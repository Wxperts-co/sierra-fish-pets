import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/authHelper";
import ReviewModel from "@/models/Review";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

// GET /api/admin/reviews
// Retrieve reviews for admin dashboard with search, pagination, status, and rating filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthenticatedUser(request);
    const ALLOWED_ADMIN_ROLES = ["admin", "manager", "sales", "delivery boy"];
    if (!user || !ALLOWED_ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json(
        { success: false, message: "Access denied. Admin authorization required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "10", 10), 1);
    
    const search = searchParams.get("search") || "";
    const rating = searchParams.get("rating");
    const status = searchParams.get("status");
    const productId = searchParams.get("productId");

    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { comment: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
      ];
    }

    if (rating && !isNaN(Number(rating))) {
      filter.rating = Number(rating);
    }

    if (status) {
      filter.status = status;
    }

    if (productId) {
      filter.productId = productId;
    }

    const [reviews, totalCount, statsAgg] = await Promise.all([
      ReviewModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ReviewModel.countDocuments(filter),
      ReviewModel.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const stats = {
      total: 0,
      published: 0,
      hidden: 0,
      reported: 0,
    };

    statsAgg.forEach((item) => {
      const statusKey = item._id as "published" | "hidden" | "reported";
      if (statusKey in stats) {
        stats[statusKey] = item.count;
      }
    });
    stats.total = await ReviewModel.countDocuments({});

    return NextResponse.json({
      success: true,
      reviews,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      currentPage: page,
      stats,
    });
  } catch (error: any) {
    console.error("GET Admin Reviews Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}
