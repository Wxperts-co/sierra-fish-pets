import { notFound } from "next/navigation";

import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import ReviewModel from "@/models/Review";
import type { Product } from "@/types";
import ProductActions from "@/components/shop/ProductActions";
import ProductCard from "@/components/shop/ProductCard";
import ProductDetailsTabs from "@/components/shop/ProductDetailsTabs";
import ProductImageViewer from "@/components/shop/ProductImageViewer";
import { Star, Check } from "lucide-react";


interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  await connectDB();

  const rawProduct = await ProductModel.findOne({ id }).lean();

  if (!rawProduct) {
    notFound();
  }

  // Cast lean Mongoose document to our frontend Product type and serialize to a plain object
  const product = JSON.parse(JSON.stringify(rawProduct)) as Product;

  // Fetch the single most recent published review for this product
  const rawRecentReview = await ReviewModel.findOne({
    productId: id,
    status: "published",
  })
    .sort({ createdAt: -1 })
    .lean();

  const recentReview = rawRecentReview ? JSON.parse(JSON.stringify(rawRecentReview)) : null;

  const rawRelated = await ProductModel.find(
    {
      categorySlug: product.categorySlug,
      id: { $ne: product.id },
    },
    {
      id: 1,
      name: 1,
      slug: 1,
      price: 1,
      compareAtPrice: 1,
      images: 1,
      rating: 1,
      reviewCount: 1,
      stockStatus: 1,
      categorySlug: 1,
      isNewArrival: 1,
      isFeatured: 1,
      isBestSeller: 1,
      createdAt: 1,
    }
  )
    .limit(4)
    .lean();

  const relatedProducts = JSON.parse(JSON.stringify(rawRelated)) as Product[];

  const hasDiscount =
    product.compareAtPrice &&
    product.compareAtPrice > product.price;

  const stockColor =
    product.stockStatus === "in_stock"
      ? "bg-green-100 text-green-700"
      : product.stockStatus === "low_stock"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="container mx-auto px-4 md:py-32 py-8">
      <div className="grid gap-12 lg:grid-cols-2">

        {/* Product Image Viewer */}
        <ProductImageViewer product={product} />

        {/* Product Details */}
        <div>

          {/* Category */}
          <span className="mb-2 inline-block text-sm font-medium uppercase tracking-wider text-[#005AA9]">
            {product.categorySlug?.replace("-", " ")}
          </span>

          {/* Title */}
          <h1 className="mb-4 text-2xl md:text-4xl font-bold text-slate-900">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="mb-5 flex items-center gap-2">
            <a href="#reviews-section" className="flex items-center gap-2 hover:underline select-none">
              <span className="text-yellow-500">
                ⭐ {product.rating.toFixed(1)}
              </span>

              <span className="text-gray-500">
                ({product.reviewCount} Reviews)
              </span>
            </a>
          </div>

          {/* Price */}
          <div className="mb-6 flex items-center gap-4">
            <span className="text-2xl md:text-3xl font-bold text-[#005AA9]">
              ${product.price.toFixed(2)}
            </span>

            {hasDiscount && (
              <span className="text-1xl text-gray-400 line-through">
                ${product.compareAtPrice?.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            <span
              className={`rounded-full px-4 py-2 md:text-sm text-[10px] font-medium ${stockColor}`}
            >
              {product.stockStatus
                .replace("_", " ")
                .toUpperCase()}
            </span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="leading-7 text-gray-600 text-[13px] md:text-[16px]">
              {product.description}
            </p>
          </div>

          

          {/* Buttons — client component wired to Redux */}
          <ProductActions product={product} />

          {/* Extra Info */}
          <div className="mt-10 space-y-3 border-t pt-6">
            <p>
              <span className="font-semibold">
                Product ID:
              </span>{" "}
              {product.id}
            </p>
            
            <p>
              <span className="font-semibold">
                Category:
              </span>{" "}
              {product.categorySlug}
            </p>

            {product.brand && (
              <p>
                <span className="font-semibold">
                  Brand:
                </span>{" "}
                {product.brand}
              </p>
            )}
          </div>
        </div>
      </div>

      <ProductDetailsTabs product={product} relatedProducts={relatedProducts} />

      {relatedProducts.length > 0 && (
        <div className="md:mt-20 border-t border-slate-100 pt-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#002244] mb-8">
            Related <span className="text-[#005AA9]">Products</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}