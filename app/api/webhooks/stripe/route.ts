import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import OrderModel from "@/models/Order";

const stripe = new Stripe(process.env.TEST_SECRET_KEY!, {
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
        // 1. Update Payment Status to Paid
        order.paymentStatus = "paid";
        order.updatedAt = new Date();
        await order.save();

        // 2. Generate Invoice PDF
        try {
          const { generateInvoicePDF } = await import("@/lib/services/invoiceService");
          const relativeInvoiceUrl = await generateInvoicePDF(order);
          order.invoiceUrl = relativeInvoiceUrl;
          order.invoiceGeneratedAt = new Date();
          await order.save();
        } catch (pdfError) {
          console.error("Failed to generate invoice in webhook:", pdfError);
        }

        // 3. Send Confirmation Email
        try {
          const { sendOrderConfirmationEmail } = await import("@/lib/services/emailService");
          await sendOrderConfirmationEmail(order);
        } catch (mailError) {
          console.error("Failed to send order confirmation email in webhook:", mailError);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
