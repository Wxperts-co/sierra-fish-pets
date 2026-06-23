import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/authHelper";
import ReviewModel from "@/models/Review";
import { connectDB } from "@/lib/mongodb";
import { updateProductRatingStats } from "@/lib/reviews";

export const dynamic = "force-dynamic";

// PATCH /api/admin/reviews/[reviewId]
// Update review status (published, hidden, reported)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    await connectDB();
    const { reviewId } = await params;

    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied. Admin authorization required." },
        { status: 403 }
      );
    }

    const { status } = await request.json();

    if (!status || !["published", "hidden", "reported"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid status: published, hidden, or reported." },
        { status: 400 }
      );
    }

    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found." },
        { status: 404 }
      );
    }

    review.status = status;
    await review.save();

    // Recalculate parent product rating stats
    await updateProductRatingStats(review.productId);

    return NextResponse.json({
      success: true,
      message: `Review status updated to ${status} successfully.`,
      review,
    });
  } catch (error: any) {
    console.error("PATCH Admin Review Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update review status." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/reviews/[reviewId]
// Permanently delete a review from the database
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    await connectDB();
    const { reviewId } = await params;

    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied. Admin authorization required." },
        { status: 403 }
      );
    }

    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found." },
        { status: 404 }
      );
    }

    const productId = review.productId;

    await ReviewModel.deleteOne({ _id: reviewId });

    // Recalculate parent product rating stats after deletion
    await updateProductRatingStats(productId);

    return NextResponse.json({
      success: true,
      message: "Review permanently deleted.",
    });
  } catch (error: any) {
    console.error("DELETE Admin Review Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete review." },
      { status: 500 }
    );
  }
}
