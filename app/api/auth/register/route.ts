import { NextRequest, NextResponse } from "next/server";

import UserModel from "@/models/User";
import OTPVerificationModel from "@/models/OTPVerification";

import { connectDB } from "@/lib/mongodb";
import { generateOTP } from "@/lib/generateOTP";
import { transporter } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, password, phone, role } =
      await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const existingUser =
      await UserModel.findOne({ email, deletedAt: null });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 400 }
      );
    }

    // Only allow "user" (default) or "admin" — reject any other value
    const allowedRoles = ["user", "admin"];
    const assignedRole = role && allowedRoles.includes(role) ? role : "user";

    const user = await UserModel.create({
      name,
      email,
      password,
      phone: phone || "",
      role: assignedRole,
    });

    const otp = generateOTP();

    await OTPVerificationModel.create({
      userId: user._id,
      otp,
      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    });

    try {
      await transporter.sendMail({
        from: `"Sierra Fish & Pets" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Verify Your Email",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #005AA9; margin-top: 0;">Email Verification</h2>
            <p>Thank you for registering at Sierra Fish & Pets. Please use the following One-Time Password (OTP) to verify your email address:</p>
            <h1 style="background: #E8F3FF; padding: 15px; text-align: center; letter-spacing: 5px; color: #005AA9; border-radius: 8px; font-size: 32px; margin: 20px 0;">${otp}</h1>
            <p style="color: #666; font-size: 14px; margin-bottom: 0;">This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `,
      });
    } catch (mailError) {
      // Clean up the created user and OTP to allow retry if sending mail fails
      await UserModel.deleteOne({ _id: user._id });
      await OTPVerificationModel.deleteOne({ userId: user._id });
      throw mailError;
    }

    return NextResponse.json({
      success: true,
      message:
        "Registration successful. Please verify your email.",
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Registration failed",
      },
      {
        status: 500,
      }
    );
  }
}