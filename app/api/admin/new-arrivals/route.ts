import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/authHelper";
import { connectDB } from "@/lib/mongodb";
import NewArrivalModel from "@/models/NewArrival";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// GET /api/admin/new-arrivals
// Retrieve all new arrivals from MongoDB
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied. Admin authorization required." },
        { status: 403 }
      );
    }

    // Auto-seed if the collection is empty, reading file dynamically at runtime
    const count = await NewArrivalModel.countDocuments();
    if (count === 0) {
      try {
        const filePath = path.join(process.cwd(), "data", "newarrivals.json");
        const fileContent = await fs.readFile(filePath, "utf-8");
        const initialData = JSON.parse(fileContent);
        await NewArrivalModel.insertMany(initialData);
      } catch (seedErr) {
        console.error("Seeding failed in GET /api/admin/new-arrivals:", seedErr);
      }
    }

    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || "").trim();
    const category = searchParams.get("category") || "all";
    const status = searchParams.get("status") || "all";

    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { breed: { $regex: search, $options: "i" } },
        { id: { $regex: search, $options: "i" } },
      ];
    }

    if (category !== "all") {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    if (status !== "all") {
      filter.status = status;
    }

    const [arrivals, statsAgg] = await Promise.all([
      NewArrivalModel.find(filter).sort({ createdAt: -1 }).lean(),
      NewArrivalModel.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const stats = {
      total: 0,
      available: 0,
      adopted: 0,
      featured: await NewArrivalModel.countDocuments({ featured: true }),
    };

    statsAgg.forEach((item) => {
      if (item._id === "available") stats.available = item.count;
      if (item._id === "adopted" || item._id === "unavailable") stats.adopted += item.count;
    });
    stats.total = await NewArrivalModel.countDocuments({});

    return NextResponse.json({
      success: true,
      arrivals,
      stats,
    });
  } catch (error: any) {
    console.error("GET Admin New Arrivals Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch arrivals." },
      { status: 500 }
    );
  }
}

// POST /api/admin/new-arrivals
// Add a new arrival record in MongoDB
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthenticatedUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied. Admin authorization required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      id,
      name,
      slug,
      category,
      breed,
      gender,
      age,
      size,
      price,
      discountPrice,
      arrivalDate,
      status,
      featured,
      vaccinated,
      dewormed,
      microchipped,
      description,
      highlights,
      images,
      location,
      stock,
      seo,
    } = body;

    if (!id || !name || !category || !breed || !price) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields: id, name, category, breed, and price." },
        { status: 400 }
      );
    }

    const exists = await NewArrivalModel.findOne({ id: { $regex: new RegExp(`^${id}$`, "i") } });
    if (exists) {
      return NextResponse.json(
        { success: false, message: `An arrival with ID ${id} already exists.` },
        { status: 400 }
      );
    }

    const newArrival = new NewArrivalModel({
      id,
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category,
      breed,
      gender: gender || "Unknown",
      age: age || "Unknown",
      size: size || "Medium",
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      arrivalDate: arrivalDate || new Date().toISOString().split("T")[0],
      status: status || "available",
      featured: !!featured,
      vaccinated: !!vaccinated,
      dewormed: !!dewormed,
      microchipped: !!microchipped,
      description: description || "",
      highlights: highlights || [],
      images: images || [],
      location: location || "Renton Store",
      stock: stock ? Number(stock) : 1,
      seo: seo || {
        title: `${name} Available in Renton, WA`,
        description: `${name} available at Sierra Fish & Pets.`,
      },
    });

    await newArrival.save();

    return NextResponse.json({
      success: true,
      message: "New arrival added successfully.",
      arrival: newArrival,
    });
  } catch (error: any) {
    console.error("POST Admin New Arrivals Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add new arrival." },
      { status: 500 }
    );
  }
}
