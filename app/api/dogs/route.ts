import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import DogAdoptionModel from "@/models/DogAdoption";


const dogSchema = z.object({
  id: z.string().min(1, "Dog ID is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  image: z.string().optional().default(""),
  breed: z.string().min(1, "Breed is required"),
  age: z.string().optional().default(""),
  gender: z.enum(["Male", "Female"]).default("Male"),
  size: z.enum(["Small", "Medium", "Large", "Extra Large"]).default("Medium"),
  color: z.string().optional().default(""),
  vaccinated: z.boolean().optional().default(false),
  neutered: z.boolean().optional().default(false),
  goodWithKids: z.boolean().optional().default(false),
  goodWithDogs: z.boolean().optional().default(false),
  goodWithCats: z.boolean().optional().default(false),
  adoptionStatus: z.enum(["available", "pending", "adopted"]).default("available"),
  featured: z.boolean().optional().default(false),
  description: z.string().optional().default(""),
  personality: z.array(z.string()).optional().default([]),
  adoptionFee: z.string().optional().default("$0"),
});

export async function GET(_request: NextRequest) {
  try {
    await connectDB();

    const dogs = await DogAdoptionModel.find().sort({ name: 1 }).lean();

    return NextResponse.json(
      { success: true, count: dogs.length, dogs },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/dogs error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = dogSchema.safeParse(body);

    if (!parsed.success) {
      const perr: any = parsed.error;
      return NextResponse.json(
        { success: false, message: perr.errors?.[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const dogData = parsed.data;

    const existing = await DogAdoptionModel.findOne({ id: dogData.id });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A dog with this ID already exists." },
        { status: 409 }
      );
    }

    const dog = new DogAdoptionModel(dogData);
    await dog.save();

    return NextResponse.json({ success: true, dog }, { status: 201 });
  } catch (error) {
    console.error("POST /api/dogs error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create dog record" },
      { status: 500 }
    );
  }
}
