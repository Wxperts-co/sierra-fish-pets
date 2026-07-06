import { NextRequest, NextResponse } from "next/server";
import { PipelineStage } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/models/Order";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "30days";

    // Compute the cutoff date based on timeframe
    const now = new Date();
    let cutoff: Date;
    if (timeframe === "7days") {
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeframe === "1year") {
      cutoff = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    } else {
      // default: 30 days
      cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Aggregate order items within the date range, grouped by productId
    const pipeline: PipelineStage[] = [
      {
        $match: {
          placedAt: { $gte: cutoff },
          status: { $nin: ["cancelled", "refunded"] },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.productName" },
          image: { $first: "$items.productImage" },
          sales: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.totalPrice" },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: 1,
          image: 1,
          sales: 1,
          revenue: 1,
        },
      },
    ];

    const topProducts = await OrderModel.aggregate(pipeline);

    return NextResponse.json({ success: true, topProducts });
  } catch (error) {
    console.error("GET /api/admin/top-products error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch top products." },
      { status: 500 }
    );
  }
}
