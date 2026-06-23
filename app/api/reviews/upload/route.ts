import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files provided" },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    // Target directory: public/uploads/reviews
    const dirPath = join(process.cwd(), "public", "uploads", "reviews");
    await mkdir(dirPath, { recursive: true });

    for (const file of files) {
      if (!file.name) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean up filename and generate a unique identifier
      const parts = file.name.split(".");
      const ext = parts.pop();
      const baseName = parts.join(".").replace(/\s+/g, "_").replace(/[^\w\-]+/g, "");
      const cleanFilename = `${Date.now()}-${Math.floor(Math.random() * 100000)}-${baseName}.${ext}`;
      const filePath = join(dirPath, cleanFilename);

      await writeFile(filePath, buffer);
      uploadedUrls.push(`/uploads/reviews/${cleanFilename}`);
    }

    return NextResponse.json({ success: true, urls: uploadedUrls }, { status: 200 });
  } catch (error: any) {
    console.error("Error uploading review images:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload review images" },
      { status: 500 }
    );
  }
}
