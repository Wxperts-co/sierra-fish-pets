import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { clearAllCooldowns } from "@/services/rateLimitManager";

/**
 * POST /api/admin/products/enrich-images/retry
 * Reset failed image status and cooldown-skipped status back to pending, clear cooldowns, and trigger background enrichment.
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // 1. Fetch all products marked as failed, or pending products that were skipped due to cooldown
    const candidates = await Product.find({
      $or: [
        { imageStatus: "failed" },
        { imageStatus: "pending", imageSource: { $regex: /Cooldown/i } }
      ],
      upc: { $exists: true, $ne: "" },
    }).lean();

    // Clear all in-memory cooldowns
    clearAllCooldowns();

    if (candidates.length === 0) {
      // Trigger background enrichment batch immediately in case there are other pending items
      import("@/services/imageScheduler").then(({ triggerEnrichment }) => {
        triggerEnrichment();
      }).catch((err) => {
        console.error("[Retry] Failed to import scheduler for immediate enrichment:", err);
      });

      return NextResponse.json({
        success: true,
        message: "No failed or cooldown-skipped image enrichments available to reset. Cooldowns cleared, background scheduler restarted.",
        retried: 0,
      });
    }

    const productIds = candidates.map((p) => p._id);

    // 2. Reset database state in bulk
    const updateResult = await Product.updateMany(
      { _id: { $in: productIds } },
      { 
        $set: { 
          imageStatus: "pending",
          imageSource: "",
          imageLastChecked: null,
          imageFailureType: ""
        } 
      }
    );

    console.log(`[Retry] Reset ${updateResult.modifiedCount} failed/cooldown-skipped image products back to pending.`);

    // Trigger background enrichment batch immediately
    import("@/services/imageScheduler").then(({ triggerEnrichment }) => {
      triggerEnrichment();
    }).catch((err) => {
      console.error("[Retry] Failed to import scheduler for immediate enrichment:", err);
    });

    return NextResponse.json({
      success: true,
      message: `Successfully reset ${updateResult.modifiedCount} image products back to pending and cleared cooldowns for background processing.`,
      retried: updateResult.modifiedCount,
    });
  } catch (error: any) {
    console.error("[Retry API] Execution error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to retry image enrichment tasks." },
      { status: 500 }
    );
  }
}
