import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import Product, { mapRetailerCsvData } from "@/models/Product";
import { connectDB } from "@/lib/mongodb";

const importProductSchema = z.object({
  products: z.array(z.record(z.any(), z.any())).min(1, "At least one product is required"),
});

// Helper function to determine stock status from quantity
function getStockStatus(quantity: number | null | undefined): "in_stock" | "low_stock" | "out_of_stock" {
  if (!quantity || quantity === 0) return "out_of_stock";
  if (quantity <= 5) return "low_stock";
  return "in_stock";
}

// Helper function to extract image URL from product data
function extractImageUrl(productData: any): string {
  return productData.product_media_main_image_url || "";
}

// Helper function to parse description
function parseDescription(descHtml: string | undefined): string {
  if (!descHtml) return "";
  // Remove HTML tags for short description
  return descHtml.replace(/<[^>]*>/g, "").slice(0, 150).trim();
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
        // Skip product options rows (only process product type rows)
        if (productData.type !== "product") {
          continue;
        }

        // Map imported data to product schema
        const id = productData.product_internal_id || productData.product_sku || "";
        const name = productData.product_name || "";
        const sku = productData.product_sku || "";
        const quantity = parseInt(productData.product_quantity) || 0;

        if (!id || !name || !sku) {
          results.failed++;
          results.errors.push("Product missing required fields (ID, Name, or SKU)");
          continue;
        }

        const mappedProduct = {
          id: String(id).slice(0, 100),
          name: name.slice(0, 200),
          slug: name.toLowerCase().replace(/\s+/g, "-").slice(0, 200),
          sku: String(sku).slice(0, 50),
          brand: productData.product_brand || "Unknown",
          price: parseFloat(productData.product_price) || 0,
          compareAtPrice: productData.product_compare_to_price ? parseFloat(productData.product_compare_to_price) : null,
          stockCount: quantity,
          stockStatus: getStockStatus(quantity),
          categorySlug: productData.product_category_1 ? productData.product_category_1.toLowerCase().replace(/\s+/g, "-") : "uncategorized",
          subcategorySlug: productData.product_category_2 ? productData.product_category_2.toLowerCase().replace(/\s+/g, "-") : "uncategorized",
          images: extractImageUrl(productData) ? [extractImageUrl(productData)] : [],
          shortDescription: parseDescription(productData.product_description) || name,
          description: productData.product_description || name,
          features: [],
          tags: productData.product_category_1 ? [productData.product_category_1] : [],
          isNewArrival: productData.product_is_featured === "TRUE" || productData.product_is_featured === true,
          isFeatured: productData.product_is_featured === "TRUE" || productData.product_is_featured === true,
          isBestSeller: false,
          createdAt: new Date().toISOString(),
          retailerCsvData: mapRetailerCsvData(productData),
        };

        // Check if product already exists
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
        results.errors.push(`Failed to import product: ${error.message}`);
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
