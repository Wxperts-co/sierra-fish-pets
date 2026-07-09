import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/models/Order";
import UserModel from "@/models/User";

const stripe = new Stripe(process.env.LIVE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia" as any,
});

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

    // Batch-fetch Stripe checkout sessions to minimize API requests and avoid rate limits
    let stripeSessions: Stripe.Checkout.Session[] = [];
    try {
      const sessionList = await stripe.checkout.sessions.list({ limit: 100 });
      stripeSessions = sessionList.data || [];
    } catch (stripeErr) {
      console.error("Failed to list Stripe checkout sessions for status sync:", stripeErr);
    }

    // Fetch orders sorting by placedAt descending
    const rawOrders = await OrderModel.find(filter)
      .sort({ placedAt: -1 })
      .lean();

    // Sync pending credit card orders with Stripe (only for recent orders placed within the last 7 days)
    const orders = await Promise.all(
      rawOrders.map(async (order) => {
        const placedDate = order.placedAt ? new Date(order.placedAt) : null;
        const diffDays = placedDate ? (Date.now() - placedDate.getTime()) / (1000 * 60 * 60 * 24) : 999;
        
        if (order.paymentMethod === "credit_card" && order.paymentStatus === "pending" && diffDays <= 7) {
          const session = stripeSessions.find(
            (s) => s.metadata?.orderId === order._id.toString()
          );
          if (session && session.payment_status === "paid") {
            try {
              await OrderModel.updateOne(
                { _id: order._id },
                { $set: { paymentStatus: "paid", status: "confirmed", updatedAt: new Date() } }
              );

              // Update in-memory object returned to UI
              order.paymentStatus = "paid";
              order.status = "confirmed";

              // Dynamically trigger invoice generation & confirmation email in the background
              (async () => {
                try {
                  const { generateInvoicePDF } = await import("@/lib/services/invoiceService");
                  const { sendOrderConfirmationEmail } = await import("@/lib/services/emailService");
                  
                  const updatedOrder = await OrderModel.findById(order._id);
                  if (updatedOrder) {
                    const relativeInvoiceUrl = await generateInvoicePDF(updatedOrder);
                    updatedOrder.invoiceUrl = relativeInvoiceUrl;
                    updatedOrder.invoiceGeneratedAt = new Date();
                    await updatedOrder.save();
                    await sendOrderConfirmationEmail(updatedOrder);
                  }
                } catch (bgErr) {
                  console.error("Failed to generate invoice/email during fallback sync:", bgErr);
                }
              })();
            } catch (updateErr) {
              console.error(`Failed to update synced order ${order.orderNumber} in DB:`, updateErr);
            }
          }
        }
        return order;
      })
    );

    // Calculate status statistics for stats cards
    const [total, pending, processing, shipped, delivered, cancelled, totalUsers] = await Promise.all([
      OrderModel.countDocuments({}),
      OrderModel.countDocuments({ status: "pending" }),
      OrderModel.countDocuments({ status: "processing" }),
      OrderModel.countDocuments({ status: "shipped" }),
      OrderModel.countDocuments({ status: "delivered" }),
      OrderModel.countDocuments({ status: "cancelled" }),
      UserModel.countDocuments({ role: "user", deletedAt: null }),
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
        totalUsers,
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
