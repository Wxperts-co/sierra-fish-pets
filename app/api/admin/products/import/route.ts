import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { join } from "path";
import { readFile } from "fs/promises";

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

// Helper to normalize category slugs from various CSV formats
function normalizeCategorySlug(val: any): string {
  const text = cleanExcelText(val).toLowerCase().replace(/\s+/g, "-");
  if (text === "fish") return "aquatic";
  if (text === "small-pet") return "small-animal";
  return text || "uncategorized";
}

// Helper to parse description HTML into plain text description, features array, and image URL
function parseHtmlDescription(descHtml: any) {
  if (!descHtml) return { description: "", features: [] as string[], extractedImage: null as string | null };

  const html = String(descHtml);

  // 1. Extract image url
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/i;
  const imgMatch = imgRegex.exec(html);
  let extractedImage = imgMatch ? imgMatch[1] : null;
  if (extractedImage && (extractedImage.includes("product-spec-helptext") || extractedImage.includes("plus.png") || extractedImage.includes("minus.png"))) {
    extractedImage = null;
  }

  // 2. Extract table spec key-values
  const features: string[] = [];
  const thTdRegex = /<th[^>]*>([^<]+)<\/th>\s*<td[^>]*>([^<]+)<\/td>/gi;
  let match;
  while ((match = thTdRegex.exec(html)) !== null) {
    const key = match[1].replace(/:/g, "").trim();
    const val = match[2].trim();
    if (key && val) {
      features.push(`${key}: ${val}`);
    }
  }

  // 3. Extract clean description text
  let cleanText = html;
  // Remove table
  cleanText = cleanText.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, "");
  // Remove h3 headers (like "Plant info")
  cleanText = cleanText.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "");
  // Remove images and their anchor wrappers
  cleanText = cleanText.replace(/<a[^>]*>\s*<img[^>]*>\s*<\/a>/gi, "");
  cleanText = cleanText.replace(/<img[^>]*>/gi, "");
  // Strip all other HTML tags
  cleanText = cleanText.replace(/<[^>]*>/g, " ");
  // Clean up HTML entities
  cleanText = cleanText
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Clean up whitespace
  cleanText = cleanText.replace(/\s+/g, " ").trim();

  return {
    description: cleanText,
    features,
    extractedImage,
  };
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

    // Load category mapping JSON
    const categoryMappingMap = new Map<string, { categorySlug: string; subcategorySlug: string }>();
    try {
      const mappingPath = join(process.cwd(), "data", "category_mapping.json");
      const mappingRaw = await readFile(mappingPath, "utf-8");
      const mappingList = JSON.parse(mappingRaw);
      if (Array.isArray(mappingList)) {
        for (const item of mappingList) {
          if (item.code) {
            categoryMappingMap.set(String(item.code).trim(), {
              categorySlug: item.categorySlug,
              subcategorySlug: item.subcategorySlug,
            });
          }
        }
      }
    } catch (err) {
      console.warn("[Import] No category_mapping.json found or failed to parse:", err);
    }

    console.log(`[Import] Starting bulk import of ${importedProducts.length} entries.`);

    // 1. Optimize lookup: Fetch all existing product IDs, SKUs, and Slugs in a single light query
    const existingProducts = await Product.find({}, "id sku slug images imageStatus imageSource imageLastChecked createdAt").lean();
    const existingIdMap = new Map<string, any>(existingProducts.map(p => [p.id, p]));
    const existingSkuSet = new Set(existingProducts.map(p => p.sku));
    const slugSet = new Set(existingProducts.map(p => p.slug));

    const productsToInsert: any[] = [];
    const productsToUpdate: any[] = [];

    for (const productData of importedProducts) {
      try {
        const rawType = getValue(productData, "type");
        // Skip product options rows
        if (rawType && String(rawType).toLowerCase() !== "product") {
          continue;
        }

        // Map imported data
        const rawId = getValue(productData, "product_internal_id", "sku_id", "upc_id", "product_sku", "id", "sku", "item", "6 digits") || "";
        const rawName = getValue(productData, "item_name", "product_name", "name", "des", "description") || "";
        const rawSku = getValue(productData, "sku_id", "product_sku", "sku", "item", "6 digits") || "";
        const rawUpc = getValue(productData, "product_upc", "upc_id", "upc", "barcode", "gtin", "each upc", "upc_no") || "";
        
        const id = cleanExcelText(rawId);
        const name = cleanExcelText(rawName);
        const sku = cleanExcelText(rawSku);
        const upc = cleanExcelText(rawUpc);

        // Silently skip completely empty padding rows
        const hasAnyData = Object.values(productData).some(v => v != null && String(v).trim() !== "");
        if (!id && !name && !sku) {
          if (hasAnyData) {
            results.failed++;
            results.errors.push("Row contains data but column headers for ID, Name, or SKU were not recognized.");
          }
          continue;
        }

        // Skip instruction/description helper rows (e.g. from sample6)
        if (
          id.toLowerCase().includes("unique product id") ||
          name.toLowerCase().includes("consumer would see")
        ) {
          continue;
        }

        const quantityRaw = getValue(productData, "product_quantity", "quantity", "stock_count", "stockCount", "instock");
        const statusRaw = getValue(productData, "status");
        
        let quantity = 50; // Default in_stock count if quantity column is missing (e.g. feedback template)
        if (quantityRaw != null) {
          quantity = parseInt(quantityRaw) || 0;
        } else if (statusRaw && String(statusRaw).toLowerCase() === "inactive") {
          quantity = 0; // Out of stock if explicitly marked as Inactive
        }

        if (!id || !name || !sku) {
          results.failed++;
          results.errors.push(`Row missing ID, Name, or SKU (Name: "${name || 'unknown'}", SKU: "${sku || 'unknown'}", ID: "${id || 'unknown'}")`);
          continue;
        }

        // Verify duplicates / updates in-memory
        const existingProduct = existingIdMap.get(id);
        const isUpdate = !!existingProduct;

        // If it's a new product, check if the SKU is already taken by another product
        if (!isUpdate && existingSkuSet.has(sku)) {
          results.failed++;
          results.errors.push(`Product "${name}" (SKU: ${sku}) is already taken by another product.`);
          continue;
        }

        const brandRaw = getValue(productData, "product_brand", "brand");
        const cleanBrandVal = cleanExcelText(brandRaw);
        const brand = (cleanBrandVal && cleanBrandVal !== "Unknown") ? cleanBrandVal : (name.split(" ")[0] || "Unknown");

        const priceRaw = getValue(productData, "default_price", "product_price", "price", "price 1", "item price");
        const price = priceRaw != null ? parseFloat(priceRaw) || 0 : 0;
        
        const compareAtPriceRaw = getValue(productData, "product_compare_to_price", "compareAtPrice", "compare_at_price");
        const compareAtPrice = (compareAtPriceRaw != null && !isNaN(parseFloat(compareAtPriceRaw))) ? parseFloat(compareAtPriceRaw) : null;
        
        const cat1Raw = getValue(productData, "category_l1", "product_category_1", "categorySlug", "category", "category_code", "class");
        const cat2Raw = getValue(productData, "category_l2", "product_category_2", "subcategorySlug", "subcategory");
        
        let categorySlugVal = "";
        let subcategorySlugVal = "";

        const cleanCat1 = cleanExcelText(cat1Raw);
        const mapped = categoryMappingMap.get(cleanCat1);

        if (mapped) {
          categorySlugVal = mapped.categorySlug;
          subcategorySlugVal = mapped.subcategorySlug;
        } else {
          categorySlugVal = normalizeCategorySlug(cat1Raw);
          subcategorySlugVal = cleanExcelText(cat2Raw).toLowerCase().replace(/\s+/g, "-") || "uncategorized";
        }

        let categorySlug = categorySlugVal;
        if (cat2Raw && !categorySlugVal.includes("-/-") && !mapped) {
          categorySlug = `${categorySlugVal}-/-${subcategorySlugVal}`;
        }

        const parsedDesc = parseHtmlDescription(getValue(productData, "product_description", "description"));

        const isFeaturedRaw = getValue(productData, "product_is_featured", "isFeatured", "featured");
        const isFeatured = isFeaturedRaw === "TRUE" || isFeaturedRaw === "true" || isFeaturedRaw === true;

        let imageUrl = extractImageUrl(productData);
        if (imageUrl === "0" || imageUrl === "undefined" || imageUrl === "null") {
          imageUrl = "";
        }
        if (!imageUrl && parsedDesc.extractedImage) {
          imageUrl = parsedDesc.extractedImage;
        }

        // Check if the image is a generic placeholder/fallback to treat it as pending
        const isPlaceholder = imageUrl && (
          imageUrl === "/images/products/dog1.avif" ||
          imageUrl === "/images/products/cat1.avif" ||
          imageUrl === "/images/products/aqua1.avif" ||
          imageUrl === "/images/products/bird/bird1.avif" ||
          imageUrl === "/placeholder-product.png" ||
          imageUrl === "/placeholderimg.png" ||
          imageUrl.toLowerCase().includes("placeholder") ||
          imageUrl.toLowerCase().includes("fallback")
        );

        const images = imageUrl ? [imageUrl] : [];
        const imageStatus = (images.length > 0 && !isPlaceholder) ? "completed" : "pending";
        const imageSource = images.length > 0 ? "Import CSV" : "";
        const imageLastChecked = images.length > 0 ? new Date() : null;

        // Resolve slug in-memory using sets
        let slug = existingProduct ? existingProduct.slug : "";
        if (!slug) {
          let baseSlug = String(name)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
            .slice(0, 180);
          if (!baseSlug) baseSlug = "product";
          slug = baseSlug;
          let slugCounter = 1;
          while (slugSet.has(slug)) {
            const suffix = `-${slugCounter}`;
            slug = baseSlug.slice(0, 200 - suffix.length) + suffix;
            slugCounter++;
          }
          slugSet.add(slug); // Reserve slug in-memory
        }

        // Smart image mapping merging
        let finalImages = images;
        let finalImageStatus = imageStatus;
        let finalImageSource = imageSource;
        let finalImageLastChecked = imageLastChecked;

        if (isUpdate && existingProduct) {
          const hasNewValidImage = images.length > 0 && !isPlaceholder;
          if (!hasNewValidImage && existingProduct.images && existingProduct.images.length > 0) {
            finalImages = existingProduct.images;
            finalImageStatus = existingProduct.imageStatus || "completed";
            finalImageSource = existingProduct.imageSource || "";
            finalImageLastChecked = existingProduct.imageLastChecked || null;
          }
        }

        const mappedProduct = {
          _id: existingProduct ? existingProduct._id : new mongoose.Types.ObjectId(),
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
          images: finalImages,
          imageStatus: finalImageStatus,
          imageSource: finalImageSource,
          imageLastChecked: finalImageLastChecked,
          shortDescription: parseDescription(parsedDesc.description) || String(name),
          description: parsedDesc.description || String(name),
          features: parsedDesc.features || [],
          tags: cat1Raw ? [cleanExcelText(cat1Raw)] : [],
          isNewArrival: isFeatured,
          isFeatured,
          isBestSeller: false,
          createdAt: existingProduct ? existingProduct.createdAt : new Date().toISOString(),
          retailerCsvData: mapRetailerCsvData(productData),
        };

        if (isUpdate) {
          productsToUpdate.push(mappedProduct);
          existingIdMap.set(id, mappedProduct);
        } else {
          productsToInsert.push(mappedProduct);
          existingSkuSet.add(sku);
          existingIdMap.set(id, mappedProduct);
        }
        results.successful++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Failed to map product "${getValue(productData, "product_name", "name") || 'unknown'}": ${error.message}`);
      }
    }

    // 2. Perform bulk insertion and updates
    if (productsToInsert.length > 0) {
      console.log(`[Import] Writing ${productsToInsert.length} new products to database...`);
      try {
        await Product.insertMany(productsToInsert, { ordered: false });
      } catch (err: any) {
        console.error("[Import] insertMany partial/complete failure:", err);
        if (err.writeErrors) {
          results.failed += err.writeErrors.length;
          results.successful -= err.writeErrors.length;
          for (const we of err.writeErrors) {
            const failedDoc = productsToInsert[we.index];
            results.errors.push(`Failed to insert "${failedDoc?.name || 'Unknown'}": ${we.errmsg || 'Duplicate key or validation error'}`);
          }
        } else {
          results.failed += productsToInsert.length;
          results.successful -= productsToInsert.length;
          results.errors.push(`Bulk insertion failed: ${err.message || 'Validation or database error'}`);
        }
      }
    }

    if (productsToUpdate.length > 0) {
      console.log(`[Import] Updating ${productsToUpdate.length} existing products...`);
      const bulkOps = productsToUpdate.map(p => ({
        updateOne: {
          filter: { id: p.id },
          update: {
            $set: {
              name: p.name,
              sku: p.sku,
              upc: p.upc,
              brand: p.brand,
              price: p.price,
              compareAtPrice: p.compareAtPrice,
              stockCount: p.stockCount,
              stockStatus: p.stockStatus,
              categorySlug: p.categorySlug,
              subcategorySlug: p.subcategorySlug,
              images: p.images,
              imageStatus: p.imageStatus,
              imageSource: p.imageSource,
              imageLastChecked: p.imageLastChecked,
              shortDescription: p.shortDescription,
              description: p.description,
              features: p.features,
              tags: p.tags,
              retailerCsvData: p.retailerCsvData,
            }
          }
        }
      }));
      try {
        await Product.bulkWrite(bulkOps, { ordered: false });
      } catch (err: any) {
        console.error("[Import] bulkWrite partial/complete failure:", err);
        if (err.writeErrors) {
          results.failed += err.writeErrors.length;
          results.successful -= err.writeErrors.length;
          for (const we of err.writeErrors) {
            const failedDoc = productsToUpdate[we.index];
            results.errors.push(`Failed to update "${failedDoc?.name || 'Unknown'}": ${we.errmsg || 'Database write error'}`);
          }
        } else {
          results.failed += productsToUpdate.length;
          results.successful -= productsToUpdate.length;
          results.errors.push(`Bulk update failed: ${err.message || 'Database error'}`);
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Import completed: ${results.successful} successful, ${results.failed} failed.`,
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
