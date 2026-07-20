import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SpecialOrderPetModel from "@/models/SpecialOrderPet";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const deleted = await SpecialOrderPetModel.findOneAndDelete({ id });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Pet record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Special order pet deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/special-order-pets/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete pet record" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updated = await SpecialOrderPetModel.findOneAndUpdate(
      { id },
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Pet record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, pet: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/special-order-pets/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update pet record" },
      { status: 500 }
    );
  }
}
