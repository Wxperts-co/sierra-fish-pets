import { NextRequest, NextResponse } from "next/server";

import ProductModel from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import { brands } from "@/data";

// Simple in-memory cache for products
const productCache = new Map<string, { data: any; expiresAt: number }>();
const CACHE_TTL = 60 * 1000; // 1 minute cache duration

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    searchParams.sort();
    const cacheKey = searchParams.toString();

    // Check cache
    const cached = productCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json(cached.data, { status: 200 });
    }

    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const id = searchParams.get("id");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const sort = searchParams.get("sort");
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minRating = searchParams.get("rating");
    const stockStatus = searchParams.get("stockStatus");
    const isBestSeller = searchParams.get("isBestSeller");
    const isNewArrival = searchParams.get("isNewArrival");
    const isFeatured = searchParams.get("isFeatured");

    const latestByCategory = searchParams.get("latestByCategory");
    if (latestByCategory === "true") {
      const categoriesList = [
        "dog",
        "cat",
        "aquatic",
        "reptile",
        "bird",
        "small-animal",
      ];

      const productsPromises = categoriesList.map(async (slug) => {
        const catFilter = {
          $or: [
            { categorySlug: slug },
            { categorySlug: { $regex: new RegExp(`^${slug}-\\/\\-`, "i") } },
          ],
        };
        return ProductModel.find(catFilter)
          .sort({ createdAt: -1 })
          .limit(2)
          .lean();
      });

      const results = await Promise.all(productsPromises);
      const allLatestProducts = results.flat();

      const responseData = {
        success: true,
        count: allLatestProducts.length,
        products: allLatestProducts,
        totalPages: 1,
      };
      productCache.set(cacheKey, { data: responseData, expiresAt: Date.now() + CACHE_TTL });
      return NextResponse.json(responseData, { status: 200 });
    }

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (id) filter.id = id;
    if (category) {
      filter.$or = [
        { categorySlug: category },
        { categorySlug: { $regex: new RegExp(`^${category}-\\/\\-`, "i") } },
      ];
    }
    if (subcategory) filter.subcategorySlug = subcategory;

    if (brand) {
      const brandSlugs = brand.split(",");
      const brandNames = brandSlugs
        .map((slug) => {
          const brandObj = brands.find((b) => b.slug === slug);
          return brandObj ? brandObj.name : null;
        })
        .filter(Boolean) as string[];

      if (brandNames.length > 0) {
        filter.brand = {
          $in: brandNames.map((name) => new RegExp(`^${name}$`, "i")),
        };
      }
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        filter.price.$lte = Number(maxPrice);
      }
      if (Object.keys(filter.price).length === 0) {
        delete filter.price;
      }
    }

    if (minRating && !isNaN(Number(minRating))) {
      filter.rating = { $gte: Number(minRating) };
    }

    if (stockStatus) {
      if (stockStatus === "in_stock") {
        filter.stockStatus = { $in: ["in_stock", "low_stock"] };
      } else {
        filter.stockStatus = stockStatus;
      }
    }

    if (isBestSeller === "true") {
      filter.isBestSeller = true;
    }
    if (isNewArrival === "true") {
      filter.isNewArrival = true;
    }
    if (isFeatured === "true") {
      filter.isFeatured = true;
    }

    // Determine sorting
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sortOption: Record<string, any> = {};
    if (sort === "newest") {
      sortOption = { createdAt: -1 };
    } else if (sort === "best-selling") {
      sortOption = { isBestSeller: -1, reviewCount: -1 };
    } else if (sort === "price-low-high") {
      sortOption = { price: 1 };
    } else if (sort === "price-high-low") {
      sortOption = { price: -1 };
    } else if (sort === "rating") {
      sortOption = { rating: -1 };
    } else if (sort === "featured") {
      sortOption = { isFeatured: -1 };
    } else {
      sortOption = { createdAt: -1 }; // Preserve original default sorting behavior
    }

    const pageNum = page ? parseInt(page, 10) : null;
    const limitNum = limit ? parseInt(limit, 10) : null;
    const isPaginated = pageNum && limitNum && !isNaN(pageNum) && !isNaN(limitNum);

    let query = ProductModel.find(filter).sort(sortOption);

    if (isPaginated) {
      const skip = (pageNum! - 1) * limitNum!;
      query = query.skip(skip).limit(limitNum!);
    } else if (limitNum && !isNaN(limitNum)) {
      query = query.limit(limitNum);
    }

    let products: any[] = [];
    let totalCount = 0;

    if (isBestSeller === "true") {
      products = await query.lean();
      if (products.length === 0) {
        const fallbackQuery = ProductModel.find().sort({ isBestSeller: -1, reviewCount: -1 }).limit(limitNum || 10);
        products = await fallbackQuery.lean();
        totalCount = products.length;
      } else {
        totalCount = await ProductModel.countDocuments(filter);
      }
    } else if (isNewArrival === "true") {
      products = await query.lean();
      if (products.length === 0) {
        const fallbackQuery = ProductModel.find().sort({ createdAt: -1 }).limit(limitNum || 12);
        products = await fallbackQuery.lean();
        totalCount = products.length;
      } else {
        totalCount = await ProductModel.countDocuments(filter);
      }
    } else if (isFeatured === "true") {
      products = await query.lean();
      if (products.length === 0) {
        const fallbackQuery = ProductModel.find().sort({ isFeatured: -1, rating: -1 }).limit(limitNum || 5);
        products = await fallbackQuery.lean();
        totalCount = products.length;
      } else {
        totalCount = await ProductModel.countDocuments(filter);
      }
    } else {
      [products, totalCount] = await Promise.all([
        query.lean(),
        ProductModel.countDocuments(filter),
      ]);
    }

    const totalPages = isPaginated ? Math.ceil(totalCount / limitNum!) : 1;

    const responseData = {
      success: true,
      count: totalCount,
      products,
      totalPages,
    };
    productCache.set(cacheKey, { data: responseData, expiresAt: Date.now() + CACHE_TTL });
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
