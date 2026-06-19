import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import EventModel from "@/models/Event";


const eventSchema = z.object({
  id: z.string().min(1, "Event ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  petType: z.array(z.string()).optional().default([]),
  image: z.string().optional().default(""),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: z.string().optional().default("upcoming"),
  featured: z.boolean().optional().default(false),
  ctaText: z.string().optional().default("View Details"),
  ctaLink: z.string().optional().default("#"),
  recurrence: z
    .object({
      enabled: z.boolean().default(false),
      frequency: z.string().nullable().optional().default(null),
      rule: z.string().nullable().optional().default(null),
    })
    .optional(),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: "End date must be ahead of start date",
  path: ["endDate"],
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const events = await EventModel.find().sort({ startDate: 1 }).lean();
    
    return NextResponse.json(
      { success: true, count: events.length, events },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = eventSchema.safeParse(body);

    if (!parsed.success) {
      const perr: any = parsed.error;
      console.error("Validation error details for event creation:", JSON.stringify(perr.errors, null, 2));
      return NextResponse.json(
        { success: false, message: perr.errors?.[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const eventData = parsed.data;

    const existingEvent = await EventModel.findOne({ id: eventData.id });
    if (existingEvent) {
      return NextResponse.json(
        { success: false, message: "An event with this ID already exists." },
        { status: 409 }
      );
    }

    const event = new EventModel(eventData);
    await event.save();

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create event" },
      { status: 500 }
    );
  }
}
