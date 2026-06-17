import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import UserModel from "@/models/User";
import { connectDB } from "@/lib/mongodb";

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
    if (role === "admin" && user.role !== "admin") {
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

    // 5. Generate JWT Token
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
