"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";

import { Product } from "@/types";

import { Button } from "@/components/ui/button";

import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product.id));
  };

  const hasDiscount =
    product.compareAtPrice &&
    product.compareAtPrice > product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) /
          product.compareAtPrice!) *
          100
      )
    : 0;

  return (
    <div className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-lg">

      {/* Product Image */}
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">

          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain transition duration-300 group-hover:scale-105"
          />

          {/* Sale Badge */}
          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
              -{discountPercentage}%
            </span>
          )}

          {/* New Arrival Badge */}
          {product.isNewArrival && (
            <span className="absolute right-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
              New
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">

        {/* Category */}
        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
          {product.categorySlug}
        </p>

        {/* Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-2 min-h-[48px] font-medium hover:text-[#005AA9]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

          <span className="text-sm">
            {product.rating.toFixed(1)}
          </span>

          <span className="text-sm text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">

          <span className="text-lg font-bold text-[#005AA9]">
            ${product.price.toFixed(2)}
          </span>

          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.compareAtPrice?.toFixed(2)}
            </span>
          )}

        </div>

        {/* Stock */}
        <p
          className={`mt-2 text-sm ${
            product.stockStatus === "in_stock"
              ? "text-green-600"
              : product.stockStatus === "low_stock"
              ? "text-orange-500"
              : "text-red-500"
          }`}
        >
          {product.stockStatus.replace("_", " ")}
        </p>

        {/* Actions */}
        <div className="mt-4 flex gap-2">

          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-[#005AA9] hover:bg-[#004b8d]"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleWishlist}
          >
            <Heart className="h-4 w-4" />
          </Button>

        </div>

      </div>
    </div>
  );
}