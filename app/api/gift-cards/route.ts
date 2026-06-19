import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { readFile } from "fs/promises";
import { join } from "path";
import { connectDB } from "@/lib/mongodb";
import GiftCardModel from "@/models/GiftCard";

const giftCardSchema = z.object({
  id: z.string().min(1, "Gift card ID is required"),
  type: z.string().min(1, "Gift card type is required"),
  name: z.string().min(1, "Gift card name is required"),
  tagline: z.string().optional().default(""),
  image: z.string().optional().default(""),
  shortDescription: z.string().optional().default(""),
  description: z.string().optional().default(""),
  priceOptions: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
  terms: z.string().optional().default(""),
});

async function loadDefaultGiftCards() {
  const filePath = join(process.cwd(), "data", "gift-cards.json");
  const fileContents = await readFile(filePath, "utf8");
  return JSON.parse(fileContents);
}

export async function GET(_request: NextRequest) {
  try {
    await connectDB();
    let giftCards = await GiftCardModel.find().sort({ name: 1 }).lean();

    if (giftCards.length === 0) {
      const defaultGiftCards = await loadDefaultGiftCards();
      await GiftCardModel.insertMany(defaultGiftCards);
      giftCards = await GiftCardModel.find().sort({ name: 1 }).lean();
    }

    return NextResponse.json({ success: true, count: giftCards.length, giftCards }, { status: 200 });
  } catch (error) {
    console.error("GET /api/gift-cards error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch gift cards" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = giftCardSchema.safeParse(body);

    if (!parsed.success) {
      const perr: any = parsed.error;
      return NextResponse.json(
        { success: false, message: perr.errors?.[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const existing = await GiftCardModel.findOne({ id: parsed.data.id });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A gift card with this ID already exists." },
        { status: 409 }
      );
    }

    const giftCard = new GiftCardModel(parsed.data);
    await giftCard.save();
    return NextResponse.json({ success: true, giftCard }, { status: 201 });
  } catch (error) {
    console.error("POST /api/gift-cards error:", error);
    return NextResponse.json({ success: false, message: "Failed to create gift card" }, { status: 500 });
  }
}
