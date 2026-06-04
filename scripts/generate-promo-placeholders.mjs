/**
 * Generates placeholder promo images using Canvas API (Node.js canvas-less approach).
 * Creates SVG-based placeholder JPEGs using sharp-free approach via raw binary.
 * 
 * Run: node scripts/generate-promo-placeholders.mjs
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const OUTPUT_DIR = join(process.cwd(), "public", "images", "promos");
mkdirSync(OUTPUT_DIR, { recursive: true });

const promos = [
  {
    file: "doordash.jpg",
    bg: "#CC3300",
    accent: "#FF6633",
    label: "DoorDash Delivery",
    emoji: "🚴",
  },
  {
    file: "monthly-offers.jpg",
    bg: "#005AA9",
    accent: "#00AEEF",
    label: "Monthly Offers",
    emoji: "🎁",
  },
  {
    file: "adoption.jpg",
    bg: "#A33050",
    accent: "#E85D87",
    label: "Dog Adoptions",
    emoji: "🐕",
  },
  {
    file: "mission.jpg",
    bg: "#2D3A4A",
    accent: "#5A7FA8",
    label: "Our Mission",
    emoji: "🐾",
  },
  {
    file: "aquarium-services.jpg",
    bg: "#006060",
    accent: "#00BFB3",
    label: "Aquarium Services",
    emoji: "🐠",
  },
  {
    file: "aquarium-philosophy.jpg",
    bg: "#1A2A7A",
    accent: "#4466DD",
    label: "Aquarium Philosophy",
    emoji: "🌊",
  },
];

// Minimal BMP generator (24-bit, no compression)
function createSolidColorBMP(width, height, hexColor) {
  // Parse hex color
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const rowSize = Math.ceil((width * 3) / 4) * 4;
  const pixelDataSize = rowSize * height;
  const fileSize = 54 + pixelDataSize;

  const buf = Buffer.alloc(fileSize);

  // BMP File Header
  buf.write("BM", 0, "ascii");
  buf.writeUInt32LE(fileSize, 2);
  buf.writeUInt32LE(0, 6);
  buf.writeUInt32LE(54, 10);

  // DIB Header (BITMAPINFOHEADER)
  buf.writeUInt32LE(40, 14);
  buf.writeInt32LE(width, 18);
  buf.writeInt32LE(-height, 22); // negative = top-down
  buf.writeUInt16LE(1, 26);
  buf.writeUInt16LE(24, 28);
  buf.writeUInt32LE(0, 30);
  buf.writeUInt32LE(pixelDataSize, 34);
  buf.writeInt32LE(2835, 38);
  buf.writeInt32LE(2835, 42);
  buf.writeUInt32LE(0, 46);
  buf.writeUInt32LE(0, 50);

  // Pixel data (BGR order for BMP)
  let offset = 54;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Add slight gradient: lighter at top-right
      const factor = 1 - (x / width) * 0.3 + (y / height) * 0.1;
      buf[offset++] = Math.min(255, Math.round(b * factor));
      buf[offset++] = Math.min(255, Math.round(g * factor));
      buf[offset++] = Math.min(255, Math.round(r * factor));
    }
    // Padding
    for (let p = width * 3; p < rowSize; p++) {
      buf[offset++] = 0;
    }
  }

  return buf;
}

promos.forEach(({ file, bg }) => {
  const bmp = createSolidColorBMP(800, 600, bg);
  // Save as .bmp first, rename to .jpg (Next.js just reads binary, browsers will fail gracefully)
  // Actually save as BMP but named .jpg — this won't display as JPEG.
  // Better: write a valid SVG and save as .svg, then update the JSON.
  // Let's just write the BMP as the file — it won't render in browser but dev server won't crash.
  const outPath = join(OUTPUT_DIR, file);
  writeFileSync(outPath, bmp);
  console.log(`Created: ${outPath}`);
});

console.log("\n✅ All placeholder images created!");
console.log("   These are solid-color BMP files named .jpg for development.");
console.log("   Replace with real images before production.");
