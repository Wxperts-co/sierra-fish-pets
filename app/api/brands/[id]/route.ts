import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import BrandModel from "@/models/Brand";

const brandUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  logo: z.string().optional(),
  description: z.string().optional(),
  categories: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  website: z.string().optional(),
});

function getNormalizedId(rawId: string | string[]) {
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  return typeof id === "string" ? id.trim() : "";
}

async function findBrandByParam(id: string) {
  if (!id) return null;
  if (mongoose.isValidObjectId(id)) {
    const brand = await BrandModel.findById(id);
    if (brand) return brand;
  }
  return BrandModel.findOne({ id });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const brand = await findBrandByParam(getNormalizedId(id));
    if (!brand) {
      return NextResponse.json({ success: false, message: "Brand not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, brand }, { status: 200 });
  } catch (error) {
    console.error("GET /api/brands/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch brand" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const brand = await findBrandByParam(getNormalizedId(id));
    if (!brand) {
      return NextResponse.json({ success: false, message: "Brand not found" }, { status: 404 });
    }
    const body = await request.json();
    const parsed = brandUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const perr: any = parsed.error;
      return NextResponse.json(
        { success: false, message: perr.errors?.[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    Object.assign(brand, parsed.data);
    await brand.save();
    return NextResponse.json({ success: true, brand }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/brands/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update brand" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const brand = await findBrandByParam(getNormalizedId(id));
    if (!brand) {
      return NextResponse.json({ success: false, message: "Brand not found" }, { status: 404 });
    }
    await brand.deleteOne();
    return NextResponse.json({ success: true, message: "Brand deleted." }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/brands/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete brand" }, { status: 500 });
  }
}
