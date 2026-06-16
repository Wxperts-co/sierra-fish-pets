import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join, dirname } from "path";

const PRODUCTS_DIR = join(process.cwd(), "data", "products");
const PUBLIC_DIR = join(process.cwd(), "public");

const files = ["aquatic.json", "bird.json", "cat.json", "dog.json", "reptile.json", "small-animal.json"];

// 1x1 px base64 placeholders
const PLACEHOLDERS = {
  jpg: Buffer.from("/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=", "base64"),
  jpeg: Buffer.from("/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=", "base64"),
  png: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64"),
  gif: Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64"),
  webp: Buffer.from("UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEADsD+wVIAAP73AAAA", "base64"),
};

// Fallback avif source images that we know exist
const AVIF_SOURCES = {
  dog: join(PUBLIC_DIR, "images", "products", "dog1.avif"),
  cat: join(PUBLIC_DIR, "images", "products", "cat1.avif"),
  aquatic: join(PUBLIC_DIR, "images", "products", "aqua1.avif"),
  reptile: join(PUBLIC_DIR, "images", "products", "reptile1.avif"),
  default: join(PUBLIC_DIR, "images", "products", "dog1.avif"),
};

files.forEach(fileName => {
  const filePath = join(PRODUCTS_DIR, fileName);
  if (!existsSync(filePath)) return;

  const content = JSON.parse(readFileSync(filePath, "utf-8"));

  content.forEach(product => {
    const images = product.images || [];
    images.forEach(img => {
      if (!img.startsWith("/images/products/")) return;

      const targetPath = join(PUBLIC_DIR, img);
      if (existsSync(targetPath)) return;

      // Ensure directory exists
      mkdirSync(dirname(targetPath), { recursive: true });

      const ext = img.split(".").pop().toLowerCase();

      if (ext === "avif") {
        // Find suitable avif source
        let src = AVIF_SOURCES.default;
        if (product.categorySlug === "dog") src = AVIF_SOURCES.dog;
        else if (product.categorySlug === "cat") src = AVIF_SOURCES.cat;
        else if (product.categorySlug === "aquatic") src = AVIF_SOURCES.aquatic;
        else if (product.categorySlug === "reptile") src = AVIF_SOURCES.reptile;

        if (existsSync(src)) {
          writeFileSync(targetPath, readFileSync(src));
          console.log(`Copied AVIF: ${img}`);
        } else {
          // If no avif exists, write a 1x1 webp
          writeFileSync(targetPath, PLACEHOLDERS.webp);
          console.log(`Created WebP placeholder for AVIF: ${img}`);
        }
      } else if (PLACEHOLDERS[ext]) {
        writeFileSync(targetPath, PLACEHOLDERS[ext]);
        console.log(`Created ${ext.toUpperCase()} placeholder: ${img}`);
      } else {
        // default to PNG
        writeFileSync(targetPath, PLACEHOLDERS.png);
        console.log(`Created default PNG placeholder: ${img}`);
      }
    });
  });
});

console.log("\n✅ All missing product images checked and resolved.");
