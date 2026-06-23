import fs from "fs";
import path from "path";
import axios from "axios";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export interface ValidationResult {
  isValid: boolean;
  data?: Buffer;
  mimeType?: string;
}

/**
 * Checks whether an image already exists locally for the same UPC.
 */
export function getExistingLocalImage(upc: string): string | null {
  const cleanUpc = upc ? upc.trim() : "";
  if (!cleanUpc) return null;

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "products");
  if (!fs.existsSync(uploadsDir)) return null;

  // Check supported extensions
  const extensions = ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"];
  for (const ext of extensions) {
    const filePath = path.join(uploadsDir, `${cleanUpc}.${ext}`);
    if (fs.existsSync(filePath)) {
      return `/uploads/products/${cleanUpc}.${ext}`;
    }
  }
  return null;
}

/**
 * Validates Content-Type, downloadability, URL, response size, and non-empty/non-html data.
 */
export async function validateImageUrl(url: string): Promise<ValidationResult> {
  if (!url || typeof url !== "string") {
    return { isValid: false };
  }

  try {
    // Validate URL syntax
    new URL(url);

    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 5000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
      }
    });

    if (response.status !== 200) {
      return { isValid: false };
    }

    const contentType = response.headers["content-type"];
    const mimeType = (typeof contentType === "string") ? contentType.toLowerCase().split(";")[0].trim() : "";

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return { isValid: false };
    }

    if (!response.data || response.data.length === 0) {
      return { isValid: false };
    }

    // Additional check: HTML content or JSON (captchas / page blocks)
    const dataString = Buffer.from(response.data).toString("utf8", 0, 200).trim();
    if (
      dataString.startsWith("<html") ||
      dataString.startsWith("<!DOCTYPE") ||
      dataString.startsWith("{") ||
      dataString.includes("captcha") ||
      dataString.includes("forbidden") ||
      dataString.includes("unauthorized")
    ) {
      return { isValid: false };
    }

    return {
      isValid: true,
      data: Buffer.from(response.data),
      mimeType
    };
  } catch (error) {
    return { isValid: false };
  }
}

/**
 * Downloads an image from a remote URL, validates its size and type,
 * creates local directory structures, and writes the image to disk.
 * Supports passing pre-validated buffer data to prevent double download.
 */
export async function downloadAndSaveImage(
  imageUrl: string,
  upc: string,
  validatedData?: Buffer,
  mimeType?: string
): Promise<string> {
  // If the image is already a local asset path, return it directly without downloading
  if (imageUrl.startsWith("/") || imageUrl.startsWith("file://")) {
    return imageUrl;
  }

  const cleanUpc = upc ? upc.trim() : "";
  if (!cleanUpc) {
    throw new Error("Cannot write local image without a valid product UPC.");
  }

  // Duplicate Check
  const existingLocal = getExistingLocalImage(cleanUpc);
  if (existingLocal) {
    console.log(`[Downloader] Found existing local image for UPC ${cleanUpc}: ${existingLocal}`);
    return existingLocal;
  }

  let data: Buffer;
  let finalMimeType = "";

  if (validatedData && mimeType) {
    data = validatedData;
    finalMimeType = mimeType;
  } else {
    console.log(`[Downloader] Initiating download for URL: ${imageUrl}`);
    const validation = await validateImageUrl(imageUrl);
    if (!validation.isValid || !validation.data || !validation.mimeType) {
      throw new Error(`Restricted content format or invalid image at URL: ${imageUrl}`);
    }
    data = validation.data;
    finalMimeType = validation.mimeType;
  }

  // Validate file size limit
  if (data.length > MAX_SIZE_BYTES) {
    throw new Error(`File exceeds storage limits: ${Math.round(data.length / 1024 / 1024)}MB. Limit is 8MB.`);
  }

  // Map MIME to extension
  let extension = "jpg";
  if (finalMimeType.includes("png")) extension = "png";
  else if (finalMimeType.includes("webp")) extension = "webp";
  else if (finalMimeType.includes("gif")) extension = "gif";
  else if (finalMimeType.includes("svg")) extension = "svg";
  else if (finalMimeType.includes("avif")) extension = "avif";

  // Create folder directory path
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "products");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Write file to VPS local directory
  const filename = `${cleanUpc}.${extension}`;
  const filePath = path.join(uploadsDir, filename);

  fs.writeFileSync(filePath, data);
  console.log(`[Downloader] Successfully wrote image to VPS: ${filePath}`);

  // Return server serving URL
  return `/uploads/products/${filename}`;
}
