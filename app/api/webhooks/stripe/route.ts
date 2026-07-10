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
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle successful payments
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await connectDB();
      const order = await OrderModel.findById(orderId);
      if (order && order.paymentStatus !== "paid") {
        // 1. Update Payment Status to Paid & Order Status to Confirmed
        order.paymentStatus = "paid";
        order.status = "confirmed";
        order.updatedAt = new Date();
        await order.save();

        // 2. Deduct applied gift card balance
        if (order.giftCardCode && order.giftCardAmount && order.giftCardAmount > 0) {
          try {
            const giftCardInst = await GiftCardInstanceModel.findOne({ code: order.giftCardCode });
            if (giftCardInst) {
              giftCardInst.currentBalance = Math.max(0, giftCardInst.currentBalance - order.giftCardAmount);
              if (giftCardInst.currentBalance === 0) {
                giftCardInst.isActive = false;
              }
              await giftCardInst.save();
              console.log(`[Stripe Webhook] Deducted $${order.giftCardAmount} from Gift Card ${order.giftCardCode}`);
            }
          } catch (err) {
            console.error("Failed to deduct gift card balance in Stripe webhook:", err);
          }
        }

        // 3. Generate newly purchased gift cards if any
        try {
          const { generateGiftCardsForOrder } = await import("@/lib/services/giftCardService");
          await generateGiftCardsForOrder(order);
        } catch (gcGenErr) {
          console.error("Failed to generate gift cards in Stripe webhook:", gcGenErr);
        }

        // 4. Generate Invoice PDF
        try {
          const { generateInvoicePDF } = await import("@/lib/services/invoiceService");
          const relativeInvoiceUrl = await generateInvoicePDF(order);
          order.invoiceUrl = relativeInvoiceUrl;
          order.invoiceGeneratedAt = new Date();
          await order.save();
        } catch (pdfError) {
          console.error("Failed to generate invoice in webhook:", pdfError);
        }

        // 5. Send Confirmation Email
        try {
          const { sendOrderConfirmationEmail } = await import("@/lib/services/emailService");
          await sendOrderConfirmationEmail(order);
        } catch (mailError) {
          console.error("Failed to send order confirmation email in webhook:", mailError);
        }
      }
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
}
