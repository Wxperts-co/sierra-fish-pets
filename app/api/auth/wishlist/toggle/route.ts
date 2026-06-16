import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import UserModel from "@/models/User";
import { connectDB } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY || "your-fallback-jwt-secret";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 200 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 200 }
      );
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ _id: decoded.id, deletedAt: null });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Initialize wishlist if undefined
    if (!user.wishlist) {
      user.wishlist = [];
    }

    const index = user.wishlist.indexOf(productId);
    if (index > -1) {
      // Remove if exists
      user.wishlist.splice(index, 1);
    } else {
      // Add if missing
      user.wishlist.push(productId);
    }

    user.markModified("wishlist");
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Wishlist updated successfully",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Wishlist Toggle API Error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred updating the wishlist" },
      { status: 500 }
    );
  }
}
