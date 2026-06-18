import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const normalizedId = typeof id === "string" ? id.trim() : "";

    if (!normalizedId) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    let user;
    try {
      user = await User.findById(normalizedId);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    user.deletedAt = new Date();
    await user.save();

    return NextResponse.json(
      { success: true, message: "User deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/admin/users/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const normalizedId = typeof id === "string" ? id.trim() : "";

    if (!normalizedId) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const allowedFields = [
      "name",
      "email",
      "role",
      "status",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
      "country",
    ];

    const updateData: Record<string, any> = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        updateData[key] = body[key];
      }
    }

    let user;
    try {
      user = await User.findById(normalizedId);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    Object.assign(user, updateData);
    await user.save();

    const u: any = user;
    const safeUser = {
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      isEmailVerified: u.isEmailVerified,
      phone: u.phone,
      address: u.address,
      city: u.city,
      state: u.state,
      zipCode: u.zipCode,
      country: u.country,
      createdAt: u.createdAt,
    };

    return NextResponse.json({ success: true, user: safeUser }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/admin/users/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user" },
      { status: 500 }
    );
  }
}
