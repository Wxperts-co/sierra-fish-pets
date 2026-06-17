import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

const addUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]),
});

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({
      deletedAt: null,
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        count: users.length,
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/users error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = addUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.errors[0]?.message || "Validation failed",
        },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "A user with that email already exists.",
        },
        { status: 409 }
      );
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role,
    });

    await user.save();

    return NextResponse.json(
      {
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/users error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user",
      },
      { status: 500 }
    );
  }
}