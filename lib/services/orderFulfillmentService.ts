import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import OrderModel, { IOrder } from "@/models/Order";
import GiftCardInstanceModel from "@/models/GiftCardInstance";
import { generateGiftCardsForOrder } from "@/lib/services/giftCardService";
import { generateInvoicePDF } from "@/lib/services/invoiceService";
import { sendOrderConfirmationEmail } from "@/lib/services/emailService";

export async function fulfillOrder(orderOrId: IOrder | string | mongoose.Types.ObjectId): Promise<IOrder | null> {
  await connectDB();

  let order: IOrder | null = null;
  if (typeof orderOrId === "string" || orderOrId instanceof mongoose.Types.ObjectId) {
    order = await OrderModel.findById(orderOrId);
  } else {
    order = orderOrId;
  }

  if (!order) {
    console.error("[FulfillOrder] Order not found:", orderOrId);
    return null;
  }

  // If already paid and confirmed, return immediately
  if (order.paymentStatus === "paid" && order.status === "confirmed") {
    return order;
  }

  // 1. Update Payment Status to Paid & Order Status to Confirmed
  order.paymentStatus = "paid";
  order.status = "confirmed";
  order.updatedAt = new Date();
  await order.save();

  // 2. Deduct applied gift card balance if any
  if (order.giftCardCode && order.giftCardAmount && order.giftCardAmount > 0) {
    try {
      const giftCardInst = await GiftCardInstanceModel.findOne({ code: order.giftCardCode });
      if (giftCardInst) {
        giftCardInst.currentBalance = Math.max(0, giftCardInst.currentBalance - order.giftCardAmount);
        if (giftCardInst.currentBalance === 0) {
          giftCardInst.isActive = false;
        }
        await giftCardInst.save();
        console.log(`[OrderFulfillment] Deducted $${order.giftCardAmount} from Gift Card ${order.giftCardCode}`);
      }
    } catch (err) {
      console.error("[OrderFulfillment] Failed to deduct gift card balance:", err);
    }
  }

  // 3. Generate newly purchased gift cards if any (sends gift card email with code to recipient)
  try {
    await generateGiftCardsForOrder(order);
  } catch (gcGenErr) {
    console.error("[OrderFulfillment] Failed to generate gift cards:", gcGenErr);
  }

  // 4. Generate Invoice PDF
  try {
    const relativeInvoiceUrl = await generateInvoicePDF(order);
    order.invoiceUrl = relativeInvoiceUrl;
    order.invoiceGeneratedAt = new Date();
    await order.save();
  } catch (pdfError) {
    console.error("[OrderFulfillment] Failed to generate invoice:", pdfError);
  }

  // 5. Send Confirmation Email (Customer + Admin + BCC)
  try {
    await sendOrderConfirmationEmail(order);
  } catch (mailError) {
    console.error("[OrderFulfillment] Failed to send order confirmation email:", mailError);
  }

  return order;
}
