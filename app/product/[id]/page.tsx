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
import { isAquaDreamProduct, isPickupOnlyProduct, isFilterProduct, isLivePlantProduct } from "@/lib/shippingAndTax";


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

  const [rawProduct, rawRecentReview] = await Promise.all([
    ProductModel.findOne({ id }).lean(),
    ReviewModel.findOne({
      productId: id,
      status: "published",
    })
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  if (!rawProduct) {
    notFound();
  }

  // Cast lean Mongoose document to our frontend Product type and serialize to a plain object
  const product = JSON.parse(JSON.stringify(rawProduct)) as Product;
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

          {/* Stock & Shipping Information */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-4 py-2 md:text-sm text-[10px] font-medium ${stockColor}`}
            >
              {product.stockStatus
                .replace("_", " ")
                .toUpperCase()}
            </span>

            {isPickupOnlyProduct(product) ? (
              <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-4 py-2 text-xs md:text-sm font-bold flex items-center gap-1.5">
                🏪 In-Store Pickup Only (Renton, WA)
              </span>
            ) : isAquaDreamProduct(product) ? (
              <span className="rounded-full bg-blue-100 text-blue-900 border border-blue-300 px-4 py-2 text-xs md:text-sm font-bold flex items-center gap-1.5">
                🚚 Free Shipping (Drop-Ship Direct from Manufacturer)
              </span>
            ) : isFilterProduct(product) ? (
              <span className="rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 px-4 py-2 text-xs md:text-sm font-bold flex items-center gap-1.5">
                🚚 Free Shipping (Filters & Systems)
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-4 py-2 text-xs md:text-sm font-semibold flex items-center gap-1.5">
                🚚 Standard Tiered Freight Shipping / Store Pickup
              </span>
            )}
          </div>

          {/* Live Plant Special Requirement Notice */}
          {isLivePlantProduct(product) && (
            <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs md:text-sm font-semibold text-emerald-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                🌱 Live Plant Shipping Notice
              </p>
              <p className="text-emerald-700 text-xs font-normal">
                Requires <strong>2nd Day Shipping</strong> to ensure healthy arrival. Weight: 0.25 lbs | Package Size: 6&quot; x 2&quot; x 2&quot;.
              </p>
            </div>
          )}

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