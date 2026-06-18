import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, "../.env.local");
const envContents = await fs.readFile(envPath, "utf-8");
for (const line of envContents.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;

  const equalsIndex = trimmed.indexOf("=");
  if (equalsIndex === -1) continue;

  const key = trimmed.slice(0, equalsIndex).trim();
  let value = trimmed.slice(equalsIndex + 1).trim();

  if (value.startsWith("\"") && value.endsWith("\"")) {
    value = value.slice(1, -1);
  } else if (value.startsWith("'") && value.endsWith("'")) {
    value = value.slice(1, -1);
  }

  if (key && value !== undefined && process.env[key] === undefined) {
    process.env[key] = value;
  }
}

const categoriesPath = path.join(__dirname, "../data/categories.json");
const categoriesJson = await fs.readFile(categoriesPath, "utf-8");
const categories = JSON.parse(categoriesJson);

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local before running this script.");
}

await mongoose.connect(MONGODB_URI, { bufferCommands: false });

const subCategorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    icon: { type: String, required: true, trim: true },
    productCount: { type: Number, default: 0 },
    subcategories: { type: [subCategorySchema], default: [] },
  },
  { versionKey: false }
);

const CategoryModel = mongoose.models.Category || mongoose.model("Category", categorySchema);

const rows = categories.map((category) => ({
  ...category,
  description: category.description || category.name,
  image: category.image || "/images/default-category.png",
  icon: category.icon || "/icons/default-icon.svg",
  productCount: category.productCount ?? 0,
}));

for (const row of rows) {
  await CategoryModel.updateOne(
    { id: row.id },
    { $set: row },
    { upsert: true }
  );
}

console.log("Categories imported:", rows.length);
await mongoose.disconnect();