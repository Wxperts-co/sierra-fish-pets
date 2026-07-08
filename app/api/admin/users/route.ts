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

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const isEmailVerified = searchParams.get("isEmailVerified");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (role && role !== "all") {
      filter.role = role;
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    if (isEmailVerified && isEmailVerified !== "all") {
      filter.isEmailVerified = isEmailVerified === "verified";
    }

    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const skip = (pageNum - 1) * limitNum;

    const [users, totalCount, total, active, admins, banned] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(filter),
      User.countDocuments({}),
      User.countDocuments({ status: "active" }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ status: { $in: ["inactive", "banned"] } }),
    ]);

    return NextResponse.json(
      {
        success: true,
        count: totalCount,
        users,
        stats: {
          total,
          active,
          admins,
          banned,
        },
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
      const perr: any = parsed.error;
      return NextResponse.json(
        {
          success: false,
          message: perr.errors?.[0]?.message || "Validation failed",
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

    const u: any = user;
    return NextResponse.json(
      {
        success: true,
        user: {
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          isEmailVerified: u.isEmailVerified,
          createdAt: u.createdAt,
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