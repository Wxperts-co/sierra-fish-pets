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

    const { id, fullName, phone, address, city, state, zipCode, country, label, isDefault } = await req.json();

    if (!id || !fullName || !phone || !address || !city || !state || !zipCode) {
      return NextResponse.json(
        { success: false, message: "All address fields and ID are required" },
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

    // Find the target address index
    const addrIndex = user.addresses.findIndex((addr) => addr.id === id);

    if (addrIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    const shouldBeDefault = isDefault === true || user.addresses[addrIndex].isDefault;

    // Toggle defaults if needed
    if (isDefault === true) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // Update the fields in the array
    user.addresses[addrIndex] = {
      id,
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

    // If it is the default address, sync flat fields
    if (shouldBeDefault) {
      user.address = user.addresses[addrIndex].address;
      user.city = user.addresses[addrIndex].city;
      user.state = user.addresses[addrIndex].state;
      user.zipCode = user.addresses[addrIndex].zipCode;
      user.country = user.addresses[addrIndex].country;
    }

    // Mark addresses modified for mongoose change tracking
    user.markModified("addresses");

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Address updated successfully",
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
    console.error("Update Address Error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while updating the address" },
      { status: 500 }
    );
  }
}
