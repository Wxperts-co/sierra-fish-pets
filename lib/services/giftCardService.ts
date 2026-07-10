import GiftCardInstanceModel from "@/models/GiftCardInstance";

export async function generateGiftCardsForOrder(order: any) {
  for (const item of order.items) {
    if (item.giftCardDetails && item.productId) {
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
          recipientEmail: details.recipientEmail || order.guestEmail,
          recipientName: details.recipientName || "Valued Customer",
          senderName: details.senderName || "Friend",
          message: details.message || "",
          orderId: order._id,
          isActive: true,
        });

        await newGiftCard.save();
        console.log(`[GiftCardService] Generated Gift Card ${code} for order ${order.orderNumber}`);

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
