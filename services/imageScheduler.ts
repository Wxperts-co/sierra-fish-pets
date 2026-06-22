import mongoose from "mongoose";
import Product from "@/models/Product";
import { findProductImage } from "@/services/imageLookup";
import { downloadAndSaveImage } from "@/services/imageDownloader";

declare global {
  var imageEnrichmentSchedulerStarted: boolean | undefined;
}

const DEFAULT_BATCH_SIZE = 50;
const DEFAULT_INTERVAL_MS = 60000; // 1 minute
const STUCK_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Initializes the background image enrichment scheduler.
 * Ensures only one scheduler is running per Next.js server instance.
 */
export function initImageScheduler() {
  if (global.imageEnrichmentSchedulerStarted) {
    return;
  }

  global.imageEnrichmentSchedulerStarted = true;
  console.log("[Scheduler] Initializing background image enrichment scheduler...");

  // Run stuck products cleanup immediately on boot
  resetStuckProducts().catch((err) => {
    console.error("[Scheduler] Initial stuck cleanup failed:", err);
  });

  // Start the periodic processing loop
  scheduleNextRun();
}

/**
 * Schedules the next execution of the scheduler using recursive setTimeout
 * to prevent overlapping runs.
 */
function scheduleNextRun() {
  const interval = parseInt(process.env.IMAGE_PROCESS_INTERVAL || String(DEFAULT_INTERVAL_MS), 10);

  setTimeout(async () => {
    try {
      // 1. Clean up any stuck jobs
      await resetStuckProducts();

      // 2. Process next batch
      await processEnrichmentBatch();
    } catch (error: any) {
      console.error("[Scheduler] Error in background scheduler loop:", error.message || error);
    } finally {
      // Schedule next run recursively
      scheduleNextRun();
    }
  }, interval);
}

/**
 * Scans MongoDB for pending products, locks them atomically, and enriches them.
 */
export async function processEnrichmentBatch(manualBatchSize?: number): Promise<any[]> {
  const batchSize = manualBatchSize || parseInt(process.env.IMAGE_BATCH_SIZE || String(DEFAULT_BATCH_SIZE), 10);
  const processToken = new mongoose.Types.ObjectId().toString();
  const runResults: any[] = [];

  try {
    // 1. Find candidates to lock
    const candidates = await Product.find({
      imageStatus: "pending",
      upc: { $exists: true, $ne: "" },
    })
      .select("_id")
      .limit(batchSize)
      .lean();

    if (candidates.length === 0) {
      return [];
    }

    const candidateIds = candidates.map((c) => c._id);

    // 2. Lock them atomically using processToken
    const lockTime = new Date();
    await Product.updateMany(
      {
        _id: { $in: candidateIds },
        imageStatus: "pending",
      },
      {
        $set: {
          imageStatus: "processing",
          imageSource: `Processing:${processToken}`,
          imageLastChecked: lockTime,
        },
      }
    );

    // 3. Retrieve the locked products
    const lockedProducts = await Product.find({
      imageStatus: "processing",
      imageSource: `Processing:${processToken}`,
    });

    if (lockedProducts.length === 0) {
      return [];
    }

    console.log(`[Scheduler] Locked ${lockedProducts.length} products for process token: ${processToken}`);

    // 4. Process each product sequentially
    for (let i = 0; i < lockedProducts.length; i++) {
      const product = lockedProducts[i];
      try {
        console.log(
          `[Scheduler] [${i + 1}/${lockedProducts.length}] Processing "${product.name}" (UPC: ${product.upc})`
        );

        // A. Look up image URL
        const lookupResult = await findProductImage(product.upc, product.name, product.brand);

        if (lookupResult && lookupResult.imageUrl) {
          // B. Download and save the image locally
          console.log(`[Scheduler] Image resolved from ${lookupResult.source}. Starting download...`);
          const localPath = await downloadAndSaveImage(lookupResult.imageUrl, product.upc);

          // C. Update DB to completed
          await Product.updateOne(
            { _id: product._id },
            {
              $set: {
                images: [localPath],
                imageStatus: "completed",
                imageSource: lookupResult.source,
                imageLastChecked: new Date(),
              },
            }
          );

          console.log(`[Scheduler] Successfully enriched: "${product.name}" -> ${localPath}`);
          runResults.push({
            productId: product.id,
            name: product.name,
            status: "completed",
            imageUrl: localPath,
            source: lookupResult.source,
          });
        } else {
          // No image resolved
          await Product.updateOne(
            { _id: product._id },
            {
              $set: {
                imageStatus: "failed",
                imageSource: "None",
                imageLastChecked: new Date(),
              },
            }
          );

          console.log(`[Scheduler] Image lookup returned no results for "${product.name}"`);
          runResults.push({
            productId: product.id,
            name: product.name,
            status: "failed",
            reason: "No image found through lookup services",
          });
        }
      } catch (err: any) {
        console.error(`[Scheduler] Error processing product ${product.id}:`, err.message || err);

        const isRateLimit = err.message?.includes("Rate Limit Exceeded");

        if (isRateLimit) {
          console.warn("[Scheduler] Rate limit detected from API. Halting batch and releasing remaining products.");
          
          // Release remaining products in this batch back to pending
          const remainingProducts = lockedProducts.slice(i);
          const remainingIds = remainingProducts.map((p) => p._id);

          await Product.updateMany(
            {
              _id: { $in: remainingIds },
              imageStatus: "processing",
              imageSource: `Processing:${processToken}`,
            },
            {
              $set: {
                imageStatus: "pending",
                imageSource: "",
                imageLastChecked: null,
              },
            }
          );

          runResults.push({
            productId: product.id,
            name: product.name,
            status: "failed",
            reason: "API rate limit encountered. Batch paused.",
          });

          // Terminate batch execution
          break;
        } else {
          // Standard failure
          await Product.updateOne(
            { _id: product._id },
            {
              $set: {
                imageStatus: "failed",
                imageSource: `Failed: ${err.message || "Unknown error"}`,
                imageLastChecked: new Date(),
              },
            }
          );

          runResults.push({
            productId: product.id,
            name: product.name,
            status: "failed",
            reason: err.message || "Internal processing error",
          });
        }
      }
    }
  } catch (error: any) {
    console.error("[Scheduler] Critical error processing batch:", error.message || error);
  }

  return runResults;
}

/**
 * Recovers products that are stuck in the "processing" state.
 * This can happen if the server crashes or restarts during image downloads.
 */
async function resetStuckProducts() {
  try {
    const cutoffTime = new Date(Date.now() - STUCK_TIMEOUT_MS);

    const result = await Product.updateMany(
      {
        imageStatus: "processing",
        imageLastChecked: { $lt: cutoffTime },
      },
      {
        $set: {
          imageStatus: "pending",
          imageSource: "",
          imageLastChecked: null,
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(
        `[Scheduler] Successfully recovered ${result.modifiedCount} stuck processing jobs back to pending.`
      );
    }
  } catch (err: any) {
    console.error("[Scheduler] Error cleaning up stuck processing jobs:", err.message || err);
  }
}
