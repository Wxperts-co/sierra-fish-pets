import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import NewArrivalModel from "@/models/NewArrival";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "No items provided for publishing." },
        { status: 400 }
      );
    }

    const createdRecords: any[] = [];

    for (const item of items) {
      if (!item.name || !item.name.trim()) continue;

      const slugBase = item.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const uniqueSuffix = Math.random().toString(36).substring(2, 6);
      const slug = `${slugBase}-${uniqueSuffix}`;
      const id = `arr-${Date.now().toString(36)}-${uniqueSuffix}`;

      const statusVal: "available" | "adopted" | "unavailable" = "available";

      const arrivalData = {
        id,
        name: item.name.trim(),
        slug,
        category: item.category || "fish",
        subcategory: item.subcategory || item.scientificName || "",
        breed: item.breed || item.scientificName || item.name,
        gender: item.gender || "Unknown",
        age: item.age || "Young Adult",
        size: item.size || "Medium",
        price: Number(item.price) || 9.99,
        arrivalDate: item.arrivalDate || new Date().toISOString().split("T")[0],
        status: statusVal,
        featured: false,
        vaccinated: false,
        dewormed: false,
        microchipped: false,
        description: item.description || `New arrival: ${item.name} (${item.size || "Medium"}). In stock at Renton Store.`,
        highlights: [
          `Condition: Healthy & Acclimated`,
          `Size: ${item.size || "Medium"}`,
          `Quantity In-Stock: ${item.quantity || 1}`,
        ],
        images: item.image ? [item.image] : [],
        location: item.location || "Renton Store",
        stock: Number(item.quantity) || 1,
        seo: {
          title: `${item.name} - Live Pet & Fish Arrivals | Sierra Fish & Pets`,
          description: `Check out our latest arrival of ${item.name} at Sierra Fish & Pets in Renton.`,
        },
      };

      const record = await NewArrivalModel.create(arrivalData);
      createdRecords.push(record);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully published ${createdRecords.length} new fish/pet arrivals!`,
        count: createdRecords.length,
        items: createdRecords,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("AI Batch Create Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to publish arrivals." },
      { status: 500 }
    );
  }
}
