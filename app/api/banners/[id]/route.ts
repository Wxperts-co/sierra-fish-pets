import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { writeFile } from "fs/promises";
import { join } from "path";
import { connectDB } from "@/lib/mongodb";
import BannerModel from "@/models/Banner";

const bannerUpdateSchema = z.object({
  image: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  subtitle: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaLink: z.string().optional(),
  order: z.number().optional(),
  status: z.string().optional(),
});

function getNormalizedId(rawId: string | string[]) {
  const idFromParams = Array.isArray(rawId) ? rawId[0] : rawId;
  return typeof idFromParams === "string" ? idFromParams.trim() : "";
}

async function findBannerByParam(id: string) {
  if (!id) return null;

  if (mongoose.isValidObjectId(id)) {
    const banner = await BannerModel.findById(id);
    if (banner) return banner;
  }

  return BannerModel.findOne({ id });
}

async function syncBannersJson() {
  const filePath = join(process.cwd(), "data", "banners.json");
  const banners = await BannerModel.find().sort({ order: 1 }).lean();
  
  const formatted = banners.map((b: any) => ({
    id: b.id,
    image: b.image,
    title: b.title,
    subtitle: b.subtitle || "",
    ctaLabel: b.ctaLabel || "",
    ctaLink: b.ctaLink || "",
    order: b.order ?? 0,
    status: b.status || "active",
  }));

  await writeFile(filePath, JSON.stringify(formatted, null, 2), "utf8");
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const normalizedId = getNormalizedId(id);
    const banner = await findBannerByParam(normalizedId);

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, banner }, { status: 200 });
  } catch (error) {
    console.error("GET /api/banners/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch banner" },
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
    const banner = await findBannerByParam(normalizedId);

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = bannerUpdateSchema.safeParse(body);

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

    Object.assign(banner, parsed.data);
    await banner.save();

    // Sync filesystem JSON
    await syncBannersJson();

    return NextResponse.json({ success: true, banner }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/banners/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update banner" },
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
    const banner = await findBannerByParam(normalizedId);

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    await banner.deleteOne();

    // Sync filesystem JSON
    await syncBannersJson();

    return NextResponse.json(
      { success: true, message: "Banner deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/banners/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
