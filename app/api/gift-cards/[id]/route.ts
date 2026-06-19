import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import GiftCardModel from "@/models/GiftCard";

const giftCardUpdateSchema = z.object({
  id: z.string().min(1).optional(),
  type: z.string().optional(),
  name: z.string().optional(),
  tagline: z.string().optional(),
  image: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  priceOptions: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  terms: z.string().optional(),
});

function getNormalizedId(rawId: string | string[]) {
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  return typeof id === "string" ? id.trim() : "";
}

async function findGiftCardByParam(id: string) {
  if (!id) return null;
  if (mongoose.isValidObjectId(id)) {
    const giftCard = await GiftCardModel.findById(id);
    if (giftCard) return giftCard;
  }
  return GiftCardModel.findOne({ id });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const giftCard = await findGiftCardByParam(getNormalizedId(id));
    if (!giftCard) {
      return NextResponse.json({ success: false, message: "Gift card not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, giftCard }, { status: 200 });
  } catch (error) {
    console.error("GET /api/gift-cards/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch gift card" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const giftCard = await findGiftCardByParam(getNormalizedId(id));
    if (!giftCard) {
      return NextResponse.json({ success: false, message: "Gift card not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = giftCardUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const perr: any = parsed.error;
      return NextResponse.json(
        { success: false, message: perr.errors?.[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    if (parsed.data.id && parsed.data.id !== giftCard.id) {
      const existing = await GiftCardModel.findOne({ id: parsed.data.id });
      if (existing) {
        return NextResponse.json(
          { success: false, message: "A gift card with this ID already exists." },
          { status: 409 }
        );
      }
      giftCard.id = parsed.data.id;
    }

    Object.assign(giftCard, parsed.data);
    await giftCard.save();
    return NextResponse.json({ success: true, giftCard }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/gift-cards/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update gift card" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const giftCard = await findGiftCardByParam(getNormalizedId(id));
    if (!giftCard) {
      return NextResponse.json({ success: false, message: "Gift card not found" }, { status: 404 });
    }
    await giftCard.deleteOne();
    return NextResponse.json({ success: true, message: "Gift card deleted." }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/gift-cards/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete gift card" }, { status: 500 });
  }
}
