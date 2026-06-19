import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import DogAdoptionModel from "@/models/DogAdoption";

const dogUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  image: z.string().optional(),
  breed: z.string().min(1).optional(),
  age: z.string().optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  size: z.enum(["Small", "Medium", "Large", "Extra Large"]).optional(),
  color: z.string().optional(),
  vaccinated: z.boolean().optional(),
  neutered: z.boolean().optional(),
  goodWithKids: z.boolean().optional(),
  goodWithDogs: z.boolean().optional(),
  goodWithCats: z.boolean().optional(),
  adoptionStatus: z.enum(["available", "pending", "adopted"]).optional(),
  featured: z.boolean().optional(),
  description: z.string().optional(),
  personality: z.array(z.string()).optional(),
  adoptionFee: z.string().optional(),
});

function getNormalizedId(rawId: string | string[]) {
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  return typeof id === "string" ? id.trim() : "";
}

async function findDogByParam(id: string) {
  if (!id) return null;
  if (mongoose.isValidObjectId(id)) {
    const dog = await DogAdoptionModel.findById(id);
    if (dog) return dog;
  }
  return DogAdoptionModel.findOne({ id });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const dog = await findDogByParam(getNormalizedId(id));
    if (!dog) {
      return NextResponse.json({ success: false, message: "Dog not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, dog }, { status: 200 });
  } catch (error) {
    console.error("GET /api/dogs/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch dog" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const dog = await findDogByParam(getNormalizedId(id));
    if (!dog) {
      return NextResponse.json({ success: false, message: "Dog not found" }, { status: 404 });
    }
    const body = await request.json();
    const parsed = dogUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const perr: any = parsed.error;
      return NextResponse.json(
        { success: false, message: perr.errors?.[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    Object.assign(dog, parsed.data);
    await dog.save();
    return NextResponse.json({ success: true, dog }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/dogs/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update dog" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const dog = await findDogByParam(getNormalizedId(id));
    if (!dog) {
      return NextResponse.json({ success: false, message: "Dog not found" }, { status: 404 });
    }
    await dog.deleteOne();
    return NextResponse.json({ success: true, message: "Dog record deleted." }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/dogs/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete dog" }, { status: 500 });
  }
}
