import mongoose from "mongoose";
import Product from "@/models/Product";
import { findProductImage } from "@/services/imageLookup";
import { downloadAndSaveImage, getExistingLocalImage } from "@/services/imageDownloader";
import { classifyError, ErrorType } from "@/services/errorClassifier";


declare global {
  var imageEnrichmentSchedulerStarted: boolean | undefined;
  var imageEnrichmentActiveTimeout: NodeJS.Timeout | null | undefined;
}

const DEFAULT_BATCH_SIZE = 50;
const DEFAULT_INTERVAL_MS = 60000; // 1 minute
const STUCK_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

let isShuttingDown = false;
let isModuleInitialized = false;
let isProcessing = false;

/**
 * Initializes the background image enrichment scheduler.
 * Ensure any old scheduler instances are cleared (useful on Next.js hot-reloads).
 */
export function initImageScheduler() {
  if (isModuleInitialized) {
    return;
  }
  isModuleInitialized = true;

  if (global.imageEnrichmentActiveTimeout) {
    console.log("[Scheduler] Clearing existing background scheduler timeout for restart...");
    clearTimeout(global.imageEnrichmentActiveTimeout);
    global.imageEnrichmentActiveTimeout = null;
  }

  global.imageEnrichmentSchedulerStarted = true;
  isShuttingDown = false;
  console.log("[Scheduler] Initializing background image enrichment scheduler...");

  // Run stuck products cleanup immediately on boot
  resetStuckProducts().catch((err) => {
    console.error("[Scheduler] Initial stuck cleanup failed:", err);
  });

  // Start the periodic processing loop
  scheduleNextRun();
}

/**
 * Defensively shuts down the scheduler.
 */
export function shutdownImageScheduler() {
  isShuttingDown = true;
  if (global.imageEnrichmentActiveTimeout) {
    clearTimeout(global.imageEnrichmentActiveTimeout);
    global.imageEnrichmentActiveTimeout = null;
  }
  global.imageEnrichmentSchedulerStarted = false;
  console.warn("[Scheduler] Background image enrichment scheduler has been shut down defensively.");
}

/**
 * Schedules the next execution of the scheduler using recursive setTimeout
 * to prevent overlapping runs. Supports variable delays for active progress.
 */
function scheduleNextRun(delayMs?: number) {
  if (isShuttingDown) {
    console.log("[Scheduler] Skipping next run schedule because scheduler is shutting down.");
    return;
  }

  const defaultInterval = parseInt(process.env.IMAGE_PROCESS_INTERVAL || String(DEFAULT_INTERVAL_MS), 10);
  const currentDelay = delayMs !== undefined ? delayMs : defaultInterval;

  global.imageEnrichmentActiveTimeout = setTimeout(async () => {
    let nextDelay = defaultInterval;
    try {
      if (isShuttingDown) return;
      // 1. Clean up any stuck jobs
      await resetStuckProducts();

      // 2. Process next batch
      const results = await processEnrichmentBatch();

      // 3. Dynamic throttling: if we made progress and there are still pending products, schedule next soon
      if (results && results.length > 0) {
        const completedCount = results.filter((r) => r.status === "completed").length;
        if (completedCount > 0) {
          const remainingCount = await Product.countDocuments({
            $or: [
              { imageStatus: "pending" },
              {
                imageStatus: "failed",
                imageRetryCount: { $lt: 3 },
                imageFailureType: "temporary"
              }
            ]
          });
          if (remainingCount > 0) {
            console.log(`[Scheduler] Active progress made (${completedCount} completed). ${remainingCount} products still pending. Scheduling next batch in 5 seconds.`);
            nextDelay = 5000; // 5 seconds
          }
        }
      }
    } catch (error: any) {
      console.error("[Scheduler] Error in background scheduler loop:", error.message || error);
    } finally {
      global.imageEnrichmentActiveTimeout = null;
      if (!isShuttingDown) {
        scheduleNextRun(nextDelay);
      }
    }
  }, currentDelay);
}

/**
 * Triggers the scheduler to run a batch immediately if it is idle.
 */
export function triggerEnrichment() {
  // Ensure the scheduler is initialized
  if (!global.imageEnrichmentSchedulerStarted) {
    console.log("[Scheduler] triggerEnrichment: Scheduler not started, initializing...");
    initImageScheduler();
    return;
  }

  // If there's an active timeout waiting for the next run, clear it and run immediately
  if (global.imageEnrichmentActiveTimeout) {
    console.log("[Scheduler] triggerEnrichment: Manual trigger received. Clearing active timeout to run immediately...");
    clearTimeout(global.imageEnrichmentActiveTimeout);
    global.imageEnrichmentActiveTimeout = null;
    scheduleNextRun(0); // Run immediately (0ms delay)
  } else {
    console.log("[Scheduler] triggerEnrichment: Manual trigger received, but scheduler is already processing or starting. Skipping duplicate trigger.");
  }
}

