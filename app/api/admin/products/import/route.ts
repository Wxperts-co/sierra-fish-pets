import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";

import Product, { mapRetailerCsvData } from "@/models/Product";
import { connectDB } from "@/lib/mongodb";

const importProductSchema = z.object({
  products: z.array(z.record(z.any(), z.any())).min(1, "At least one product is required"),
});

// Helper function to safely fetch keys case-insensitively
function getValue(data: any, ...keys: string[]): any {
  if (!data) return undefined;
  for (const k of keys) {
    if (data[k] !== undefined) return data[k];
  }
  const normalizedKeys = keys.map(k => k.toLowerCase().replace(/[\s_-]+/g, ""));
  for (const rawKey of Object.keys(data)) {
    const normRawKey = rawKey.toLowerCase().replace(/[\s_-]+/g, "");
    if (normalizedKeys.includes(normRawKey)) {
      return data[rawKey];
    }
  }
  return undefined;
}

// Helper to clean pipe characters and whitespace
function cleanExcelText(val: any): string {
  if (val == null) return "";
  return String(val).trim().replace(/^\||\|$/g, "").trim();
}

// Helper to determine stock status
function getStockStatus(quantity: number | null | undefined): "in_stock" | "low_stock" | "out_of_stock" {
  if (!quantity || quantity === 0) return "out_of_stock";
  if (quantity <= 5) return "low_stock";
  return "in_stock";
}

// Helper to extract image URL
function extractImageUrl(productData: any): string {
  const url = getValue(productData, "product_media_main_image_url", "product_media_main_image", "image", "image_url", "images", "imageUrl");
  if (Array.isArray(url)) {
    return url[0] || "";
  }
  return url || "";
}

