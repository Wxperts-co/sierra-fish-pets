import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import SpecialOrderPetModel from "@/models/SpecialOrderPet";

const specialOrderPetSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  category: z.enum(["fish", "reptile", "bird"]),
  type: z.string().min(1, "Type is required"),
  leadTime: z.string().optional().default("1-2 Weeks"),
  image: z.string().optional().default(""),
  description: z.string().optional().default(""),
  careDetails: z.string().optional().default(""),
  status: z.enum(["available", "unavailable"]).default("available"),
});



export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const includeUnavailable = searchParams.get("all") === "true";

    const filter: Record<string, any> = includeUnavailable ? {} : { status: "available" };
    const pets = await SpecialOrderPetModel.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { success: true, count: pets.length, pets },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/special-order-pets error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch special order pets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = specialOrderPetSchema.safeParse(body);

    if (!parsed.success) {
      const perr: any = parsed.error;
      return NextResponse.json(
        { success: false, message: perr.errors?.[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const petData = parsed.data;

    const existing = await SpecialOrderPetModel.findOne({ id: petData.id });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A pet with this ID already exists." },
        { status: 409 }
      );
    }

    const pet = new SpecialOrderPetModel(petData);
    await pet.save();

    return NextResponse.json({ success: true, pet }, { status: 201 });
  } catch (error) {
    console.error("POST /api/special-order-pets error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create special order pet record" },
      { status: 500 }
    );
  }
}
