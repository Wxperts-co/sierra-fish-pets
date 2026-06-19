import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import BrandModel from "@/models/Brand";
import defaultBrands from "@/data/brands.json";

const brandSchema = z.object({
  id: z.string().min(1, "Brand ID is required"),
  name: z.string().min(1, "Brand name is required"),
  slug: z.string().min(1, "Slug is required"),
  logo: z.string().optional().default(""),
  description: z.string().optional().default(""),
  categories: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  website: z.string().optional().default(""),
});

export async function GET(_request: NextRequest) {
  try {
    await connectDB();

    let brands = await BrandModel.find().sort({ name: 1 }).lean();

    // Seed from JSON if collection is empty
    if (brands.length === 0) {
      await BrandModel.insertMany(defaultBrands);
      brands = await BrandModel.find().sort({ name: 1 }).lean();
    }

    return NextResponse.json(
      { success: true, count: brands.length, brands },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/brands error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = brandSchema.safeParse(body);

    if (!parsed.success) {
      const perr: any = parsed.error;
      return NextResponse.json(
        { success: false, message: perr.errors?.[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const existing = await BrandModel.findOne({ id: parsed.data.id });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A brand with this ID already exists." },
        { status: 409 }
      );
    }

    const brand = new BrandModel(parsed.data);
    await brand.save();

    return NextResponse.json({ success: true, brand }, { status: 201 });
  } catch (error) {
    console.error("POST /api/brands error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create brand" },
      { status: 500 }
    );
  }
}
