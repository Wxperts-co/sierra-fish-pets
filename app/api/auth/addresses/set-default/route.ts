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

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Address ID is required" },
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

    let found = false;
    user.addresses.forEach((addr) => {
      if (addr.id === id) {
        addr.isDefault = true;
        found = true;
        // Sync flat fields
        user.address = addr.address;
        user.city = addr.city;
        user.state = addr.state;
        user.zipCode = addr.zipCode;
        user.country = addr.country;
      } else {
        addr.isDefault = false;
      }
    });

    if (!found) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    user.markModified("addresses");
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Default address updated successfully",
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
        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.error("Set Default Address Error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while setting the default address" },
      { status: 500 }
    );
  }
}
