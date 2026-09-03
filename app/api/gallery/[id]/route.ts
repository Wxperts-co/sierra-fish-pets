import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { writeFile } from "fs/promises";
import { join } from "path";
import { connectDB } from "@/lib/mongodb";
import GalleryModel from "@/models/Gallery";

export const dynamic = "force-dynamic";

const galleryUpdateSchema = z.object({
  image: z.string().min(1, "Image URL is required").optional(),
  caption: z.string().min(1, "Caption is required").optional(),
  categorySlug: z.string().optional(),
  order: z.number().optional(),
  status: z.enum(["active", "inactive"]).optional(),
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const item = await GalleryModel.findOne({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }].filter(Boolean),
    });

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Gallery item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, item }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/gallery/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch gallery item" },
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
    const body = await request.json();

    const parsed = galleryUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const perr: any = parsed.error;
      return NextResponse.json(
        { success: false, message: perr.errors?.[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const updated = await GalleryModel.findOneAndUpdate(
      {
        $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }].filter(Boolean),
      },
      { $set: parsed.data },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Gallery item not found" },
        { status: 404 }
      );
    }

    await syncGalleryJson();

    return NextResponse.json(
      {
        success: true,
        message: "Gallery item updated successfully",
        item: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH /api/gallery/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update gallery item" },
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

    const deleted = await GalleryModel.findOneAndDelete({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }].filter(Boolean),
    });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Gallery item not found" },
        { status: 404 }
      );
    }

    await syncGalleryJson();

    return NextResponse.json(
      {
        success: true,
        message: "Gallery item deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/gallery/[id] error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}
