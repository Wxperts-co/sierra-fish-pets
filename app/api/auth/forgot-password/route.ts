import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User";
import OTPVerificationModel from "@/models/OTPVerification";
import { connectDB } from "@/lib/mongodb";
import { generateOTP } from "@/lib/generateOTP";
import { transporter } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email, deletedAt: null });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found with this email." },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP code
    const otp = generateOTP();

    // Clean up any existing OTPs for this user first
    await OTPVerificationModel.deleteMany({ userId: user._id });

    // Store the OTP
    await OTPVerificationModel.create({
      userId: user._id,
      otp,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // Valid for 15 minutes
    });

    // Send the OTP email
    await transporter.sendMail({
      from: `"Sierra Fish & Pets" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Password Reset Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #005AA9; margin-top: 0;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>We received a request to reset the password for your Sierra Fish & Pets account. Please use the following One-Time Password (OTP) to reset your password:</p>
          <h1 style="background: #E8F3FF; padding: 15px; text-align: center; letter-spacing: 5px; color: #005AA9; border-radius: 8px; font-size: 32px; margin: 20px 0;">${otp}</h1>
          <p style="color: #666; font-size: 14px; margin-bottom: 0;">This code will expire in 15 minutes. If you did not request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Reset code sent successfully.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
