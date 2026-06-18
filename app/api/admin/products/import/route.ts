import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import Product, { mapRetailerCsvData } from "@/models/Product";
import { connectDB } from "@/lib/mongodb";

const importProductSchema = z.object({
  products: z.array(z.record(z.any(), z.any())).min(1, "At least one product is required"),
});

// Helper function to safely fetch keys from productData case-insensitively and space/underscore-insensitively
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

// Helper function to clean leading/trailing pipe characters and whitespace from Excel cell values
function cleanExcelText(val: any): string {
  if (val == null) return "";
  return String(val).trim().replace(/^\||\|$/g, "").trim();
}

// Helper function to determine stock status from quantity
function getStockStatus(quantity: number | null | undefined): "in_stock" | "low_stock" | "out_of_stock" {
  if (!quantity || quantity === 0) return "out_of_stock";
  if (quantity <= 5) return "low_stock";
  return "in_stock";
}

// Helper function to extract image URL from product data
function extractImageUrl(productData: any): string {
  const url = getValue(productData, "product_media_main_image_url", "product_media_main_image", "image", "image_url", "images", "imageUrl");
  if (Array.isArray(url)) {
    return url[0] || "";
  }
  return url || "";
}

// Helper function to parse description
function parseDescription(descHtml: any): string {
  if (!descHtml) return "";
  const descStr = String(descHtml);
  // Remove HTML tags for short description
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

    for (const productData of importedProducts) {
      try {
        const rawType = getValue(productData, "type");
        // Skip product options rows (only process product type rows or if type is not specified)
        if (rawType && String(rawType).toLowerCase() !== "product") {
          continue;
        }

        // Map imported data to product schema
        const rawId = getValue(productData, "product_internal_id", "sku_id", "upc_id", "product_sku", "id", "sku") || "";
        const rawName = getValue(productData, "item_name", "product_name", "name") || "";
        const rawSku = getValue(productData, "sku_id", "product_sku", "sku") || "";
        
        const id = cleanExcelText(rawId);
        const name = cleanExcelText(rawName);
        const sku = cleanExcelText(rawSku);

        const quantityRaw = getValue(productData, "product_quantity", "quantity", "stock_count", "stockCount");
        const quantity = quantityRaw != null ? parseInt(quantityRaw) || 0 : 0;

        if (!id || !name || !sku) {
          results.failed++;
          results.errors.push(`Row missing ID, Name, or SKU (Name: "${name || 'unknown'}", SKU: "${sku || 'unknown'}", ID: "${id || 'unknown'}")`);
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
        
        // Construct compound categorySlug to match the existing DB categorySlug format
        let categorySlug = categorySlugVal;
        if (cat2Raw && !categorySlugVal.includes("-/-")) {
          categorySlug = `${categorySlugVal}-/-${subcategorySlugVal}`;
        }

        const isFeaturedRaw = getValue(productData, "product_is_featured", "isFeatured", "featured");
        const isFeatured = isFeaturedRaw === "TRUE" || isFeaturedRaw === "true" || isFeaturedRaw === true;

        const mappedProduct = {
          id: String(id).slice(0, 100),
          name: String(name).slice(0, 200),
          slug: "", // assigned below
          sku: String(sku).slice(0, 50),
          brand: String(brand).slice(0, 100),
          price,
          compareAtPrice,
          stockCount: quantity,
          stockStatus: getStockStatus(quantity),
          categorySlug,
          subcategorySlug: subcategorySlugVal,
          images: extractImageUrl(productData) ? [extractImageUrl(productData)] : [],
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

        // Ensure slug is unique to avoid DB duplicate key index violations
        let baseSlug = String(name)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .slice(0, 180);
        if (!baseSlug) baseSlug = "product";
        let slug = baseSlug;
        let slugExists = await Product.findOne({ slug });
        let slugCounter = 1;
        while (slugExists) {
          const suffix = `-${slugCounter}`;
          slug = baseSlug.slice(0, 200 - suffix.length) + suffix;
          slugExists = await Product.findOne({ slug });
          slugCounter++;
        }
        mappedProduct.slug = slug;

        // Check if product already exists by ID or SKU
        const existingProduct = await Product.findOne({
          $or: [{ id: mappedProduct.id }, { sku: mappedProduct.sku }],
        });

        if (existingProduct) {
          results.failed++;
          results.errors.push(
            `Product "${mappedProduct.name}" (SKU: ${mappedProduct.sku}) already exists`
          );
          continue;
        }

        // Create and save product
        const newProduct = new Product(mappedProduct);
        await newProduct.save();
        results.successful++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Failed to import product "${getValue(productData, "product_name", "name") || 'unknown'}": ${error.message}`);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Import completed: ${results.successful} successful, ${results.failed} failed`,
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/admin/products/import error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to import products",
      },
      { status: 500 }
    );
  }
}
