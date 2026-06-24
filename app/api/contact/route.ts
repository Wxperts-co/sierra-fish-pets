

import { sendContactEmail } from "@/lib/email/contact";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, message } = body;

    if (!name || !email || !message) {
      return Response.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await sendContactEmail({
      name,
      email,
      message,
    });

    return Response.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return Response.json(
      { message: "Failed to send message" },
      { status: 500 }
    );
  }
}