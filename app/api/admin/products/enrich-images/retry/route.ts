import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

/**
 * POST /api/admin/products/enrich-images/retry
 * Reset failed image status back to pending to be picked up by the background scheduler.
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // 1. Fetch all products marked as failed with valid UPC codes
    const failedProducts = await Product.find({
      imageStatus: "failed",
      upc: { $exists: true, $ne: "" },
    }).lean();

    if (failedProducts.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No failed image enrichments available to retry.",
        retried: 0,
      });
    }

    const productIds = failedProducts.map((p) => p._id);

    // 2. Reset database state in bulk
    const updateResult = await Product.updateMany(
      { _id: { $in: productIds } },
      { 
        $set: { 
          imageStatus: "pending",
          imageSource: "",
          imageLastChecked: null
        } 
      }
    );

    console.log(`[Retry] Reset ${updateResult.modifiedCount} failed image products back to pending.`);

    return NextResponse.json({
      success: true,
      message: `Successfully reset ${updateResult.modifiedCount} failed image products back to pending for background processing.`,
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
