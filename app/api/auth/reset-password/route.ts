import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User";
import OTPVerificationModel from "@/models/OTPVerification";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, otp, password, name, phone } = await req.json();

    if (!email || !otp || !password) {
      return NextResponse.json(
        { success: false, message: "Email, OTP code, and new password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email, deletedAt: null });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Find verification record for this user and OTP
    const verification = await OTPVerificationModel.findOne({
      userId: user._id,
      otp,
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP code." },
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date() > verification.expiresAt) {
      await OTPVerificationModel.deleteOne({ _id: verification._id });
      return NextResponse.json(
        { success: false, message: "OTP code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Update password (pre-save hook will hash it), name, and phone if provided
    user.password = password;
    user.isEmailVerified = true;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    await user.save();

    // Delete verification record
    await OTPVerificationModel.deleteOne({ _id: verification._id });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now login.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while resetting your password." },
      { status: 500 }
    );
  }
}
