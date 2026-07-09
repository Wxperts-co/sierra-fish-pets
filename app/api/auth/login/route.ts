import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import UserModel from "@/models/User";
import OTPVerificationModel from "@/models/OTPVerification";
import { generateOTP } from "@/lib/generateOTP";
import { transporter } from "@/lib/mail";
import { connectDB } from "@/lib/mongodb";
import { linkGuestOrders } from "@/lib/auth/linking";

const LOGO_URL = "https://sierra-fish.w-serve.com/images/logo/logo.png";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY || "your-fallback-jwt-secret";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 1. Find user and explicitly select password field
    const user = await UserModel.findOne({ email, deletedAt: null }).select("+password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 400 }
      );
    }

    // 2. Check if email is verified
    if (!user.isEmailVerified) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Email is not verified. Please verify your email first.",
          notVerified: true 
        },
        { status: 403 }
      );
    }

    // 3. Verify Password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 400 }
      );
    }

    // 4. Admin route guard — verify role from DB, never mutate it
    const ALLOWED_ADMIN_ROLES = ["admin", "manager", "sales", "delivery boy"];
    if (role === "admin" && !ALLOWED_ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 403 }
      );
    }

    // Public user route guard — reject admin accounts from signing in through the normal user login flow
    if (role !== "admin" && user.role !== "user") {
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 403 }
      );
    }

    // 4b. Admin OTP Verification Intercept — send verification code and return early
    if (ALLOWED_ADMIN_ROLES.includes(user.role)) {
      const otp = generateOTP();

      // Clean old OTPs and create a new one
      await OTPVerificationModel.deleteMany({ userId: user._id });
      await OTPVerificationModel.create({
        userId: user._id,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      });

      // Send the OTP email to the admin
      try {
        await transporter.sendMail({
          from: `"Sierra Fish & Pets" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: "Your Admin Login Verification Code",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; text-align: center;">
              <img src="${LOGO_URL}" alt="Sierra Fish & Pets" style="max-height: 50px; margin-bottom: 24px; display: inline-block;" />
              <p style="text-align: left; font-size: 15px; line-height: 1.6; color: #4a5568;">Hello Admin,</p>
              <p style="text-align: left; font-size: 15px; line-height: 1.6; color: #4a5568;">Please use the following One-Time Password (OTP) to verify your identity and log in to the Admin Portal:</p>
              <h1 style="background: #E8F3FF; padding: 15px; text-align: center; letter-spacing: 5px; color: #005AA9; border-radius: 8px; font-size: 32px; margin: 20px 0;">${otp}</h1>
              <p style="text-align: left; color: #718096; font-size: 14px; margin-bottom: 0;">This OTP will expire in 10 minutes. If you did not attempt this login, please change your password immediately.</p>
            </div>
          `,
        });
      } catch (mailError) {
        console.error("Failed to send admin login OTP email:", mailError);
        return NextResponse.json(
          { success: false, message: "Failed to send verification email. Please try again." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        requireOTP: true,
        email: user.email,
        message: "A verification code has been sent to your admin email address.",
      });
    }

    // 5. Link guest orders to user account
    try {
      await linkGuestOrders(user.email, user._id.toString());
    } catch (err) {
      console.error("Failed to link guest orders during credentials login:", err);
    }

    // 6. Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Build Response and set HTTP-only cookie
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
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
