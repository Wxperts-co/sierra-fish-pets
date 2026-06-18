import { NextRequest, NextResponse } from "next/server";

import ProductModel from "@/models/Product";
import { connectDB } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const id = searchParams.get("id");

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (id) filter.id = id;
    if (category) {
      filter.$or = [
        { categorySlug: category },
        { categorySlug: { $regex: new RegExp(`^${category}-\\/\\-`, "i") } },
      ];
    }
    if (subcategory) filter.subcategorySlug = subcategory;

    const products = await ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { success: true, count: products.length, products },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
