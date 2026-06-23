import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/authHelper";
import OrderModel from "@/models/Order";
import ReviewModel from "@/models/Review";
import { connectDB } from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: productId } = await params;

    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({
        success: true,
        eligible: false,
        code: "AUTH_REQUIRED",
        message: "Please sign in to review this product.",
      });
    }

    const userId = user._id.toString();

    // 1. Fetch orders for this user that contain the product ID
    const userOrders = await OrderModel.find({
      userId,
      "items.productId": productId,
    }).lean();

    if (userOrders.length === 0) {
      return NextResponse.json({
        success: true,
        eligible: false,
        code: "NOT_PURCHASED",
        message: "Only customers who have purchased this product can leave a review.",
      });
    }

    // 2. Check if any order containing the product has been delivered
    const deliveredOrder = userOrders.find((o) => o.status === "delivered");

    if (!deliveredOrder) {
      return NextResponse.json({
        success: true,
        eligible: false,
        code: "NOT_DELIVERED",
        message: "You can review this product after your order has been delivered.",
      });
    }

    // 3. Check if they have already reviewed the product
    const existingReview = await ReviewModel.findOne({
      userId,
      productId,
    }).lean();

    if (existingReview) {
      return NextResponse.json({
        success: true,
        eligible: true,
        hasExisting: true,
        existingReview,
        orderId: deliveredOrder._id,
        message: "Edit your existing review.",
      });
    }

    return NextResponse.json({
      success: true,
      eligible: true,
      hasExisting: false,
      orderId: deliveredOrder._id,
    });
  } catch (error: any) {
    console.error("GET Eligibility Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to check eligibility." },
      { status: 500 }
    );
  }
}
