import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { writeFile } from "fs/promises";
import { join } from "path";
import { connectDB } from "@/lib/mongodb";
import BlogModel from "@/models/Blog";
import defaultBlogs from "@/data/blogs.json";

const seoSchema = z.object({
  title: z.string().optional().default(""),
  description: z.string().optional().default(""),
  keywords: z.array(z.string()).optional().default([]),
});

const specialistQuoteSchema = z.object({
  quote: z.string().optional().default(""),
  author: z.string().optional().default(""),
});

const blogSchema = z.object({
  id: z.string().min(1, "Blog ID is required"),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional().default(""),
  content: z.string().optional().default(""),
  coverImage: z.string().optional().default(""),
  thumbnailAlt: z.string().optional().default(""),
  author: z.string().optional().default("Sierra Team"),
  authorRole: z.string().optional().default("Pet Specialist"),
  authorImage: z.string().optional().default("/images/team/sierra-team.jpg"),
  category: z.string().min(1, "Category is required"),
  categorySlug: z.string().min(1, "Category slug is required"),
  tags: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  isArrival: z.boolean().optional().default(false),
  status: z.string().optional().default("draft"),
  publishedAt: z.string().optional().default(""),
  updatedAt: z.string().optional().default(""),
  readingTime: z.number().optional().default(0),
  relatedIds: z.array(z.string()).optional().default([]),
  seo: seoSchema.optional().default(() => ({ title: "", description: "", keywords: [] })),
  specialistQuote: specialistQuoteSchema.optional().default(() => ({ quote: "", author: "" })),
  galleryImages: z.array(z.string()).optional().default([]),
});

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

export async function GET(_request: NextRequest) {
  try {
    await connectDB();
    let blogs = await BlogModel.find().sort({ publishedAt: -1 }).lean();

    // Seed from JSON if collection is empty
    if (blogs.length === 0) {
      await BlogModel.insertMany(defaultBlogs);
      blogs = await BlogModel.find().sort({ publishedAt: -1 }).lean();
    }

    return NextResponse.json(
      { success: true, count: blogs.length, blogs },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/blogs error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = blogSchema.safeParse(body);

    if (!parsed.success) {
      const perr: any = parsed.error;
      return NextResponse.json(
        { success: false, message: perr.errors?.[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const blogData = parsed.data;

    const existing = await BlogModel.findOne({ id: blogData.id });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A blog post with this ID already exists." },
        { status: 409 }
      );
    }

    const blog = new BlogModel(blogData);
    await blog.save();

    // Sync file system JSON
    await syncBlogsJson();

    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (error) {
    console.error("POST /api/blogs error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
