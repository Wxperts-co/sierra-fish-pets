import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User";
import OTPVerificationModel from "@/models/OTPVerification";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and OTP are required",
        },
        { status: 400 }
      );
    }

    // 1. Find user by email
    const user = await UserModel.findOne({ email, deletedAt: null });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // 2. Find active OTP verification record for this user
    const verification = await OTPVerificationModel.findOne({
      userId: user._id,
      otp,
    });

    if (!verification) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP code",
        },
        { status: 400 }
      );
    }

    // 3. Check if OTP is expired
    if (new Date() > verification.expiresAt) {
      // Clean up the expired OTP
      await OTPVerificationModel.deleteOne({ _id: verification._id });

      return NextResponse.json(
        {
          success: false,
          message: "OTP code has expired. Please register again.",
        },
        { status: 400 }
      );
    }

    // 4. Update user verification status
    user.isEmailVerified = true;
    await user.save();

    // 5. Clean up the used OTP record
    await OTPVerificationModel.deleteOne({ _id: verification._id });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Error in verify-email API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Email verification failed",
      },
      { status: 500 }
    )
  }
}
