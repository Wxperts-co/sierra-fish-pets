import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import EventModel from "@/models/Event";

const eventUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  petType: z.array(z.string()).optional(),
  image: z.string().optional(),
  location: z.string().min(1).optional(),
  startDate: z.string().min(1).optional(),
  endDate: z.string().min(1).optional(),
  status: z.string().optional(),
  featured: z.boolean().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  recurrence: z
    .object({
      enabled: z.boolean().optional(),
      frequency: z.string().nullable().optional(),
      rule: z.string().nullable().optional(),
    })
    .optional(),
});

function getNormalizedId(rawId: string | string[]) {
  const idFromParams = Array.isArray(rawId) ? rawId[0] : rawId;
  return typeof idFromParams === "string" ? idFromParams.trim() : "";
}

async function findEventByParam(id: string) {
  if (!id) return null;

  if (mongoose.isValidObjectId(id)) {
    const event = await EventModel.findById(id);
    if (event) return event;
  }

  return EventModel.findOne({ id });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const normalizedId = getNormalizedId(id);
    const event = await findEventByParam(normalizedId);

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, event }, { status: 200 });
  } catch (error) {
    console.error("GET /api/events/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const normalizedId = getNormalizedId(id);
    const event = await findEventByParam(normalizedId);

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = eventUpdateSchema.safeParse(body);

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

    Object.assign(event, parsed.data);
    await event.save();

    return NextResponse.json({ success: true, event }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/events/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const normalizedId = getNormalizedId(id);
    const event = await findEventByParam(normalizedId);

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    await event.deleteOne();

    return NextResponse.json(
      { success: true, message: "Event deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/events/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete event" },
      { status: 500 }
    );
  }
}
