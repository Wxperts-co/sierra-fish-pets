import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import OTPVerificationModel from "@/models/OTPVerification";
import { generateOTP } from "@/lib/generateOTP";
import { transporter } from "@/lib/mail";
import { getAuthenticatedUser } from "@/lib/auth/authHelper";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // 1. Authorize current request - must be admin only
    const currentUser = await getAuthenticatedUser(req);
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied. Only admins can invite team members." },
        { status: 403 }
      );
    }

    // 2. Validate input payload
    const { email, role } = await req.json();
    if (!email || !role) {
      return NextResponse.json(
        { success: false, message: "Email and Role are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanRole = role.toLowerCase().trim();

    const ALLOWED_ROLES = ["admin", "manager", "sales", "delivery boy"];
    if (!ALLOWED_ROLES.includes(cleanRole)) {
      return NextResponse.json(
        { success: false, message: "Invalid role selected." },
        { status: 400 }
      );
    }

    // 3. Verify user does not already exist
    const existingUser = await UserModel.findOne({ email: cleanEmail, deletedAt: null });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: `A user with the email ${cleanEmail} already exists.` },
        { status: 400 }
      );
    }

    // 4. Create new user document
    const tempPassword = crypto.randomBytes(16).toString("hex");
    const newUser = await UserModel.create({
      email: cleanEmail,
      role: cleanRole,
      name: "Team Member",
      password: tempPassword,
      isEmailVerified: false,
    });

    // 5. Generate secure 6-digit OTP code for setup
    const otp = generateOTP();
    await OTPVerificationModel.deleteMany({ userId: newUser._id });
    await OTPVerificationModel.create({
      userId: newUser._id,
      otp,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Valid for 24 hours
    });

    // 6. Send Invitation Email
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");
    const activationLink = `${appUrl}/reset-password?email=${encodeURIComponent(cleanEmail)}&otp=${otp}`;
    
    await transporter.sendMail({
      from: `"Sierra Fish & Pets" <${process.env.SMTP_USER}>`,
      to: cleanEmail,
      subject: "Invitation to Join the Sierra Fish & Pets Team",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 25px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #005AA9; margin: 0; font-size: 24px; font-weight: 800;">Sierra Fish & Pets</h2>
            <p style="color: #718096; margin: 4px 0 0 0; font-size: 14px;">Team Member Registration</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #2d3748;">Hello,</p>
          <p style="font-size: 16px; line-height: 1.6; color: #2d3748;">You have been invited to join the Sierra Fish & Pets team as a <strong style="text-transform: capitalize; color: #005AA9;">${cleanRole}</strong>.</p>
          
          <div style="background-color: #f7fafc; border: 1px solid #edf2f7; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 700; color: #4a5568; text-uppercase; tracking-wider;">Your 6-Digit Activation Code</p>
            <h1 style="margin: 0; font-size: 36px; font-weight: 900; color: #005AA9; letter-spacing: 6px;">${otp}</h1>
            <p style="margin: 10px 0 0 0; font-size: 13px; color: #718096;">This code is valid for 24 hours</p>
          </div>
          
          <p style="font-size: 15px; line-height: 1.6; color: #4a5568;">Click the button below to set up your profile name, phone number, password, and activate your account:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${activationLink}" style="background-color: #005AA9; color: #ffffff; padding: 14px 30px; font-size: 15px; font-weight: bold; text-decoration: none; border-radius: 10px; display: inline-block; transition: background-color 0.2s;">
              Set Up & Activate Account
            </a>
          </div>
          
          <p style="font-size: 12px; color: #a0aec0; line-height: 1.5; margin-top: 30px; border-top: 1px solid #edf2f7; padding-top: 20px;">
            If you did not request this invitation, please ignore this email. This portal is strictly for authorized staff of Sierra Fish & Pets.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Team member invitation email sent successfully.",
    });
  } catch (error: any) {
    console.error("Invite User API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process invitation." },
      { status: 500 }
    );
  }
}
