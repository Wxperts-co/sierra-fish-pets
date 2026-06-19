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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Target directory: public/images/heroslider
    const dirPath = join(process.cwd(), "public", "images", "heroslider");
    await mkdir(dirPath, { recursive: true });

    // Clean up filename and generate a unique identifier
    const parts = file.name.split(".");
    const ext = parts.pop();
    const baseName = parts.join(".").replace(/\s+/g, "_").replace(/[^\w\-]+/g, "");
    const cleanFilename = `${Date.now()}-${baseName}.${ext}`;
    const filePath = join(dirPath, cleanFilename);

    await writeFile(filePath, buffer);

    const relativeUrl = `/images/heroslider/${cleanFilename}`;
    return NextResponse.json({ success: true, url: relativeUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading hero banner image:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload image" },
      { status: 500 }
    );
  }
}
