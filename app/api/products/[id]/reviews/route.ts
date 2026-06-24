import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/authHelper";
import OrderModel from "@/models/Order";
import ReviewModel from "@/models/Review";
import ProductModel from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import { updateProductRatingStats } from "@/lib/reviews";

export const dynamic = "force-dynamic";

// GET /api/products/[id]/reviews
// Retrieve reviews with pagination, sorting, and rating summary statistics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: productId } = await params;

    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "10", 10), 1);
    const sort = searchParams.get("sort") || "newest";

    let sortQuery: Record<string, any> = { createdAt: -1 };
    if (sort === "highest-rating") {
      sortQuery = { rating: -1, createdAt: -1 };
    } else if (sort === "lowest-rating") {
      sortQuery = { rating: 1, createdAt: -1 };
    } else if (sort === "helpful") {
      sortQuery = { helpfulCount: -1, createdAt: -1 };
    }

    const filter = { productId, status: "published" as const };

    // 1. Fetch paginated reviews
    const [reviews, totalCount] = await Promise.all([
      ReviewModel.find(filter)
        .sort(sortQuery)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ReviewModel.countDocuments(filter),
    ]);

    // 2. Fetch rating summary breakdown stats
    const statsAgg = await ReviewModel.aggregate([
      { $match: { productId, status: "published" } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let ratingSum = 0;
    let ratingCount = 0;

    statsAgg.forEach((item) => {
      breakdown[item._id] = item.count;
      ratingSum += item._id * item.count;
      ratingCount += item.count;
    });

    const averageRating = ratingCount > 0 ? Math.round((ratingSum / ratingCount) * 10) / 10 : 0;

    const ratingPercentages: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (ratingCount > 0) {
      for (let star = 1; star <= 5; star++) {
        ratingPercentages[star] = Math.round((breakdown[star] / ratingCount) * 100);
      }
    }

    return NextResponse.json({
      success: true,
      reviews,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      currentPage: page,
      stats: {
        ratingBreakdown: ratingPercentages,
        averageRating,
        totalCount: ratingCount,
      },
    });
  } catch (error: any) {
    console.error("GET Reviews Route Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch reviews." },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/reviews
// Submit a review or update an existing one (Backend purchase & delivery verification enforced)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: productId } = await params;

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please sign in to review this product." },
        { status: 401 }
      );
    }

    const { rating, title, comment, images } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid rating between 1 and 5 stars." },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Review comment cannot be empty." },
        { status: 400 }
      );
    }

    const userId = user._id.toString();

    // 1. Verify eligibility (Delivered order containing this product)
    const userOrders = await OrderModel.find({
      userId,
      "items.productId": productId,
    }).lean();

    if (userOrders.length === 0) {
      return NextResponse.json(
        { success: false, message: "Only customers who have purchased this product can leave a review." },
        { status: 403 }
      );
    }

    const deliveredOrder = userOrders.find((o) => o.status === "delivered");
    if (!deliveredOrder) {
      return NextResponse.json(
        { success: false, message: "You can review this product after your order has been delivered." },
        { status: 403 }
      );
    }

    // 2. Check if a review already exists
    let review = await ReviewModel.findOne({ userId, productId });

    if (review) {
      // Edit mode
      review.rating = Number(rating);
      review.title = title ? String(title).trim() : "";
      review.comment = String(comment).trim();
      review.images = Array.isArray(images) ? images : [];
      review.status = "published"; // reset to published if it was hidden/reported
      await review.save();
    } else {
      // Create mode
      review = await ReviewModel.create({
        userId,
        userName: user.name || "Verified Buyer",
        userAvatar: user.avatar?.url || "",
        productId,
        orderId: deliveredOrder._id.toString(),
        rating: Number(rating),
        title: title ? String(title).trim() : "",
        comment: String(comment).trim(),
        images: Array.isArray(images) ? images : [],
        verifiedPurchase: true,
        status: "published",
        helpfulCount: 0,
        helpfulVotes: [],
      });
    }

    // 3. Update the parent product's average rating and review counts
    await updateProductRatingStats(productId);

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully!",
      review,
    });
  } catch (error: any) {
    console.error("POST Review Route Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to submit review." },
      { status: 500 }
    );
  }
}
