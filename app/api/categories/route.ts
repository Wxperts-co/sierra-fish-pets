import { NextResponse } from "next/server";
import Category from "@/models/Category";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    const rawCategories = await Category.find({})
      .sort({ name: 1 })
      .lean();

    const categories = rawCategories.map((cat) => ({
      ...cat,
      subcategories: (cat.subcategories || []).filter((sub: any) => sub.isActive !== false),
    }));

    return NextResponse.json(
      { success: true, categories },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
