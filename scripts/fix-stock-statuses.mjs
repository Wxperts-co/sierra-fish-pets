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

  // 1. Bulk update all products with stockCount <= 0 (or null) to out_of_stock status
  console.log("Updating out_of_stock products...");
  const r1 = await db.collection("products").updateMany(
    { 
      $or: [
        { stockCount: { $lte: 0 } },
        { stockCount: null },
        { stockCount: { $exists: false } }
      ]
    },
    { $set: { stockStatus: "out_of_stock", stockCount: 0 } }
  );
  console.log(`Successfully set out_of_stock for ${r1.modifiedCount} products.`);

  // 2. Bulk update all products with stockCount between 1 and 5 to low_stock status
  console.log("Updating low_stock products...");
  const r2 = await db.collection("products").updateMany(
    { stockCount: { $gt: 0, $lte: 5 } },
    { $set: { stockStatus: "low_stock" } }
  );
  console.log(`Successfully set low_stock for ${r2.modifiedCount} products.`);

  // 3. Bulk update all products with stockCount > 5 to in_stock status
  console.log("Updating in_stock products...");
  const r3 = await db.collection("products").updateMany(
    { stockCount: { $gt: 5 } },
    { $set: { stockStatus: "in_stock" } }
  );
  console.log(`Successfully set in_stock for ${r3.modifiedCount} products.`);

  console.log("Success: Bulk correction completed successfully!");
  process.exit(0);
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
}
