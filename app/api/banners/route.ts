import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { writeFile } from "fs/promises";
import { join } from "path";
import { connectDB } from "@/lib/mongodb";
import BannerModel from "@/models/Banner";
import defaultBanners from "@/data/banners.json";

const bannerSchema = z.object({
  id: z.string().min(1, "Banner ID is required"),
  image: z.string().min(1, "Image URL is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional().default(""),
  ctaLabel: z.string().optional().default(""),
  ctaLink: z.string().optional().default(""),
  order: z.number().optional().default(0),
  status: z.string().optional().default("active"),
});

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

export async function GET(_request: NextRequest) {
  try {
    await connectDB();
    let banners = await BannerModel.find().sort({ order: 1 }).lean();

    // Seed from JSON if collection is empty
    if (banners.length === 0) {
      await BannerModel.insertMany(defaultBanners);
      banners = await BannerModel.find().sort({ order: 1 }).lean();
    }

    return NextResponse.json(
      { success: true, count: banners.length, banners },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/banners error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = bannerSchema.safeParse(body);

    if (!parsed.success) {
      const perr: any = parsed.error;
      return NextResponse.json(
        { success: false, message: perr.errors?.[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const bannerData = parsed.data;

    const existing = await BannerModel.findOne({ id: bannerData.id });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A banner with this ID already exists." },
        { status: 409 }
      );
    }

    const banner = new BannerModel(bannerData);
    await banner.save();

    // Sync file system JSON
    await syncBannersJson();

    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (error) {
    console.error("POST /api/banners error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create banner" },
      { status: 500 }
    );
  }
}
