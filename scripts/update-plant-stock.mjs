import mongoose from "mongoose";
import dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

try {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection not ready");
  }

  const targetCategories = [
    "aquatic-/-live-plants-potted",
    "aquatic-/-live-plants-tissue-culture"
  ];

  // 1. Check existing products matching category
  console.log("\n[1] Checking products in target categories before update...");
  const beforeProducts = await db.collection("products").find({
    categorySlug: { $in: targetCategories }
  }).toArray();

  console.log(`Found ${beforeProducts.length} products to update:`);
  console.log(`- 'aquatic-/-live-plants-potted': ${beforeProducts.filter(p => p.categorySlug === targetCategories[0]).length}`);
  console.log(`- 'aquatic-/-live-plants-tissue-culture': ${beforeProducts.filter(p => p.categorySlug === targetCategories[1]).length}`);

  if (beforeProducts.length === 0) {
    console.log("No products found matching target categories. No changes made.");
    process.exit(0);
  }

  // 2. Perform the update: set stockCount = 0 and stockStatus = "out_of_stock"
  console.log("\n[2] Updating stock to 0 and stockStatus to 'out_of_stock'...");
  const updateResult = await db.collection("products").updateMany(
    { categorySlug: { $in: targetCategories } },
    { $set: { stockCount: 0, stockStatus: "out_of_stock" } }
  );

  console.log(`Matched count: ${updateResult.matchedCount}`);
  console.log(`Modified count: ${updateResult.modifiedCount}`);

  // 3. Verify the updated products
  console.log("\n[3] Verifying products after update...");
  const afterProducts = await db.collection("products").find({
    categorySlug: { $in: targetCategories }
  }).toArray();

  const allZeroStock = afterProducts.every(p => p.stockCount === 0 && p.stockStatus === "out_of_stock");
  console.log(`All ${afterProducts.length} products successfully verified with stockCount = 0 and stockStatus = 'out_of_stock': ${allZeroStock}`);

  // 4. Verify no other products were affected
  console.log("\n[4] Checking non-target products...");
  const nonTargetTotal = await db.collection("products").countDocuments({
    categorySlug: { $nin: targetCategories }
  });
  console.log(`Non-target products count remains intact: ${nonTargetTotal}`);

  console.log("\nUpdate completed successfully!");
  process.exit(0);
} catch (error) {
  console.error("Update failed:", error);
  process.exit(1);
}
