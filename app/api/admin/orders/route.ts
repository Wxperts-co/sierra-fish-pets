import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/models/Order";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    // Build filter query
    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "shippingAddress.fullName": { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    // Fetch orders sorting by placedAt descending
    const orders = await OrderModel.find(filter)
      .sort({ placedAt: -1 })
      .lean();

    // Calculate status statistics for stats cards
    const [total, pending, processing, shipped, delivered, cancelled] = await Promise.all([
      OrderModel.countDocuments({}),
      OrderModel.countDocuments({ status: "pending" }),
      OrderModel.countDocuments({ status: "processing" }),
      OrderModel.countDocuments({ status: "shipped" }),
      OrderModel.countDocuments({ status: "delivered" }),
      OrderModel.countDocuments({ status: "cancelled" }),
    ]);

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
      stats: {
        total,
        pending,
        processing,
        shipped,
        delivered,
        cancelled,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}
