import axios from "axios";
import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import NewArrivalModel from "@/models/NewArrival";

// ─── CURATED HIGH-RES SPECIES FALLBACK LIBRARY ─────────────────────────────
const CURATED_FISH_IMAGES: Record<string, string> = {
  // Freshwater Community
  "neon tetra": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
  "cardinal tetra": "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&auto=format&fit=crop&q=80",
  "guppy": "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=800&auto=format&fit=crop&q=80",
  "betta": "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800&auto=format&fit=crop&q=80",
  "angelfish": "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800&auto=format&fit=crop&q=80",
  "discus": "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&auto=format&fit=crop&q=80",
  "corydoras": "https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=800&auto=format&fit=crop&q=80",
  "pleco": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
  "platy": "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=800&auto=format&fit=crop&q=80",
  "molly": "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&auto=format&fit=crop&q=80",
  "swordtail": "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?w=800&auto=format&fit=crop&q=80",
  "rasbora": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
  "cichlid": "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800&auto=format&fit=crop&q=80",
  "goldfish": "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&auto=format&fit=crop&q=80",
  "koi": "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&auto=format&fit=crop&q=80",
  
  // Saltwater / Reef
  "clownfish": "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800&auto=format&fit=crop&q=80",
  "yellow tang": "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&auto=format&fit=crop&q=80",
  "blue tang": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
  "damselfish": "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800&auto=format&fit=crop&q=80",
  "wrasse": "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&auto=format&fit=crop&q=80",
  "goby": "https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=800&auto=format&fit=crop&q=80",
  "blenny": "https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=800&auto=format&fit=crop&q=80",
  "coral": "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&auto=format&fit=crop&q=80",
  "anemone": "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&auto=format&fit=crop&q=80",
  "shrimp": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
  "snail": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",

  // Reptiles & Small Animals
  "gecko": "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?w=800&auto=format&fit=crop&q=80",
  "bearded dragon": "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?w=800&auto=format&fit=crop&q=80",
  "chameleon": "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?w=800&auto=format&fit=crop&q=80",
  "python": "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?w=800&auto=format&fit=crop&q=80",
  "turtle": "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?w=800&auto=format&fit=crop&q=80",
  "snake": "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?w=800&auto=format&fit=crop&q=80",
  "parrot": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop&q=80",
  "cockatiel": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop&q=80",
  "budgie": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop&q=80",
  "finch": "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop&q=80",
  "hamster": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80",
  "guinea pig": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80",
  "rabbit": "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80",
};

// Category defaults
const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  fish: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&auto=format&fit=crop&q=80",
  aquatic: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
  reptiles: "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?w=800&auto=format&fit=crop&q=80",
  birds: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&auto=format&fit=crop&q=80",
  "small animals": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80",
  dogs: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80",
  cats: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80",
  general: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&auto=format&fit=crop&q=80",
};

/**
 * Auto-fetch image for a fish or animal using the 4-tier pipeline:
 * 1. Database match (Products / NewArrivals)
 * 2. Wikipedia / Wikimedia species API
 * 3. Curated fish dictionary
 * 4. Category fallback
 */
