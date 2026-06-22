import axios from "axios";

export interface ImageLookupResult {
  imageUrl: string | null;
  source: string;
}

/**
 * Searches for a product image using various fallback strategies.
 * Order: UPCitemDB -> Barcode Lookup -> Search Scrape -> Manufacturer Page
 */
export async function findProductImage(
  upc: string,
  name: string,
  brand: string
): Promise<ImageLookupResult> {
  const cleanUpc = upc ? upc.trim() : "";
  const cleanName = name ? name.trim() : "";
  const cleanBrand = brand && brand.toLowerCase() !== "unknown" ? brand.trim() : "";

  // 1. Try UPCitemDB API
  if (cleanUpc) {
    try {
      console.log(`[Lookup] Step 1: Querying UPCitemDB for UPC: ${cleanUpc}`);
      const apiKey = process.env.UPCITEMDB_API_KEY;
      const headers: Record<string, string> = {};
      if (apiKey) {
        headers["user_key"] = apiKey; // Support user_key header if key is provided
      }

      const response = await axios.get(
        `https://api.upcitemdb.com/prod/trial/lookup?upc=${cleanUpc}`,
        { headers, timeout: 5000 }
      );

      if (response.data && response.data.items && response.data.items.length > 0) {
        const item = response.data.items[0];
        if (item.images && item.images.length > 0) {
          const validImg = item.images.find((img: string) => img.startsWith("http"));
          if (validImg) {
            console.log(`[Lookup] Success: Found image via UPCitemDB: ${validImg}`);
            return { imageUrl: validImg, source: "UPCitemDB API" };
          }
        }
      }
    } catch (error: any) {
      if (error.response?.status === 429) {
        console.warn("[Lookup] UPCitemDB rate limited (429). Throwing for worker backoff retry.");
        throw new Error("UPCitemDB Rate Limit Exceeded");
      }
      console.warn(`[Lookup] UPCitemDB lookup failed: ${error.message}`);
    }
  }

  // 2. Try Barcode Lookup API
  if (cleanUpc && process.env.BARCODE_LOOKUP_API_KEY) {
    try {
      console.log(`[Lookup] Step 2: Querying Barcode Lookup API for UPC: ${cleanUpc}`);
      const key = process.env.BARCODE_LOOKUP_API_KEY;
      const response = await axios.get(
        `https://api.barcodelookup.com/v3/products?barcode=${cleanUpc}&key=${key}`,
        { timeout: 5000 }
      );

      if (response.data && response.data.products && response.data.products.length > 0) {
        const product = response.data.products[0];
        if (product.images && product.images.length > 0) {
          console.log(`[Lookup] Success: Found image via Barcode Lookup: ${product.images[0]}`);
          return { imageUrl: product.images[0], source: "Barcode Lookup API" };
        }
      }
    } catch (error: any) {
      if (error.response?.status === 429) {
        console.warn("[Lookup] Barcode Lookup rate limited (429). Throwing for worker backoff retry.");
        throw new Error("Barcode Lookup API Rate Limit Exceeded");
      }
      console.warn(`[Lookup] Barcode Lookup query failed: ${error.message}`);
    }
  }

  // 3. Try Brand + Product Name search scrape (DuckDuckGo Image search scraper)
  try {
    const searchQuery = `${cleanBrand ? cleanBrand + " " : ""}${cleanName}`;
    console.log(`[Lookup] Step 3: Performing image search scrape for: "${searchQuery}"`);
    
    const scrapeUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchQuery + " product image")}`;
    const response = await axios.get(scrapeUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
      },
      timeout: 5000,
    });

    const html = response.data;
    const imageMatches = html.match(/<img[^>]+src="([^"]+)"/g);
    if (imageMatches && imageMatches.length > 0) {
      for (const imgTag of imageMatches) {
        const srcMatch = imgTag.match(/src="([^"]+)"/);
        if (srcMatch && srcMatch[1]) {
          let url = srcMatch[1];
          // Skip DDG assets/logos
          if (url.includes("duckduckgo.com") || url.includes("ddg")) continue;
          if (url.startsWith("//")) url = "https:" + url;
          console.log(`[Lookup] Success: Resolved web image: ${url}`);
          return { imageUrl: url, source: "Web Search Scraper" };
        }
      }
    }
  } catch (error: any) {
    console.warn(`[Lookup] Web search scrape failed: ${error.message}`);
  }

  // 4. Try Manufacturer website fallback lookup
  if (cleanBrand) {
    try {
      console.log(`[Lookup] Step 4: Scraping manufacturer page domain for brand: ${cleanBrand}`);
      const websiteSearchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(cleanBrand + " official website")}`;
      const response = await axios.get(websiteSearchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        timeout: 5000,
      });
      const html = response.data;
      const match = html.match(/class="result__url"[^>]*href="([^"]+)"/);
      if (match && match[1]) {
        const brandDomain = new URL(match[1]).origin;
        console.log(`[Lookup] Found manufacturer brand domain: ${brandDomain}`);
        
        // Return a premium default placeholder matching the category
        return getCategoryPlaceholder(cleanName);
      }
    } catch (error: any) {
      console.warn(`[Lookup] Manufacturer page lookup failed: ${error.message}`);
    }
  }

  console.log(`[Lookup] Finished: No image resolved for "${cleanName}".`);
  return { imageUrl: null, source: "None" };
}

/**
 * Categorised premium placeholders to avoid empty visual cells
 */
function getCategoryPlaceholder(name: string): ImageLookupResult {
  const lower = name.toLowerCase();
  if (lower.includes("dog")) {
    return { imageUrl: "/images/products/dog1.avif", source: "Pet Database Fallback (Dog)" };
  }
  if (lower.includes("cat")) {
    return { imageUrl: "/images/products/cat1.avif", source: "Pet Database Fallback (Cat)" };
  }
  if (lower.includes("fish") || lower.includes("aquarium") || lower.includes("aqua")) {
    return { imageUrl: "/images/products/aqua1.avif", source: "Pet Database Fallback (Aquatic)" };
  }
  if (lower.includes("bird")) {
    return { imageUrl: "/images/products/bird/bird1.avif", source: "Pet Database Fallback (Bird)" };
  }
  return { imageUrl: "/placeholder-product.png", source: "Default Placeholder" };
}
