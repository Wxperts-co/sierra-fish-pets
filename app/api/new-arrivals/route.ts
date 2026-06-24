import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import NewArrivalModel from "@/models/NewArrival";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Auto-seed if the collection is empty, reading file dynamically at runtime
    const count = await NewArrivalModel.countDocuments();
    if (count === 0) {
      try {
        const filePath = path.join(process.cwd(), "data", "newarrivals.json");
        const fileContent = await fs.readFile(filePath, "utf-8");
        const initialData = JSON.parse(fileContent);
        await NewArrivalModel.insertMany(initialData);
      } catch (seedErr) {
        console.error("Seeding failed in GET /api/new-arrivals:", seedErr);
      }
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";
    const status = searchParams.get("status") || "all";

    const filter: Record<string, any> = {};
    if (category !== "all") {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    if (status !== "all") {
      filter.status = status;
    }

    const arrivals = await NewArrivalModel.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      arrivals,
    });
  } catch (error: any) {
    console.error("GET public new-arrivals error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch arrivals" },
      { status: 500 }
    );
  }
}
