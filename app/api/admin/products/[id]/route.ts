import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";

import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";

const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
  categorySlug: z.string().min(1).optional(),
  subcategorySlug: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
  price: z.number().nonnegative().optional(),
  compareAtPrice: z.number().nonnegative().optional().nullable(),
  images: z.array(z.string()).optional(),
  shortDescription: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  features: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().nonnegative().optional(),
  reviews: z.array(z.any()).optional(),
  stockStatus: z.enum(["in_stock", "low_stock", "out_of_stock"]).optional(),
  stockCount: z.number().nonnegative().optional(),
  isNewArrival: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  dimensions: z.string().optional(),
  createdAt: z.string().optional(),
});

function getNormalizedId(rawId: string | string[]) {
  const idFromParams = Array.isArray(rawId) ? rawId[0] : rawId;
  return typeof idFromParams === "string" ? idFromParams.trim() : "";
}

async function findProductByParam(id: string) {
  if (!id) return null;

  if (mongoose.isValidObjectId(id)) {
    const product = await Product.findById(id);
    if (product) return product;
  }

  return Product.findOne({ id });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const normalizedId = getNormalizedId(id);
    const product = await findProductByParam(normalizedId);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const p: any = product;
    return NextResponse.json({ success: true, product: p }, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const normalizedId = getNormalizedId(id);
    const product = await findProductByParam(normalizedId);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = productUpdateSchema.safeParse(body);

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

    Object.assign(product, parsed.data);
    await product.save();

    const p: any = product;
    return NextResponse.json({ success: true, product: p }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const normalizedId = getNormalizedId(id);
    const product = await findProductByParam(normalizedId);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    await product.deleteOne();

    return NextResponse.json(
      { success: true, message: "Product deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
