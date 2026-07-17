"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";

import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleWishlistDb } from "@/store/slices/wishlistSlice";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart(product));
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleWishlistDb(product.id));
  };

  const wishlist = useAppSelector((state) => state.wishlist.productIds);
  const isWished = wishlist.includes(product.id);

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
      ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
      100
    )
    : 0;

  const stockColor =
    product.stockStatus === "in_stock"
      ? "text-emerald-500"
      : product.stockStatus === "low_stock"
        ? "text-amber-500"
        : "text-red-500";

  const stockLabel =
    product.stockStatus === "in_stock"
      ? "In Stock"
      : product.stockStatus === "low_stock"
        ? "Low Stock"
        : "Out of Stock";

  // Category specific fallback images
  const getFallbackImage = () => {
    return "/placeholderimg.png";
  };

  return (
    <div
      className={cn(
        "relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2",
        className
      )}
      onMouseEnter={() => {
        if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
          setHovered(true);
        }
      }}
      onMouseLeave={() => setHovered(false)}
    >

      {/* ── Image flip container ── */}
      <div className="relative w-full h-[220px]" style={{ perspective: "900px" }}>

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-[#e8473f] px-2.5 py-1 text-[11px] font-bold text-white leading-none shadow">
            -{discountPercentage}%
          </span>
        )}
        {/* New badge */}
        {product.isNewArrival && (
          <span className="absolute right-3 top-3 z-20 rounded-full bg-[#005AA9] px-2.5 py-1 text-[11px] font-bold text-white leading-none shadow">
            New
          </span>
        )}

        {/* Flip inner wrapper */}
        <div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transform: hovered ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1)",
          }}
        >
          {/* FRONT – product image */}
          <div
            className="absolute inset-0 rounded-t-2xl overflow-hidden bg-[#f8f9fb]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Link href={`/product/${product.id}`} className="relative block w-full h-full">
              <img
                src={
                  imgError || !product.images?.[0]
                    ? getFallbackImage()
                    : (product.images[0].startsWith("http") || product.images[0].startsWith("/")
                      ? product.images[0]
                      : `/${product.images[0]}`)
                }
                alt={product.name}
                className={`object-contain p-1 w-full h-full transition-transform duration-500 ease-out ${hovered ? "scale-108" : "scale-100"
                  }`}
                onError={() => setImgError(true)}
              />
            </Link>
          </div>

          {/* BACK – action overlay */}
          <div
            className="absolute inset-0 rounded-t-2xl flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-[#004a8f] to-[#006fd6]"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Subtle decorative ring */}
            <div className="absolute inset-3 rounded-xl border border-white/10 pointer-events-none" />

            {/* Add to Cart — primary solid button */}
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2.5 rounded-xl bg-white px-7 py-3 text-[15px] font-bold text-[#005AA9] shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>

            {/* Secondary actions */}
            <div className="flex items-center gap-4">
              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                className="flex flex-col items-center gap-1 group/btn"
                title="Add to Wishlist"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white text-[#e8473f] shadow-md group-hover/btn:scale-110 active:scale-95 transition-all duration-200">
                  <Heart
                    className={`h-5 w-5 transition-colors duration-200 ${isWished ? "text-[#e8473f] fill-[#e8473f]" : "text-[#e8473f]"
                      }`}
                  />
                </span>
                <span className="text-[11px] font-semibold text-white/90 ">Wishlist</span>
              </button>

              {/* Quick View */}
              <Link
                href={`/product/${product.id}`}
                className="flex flex-col items-center gap-1 group/btn"
                title="View Product"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white text-[#005AA9] shadow-md group-hover/btn:scale-110 active:scale-95 transition-all duration-200">
                  <Eye className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-semibold text-white/90">Quick View</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Product info ── */}
      <div className="flex flex-col flex-1 p-4 pt-3">

        {/* Category tag */}
        <span className="text-[10px] uppercase tracking-widest font-semibold text-[#005AA9]/60 mb-1">
          {product.categorySlug?.replace(/-/g, " ")}
        </span>

        {/* Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 min-h-[40px] hover:text-[#005AA9] transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Star rating */}
        <div className="mt-2 flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < Math.round(product.rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
                }`}
            />
          ))}
          <span className="ml-1.5 text-xs text-gray-400">
            ({product.reviewCount})
          </span>
        </div>

        {/* Divider */}
        <div className="my-1 h-px bg-gray-100" />

        {/* Price + stock row */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#005AA9]">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ${product.compareAtPrice?.toFixed(2)}
              </span>
            )}
          </div>
          <span className={`text-xs  font-semibold ${stockColor}`}>
            {stockLabel}
          </span>
        </div>



      </div>
    </div>
  );
}