// Helper to parse description
function parseDescription(descHtml: any): string {
  if (!descHtml) return "";
  const descStr = String(descHtml);
  return descStr.replace(/<[^>]*>/g, "").slice(0, 150).trim();
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = importProductSchema.safeParse(body);

    if (!parsed.success) {
      const perr: any = parsed.error;
      return NextResponse.json(
        {
          success: false,
          message: perr.errors?.[0]?.message || "Validation failed",
        },
        { status: 400 }
      );
    }

    const { products: importedProducts } = parsed.data;
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    console.log(`[Import] Starting bulk import of ${importedProducts.length} entries.`);

    // 1. Optimize lookup: Fetch all existing product IDs, SKUs, and Slugs in a single light query
    const existingProducts = await Product.find({}, "id sku slug").lean();
    const existingIdSet = new Set(existingProducts.map(p => p.id));
    const existingSkuSet = new Set(existingProducts.map(p => p.sku));
    const slugSet = new Set(existingProducts.map(p => p.slug));

    const productsToInsert: any[] = [];

    for (const productData of importedProducts) {
      try {
        const rawType = getValue(productData, "type");
        // Skip product options rows
        if (rawType && String(rawType).toLowerCase() !== "product") {
          continue;
        }

        // Map imported data
        const rawId = getValue(productData, "product_internal_id", "sku_id", "upc_id", "product_sku", "id", "sku") || "";
        const rawName = getValue(productData, "item_name", "product_name", "name") || "";
        const rawSku = getValue(productData, "sku_id", "product_sku", "sku") || "";
        const rawUpc = getValue(productData, "product_upc", "upc_id", "upc", "barcode", "gtin") || "";
        
        const id = cleanExcelText(rawId);
        const name = cleanExcelText(rawName);
        const sku = cleanExcelText(rawSku);
        const upc = cleanExcelText(rawUpc);

        const quantityRaw = getValue(productData, "product_quantity", "quantity", "stock_count", "stockCount");
        const quantity = quantityRaw != null ? parseInt(quantityRaw) || 0 : 0;

        if (!id || !name || !sku) {
          results.failed++;
          results.errors.push(`Row missing ID, Name, or SKU (Name: "${name || 'unknown'}", SKU: "${sku || 'unknown'}", ID: "${id || 'unknown'}")`);
          continue;
        }

        // Verify duplicates in-memory
        if (existingIdSet.has(id) || existingSkuSet.has(sku)) {
          results.failed++;
          results.errors.push(`Product "${name}" (ID: ${id}, SKU: ${sku}) already exists.`);
          continue;
        }

        const brandRaw = getValue(productData, "product_brand", "brand") || "Unknown";
        const brand = cleanExcelText(brandRaw);

        const priceRaw = getValue(productData, "default_price", "product_price", "price");
        const price = priceRaw != null ? parseFloat(priceRaw) || 0 : 0;
        
        const compareAtPriceRaw = getValue(productData, "product_compare_to_price", "compareAtPrice", "compare_at_price");
        const compareAtPrice = (compareAtPriceRaw != null && !isNaN(parseFloat(compareAtPriceRaw))) ? parseFloat(compareAtPriceRaw) : null;
        
        const cat1Raw = getValue(productData, "category_l1", "product_category_1", "categorySlug", "category");
        const cat2Raw = getValue(productData, "category_l2", "product_category_2", "subcategorySlug", "subcategory");
        
        const categorySlugVal = cleanExcelText(cat1Raw).toLowerCase().replace(/\s+/g, "-") || "uncategorized";
        const subcategorySlugVal = cleanExcelText(cat2Raw).toLowerCase().replace(/\s+/g, "-") || "uncategorized";
        
        let categorySlug = categorySlugVal;
        if (cat2Raw && !categorySlugVal.includes("-/-")) {
          categorySlug = `${categorySlugVal}-/-${subcategorySlugVal}`;
        }

        const isFeaturedRaw = getValue(productData, "product_is_featured", "isFeatured", "featured");
        const isFeatured = isFeaturedRaw === "TRUE" || isFeaturedRaw === "true" || isFeaturedRaw === true;

        let imageUrl = extractImageUrl(productData);
        if (imageUrl === "0" || imageUrl === "undefined" || imageUrl === "null") {
          imageUrl = "";
        }

        // Check if the image is a generic placeholder/fallback to treat it as pending
        const isPlaceholder = imageUrl && (
          imageUrl === "/images/products/dog1.avif" ||
          imageUrl === "/images/products/cat1.avif" ||
          imageUrl === "/images/products/aqua1.avif" ||
          imageUrl === "/images/products/bird/bird1.avif" ||
          imageUrl === "/placeholder-product.png" ||
          imageUrl.toLowerCase().includes("placeholder") ||
          imageUrl.toLowerCase().includes("fallback")
        );

        const images = imageUrl ? [imageUrl] : [];
        const imageStatus = (images.length > 0 && !isPlaceholder) ? "completed" : "pending";
        const imageSource = images.length > 0 ? "Import CSV" : "";
        const imageLastChecked = images.length > 0 ? new Date() : null;

        // Resolve slug in-memory using sets
        let baseSlug = String(name)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .slice(0, 180);
        if (!baseSlug) baseSlug = "product";
        let slug = baseSlug;
        let slugCounter = 1;
        while (slugSet.has(slug)) {
          const suffix = `-${slugCounter}`;
          slug = baseSlug.slice(0, 200 - suffix.length) + suffix;
          slugCounter++;
        }
        slugSet.add(slug); // Reserve slug in-memory

        // Pre-allocate ObjectId in-memory
        const mongoId = new mongoose.Types.ObjectId();

        const mappedProduct = {
          _id: mongoId,
          id: String(id).slice(0, 100),
          name: String(name).slice(0, 200),
          slug,
          sku: String(sku).slice(0, 50),
          upc: String(upc).slice(0, 50),
          brand: String(brand).slice(0, 100),
          price,
          compareAtPrice,
          stockCount: quantity,
          stockStatus: getStockStatus(quantity),
          categorySlug,
          subcategorySlug: subcategorySlugVal,
          images,
          imageStatus,
          imageSource,
          imageLastChecked,
          shortDescription: parseDescription(getValue(productData, "product_description", "description")) || String(name),
          description: getValue(productData, "product_description", "description") || String(name),
          features: [],
          tags: cat1Raw ? [cleanExcelText(cat1Raw)] : [],
          isNewArrival: isFeatured,
          isFeatured,
          isBestSeller: false,
          createdAt: new Date().toISOString(),
          retailerCsvData: mapRetailerCsvData(productData),
        };

        // Track in-memory sets to avoid duplicating within the same CSV upload
        existingIdSet.add(id);
        existingSkuSet.add(sku);

        productsToInsert.push(mappedProduct);
        results.successful++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Failed to map product "${getValue(productData, "product_name", "name") || 'unknown'}": ${error.message}`);
      }
    }

    // 2. Perform bulk insertion in a single DB operation
    if (productsToInsert.length > 0) {
      console.log(`[Import] Writing ${productsToInsert.length} products to database...`);
      await Product.insertMany(productsToInsert, { ordered: false });

      // Trigger background enrichment batch immediately
      import("@/services/imageScheduler").then(({ triggerEnrichment }) => {
        triggerEnrichment();
      }).catch((err) => {
        console.error("[Import] Failed to import scheduler for immediate enrichment:", err);
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: `Import completed: ${results.successful} successful, ${results.failed} failed. Products queued for background image enrichment.`,
        results,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST /api/admin/products/import error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to import products",
      },
      { status: 500 }
    );
  }
}
