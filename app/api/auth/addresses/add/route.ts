import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
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

    const { fullName, phone, address, city, state, zipCode, country, label, isDefault } = await req.json();

    if (!fullName || !phone || !address || !city || !state || !zipCode) {
      return NextResponse.json(
        { success: false, message: "All address fields are required" },
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

    // Initialize addresses array if it doesn't exist
    if (!user.addresses) {
      user.addresses = [];
    }

    const newAddressId = new mongoose.Types.ObjectId().toString();
    const shouldBeDefault = user.addresses.length === 0 || isDefault === true;

    // If new address is default, set all others to false
    if (shouldBeDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const newAddress = {
      id: newAddressId,
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim(),
      country: (country || "United States").trim(),
      isDefault: shouldBeDefault,
      label: (label || "Home").trim(),
    };

    user.addresses.push(newAddress);

    // Sync flat fields if this is the default address
    if (shouldBeDefault) {
      user.address = newAddress.address;
      user.city = newAddress.city;
      user.state = newAddress.state;
      user.zipCode = newAddress.zipCode;
      user.country = newAddress.country;
    }

    user.markModified("addresses");

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Address added successfully",
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
    console.error("Add Address Error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while adding the address" },
      { status: 500 }
    );
  }
}
