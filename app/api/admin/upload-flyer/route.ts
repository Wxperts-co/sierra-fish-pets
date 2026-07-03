import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Verify it is an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Please upload an image file" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Target directory: public/images
    const dirPath = join(process.cwd(), "public", "images");
    await mkdir(dirPath, { recursive: true });

    // We overwrite public/images/flyers.png directly so it replaces the existing flyer
    const filePath = join(dirPath, "flyers.png");
    await writeFile(filePath, buffer);

    return NextResponse.json(
      { success: true, url: "/images/flyers.png" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading weekly flyer image:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload flyer image" },
      { status: 500 }
    );
  }
}
