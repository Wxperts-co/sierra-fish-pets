import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import Category from "@/models/Category";
import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";

const categorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Category slug is required"),
  description: z.string().min(1, "Category description is required"),
  image: z.string().min(1, "Category image is required"),
  icon: z.string().min(1, "Category icon is required"),
  productCount: z.number().nonnegative("Product count must be non-negative").optional().default(0),
  subcategories: z
    .array(
      z.object({
        id: z.string().min(1, "Subcategory ID is required"),
        name: z.string().min(1, "Subcategory name is required"),
        slug: z.string().min(1, "Subcategory slug is required"),
        isActive: z.boolean().optional().default(true),
      })
    )
    .optional()
    .default([]),
});

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find({})
      .sort({ name: 1 })
      .lean();

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        let querySlug = category.slug as string;
        if (querySlug === "small-pet" || querySlug === "small-pets") {
          querySlug = "small-animal";
        }

        let count = 0;
        if (querySlug === "other-pet") {
          const otherSlugs = categories
            .map((c) => c.slug as string)
            .filter((slug) => slug && slug !== "other-pet");

          const activeSearchSlugs = otherSlugs.map(slug => 
            (slug === "small-pet" || slug === "small-pets") ? "small-animal" : slug
          );

          count = await Product.countDocuments({
            $or: [
              { categorySlug: { $nin: activeSearchSlugs } },
              { categorySlug: { $exists: false } },
              { categorySlug: null }
            ]
          });
        } else {
          count = await Product.countDocuments({ categorySlug: querySlug });
        }

        return {
          ...category,
          productCount: count,
        };
      })
    );

    return NextResponse.json(
      { success: true, count: categoriesWithCount.length, categories: categoriesWithCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/admin/categories error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      const perr: any = parsed.error;
      return NextResponse.json(
        { success: false, message: perr.errors?.[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const categoryData = parsed.data;

    const existingCategory = await Category.findOne({
      $or: [{ id: categoryData.id }, { slug: categoryData.slug }],
    } as any);

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "A category with the same ID or slug already exists.",
        },
        { status: 409 }
      );
    }

    const category = new Category(categoryData);
    await category.save();

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/categories error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create category" },
      { status: 500 }
    );
  }
}
