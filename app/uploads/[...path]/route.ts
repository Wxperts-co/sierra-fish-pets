import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

/**
 * Endpoint to serve uploaded images directly from local VPS uploads folder.
 * URL format: GET /uploads/products/[upc].jpg
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    // Resolve params checking if next dynamic parameters are a Promise
    const resolvedParams = "then" in params ? await params : params;
    const pathSegments = resolvedParams.path;

    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Target directory: process.cwd()/uploads/
    const uploadsBase = path.join(process.cwd(), "uploads");
    const filePath = path.join(uploadsBase, ...pathSegments);

    // SECURITY: Prevent Directory Traversal (e.g. /uploads/../../../etc/passwd)
    const relative = path.relative(uploadsBase, filePath);
    const isSafe = relative && !relative.startsWith("..") && !path.isAbsolute(relative);
    
    if (!isSafe) {
      return new NextResponse("Access Denied", { status: 403 });
    }

    // Serve file if it exists
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      let contentType = "application/octet-stream";
      
      if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      else if (ext === ".png") contentType = "image/png";
      else if (ext === ".webp") contentType = "image/webp";
      else if (ext === ".gif") contentType = "image/gif";
      else if (ext === ".svg") contentType = "image/svg+xml";

      const fileBuffer = fs.readFileSync(filePath);

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable", // Cache permanently on client/CDN
        },
      });
    }

    // Fallback: If requested image is missing, serve placeholderimg.png
    const placeholderPath = path.join(process.cwd(), "public", "placeholderimg.png");
    if (fs.existsSync(placeholderPath)) {
      const fileBuffer = fs.readFileSync(placeholderPath);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=86400", // Cache placeholder for 24 hours
        },
      });
    }

    return new NextResponse("Not Found", { status: 404 });
  } catch (error: any) {
    console.error("[Local Server] File serving error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
