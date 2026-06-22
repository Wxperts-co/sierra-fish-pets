import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { processEnrichmentBatch } from "@/services/imageScheduler";

// GET /api/admin/products/enrich-images
// Retrieves stats about product image enrichment status
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const [
      totalProducts,
      productsWithImages,
      pendingEnrichment,
      failedEnrichment,
      processingEnrichment,
    ] = await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ images: { $exists: true, $not: { $size: 0 } } }),
      Product.countDocuments({ imageStatus: "pending" }),
      Product.countDocuments({ imageStatus: "failed" }),
      Product.countDocuments({ imageStatus: "processing" }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        productsWithImages,
        pendingEnrichment,
        failedEnrichment,
        processingEnrichment,
        productsMissingImages: totalProducts - productsWithImages,
      },
    });
  } catch (error: any) {
    console.error("GET /api/admin/products/enrich-images error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch enrichment stats" },
      { status: 500 }
    );
  }
}

// POST /api/admin/products/enrich-images
// Runs the image enrichment process for a batch of products synchronously
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json().catch(() => ({}));
    const batchSize = Math.min(Math.max(body.batchSize || 20, 1), 50);

    // Call the scheduler batch processing function
    const results = await processEnrichmentBatch(batchSize);

    const succeededCount = results.filter((r) => r.status === "completed").length;
    const failedCount = results.filter((r) => r.status === "failed").length;

    return NextResponse.json({
      success: true,
      message: `Enrichment task completed: ${succeededCount} succeeded, ${failedCount} failed.`,
      processed: results.length,
      succeeded: succeededCount,
      failed: failedCount,
      results,
    });
  } catch (error: any) {
    console.error("POST /api/admin/products/enrich-images error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to run image enrichment" },
      { status: 500 }
    );
  }
}