/**
 * Scans MongoDB for pending products, locks them atomically, and enriches them.
 */
export async function processEnrichmentBatch(manualBatchSize?: number): Promise<any[]> {
  if (isProcessing) {
    console.log("[Scheduler] Enrichment batch is already processing. Skipping concurrent execution.");
    return [];
  }
  isProcessing = true;
  try {
    const batchSize = manualBatchSize || parseInt(process.env.IMAGE_BATCH_SIZE || String(DEFAULT_BATCH_SIZE), 10);
  const processToken = new mongoose.Types.ObjectId().toString();
  const runResults: any[] = [];

  let totalProcessed = 0;
  let totalCompleted = 0;
  let totalFailed = 0;
  let totalRetried = 0;
  let totalSkipped = 0;

  try {
    // 1. Find candidates to lock: pending products OR failed products with temporary failure and < 3 retries
    // Order deterministically by _id ascending
    const candidates = await Product.find({
      $or: [
        { imageStatus: "pending" },
        {
          imageStatus: "failed",
          imageRetryCount: { $lt: 3 },
          imageFailureType: "temporary"
        }
      ]
    })
      .select("_id")
      .sort({ _id: 1 })
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
        $or: [
          { imageStatus: "pending" },
          {
            imageStatus: "failed",
            imageRetryCount: { $lt: 3 },
            imageFailureType: "temporary"
          }
        ],
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

    // 4. Process each product sequentially (sequential, no Promise.all)
    for (let i = 0; i < lockedProducts.length; i++) {
      if (isShuttingDown) {
        console.warn("[Scheduler] Shutting down batch processing midway due to server shutdown.");
        break;
      }


      const product = lockedProducts[i];
      let lookupResult: any = null;
      const imageKey = product.upc ? product.upc.trim() : product.id;

      try {
        console.log(
          `[Scheduler] [${i + 1}/${lockedProducts.length}] Processing Product ID: ${product._id} | UPC: ${product.upc || "None"} | Name: "${product.name}" | Previous Retry Count: ${product.imageRetryCount || 0}`
        );

        // A. Duplicate Protection check (Check if file already exists locally for the same UPC/Key)
        const existingLocal = getExistingLocalImage(imageKey);
        if (existingLocal) {
          console.log(`[Scheduler] Duplicate protection: Reusing local file for Key ${imageKey} at ${existingLocal}`);
          await Product.updateOne(
            { _id: product._id },
            {
              $set: {
                images: [existingLocal],
                imageStatus: "completed",
                imageSource: "Local Reuse",
                imageLastChecked: new Date(),
                imageRetryCount: 0,
                imageFailureType: ""
              }
            }
          );
          
          totalCompleted++;
          totalSkipped++; // skipped downloading
          
          runResults.push({
            productId: product.id,
            name: product.name,
            status: "completed",
            imageUrl: existingLocal,
            source: "Local Reuse"
          });
          continue;
        }

        totalProcessed++;

        // B. Look up image URL (pass original upc string)
        lookupResult = await findProductImage(product.upc, product.name, product.brand);

        if (lookupResult && lookupResult.imageUrl) {
          console.log(`[Scheduler] Image resolved from ${lookupResult.source}. Writing local file...`);
          // C. Download and save the image locally (pass pre-downloaded validated buffer if present)
          const localPath = await downloadAndSaveImage(
            lookupResult.imageUrl,
            imageKey,
            lookupResult.validatedData,
            lookupResult.mimeType
          );

          // D. Update DB to completed
          await Product.updateOne(
            { _id: product._id },
            {
              $set: {
                images: [localPath],
                imageStatus: "completed",
                imageSource: lookupResult.source,
                imageLastChecked: new Date(),
                imageRetryCount: 0,
                imageFailureType: ""
              },
            }
          );

          console.log(`[Scheduler] Success: Product ID: ${product._id} | UPC: ${product.upc} | Source: ${lookupResult.source} | Saved Path: ${localPath}`);
          totalCompleted++;

          runResults.push({
            productId: product.id,
            name: product.name,
            status: "completed",
            imageUrl: localPath,
            source: lookupResult.source,
          });
        } else {
          // No image resolved (Permanent failure / not found)
          const fallbackPath = getCategoryFallback(product.name);
          await Product.updateOne(
            { _id: product._id },
            {
              $set: {
                images: [fallbackPath],
                imageStatus: "failed",
                imageFailureType: "permanent",
                imageSource: "None",
                imageLastChecked: new Date(),
                imageRetryCount: 0
              },
            }
          );

          console.log(`[Scheduler] Failure: Product ID: ${product._id} | UPC: ${product.upc} | Source: None | Reason: No image found through lookup services`);
          totalFailed++;

          runResults.push({
            productId: product.id,
            name: product.name,
            status: "failed",
            reason: "No image found through lookup services",
          });
        }
      } catch (err: any) {
        const errorType = classifyError(err);
        const retryCount = product.imageRetryCount || 0;
        const errorMsg = err.message || "Unknown error";
        const currentSource = lookupResult?.source || "Lookup Service";

        console.log(`[Scheduler] Failure: Product ID: ${product._id} | UPC: ${product.upc} | Source: ${currentSource} | Current Retry Count: ${retryCount} | Error Type: ${errorType} | Reason: ${errorMsg}`);

        if (errorType === ErrorType.COOLDOWN) {
          // Cooldown bypass - release lock without changing retry count
          await Product.updateOne(
            { _id: product._id },
            {
              $set: {
                imageStatus: "pending",
                imageFailureType: "",
                imageSource: `Skipped (Cooldown): ${errorMsg}`,
                imageLastChecked: new Date(),
              },
            }
          );
          totalSkipped++;

          runResults.push({
            productId: product.id,
            name: product.name,
            status: "skipped",
            reason: errorMsg,
          });
        } else if (errorType === ErrorType.RATE_LIMITED || errorType === ErrorType.TEMPORARY) {
          const nextRetryCount = retryCount + 1;
          if (nextRetryCount >= 3) {
            // Reached max retries, mark as permanent failure
            await Product.updateOne(
              { _id: product._id },
              {
                $set: {
                  imageStatus: "failed",
                  imageFailureType: "permanent",
                  imageSource: errorType === ErrorType.RATE_LIMITED ? `Failed (Rate Limited): ${errorMsg}` : `Failed (Max Retries): ${errorMsg}`,
                  imageLastChecked: new Date(),
                  imageRetryCount: nextRetryCount
                },
              }
            );
            totalFailed++;
          } else {
            // Mark as temporary failure, eligible for retry
            await Product.updateOne(
              { _id: product._id },
              {
                $set: {
                  imageStatus: "failed",
                  imageFailureType: "temporary",
                  imageSource: errorType === ErrorType.RATE_LIMITED ? `Failed (Rate Limited): ${errorMsg}` : `Failed (Temporary): ${errorMsg}`,
                  imageLastChecked: new Date(),
                  imageRetryCount: nextRetryCount
                },
              }
            );
            totalRetried++;
          }

          runResults.push({
            productId: product.id,
            name: product.name,
            status: "failed",
            reason: errorMsg,
          });
        } else {
          // Permanent failure
          const nextRetryCount = retryCount + 1;
          await Product.updateOne(
            { _id: product._id },
            {
              $set: {
                imageStatus: "failed",
                imageFailureType: "permanent",
                imageSource: `Failed: ${errorMsg}`,
                imageLastChecked: new Date(),
                imageRetryCount: nextRetryCount
              },
            }
          );
          totalFailed++;

          runResults.push({
            productId: product.id,
            name: product.name,
            status: "failed",
            reason: errorMsg,
          });
        }
      }
    }
  } catch (error: any) {
    console.error("[Scheduler] Critical error processing batch:", error.message || error);
  }

  // Summary observability logging
  console.log(`[Scheduler] Batch enrichment run finished for token: ${processToken}
  - Total Processed: ${totalProcessed}
  - Total Completed: ${totalCompleted}
  - Total Failed (Permanent): ${totalFailed}
  - Total Retried (Temporary): ${totalRetried}
  - Total Skipped/Released: ${totalSkipped}`);

  return runResults;
  } finally {
    isProcessing = false;
  }
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
          imageFailureType: "",
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

function getCategoryFallback(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("dog")) {
    return "/images/products/dog1.avif";
  }
  if (lower.includes("cat")) {
    return "/images/products/cat1.avif";
  }
  if (lower.includes("fish") || lower.includes("aquarium") || lower.includes("aqua") || lower.includes("aquatic")) {
    return "/images/products/aqua1.avif";
  }
  if (lower.includes("bird")) {
    return "/images/products/bird/bird1.avif";
  }
  return "/placeholder-product.png";
}
