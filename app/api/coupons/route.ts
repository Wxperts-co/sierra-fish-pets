import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CouponModel from "@/models/Coupon";

// GET /api/coupons — public, returns only active & non-expired coupons
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true"; // admin: include all

    const filter: Record<string, any> = all
      ? {}
      : {
          isActive: true,
          startDate: { $lte: new Date() },
          endDate: { $gte: new Date() },
        };

    const coupons = await CouponModel.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, count: coupons.length, coupons }, { status: 200 });
  } catch (error) {
    console.error("GET /api/coupons error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch coupons" }, { status: 500 });
  }
}

// POST /api/coupons — admin: create coupon
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { code, title, description, discountType, discountValue, minimumPurchase, maximumDiscount, startDate, endDate, usageLimit, isActive, applicableCategories, image, terms } = body;

    if (!code || !title || !discountType || discountValue === undefined || !startDate || !endDate) {
      return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }

    const existing = await CouponModel.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return NextResponse.json({ success: false, message: "Coupon code already exists." }, { status: 409 });
    }

    const coupon = await CouponModel.create({
      code: code.toUpperCase().trim(),
      title,
      description,
      discountType,
      discountValue,
      minimumPurchase: minimumPurchase || 0,
      maximumDiscount,
      startDate: new Date(startDate),
      endDate: (() => { const d = new Date(endDate); d.setUTCHours(23, 59, 59, 999); return d; })(),
      usageLimit,
      isActive: isActive !== false,
      applicableCategories: applicableCategories || [],
      image,
      terms,
    });

    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (error) {
    console.error("POST /api/coupons error:", error);
    return NextResponse.json({ success: false, message: "Failed to create coupon" }, { status: 500 });
  }
}
