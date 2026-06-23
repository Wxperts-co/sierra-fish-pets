import mongoose from "mongoose";
import dotenv from "dotenv";
import { join } from "path";
import { processEnrichmentBatch } from "../services/imageScheduler.js";

dotenv.config({ path: join(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("[Seeder] Connected to DB. Starting enrichment batches...");

    // Process up to 3 batches of size 10 to clean up all pending items
    for (let i = 1; i <= 3; i++) {
      console.log(`\n--- Running Batch #${i} ---`);
      const results = await processEnrichmentBatch(10);
      console.log(`Batch #${i} finished. Results count: ${results.length}`);
      if (results.length === 0) {
        console.log("No more pending products to enrich or batch rate-limited.");
        break;
      }
    }

    console.log("\n[Seeder] Manual enrichment runs completed.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
