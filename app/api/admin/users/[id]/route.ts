import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string | string[] } }
) {
  try {
    await connectDB();

    const rawId = params?.id;
    const idFromParams = Array.isArray(rawId) ? rawId[0] : rawId;
    const idFromPath = new URL(_request.url).pathname.split("/").filter(Boolean).pop();
    const id = typeof idFromParams === "string" && idFromParams ? idFromParams : idFromPath;
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
