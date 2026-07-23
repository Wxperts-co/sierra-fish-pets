import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CouponModel from "@/models/Coupon";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { code, subtotal = 0, shippingCost = 0 } = body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { success: false, message: "Promo code is required." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const now = new Date();

    // Look up coupon in MongoDB database
    const coupon = await CouponModel.findOne({ code: cleanCode });

    if (coupon) {
      if (!coupon.isActive) {
        return NextResponse.json(
          { success: false, message: "This promo code is no longer active." },
          { status: 400 }
        );
      }

      if (coupon.startDate && new Date(coupon.startDate) > now) {
        return NextResponse.json(
          { success: false, message: "This promo code promotion has not started yet." },
          { status: 400 }
        );
      }

      if (coupon.endDate && new Date(coupon.endDate) < now) {
        return NextResponse.json(
          { success: false, message: "This promo code has expired." },
          { status: 400 }
        );
      }

      if (coupon.minimumPurchase && subtotal < coupon.minimumPurchase) {
        return NextResponse.json(
          {
            success: false,
            message: `Minimum purchase of $${coupon.minimumPurchase.toFixed(2)} required for ${cleanCode}.`,
          },
          { status: 400 }
        );
      }

      if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
        return NextResponse.json(
          { success: false, message: "This promo code has reached its maximum usage limit." },
          { status: 400 }
        );
      }

      // Calculate discount amount
      let discountAmount = 0;
      if (coupon.discountType === "percentage") {
        discountAmount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
          discountAmount = coupon.maximumDiscount;
        }
      } else if (coupon.discountType === "fixed") {
        discountAmount = Math.min(coupon.discountValue, subtotal);
      }

      discountAmount = Number(discountAmount.toFixed(2));

      return NextResponse.json({
        success: true,
        code: coupon.code,
        title: coupon.title,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        message: `Promo code ${coupon.code} applied successfully!`,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid or unrecognized promo code." },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("POST /api/coupons/validate error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to validate promo code." },
      { status: 500 }
    );
  }
}
