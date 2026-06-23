import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/authHelper";
import ReviewModel from "@/models/Review";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

// POST /api/reviews/[reviewId]/helpful
// Vote a review as helpful (Strictly checks user authentication and prevents duplicate votes)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    await connectDB();
    const { reviewId } = await params;

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please sign in to vote a review as helpful." },
        { status: 401 }
      );
    }

    const userId = user._id.toString();

    // 1. Fetch review
    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found." },
        { status: 404 }
      );
    }

    // 2. Prevent review owner from voting on their own review (optional but standard)
    if (review.userId === userId) {
      return NextResponse.json(
        { success: false, message: "You cannot vote your own review as helpful." },
        { status: 400 }
      );
    }

    // 3. Check if user already voted
    if (review.helpfulVotes.includes(userId)) {
      // Toggle support: if already voted, remove vote
      await ReviewModel.updateOne(
        { _id: reviewId },
        {
          $pull: { helpfulVotes: userId },
          $inc: { helpfulCount: -1 }
        }
      );

      return NextResponse.json({
        success: true,
        message: "Helpful vote removed.",
        helpfulCount: review.helpfulCount - 1,
      });
    }

    // Add new helpful vote
    await ReviewModel.updateOne(
      { _id: reviewId },
      {
        $addToSet: { helpfulVotes: userId },
        $inc: { helpfulCount: 1 }
      }
    );

    return NextResponse.json({
      success: true,
      message: "Voted helpful!",
      helpfulCount: review.helpfulCount + 1,
    });
  } catch (error: any) {
    console.error("POST Review Helpful Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to vote helpful." },
      { status: 500 }
    );
  }
}
