import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import UserModel from "@/models/User";
import OTPVerificationModel from "@/models/OTPVerification";
import { connectDB } from "@/lib/mongodb";
import { linkGuestOrders } from "@/lib/auth/linking";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY || "your-fallback-jwt-secret";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP verification code are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Find user
    const user = await UserModel.findOne({ email: cleanEmail, deletedAt: null });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Admin user not found" },
        { status: 400 }
      );
    }

    const ALLOWED_ADMIN_ROLES = ["admin", "manager", "sales", "delivery boy"];
    if (!ALLOWED_ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json(
        { success: false, message: "Access denied." },
        { status: 403 }
      );
    }

    // 2. Find and validate the latest OTP
    const verificationRecord = await OTPVerificationModel.findOne({
      userId: user._id,
      otp: otp.trim(),
    });

    if (!verificationRecord) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date() > new Date(verificationRecord.expiresAt)) {
      await OTPVerificationModel.deleteOne({ _id: verificationRecord._id });
      return NextResponse.json(
        { success: false, message: "Verification code has expired" },
        { status: 400 }
      );
    }

    // 3. Delete the used OTP record
    await OTPVerificationModel.deleteOne({ _id: verificationRecord._id });

    // 4. Link guest orders
    try {
      await linkGuestOrders(user.email, user._id.toString());
    } catch (err) {
      console.error("Failed to link guest orders during OTP verification:", err);
    }

    // 5. Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6. Build response and set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        wishlist: user.wishlist || [],
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        country: user.country || "",
        addresses: user.addresses || [],
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during verification" },
      { status: 500 }
    );
  }
}
