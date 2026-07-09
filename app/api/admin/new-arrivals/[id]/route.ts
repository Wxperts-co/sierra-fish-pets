import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/authHelper";
import { connectDB } from "@/lib/mongodb";
import NewArrivalModel from "@/models/NewArrival";

export const dynamic = "force-dynamic";

// PATCH /api/admin/new-arrivals/[id]
// Update an existing new arrival record in MongoDB
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = await getAuthenticatedUser(request);
    const ALLOWED_ADMIN_ROLES = ["admin", "manager", "sales", "delivery boy"];
    if (!user || !ALLOWED_ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json(
        { success: false, message: "Access denied. Admin authorization required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const arrival = await NewArrivalModel.findOne({ id: { $regex: new RegExp(`^${id}$`, "i") } });
    if (!arrival) {
      return NextResponse.json(
        { success: false, message: "Arrival record not found." },
        { status: 404 }
      );
    }

    // Merge updates
    const fieldsToUpdate = [
      "name",
      "slug",
      "category",
      "breed",
      "gender",
      "age",
      "size",
      "status",
      "featured",
      "vaccinated",
      "dewormed",
      "microchipped",
      "description",
      "highlights",
      "images",
      "location",
      "seo"
    ];

    fieldsToUpdate.forEach((field) => {
      if (body[field] !== undefined) {
        (arrival as any)[field] = body[field];
      }
    });

    if (body.price !== undefined) arrival.price = Number(body.price);
    if (body.discountPrice !== undefined) arrival.discountPrice = body.discountPrice ? Number(body.discountPrice) : undefined;
    if (body.stock !== undefined) arrival.stock = Number(body.stock);
    if (body.arrivalDate !== undefined) arrival.arrivalDate = body.arrivalDate;

    await arrival.save();

    return NextResponse.json({
      success: true,
      message: "Arrival record updated successfully.",
      arrival,
    });
  } catch (error: any) {
    console.error("PATCH Admin New Arrivals Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update arrival." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/new-arrivals/[id]
// Permanently delete a new arrival record from MongoDB
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = await getAuthenticatedUser(request);
    const ALLOWED_ADMIN_ROLES = ["admin", "manager", "sales", "delivery boy"];
    if (!user || !ALLOWED_ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json(
        { success: false, message: "Access denied. Admin authorization required." },
        { status: 403 }
      );
    }

    const { id } = await params;

    const result = await NewArrivalModel.deleteOne({ id: { $regex: new RegExp(`^${id}$`, "i") } });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Arrival record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Arrival record permanently deleted.",
    });
  } catch (error: any) {
    console.error("DELETE Admin New Arrivals Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete arrival." },
      { status: 500 }
    );
  }
}
