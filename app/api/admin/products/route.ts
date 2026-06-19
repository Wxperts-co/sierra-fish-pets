import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import Product from "@/models/Product";
import { connectDB } from "@/lib/mongodb";

const productSchema = z.object({
  id: z.string().min(1, "Product id is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  sku: z.string().min(1, "SKU is required"),
  categorySlug: z.string().min(1, "Category slug is required"),
  subcategorySlug: z.string().min(1, "Subcategory slug is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().nonnegative("Price must be non-negative"),
  compareAtPrice: z.number().nonnegative("Compare price must be non-negative").optional().nullable(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  description: z.string().min(1, "Description is required"),
  features: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  rating: z.number().min(0).max(5).optional().default(0),
  reviewCount: z.number().nonnegative().optional().default(0),
  reviews: z.array(z.any()).optional().default([]),
  stockStatus: z.enum(["in_stock", "low_stock", "out_of_stock"]),
  stockCount: z.number().nonnegative().optional().default(0),
  isNewArrival: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  isBestSeller: z.boolean().optional().default(false),
  dimensions: z.string().optional(),
  createdAt: z.string().min(1, "Created date is required"),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");
    const stockStatus = searchParams.get("stockStatus");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    if (stockStatus && stockStatus !== "all") {
      filter.stockStatus = stockStatus;
    }

    const pageNum = page ? parseInt(page, 10) : null;
    const limitNum = limit ? parseInt(limit, 10) : null;
    const isPaginated = pageNum && limitNum && !isNaN(pageNum) && !isNaN(limitNum);

    let query = Product.find(filter).sort({ createdAt: -1 });

    if (isPaginated) {
      const skip = (pageNum! - 1) * limitNum!;
      query = query.skip(skip).limit(limitNum!);
    } else if (limitNum && !isNaN(limitNum)) {
      query = query.limit(limitNum);
    }

    const [products, totalCount, total, inStock, lowStock, outOfStock] = await Promise.all([
      query.lean(),
      Product.countDocuments(filter),
      Product.countDocuments({}),
      Product.countDocuments({ stockStatus: "in_stock" }),
      Product.countDocuments({ stockStatus: "low_stock" }),
      Product.countDocuments({ stockStatus: "out_of_stock" }),
    ]);

    return NextResponse.json(
      {
        success: true,
        count: totalCount,
        products,
        stats: {
          total,
          inStock,
          lowStock,
          outOfStock,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = productSchema.safeParse(body);

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

    const productData = parsed.data;

    const existingProduct = await Product.findOne({
      $or: [{ id: productData.id }, { slug: productData.slug }, { sku: productData.sku }],
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "A product with that ID, slug, or SKU already exists.",
        },
        { status: 409 }
      );
    }

    const product = new Product(productData);
    await product.save();

    const p: any = product;
    return NextResponse.json(
      {
        success: true,
        product: p,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product",
      },
      { status: 500 }
    );
  }
}
