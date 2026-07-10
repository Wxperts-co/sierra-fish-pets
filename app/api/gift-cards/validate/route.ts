import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import GiftCardInstanceModel from "@/models/GiftCardInstance";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { code } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, message: "Gift card code is required." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    const giftCard = await GiftCardInstanceModel.findOne({ code: cleanCode });

    if (!giftCard) {
      return NextResponse.json(
        { success: false, message: "Invalid or unrecognized gift card code." },
        { status: 404 }
      );
    }

    if (!giftCard.isActive || giftCard.currentBalance <= 0) {
      return NextResponse.json(
        { success: false, message: "This gift card is inactive or has a zero balance." },
        { status: 400 }
      );
    }

    if (giftCard.expiryDate && new Date(giftCard.expiryDate) < new Date()) {
      return NextResponse.json(
        { success: false, message: "This gift card has expired." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      code: giftCard.code,
      balance: giftCard.currentBalance,
      initialBalance: giftCard.initialBalance,
      senderName: giftCard.senderName,
      recipientName: giftCard.recipientName,
    });
  } catch (error: any) {
    console.error("POST /api/gift-cards/validate error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to validate gift card code." },
      { status: 500 }
    );
  }
}
