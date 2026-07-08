import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User";
import OTPVerificationModel from "@/models/OTPVerification";
import { connectDB } from "@/lib/mongodb";
import { linkGuestOrders } from "@/lib/auth/linking";

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

    const cleanEmail = email.toLowerCase().trim();

    // 1. Find active OTP verification record for this email and otp
    const verification = await OTPVerificationModel.findOne({
      "signupData.email": cleanEmail,
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

    // 2. Check if OTP is expired
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

    // 3. Ensure signup data is present
    if (!verification.signupData) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification data. Please register again.",
        },
        { status: 400 }
      );
    }

    // 4. Check if the user was already created while this OTP was pending
    const existingUser = await UserModel.findOne({ email: cleanEmail });
    if (existingUser) {
      await OTPVerificationModel.deleteOne({ _id: verification._id });
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 400 }
      );
    }

    // 5. Create user in database now that email is verified
    const user = await UserModel.create({
      name: verification.signupData.name,
      email: verification.signupData.email,
      password: verification.signupData.password,
      phone: verification.signupData.phone || "",
      role: (verification.signupData.role as "user" | "admin") || "user",
      isEmailVerified: true,
    });

    // Link guest orders to verified user account
    try {
      await linkGuestOrders(user.email, user._id.toString());
    } catch (err) {
      console.error("Failed to link guest orders during verification:", err);
    }

    // 6. Clean up the used OTP record
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
