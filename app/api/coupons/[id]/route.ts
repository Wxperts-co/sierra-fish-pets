import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CouponModel from "@/models/Coupon";

// PUT /api/coupons/[id] — admin: update coupon
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updatePayload = { ...body };
    if (updatePayload.endDate) {
      const d = new Date(updatePayload.endDate);
      d.setUTCHours(23, 59, 59, 999);
      updatePayload.endDate = d;
    }

    const coupon = await CouponModel.findByIdAndUpdate(id, { ...updatePayload }, { new: true, runValidators: true });

    if (!coupon) {
      return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, coupon }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/coupons/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update coupon" }, { status: 500 });
  }
}

// DELETE /api/coupons/[id] — admin: delete coupon
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const coupon = await CouponModel.findByIdAndDelete(id);
    if (!coupon) {
      return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Coupon deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/coupons/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete coupon" }, { status: 500 });
  }
}
