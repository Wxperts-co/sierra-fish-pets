import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const folder = (formData.get("folder") as string | null) || "general";

    // Gather all uploaded files from both "file" and "files" keys
    const files: File[] = [];
    
    const filesFromFileKey = formData.getAll("file") as File[];
    if (filesFromFileKey && filesFromFileKey.length > 0) {
      files.push(...filesFromFileKey);
    }

    const filesFromFilesKey = formData.getAll("files") as File[];
    if (filesFromFilesKey && filesFromFilesKey.length > 0) {
      files.push(...filesFromFilesKey);
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No file(s) provided" },
        { status: 400 }
      );
    }

    // Target directory: public/uploads/${folder}
    const dirPath = join(process.cwd(), "public", "uploads", folder);
    await mkdir(dirPath, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!file || !file.name) continue;
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean up filename and generate a unique identifier
      const parts = file.name.split(".");
      const ext = parts.pop();
      const baseName = parts.join(".").replace(/\s+/g, "_").replace(/[^\w\-]+/g, "");
      const cleanFilename = `${Date.now()}-${Math.floor(Math.random() * 100000)}-${baseName}.${ext}`;
      const filePath = join(dirPath, cleanFilename);

      await writeFile(filePath, buffer);
      uploadedUrls.push(`/uploads/${folder}/${cleanFilename}`);
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0] || "",
      urls: uploadedUrls
    }, { status: 200 });
  } catch (error) {
    console.error("Error uploading image(s):", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload image(s)" },
      { status: 500 }
    );
  }
}
