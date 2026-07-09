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

// Define Inline Schemas
const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  subcategorySlug: String,
}, { collection: "products" });

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
  subcategories: [SubCategorySchema],
}, { collection: "categories", versionKey: false });

const ProductModel = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const CategoryModel = mongoose.models.Category || mongoose.model("Category", CategorySchema);

async function run() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully.");

  // 1. Fetch distinct subcategorySlugs from products
  console.log("Fetching distinct subcategory slugs from products collection...");
  const activeSubcategorySlugs = await ProductModel.distinct("subcategorySlug");
  console.log(`Found ${activeSubcategorySlugs.length} active subcategory slugs in products.`);

  // 2. Fetch Other Pet category
  console.log("Fetching 'Other Pet' category...");
  const otherPetCategory = await CategoryModel.findOne({ slug: "other-pet" });
  if (!otherPetCategory) {
    console.error("Category 'other-pet' not found in database.");
    await mongoose.disconnect();
    return;
  }

  const initialCount = otherPetCategory.subcategories.length;
  console.log(`'Other Pet' category has ${initialCount} subcategories currently.`);

  // 3. Prune subcategories that don't have any products
  const prunedSubcategories = [];
  const removedSubcategories = [];

  for (const sub of otherPetCategory.subcategories) {
    // Check if there is at least one product with this subcategorySlug in the database
    if (activeSubcategorySlugs.includes(sub.slug)) {
      prunedSubcategories.push(sub);
    } else {
      removedSubcategories.push(sub.name);
    }
  }

  // 4. Save the pruned subcategories list
  otherPetCategory.subcategories = prunedSubcategories;
  await otherPetCategory.save();

  console.log("\n--- PRUNING SUMMARY ---");
  console.log(`Original count of subcategories: ${initialCount}`);
  console.log(`Removed count of subcategories: ${removedSubcategories.length}`);
  console.log(`Retained count of subcategories: ${prunedSubcategories.length}`);
  if (removedSubcategories.length > 0) {
    console.log(`Removed subcategories: ${removedSubcategories.join(", ")}`);
  } else {
    console.log("No subcategories were removed.");
  }
  console.log("Pruning completed successfully!");

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Pruning failed:", err);
  mongoose.disconnect();
});
