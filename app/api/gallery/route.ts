import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { writeFile } from "fs/promises";
import { join } from "path";
import { connectDB } from "@/lib/mongodb";
import GalleryModel from "@/models/Gallery";
import defaultGallery from "@/data/gallery.json";

export const dynamic = "force-dynamic";

const gallerySchema = z.object({
  id: z.string().optional(),
  image: z.string().min(1, "Image URL is required"),
  caption: z.string().min(1, "Caption is required"),
  categorySlug: z.string().optional().default("store"),
  order: z.number().optional().default(0),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});

async function syncGalleryJson() {
  try {
    const filePath = join(process.cwd(), "data", "gallery.json");
    const items = await GalleryModel.find().sort({ order: 1, createdAt: -1 }).lean();
    
    const formatted = items.map((g: any) => ({
      id: g.id,
      image: g.image,
      caption: g.caption,
      categorySlug: g.categorySlug || "store",
      order: g.order ?? 0,
      status: g.status || "active",
    }));

    await writeFile(filePath, JSON.stringify(formatted, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to sync gallery.json:", err);
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    let query: Record<string, any> = {};
    if (category && category !== "all") {
      query.categorySlug = category;
    }
    if (status && status !== "all") {
      query.status = status;
    }

    let items = await GalleryModel.find(query).sort({ order: 1, createdAt: -1 }).lean();

    // Auto-seed if collection is completely empty
    if (items.length === 0 && Object.keys(query).length === 0) {
      const seedData = (defaultGallery as any[]).map((item, idx) => ({
        id: item.id || `gal-${String(idx + 1).padStart(3, "0")}`,
        image: item.image,
        caption: item.caption,
        categorySlug: item.categorySlug || "store",
        order: idx + 1,
        status: "active",
      }));

      await GalleryModel.insertMany(seedData);
      items = await GalleryModel.find().sort({ order: 1, createdAt: -1 }).lean();
    }

    return NextResponse.json(
      { success: true, count: items.length, items },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/gallery error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch gallery items", items: defaultGallery },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = gallerySchema.safeParse(body);

    if (!parsed.success) {
      const perr: any = parsed.error;
      return NextResponse.json(
        { success: false, message: perr.errors?.[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const itemId = data.id || `gal-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const newItem = await GalleryModel.create({
      ...data,
      id: itemId,
    });

    await syncGalleryJson();

    return NextResponse.json(
      {
        success: true,
        message: "Gallery item created successfully",
        item: newItem,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/gallery error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create gallery item" },
      { status: 500 }
    );
  }
}
