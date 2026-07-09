import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";

import Category from "@/models/Category";
import { connectDB } from "@/lib/mongodb";

const categoryUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  image: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  productCount: z.number().nonnegative().optional(),
  subcategories: z
    .array(
      z.object({
        id: z.string().min(1, "Subcategory ID is required"),
        name: z.string().min(1, "Subcategory name is required"),
        slug: z.string().min(1, "Subcategory slug is required"),
        isActive: z.boolean().optional().default(true),
      })
    )
    .optional(),
});

function getNormalizedId(rawId: string | string[]) {
  const idFromParams = Array.isArray(rawId) ? rawId[0] : rawId;
  return typeof idFromParams === "string" ? idFromParams.trim() : "";
}

async function findCategoryByParam(id: string) {
  if (!id) return null;

  if (mongoose.isValidObjectId(id)) {
    const category = await Category.findById(id);
    if (category) return category;
  }

  return Category.findOne({ id });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const normalizedId = getNormalizedId(id);
    const category = await findCategoryByParam(normalizedId);

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, category }, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/categories/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch category" },
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
    const category = await findCategoryByParam(normalizedId);

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = categoryUpdateSchema.safeParse(body);

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

    if (parsed.data.slug && parsed.data.slug !== category.slug) {
      const duplicate = await Category.findOne({ slug: parsed.data.slug } as any);
      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            message: "A category with this slug already exists.",
          },
          { status: 409 }
        );
      }
    }

    Object.assign(category, parsed.data);
    await category.save();

    return NextResponse.json({ success: true, category }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/admin/categories/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update category" },
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
    const category = await findCategoryByParam(normalizedId);

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    await category.deleteOne();

    return NextResponse.json(
      { success: true, message: "Category deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/admin/categories/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
      { status: 500 }
    );
  }
}
