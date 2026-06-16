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

    const addrIndex = user.addresses.findIndex((addr) => addr.id === id);

    if (addrIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    const wasDefault = user.addresses[addrIndex].isDefault;

    // Remove the address
    user.addresses.splice(addrIndex, 1);

    // If we deleted the default address and there are remaining addresses, set the first one as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
      user.address = user.addresses[0].address;
      user.city = user.addresses[0].city;
      user.state = user.addresses[0].state;
      user.zipCode = user.addresses[0].zipCode;
      user.country = user.addresses[0].country;
    } else if (user.addresses.length === 0) {
      // Clear flat fields
      user.address = "";
      user.city = "";
      user.state = "";
      user.zipCode = "";
      user.country = "";
    }

    user.markModified("addresses");
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
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
    console.error("Delete Address Error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while deleting the address" },
      { status: 500 }
    );
  }
}
