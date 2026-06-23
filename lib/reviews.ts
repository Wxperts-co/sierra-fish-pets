import ProductModel from "@/models/Product";
import ReviewModel from "@/models/Review";

/**
 * Aggregates published reviews for a product and updates Product model rating & reviewCount.
 */
export async function updateProductRatingStats(productId: string) {
  const stats = await ReviewModel.aggregate([
    { $match: { productId, status: "published" } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const rating = stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0;
  const reviewCount = stats.length > 0 ? stats[0].reviewCount : 0;

  await ProductModel.updateOne(
    { id: productId },
    { $set: { rating, reviewCount } }
  );

  console.log(`[ReviewsStats] Updated Product "${productId}": Rating = ${rating}, Reviews Count = ${reviewCount}`);
}