export async function resolveSpeciesImage(
  name: string,
  scientificName: string = "",
  category: string = "fish"
): Promise<{ imageUrl: string; source: "database" | "wikimedia" | "curated" | "category_default" }> {
  const cleanName = (name || "").trim().toLowerCase();
  const cleanScientific = (scientificName || "").trim().toLowerCase();

  // Tier 1: Check existing Mongo database
  try {
    await connectDB();
    const existingArrival = await NewArrivalModel.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${cleanName}$`, "i") } },
        { breed: { $regex: new RegExp(`^${cleanName}$`, "i") } },
      ],
      "images.0": { $exists: true },
    }).lean();

    if (existingArrival && existingArrival.images && existingArrival.images.length > 0) {
      return { imageUrl: existingArrival.images[0], source: "database" };
    }

    const existingProduct = await ProductModel.findOne({
      name: { $regex: new RegExp(cleanName, "i") },
      images: { $exists: true, $ne: [] },
    }).lean();

    if (existingProduct && existingProduct.images && existingProduct.images.length > 0) {
      const img = typeof existingProduct.images[0] === "string" ? existingProduct.images[0] : (existingProduct.images[0] as any)?.url;
      if (img) return { imageUrl: img, source: "database" };
    }
  } catch (err) {
    console.error("Database image search error:", err);
  }

  // Tier 2: Search Wikipedia / Wikimedia Commons API
  const queryTerms = [cleanScientific, cleanName].filter(Boolean);
  for (const term of queryTerms) {
    if (!term || term.length < 3) continue;
    try {
      const wikiRes = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          titles: term,
          prop: "pageimages",
          format: "json",
          pithumbsize: 800,
          redirects: 1,
        },
        timeout: 2500,
      });

      const pages = wikiRes.data?.query?.pages;
      if (pages) {
        const pageId = Object.keys(pages)[0];
        if (pageId && pageId !== "-1" && pages[pageId]?.thumbnail?.source) {
          return { imageUrl: pages[pageId].thumbnail.source, source: "wikimedia" };
        }
      }
    } catch {
      // Continue to next tier if wiki query fails or times out
    }
  }

  // Tier 3: Curated dictionary matching
  for (const [key, url] of Object.entries(CURATED_FISH_IMAGES)) {
    if (cleanName.includes(key) || cleanScientific.includes(key)) {
      return { imageUrl: url, source: "curated" };
    }
  }

  // Tier 4: Category fallback
  const catKey = category.toLowerCase();
  const fallback = CATEGORY_DEFAULT_IMAGES[catKey] || CATEGORY_DEFAULT_IMAGES.fish;
  return { imageUrl: fallback, source: "category_default" };
}

export interface ParsedInvoiceItem {
  name: string;
  scientificName?: string;
  breed: string;
  size: string;
  quantity: number;
  price: number;
  category: string;
  subcategory?: string;
  location: string;
  arrivalDate: string;
  status: "available";
  image: string;
  imageSource: string;
  notes?: string;
}

/**
 * Smart line-by-line parser for text/distributor invoice tables
 */
export async function parseInvoiceTextToItems(
  rawText: string,
  defaultArrivalDate: string = new Date().toISOString().split("T")[0]
): Promise<ParsedInvoiceItem[]> {
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 2);
  const items: ParsedInvoiceItem[] = [];

  for (const line of lines) {
    // Skip headers or invoice totals
    if (/^(invoice|bill to|ship to|date|subtotal|tax|total|order #|po #|customer|terms|tracking|page\s+\d)/i.test(line)) {
      continue;
    }

    // Attempt to extract item data using regex patterns
    // Example patterns:
    // 1) "50x Neon Tetra (Paracheirodon innesi) 1.5 inch $1.99"
    // 2) "NEON TETRA SM/MD - QTY 25 - $2.50"
    // 3) "Zebrasoma flavescens (Yellow Tang) | Med | 10 | $45.00"
    // 4) "10  Clownfish Ocellaris Tank Raised Small  $12.00"

    let qty = 1;
    let price = 0;
    let size = "Medium";
    let category = "fish";
    let name = line;
    let scientificName = "";

    // Extract quantity (e.g. 50x, QTY: 25, or starting number)
    const qtyMatch = line.match(/(?:qty:?\s*|x\s*)?(\b\d{1,4}\b)(?:\s*x|\s*pcs|\s*ea)?/i);
    const leadingNumMatch = line.match(/^(\d{1,4})\s+([a-zA-Z].*)/);

    if (leadingNumMatch) {
      qty = parseInt(leadingNumMatch[1], 10);
      name = leadingNumMatch[2];
    } else if (qtyMatch) {
      const parsedQty = parseInt(qtyMatch[1], 10);
      if (parsedQty > 0 && parsedQty < 2000) {
        qty = parsedQty;
      }
    }

    // Extract price ($12.50 or 12.50 at end)
    const priceMatch = line.match(/\$?(\d+\.\d{2})/);
    if (priceMatch) {
      price = parseFloat(priceMatch[1]);
    }

    // Extract size patterns: (Small, Med, Large, 1-2", 1.5", S/M, L, XL)
    const sizeMatch = line.match(/\b(small|medium|large|extra large|sm|md|lg|xl|tiny|adult|juvenile|\d+(?:\.\d+)?\s*(?:-|to)?\s*\d*(?:\.\d+)?["']?|\d+cm)\b/i);
    if (sizeMatch) {
      size = sizeMatch[1];
    }

    // Extract scientific name in parentheses e.g. "Neon Tetra (Paracheirodon innesi)"
    const scientificMatch = line.match(/\(([A-Z][a-z]+(?:\s+[a-z]+)?)\)/);
    if (scientificMatch) {
      scientificName = scientificMatch[1];
      name = name.replace(/\([^)]+\)/g, "").trim();
    }

    // Clean up name string
    name = name
      .replace(/[\$#]/g, "")
      .replace(/\bqty\b:?\s*\d+/gi, "")
      .replace(/\b\d+\.\d{2}\b/g, "")
      .replace(/\b(small|medium|large|sm|md|lg|xl|tiny|pcs|ea|box)\b/gi, "")
      .replace(/^[0-9\-\*\.\s]+/, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    if (!name || name.length < 2) continue;

    // Detect category based on name keywords
    const lower = (name + " " + scientificName).toLowerCase();
    if (/gecko|snake|python|lizard|bearded dragon|chameleon|tortoise|turtle|tarantula|scorpion/i.test(lower)) {
      category = "reptiles";
    } else if (/parrot|cockatiel|budgie|canary|finch|conure|parakeet|bird/i.test(lower)) {
      category = "birds";
    } else if (/hamster|guinea pig|rabbit|ferret|chinchilla|mouse|rat/i.test(lower)) {
      category = "small animals";
    } else if (/dog|puppy/i.test(lower)) {
      category = "dogs";
    } else if (/cat|kitten/i.test(lower)) {
      category = "cats";
    } else {
      category = "fish";
    }

    // Auto-resolve high-res species image
    const { imageUrl, source } = await resolveSpeciesImage(name, scientificName, category);

    items.push({
      name,
      scientificName: scientificName || undefined,
      breed: scientificName || name,
      size: size || "Medium",
      quantity: qty || 1,
      price: price > 0 ? price : 9.99,
      category,
      location: "Renton Store",
      arrivalDate: defaultArrivalDate,
      status: "available",
      image: imageUrl,
      imageSource: source,
      notes: `Imported via AI Invoice Scanner`,
    });
  }

  return items;
}
