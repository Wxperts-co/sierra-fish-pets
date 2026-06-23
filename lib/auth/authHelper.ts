import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import UserModel from "@/models/User";
import { connectDB } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY || "your-fallback-jwt-secret";

export async function getAuthenticatedUser(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    if (!decoded || !decoded.id) return null;

    const user = await UserModel.findOne({ _id: decoded.id, deletedAt: null });
    return user;
  } catch (err) {
    return null;
  }
}
