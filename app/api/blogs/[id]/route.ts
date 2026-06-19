import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { writeFile } from "fs/promises";
import { join } from "path";
import { connectDB } from "@/lib/mongodb";
import BlogModel from "@/models/Blog";

const seoUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

const specialistQuoteUpdateSchema = z.object({
  quote: z.string().optional(),
  author: z.string().optional(),
});

const blogUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  thumbnailAlt: z.string().optional(),
  author: z.string().optional(),
  authorRole: z.string().optional(),
  authorImage: z.string().optional(),
  category: z.string().min(1).optional(),
  categorySlug: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  isArrival: z.boolean().optional(),
  status: z.string().optional(),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
  readingTime: z.number().optional(),
  relatedIds: z.array(z.string()).optional(),
  seo: seoUpdateSchema.optional(),
  specialistQuote: specialistQuoteUpdateSchema.optional(),
  galleryImages: z.array(z.string()).optional(),
});

function getNormalizedId(rawId: string | string[]) {
  const idFromParams = Array.isArray(rawId) ? rawId[0] : rawId;
  return typeof idFromParams === "string" ? idFromParams.trim() : "";
}

async function findBlogByParam(id: string) {
  if (!id) return null;

  if (mongoose.isValidObjectId(id)) {
    const blog = await BlogModel.findById(id);
    if (blog) return blog;
  }

  return BlogModel.findOne({ id });
}

async function syncBlogsJson() {
  const filePath = join(process.cwd(), "data", "blogs.json");
  const blogs = await BlogModel.find().sort({ publishedAt: -1 }).lean();
  
  const formatted = blogs.map((b: any) => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    content: b.content,
    coverImage: b.coverImage,
    thumbnailAlt: b.thumbnailAlt,
    author: b.author,
    authorRole: b.authorRole,
    authorImage: b.authorImage,
    category: b.category,
    categorySlug: b.categorySlug,
    tags: b.tags,
    featured: b.featured,
    isArrival: b.isArrival,
    status: b.status,
    publishedAt: b.publishedAt,
    updatedAt: b.updatedAt,
    readingTime: b.readingTime,
    relatedIds: b.relatedIds,
    seo: {
      title: b.seo?.title || "",
      description: b.seo?.description || "",
      keywords: b.seo?.keywords || [],
    },
    specialistQuote: {
      quote: b.specialistQuote?.quote || "",
      author: b.specialistQuote?.author || "",
    },
    galleryImages: b.galleryImages || [],
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
    const blog = await findBlogByParam(normalizedId);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog }, { status: 200 });
  } catch (error) {
    console.error("GET /api/blogs/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blog post" },
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
    const blog = await findBlogByParam(normalizedId);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = blogUpdateSchema.safeParse(body);

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

    Object.assign(blog, parsed.data);
    await blog.save();

    // Sync filesystem
    await syncBlogsJson();

    return NextResponse.json({ success: true, blog }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/blogs/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update blog post" },
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
    const blog = await findBlogByParam(normalizedId);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    await blog.deleteOne();

    // Sync filesystem
    await syncBlogsJson();

    return NextResponse.json(
      { success: true, message: "Blog post deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/blogs/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
