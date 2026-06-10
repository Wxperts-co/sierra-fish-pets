import Image from "next/image";
import { notFound } from "next/navigation";

import { getProductById } from "@/data";
import ProductActions from "@/components/shop/ProductActions";


interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const product = getProductById(id);

  if (!product) {
    notFound();
  }

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
    <div className="container mx-auto px-4 py-32">
      <div className="grid gap-12 lg:grid-cols-2">

        {/* Product Image */}
        <div className="relative overflow-hidden rounded-2xl border bg-white">
          <div className="relative h-[500px] w-full">
            <Image
              src={product.images?.[0]}
              alt={product.name}
              fill
              priority
              className="object-contain p-6"
            />
          </div>
        </div>

        {/* Product Details */}
        <div>

          {/* Category */}
          <span className="mb-2 inline-block text-sm font-medium uppercase tracking-wider text-[#005AA9]">
            {product.categorySlug?.replace("-", " ")}
          </span>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold text-slate-900">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="mb-5 flex items-center gap-2">
            <span className="text-yellow-500">
              ⭐ {product.rating}
            </span>

            <span className="text-gray-500">
              ({product.reviewCount} Reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6 flex items-center gap-4">
            <span className="text-4xl font-bold text-[#005AA9]">
              ${product.price.toFixed(2)}
            </span>

            {hasDiscount && (
              <span className="text-xl text-gray-400 line-through">
                ${product.compareAtPrice?.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            <span
              className={`rounded-full px-4 py-2 text-sm font-medium ${stockColor}`}
            >
              {product.stockStatus
                .replace("_", " ")
                .toUpperCase()}
            </span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="leading-7 text-gray-600">
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
    </div>
  );
}