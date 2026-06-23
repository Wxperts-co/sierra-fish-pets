import axios from "axios";
import { validateImageUrl } from "./imageDownloader";
import { EnrichmentError, ErrorType } from "./errorClassifier";
import {
  isProviderUnderCooldown,
  getProviderCooldownRemainingSeconds,
  setProviderCooldown,
  getRetryAfterSeconds,
} from "./rateLimitManager";

export interface ImageLookupResult {
  imageUrl: string | null;
  source: string;
  validatedData?: Buffer;
  mimeType?: string;
}

/**
 * Searches for a product image using various fallback strategies.
 * Order: UPCitemDB -> Barcode Lookup -> Search Scrape -> Manufacturer Page
 * Each candidate image is validated on the fly. If validation fails, we try the next.
 */
export async function findProductImage(
  upc: string,
  name: string,
  brand: string
): Promise<ImageLookupResult> {
  const cleanUpc = upc ? upc.trim() : "";
  const cleanName = name ? name.trim() : "";
  const cleanBrand = brand && brand.toLowerCase() !== "unknown" ? brand.trim() : "";

  // Check if we skipped everything due to active cooldowns
  const isUpcitemdbActive = !!cleanUpc;
  const isBarcodeActive = !!cleanUpc && !!process.env.BARCODE_LOOKUP_API_KEY;
  const isWebsearchActive = true;

  const isUpcitemdbCooldown = isUpcitemdbActive && isProviderUnderCooldown("upcitemdb");
  const isBarcodeCooldown = isBarcodeActive && isProviderUnderCooldown("barcodelookup");
  const isWebsearchCooldown = isWebsearchActive && isProviderUnderCooldown("websearch");

  const allActiveCooldown = 
    (!isUpcitemdbActive || isUpcitemdbCooldown) &&
    (!isBarcodeActive || isBarcodeCooldown) &&
    (!isWebsearchActive || isWebsearchCooldown);

  if (allActiveCooldown) {
    console.log(`[Lookup] Skipping all lookups for "${cleanName}" because all available providers are under cooldown. Throwing CooldownError.`);
    throw new EnrichmentError(
      "All providers are currently under cooldown",
      ErrorType.COOLDOWN
    );
  }

  let encounteredRateLimitOrBlock = false;

  // 1. Try UPCitemDB API
  if (cleanUpc) {
    if (isProviderUnderCooldown("upcitemdb")) {
      console.log(`[Lookup] Skipping UPCitemDB: under cooldown (remaining: ${getProviderCooldownRemainingSeconds("upcitemdb")}s)`);
      encounteredRateLimitOrBlock = true;
    } else {
      try {
        console.log(`[Lookup] Step 1: Querying UPCitemDB for UPC: ${cleanUpc}`);
        const apiKey = process.env.UPCITEMDB_API_KEY;
        const headers: Record<string, string> = {};
        if (apiKey) {
          headers["user_key"] = apiKey;
        }

        const response = await axios.get(
          `https://api.upcitemdb.com/prod/trial/lookup?upc=${cleanUpc}`,
          { headers, timeout: 5000 }
        );

        if (response.data && response.data.items && response.data.items.length > 0) {
          const item = response.data.items[0];
          if (item.images && item.images.length > 0) {
            for (const img of item.images) {
              if (img.startsWith("http")) {
                console.log(`[Lookup] Validating candidate URL from UPCitemDB: ${img}`);
                const validation = await validateImageUrl(img);
                if (validation.isValid && validation.data && validation.mimeType) {
                  console.log(`[Lookup] Success: Found image via UPCitemDB: ${img}`);
                  return {
                    imageUrl: img,
                    source: "UPCitemDB API",
                    validatedData: validation.data,
                    mimeType: validation.mimeType,
                  };
                }
              }
            }
          }
        }
      } catch (error: any) {
        if (error.response?.status === 429) {
          const cooldownSecs = getRetryAfterSeconds(error);
          setProviderCooldown("upcitemdb", cooldownSecs);
          console.warn(`[Lookup] UPCitemDB rate limited (429). Provider cooldown set for ${cooldownSecs}s.`);
          encounteredRateLimitOrBlock = true;
        } else {
          console.warn(`[Lookup] UPCitemDB lookup failed: ${error.message}`);
        }
      }
    }
  }

  // 2. Try Barcode Lookup API
  if (cleanUpc && process.env.BARCODE_LOOKUP_API_KEY) {
    if (isProviderUnderCooldown("barcodelookup")) {
      console.log(`[Lookup] Skipping Barcode Lookup: under cooldown (remaining: ${getProviderCooldownRemainingSeconds("barcodelookup")}s)`);
      encounteredRateLimitOrBlock = true;
    } else {
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
            for (const img of product.images) {
              if (img.startsWith("http")) {
                console.log(`[Lookup] Validating candidate URL from Barcode Lookup: ${img}`);
                const validation = await validateImageUrl(img);
                if (validation.isValid && validation.data && validation.mimeType) {
                  console.log(`[Lookup] Success: Found image via Barcode Lookup: ${img}`);
                  return {
                    imageUrl: img,
                    source: "Barcode Lookup API",
                    validatedData: validation.data,
                    mimeType: validation.mimeType,
                  };
                }
              }
            }
          }
        }
      } catch (error: any) {
        if (error.response?.status === 429) {
          const cooldownSecs = getRetryAfterSeconds(error);
          setProviderCooldown("barcodelookup", cooldownSecs);
          console.warn(`[Lookup] Barcode Lookup rate limited (429). Provider cooldown set for ${cooldownSecs}s.`);
          encounteredRateLimitOrBlock = true;
        } else {
          console.warn(`[Lookup] Barcode Lookup query failed: ${error.message}`);
        }
      }
    }
  }

  // 3. Try Brand + Product Name search scrape
  if (isProviderUnderCooldown("websearch")) {
    console.log(`[Lookup] Skipping Web Search Scraper: under cooldown (remaining: ${getProviderCooldownRemainingSeconds("websearch")}s)`);
    encounteredRateLimitOrBlock = true;
  } else {
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

      const html = response.data || "";
      const isBlocked = response.status === 202 || 
                        html.includes("anomaly-modal__image") || 
                        html.includes("captcha") || 
                        html.includes("challenge") || 
                        html.includes("forbidden") ||
                        html.includes("unauthorized");

      if (isBlocked) {
        setProviderCooldown("websearch", 300); // 5 minutes cooldown
        console.warn(`[Lookup] Web search scrape blocked (captcha/challenge detected). Provider cooldown set for 300s.`);
        encounteredRateLimitOrBlock = true;
      } else {
        const imageMatches = html.match(/<img[^>]+src="([^"]+)"/g);
        if (imageMatches && imageMatches.length > 0) {
          for (const imgTag of imageMatches) {
            const srcMatch = imgTag.match(/src="([^"]+)"/);
            if (srcMatch && srcMatch[1]) {
              let url = srcMatch[1];
              if (url.includes("duckduckgo.com") || url.includes("ddg")) continue;
              if (url.startsWith("//")) url = "https:" + url;
              
              console.log(`[Lookup] Validating candidate URL from Web Search: ${url}`);
              const validation = await validateImageUrl(url);
              if (validation.isValid && validation.data && validation.mimeType) {
                console.log(`[Lookup] Success: Resolved web image: ${url}`);
                return {
                  imageUrl: url,
                  source: "Web Search Scraper",
                  validatedData: validation.data,
                  mimeType: validation.mimeType,
                };
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.response?.status === 429) {
        const cooldownSecs = getRetryAfterSeconds(error);
        setProviderCooldown("websearch", cooldownSecs);
        console.warn(`[Lookup] Web search scrape rate limited (429). Provider cooldown set for ${cooldownSecs}s.`);
        encounteredRateLimitOrBlock = true;
      } else {
        console.warn(`[Lookup] Web search scrape failed: ${error.message}`);
      }
    }
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
      const html = response.data || "";
      const isBlocked = response.status === 202 || 
                        html.includes("anomaly-modal__image") || 
                        html.includes("captcha") || 
                        html.includes("challenge") || 
                        html.includes("forbidden") ||
                        html.includes("unauthorized");

      if (isBlocked) {
        setProviderCooldown("websearch", 300); // Cooldown for websearch provider
        console.warn(`[Lookup] Step 4 manufacturer lookup blocked. Provider cooldown set for 300s.`);
        encounteredRateLimitOrBlock = true;
      } else {
        const match = html.match(/class="result__url"[^>]*href="([^"]+)"/);
        if (match && match[1]) {
          const brandDomain = new URL(match[1]).origin;
          console.log(`[Lookup] Found manufacturer brand domain: ${brandDomain}`);
        }
      }
    } catch (error: any) {
      console.warn(`[Lookup] Manufacturer page lookup failed: ${error.message}`);
    }
  }

  if (encounteredRateLimitOrBlock) {
    console.log(`[Lookup] Lookup failed to resolve image, and encountered rate limit or block on one or more providers. Throwing EnrichmentError.`);
    throw new EnrichmentError(
      "Lookup failed due to provider rate limit or block",
      ErrorType.RATE_LIMITED
    );
  }

  console.log(`[Lookup] Finished: No image resolved for "${cleanName}". Returning null image.`);
  return { imageUrl: null, source: "None" };
}
