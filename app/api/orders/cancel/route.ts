import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/models/Order";
import ProductModel from "@/models/Product";

const stripe = new Stripe(process.env.LIVE_SECRET_KEY || process.env.TEST_SECRET_KEY || "", {
  apiVersion: "2026-06-24.dahlia" as any,
});

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const sessionId = searchParams.get("session_id");

    // 1. Expire the Stripe session immediately so it cannot be paid later
    if (sessionId && sessionId !== "{CHECKOUT_SESSION_ID}") {
      try {
        await stripe.checkout.sessions.expire(sessionId);
        console.log(`[Cancel Route] Expired Stripe session ${sessionId}`);
      } catch (stripeErr: any) {
        // If it is already expired, completed, or failed, Stripe will throw an error. We can safely ignore it.
        console.error(`[Cancel Route] Error expiring Stripe session:`, stripeErr.message);
      }
    }

    // 2. Cancel the order and restore stock in MongoDB
    if (orderId) {
      const order = await OrderModel.findById(orderId);

      // Only cancel and restore stock if the order exists, payment is still pending, and it is not already cancelled
      if (order && order.paymentStatus === "pending" && order.status !== "cancelled") {
        order.status = "cancelled";
        order.paymentStatus = "failed";
        order.updatedAt = new Date();
        await order.save();

        // Restore product stock
        for (const item of order.items) {
          if (item.productId) {
            let cleanId = item.productId;
            if (item.productId.includes("-")) {
              const parts = item.productId.split("-");
              const lastPart = parts[parts.length - 1];
              if (!isNaN(Number(lastPart))) {
                parts.pop();
                cleanId = parts.join("-");
              }
            }

            let product = null;
            if (mongoose.Types.ObjectId.isValid(cleanId)) {
              try {
                product = await ProductModel.findById(cleanId);
              } catch (err) {
                // Ignore cast error
              }
            }
            if (product) {
              product.stockCount += item.quantity;
              await product.save();
              console.log(`[Cancel Route] Restored ${item.quantity} units for product ${cleanId} (Order ${order.orderNumber} cancelled)`);
            }
          }
        }
      }
    }
  } catch (error: any) {
    console.error("[Cancel Route] General error in cancel redirect:", error);
  }

  // 3. Redirect the browser back to the checkout page
  const baseUrl = process.env.NEXTAUTH_URL || "";
  const redirectUrl = `${baseUrl.replace(/\/$/, "")}/checkout`;
  return NextResponse.redirect(redirectUrl);
}
