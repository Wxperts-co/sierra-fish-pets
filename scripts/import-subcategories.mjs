import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// Read .env.local manually to get MONGODB_URI
const envContent = fs.readFileSync(path.resolve(".env.local"), "utf-8");
const uriMatch = envContent.match(/MONGODB_URI=["']?([^"'\s]+)["']?/);
const MONGODB_URI = uriMatch ? uriMatch[1] : "";

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}

// Define Inline Schema to avoid importing TS files in JS standalone script
const SubCategorySchema = new mongoose.Schema({
  id: String,
  name: String,
  slug: String,
  isActive: { type: Boolean, default: true },
}, { _id: false });

const CategorySchema = new mongoose.Schema({
  id: String,
  name: String,
  slug: String,
  productCount: Number,
  subcategories: [SubCategorySchema],
}, { collection: "categories", versionKey: false });

const CategoryModel = mongoose.models.Category || mongoose.model("Category", CategorySchema);

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function run() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully.");

  // 1. Read and parse CSV
  console.log("Reading subcategory_codes.csv...");
  const csvContent = fs.readFileSync(path.resolve("data/subcategory_codes.csv"), "utf-8");
  const lines = csvContent.split("\n");
  const parsedSubcategories = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const commaIndex = line.indexOf(",");
    if (commaIndex === -1) continue;

    const code = line.substring(0, commaIndex).trim();
    const name = line.substring(commaIndex + 1).replace(/^"|"$/g, "").trim(); // strip outer quotes if any

    if (!code || !name) continue;

    parsedSubcategories.push({ code, name });
  }
  console.log(`Parsed ${parsedSubcategories.length} subcategories from CSV.`);

  // 2. Read category mapping
  console.log("Reading category_mapping.json...");
  const mappingContent = fs.readFileSync(path.resolve("data/category_mapping.json"), "utf-8");
  const mappings = JSON.parse(mappingContent);
  console.log(`Loaded ${mappings.length} mappings.`);

  // Create a fast mapping lookup
  const mappingMap = new Map();
  for (const m of mappings) {
    mappingMap.set(m.code, m.categorySlug);
  }

  // 3. Load all categories from MongoDB
  console.log("Loading categories from database...");
  const dbCategories = await CategoryModel.find({});
  console.log(`Loaded ${dbCategories.length} categories from database.`);

  const categoryMapBySlug = new Map();
  for (const cat of dbCategories) {
    categoryMapBySlug.set(cat.slug, cat);
  }

  // 4. Map and append subcategories
  let mappedCount = 0;
  let otherPetCount = 0;

  for (const sub of parsedSubcategories) {
    // Determine category slug
    let targetCategorySlug = mappingMap.get(sub.code);
    if (!targetCategorySlug) {
      targetCategorySlug = "other-pet";
      otherPetCount++;
    } else {
      mappedCount++;
    }

    // Normalize discrepancy: mapping file uses "small-animal", database has "small-pet"
    if (targetCategorySlug === "small-animal") {
      targetCategorySlug = "small-pet";
    }

    const targetCategory = categoryMapBySlug.get(targetCategorySlug);
    if (!targetCategory) {
      console.warn(`Warning: Category with slug "${targetCategorySlug}" not found in database for subcategory "${sub.name}" (${sub.code}).`);
      continue;
    }

    const subSlug = slugify(sub.name);

    // Check if subcategory already exists in this category
    const exists = targetCategory.subcategories.some(
      (existing) => existing.id === sub.code || existing.slug === subSlug
    );

    if (!exists) {
      targetCategory.subcategories.push({
        id: sub.code,
        name: sub.name,
        slug: subSlug,
        isActive: true,
      });
    }
  }

  // 5. Save all updated categories back to database
  console.log("Saving updated categories to database...");
  for (const cat of dbCategories) {
    await cat.save();
    console.log(`Saved category "${cat.name}" with ${cat.subcategories.length} subcategories.`);
  }

  console.log("\n--- IMPORT SUMMARY ---");
  console.log(`Total subcategories processed: ${parsedSubcategories.length}`);
  console.log(`Mapped to respective categories: ${mappedCount}`);
  console.log(`Assigned to "Other Pet" (unmapped): ${otherPetCount}`);
  console.log("Migration completed successfully!");

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Migration failed:", err);
  mongoose.disconnect();
});
