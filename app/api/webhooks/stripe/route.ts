import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/models/Order";
import ProductModel from "@/models/Product";
import GiftCardInstanceModel from "@/models/GiftCardInstance";

const stripe = new Stripe(process.env.LIVE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia" as any,
});

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signatures or configuration." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: "Invalid signature: " + err.message }, { status: 400 });
  }

  // const event = JSON.parse(payload) as Stripe.Event;

  try {
    // Handle successful payments
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        const { fulfillOrder } = await import("@/lib/services/orderFulfillmentService");
        await fulfillOrder(orderId);
      }
    }

    // Handle expired/abandoned checkout sessions
    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await connectDB();
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
              if (item.productId.startsWith("giftcard-")) {
                const parts = item.productId.split("-");
                cleanId = `${parts[0]}-${parts[1]}`;
              } else if (item.productId.includes("-")) {
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
                console.log(`[Stripe Webhook] Restored ${item.quantity} units for product ${cleanId} (Order ${order.orderNumber} expired)`);
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("❌ Stripe Webhook processing failed:", error);
    return NextResponse.json(
      { error: "Webhook processing failed", message: error.message },
      { status: 500 }
    );
  }
}

