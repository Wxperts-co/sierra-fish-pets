import GiftCardInstanceModel from "@/models/GiftCardInstance";
import { IOrder } from "@/models/Order";

export async function generateGiftCardsForOrder(order: IOrder) {
  // Prevent duplicate generation if gift cards for this order were already created
  const existingGC = await GiftCardInstanceModel.find({ orderId: order._id });
  if (existingGC && existingGC.length > 0) {
    console.log(`[GiftCardService] Gift cards for order ${order.orderNumber} already generated.`);
    return;
  }

  const generatedList: any[] = [];

  for (const item of order.items) {
    const isGiftCardItem = Boolean(
      (item.productId && item.productId.startsWith("giftcard-")) ||
      (item.sku && item.sku.startsWith("GC-")) ||
      (item.productName && item.productName.toLowerCase().includes("gift card")) ||
      item.giftCardDetails
    );

    if (isGiftCardItem) {
      const amount = item.unitPrice;
      const details = item.giftCardDetails;

      for (let q = 0; q < item.quantity; q++) {
        const randomStr = Math.random().toString(36).substring(2, 11).toUpperCase();
        // Format as SFP-XXXX-XXXX
        const code = `SFP-${randomStr.slice(0, 4)}-${randomStr.slice(4, 8)}`;

        const newGiftCard = new GiftCardInstanceModel({
          code,
          initialBalance: amount,
          currentBalance: amount,
          recipientEmail: details?.recipientEmail || "",
          recipientName: details?.recipientName || "Valued Customer",
          senderName: details?.senderName || "Friend",
          message: details?.message || "",
          orderId: order._id,
          isActive: true,
        });

        await newGiftCard.save();
        generatedList.push({
          code: newGiftCard.code,
          initialBalance: newGiftCard.initialBalance,
          currentBalance: newGiftCard.currentBalance,
          recipientName: newGiftCard.recipientName,
          senderName: newGiftCard.senderName,
          recipientEmail: newGiftCard.recipientEmail,
          message: newGiftCard.message,
          isActive: newGiftCard.isActive,
        });

        console.log(`[GiftCardService] Generated Gift Card ${code} for order ${order.orderNumber}`);

        if (details?.recipientEmail) {
          try {
            const { sendGiftCardEmail } = await import("./emailService");
            await sendGiftCardEmail(
              code,
              amount,
              newGiftCard.senderName,
              newGiftCard.recipientName,
              newGiftCard.recipientEmail,
              newGiftCard.message
            );
          } catch (mailError) {
            console.error(`[GiftCardService] Failed to send email for Gift Card ${code}:`, mailError);
          }
        }
      }
    }
  }

  if (generatedList.length > 0) {
    try {
      order.generatedGiftCards = generatedList;
      await order.save();
    } catch (saveErr) {
      console.error("[GiftCardService] Failed to attach generatedGiftCards to order:", saveErr);
    }
  }
}
