import fs from "fs";
import path from "path";
import axios from "axios";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

/**
 * Downloads an image from a remote URL, validates its size and type,
 * creates local directory structures, and writes the image to disk.
 */
export async function downloadAndSaveImage(imageUrl: string, upc: string): Promise<string> {
  // If the image is already a local asset path, return it directly without downloading
  if (imageUrl.startsWith("/") || imageUrl.startsWith("file://")) {
    return imageUrl;
  }

  const cleanUpc = upc ? upc.trim() : "";
  if (!cleanUpc) {
    throw new Error("Cannot write local image without a valid product UPC.");
  }

  console.log(`[Downloader] Initiating download for URL: ${imageUrl}`);
  
  let contentType = "";
  let contentLength = 0;

  // 1. Fetch headers to perform quick size & type validation
  const headResponse = await axios.head(imageUrl, { timeout: 4000 }).catch(() => null);
  if (headResponse?.headers) {
    const headContentType = headResponse.headers["content-type"];
    if (typeof headContentType === "string") {
      contentType = headContentType;
    }
    const headContentLength = headResponse.headers["content-length"];
    if (typeof headContentLength === "string" || typeof headContentLength === "number") {
      contentLength = parseInt(String(headContentLength), 10) || 0;
    }
  }

  // 2. Perform full download request
  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer",
    timeout: 10000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
    }
  });

  // Re-check headers if HEAD response failed or was skipped
  if (!contentType && response.headers) {
    const resContentType = response.headers["content-type"];
    if (typeof resContentType === "string") {
      contentType = resContentType;
    }
  }
  if (!contentLength && response.headers) {
    const resContentLength = response.headers["content-length"];
    if (typeof resContentLength === "string" || typeof resContentLength === "number") {
      contentLength = parseInt(String(resContentLength), 10) || 0;
    }
  }

  if (!contentLength && response.data) {
    contentLength = response.data.length;
  }

  // Validate type
  const mimeType = contentType ? contentType.toLowerCase().split(";")[0].trim() : "";
  if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`Restricted content format: ${mimeType}. Only standard web images allowed.`);
  }

  // Validate file size
  if (contentLength > MAX_SIZE_BYTES) {
    throw new Error(`File exceeds storage limits: ${Math.round(contentLength / 1024 / 1024)}MB. Limit is 8MB.`);
  }

  // Map MIME to extension
  let extension = "jpg";
  if (mimeType.includes("png")) extension = "png";
  else if (mimeType.includes("webp")) extension = "webp";
  else if (mimeType.includes("gif")) extension = "gif";
  else if (mimeType.includes("svg")) extension = "svg";

  // Create folder directory path
  const uploadsDir = path.join(process.cwd(), "uploads", "products");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Write file to VPS local directory
  const filename = `${cleanUpc}.${extension}`;
  const filePath = path.join(uploadsDir, filename);

  fs.writeFileSync(filePath, Buffer.from(response.data));
  console.log(`[Downloader] Successfully wrote image to VPS: ${filePath}`);

  // Return server serving URL
  return `/uploads/products/${filename}`;
}
