"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  Heart,
  Search,
  ShoppingCart,
  Shuffle,
  Star,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { Product } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import { toggleWishlistDb } from "@/store/slices/wishlistSlice";
import { motion } from "framer-motion";
import { addToCart } from "@/store/slices/cartSlice";

// ─── Custom Flat Product Card matching reference image ───
function BestSellerCard({ product, index }: { product: Product; index: number }) {
  const dispatch = useAppDispatch();
  const [imgError, setImgError] = useState(false);

 

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleWishlistDb(product.id));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
  e.preventDefault();
  dispatch(addToCart(product));
};

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100
      )
    : 0;

  const getFallbackImage = () => {
    return "/placeholderimg.png";
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-slate-200 hover:border-[#005AA9]/40 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="pointer-events-none absolute left-3 top-5 z-30 flex -translate-x-8 flex-col gap-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
        <Link
          href={`/product/${product.id}`}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition-colors hover:border-[#005AA9] hover:text-[#005AA9]"
          aria-label={`View ${product.name}`}
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={handleWishlist}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition-colors hover:border-[#e8473f] hover:text-[#e8473f]"
          aria-label={`Add ${product.name} to wishlist`}
        >
          <Heart className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleAddToCart}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition-colors hover:border-[#005AA9] hover:text-[#005AA9]"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart  className="h-4 w-4" />
        </button>
       
      </div>

      {/* Product Image Area - focused and proportional */}
      <div className="relative h-[200px] w-full bg-slate-50/30">
        {/* Best Seller Badge */}
        <span className="absolute top-3 left-3 z-20 rounded-full bg-[#005AA9] px-2.5 py-1 text-[11px] font-bold text-white leading-none shadow-sm flex items-center gap-1">
          <Flame className="h-3 w-3 text-amber-300 fill-amber-300" />
          Best Seller
        </span>

        {hasDiscount && (
          <span className="absolute top-3 right-3 z-20 rounded bg-[#FF9800] px-2 py-1 text-xs font-bold text-white shadow-sm">
            -{discountPercentage}%
          </span>
        )}

        <Link href={`/product/${product.id}`} className="block w-full h-full relative overflow-hidden">
          <motion.div
            initial={{ x: 120, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 60,
              damping: 14,
              delay: index * 0.08,
            }}
            className="w-full h-full relative flex items-center justify-center p-2"
          >
            <img
              src={
                imgError || !product.images?.[0] || product.images[0] === "/placeholder-product.png" || product.images[0] === "placeholder-product.png"
                  ? getFallbackImage()
                  : (product.images[0].startsWith("http") || product.images[0].startsWith("/")
                      ? product.images[0]
                      : `/${product.images[0]}`)
              }
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-108"
              onError={() => setImgError(true)}
            />
          </motion.div>
        </Link>
      </div>

      {/* Text Content at Bottom */}
      <div className="flex flex-col flex-1 p-4 text-left bg-white border-t border-slate-100">
        {/* Category tag */}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64B5F6]">
          {product.categorySlug ? product.categorySlug.replace(/-/g, " ") : "UNCATEGORIZED"}
        </span>

        {/* Product Title */}
        <Link href={`/product/${product.id}`} className="mt-1">
          <h3 className="text-sm font-medium text-slate-800 line-clamp-2 min-h-[40px] hover:text-[#005AA9] transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating stars & review count */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.round(product.rating || 0)
                    ? "fill-[#FFB300] text-[#FFB300]"
                    : "fill-slate-200 text-slate-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400 font-normal">
            ({product.reviewCount ?? 0})
          </span>
        </div>

        {/* Horizontal Divider */}
        <div className="my-2.5 h-px bg-slate-100" />

        {/* Price & Stock status row */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#005AA9]">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">
                ${product.compareAtPrice?.toFixed(2)}
              </span>
            )}
          </div>
          <span
            className={`text-xs font-medium ${
              product.stockStatus === "out_of_stock" || (product.stockCount !== undefined && product.stockCount <= 0)
                ? "text-[#FF4A4A]"
                : product.stockStatus === "low_stock"
                ? "text-amber-500"
                : "text-emerald-500"
            }`}
          >
            {product.stockStatus === "out_of_stock" || (product.stockCount !== undefined && product.stockCount <= 0)
              ? "Out of Stock"
              : product.stockStatus === "low_stock"
              ? "Low Stock"
              : "In Stock"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── BestSellers (Redesigned Section with Embla Carousel) ───
export default function BestSellers() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Fetch best sellers from DB via API
  useEffect(() => {
    const loadBestSellers = async () => {
      try {
        // 1. Try fetching products with isBestSeller flag
        const res = await fetch("/api/products?isBestSeller=true&limit=10");
        const data = await res.json();

        if (data.success && data.products && data.products.length > 0) {
          setBestSellers(data.products);
          return;
        }

        // 2. Fallback: If no products are flagged as isBestSeller, fetch products sorted by review count
        const fallbackRes = await fetch("/api/products?sort=best-selling&limit=10");
        const fallbackData = await fallbackRes.json();
        if (fallbackData.success) {
          setBestSellers(fallbackData.products);
        }
      } catch (err) {
        console.error("BestSellers fetch error:", err);
      }
    };
    loadBestSellers();
  }, []);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  if (!bestSellers.length) {
    return null;
  }

  return (
    <section className="py-8 md:py-12 bg-[#fbf9f6] border-b border-slate-100">
      <div className="container mx-auto px-4">
        {/* Centered Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-5xl font-extrabold leading-tight font-lato">
            <span className="text-[#005AA9]">Best</span> <span className="text-[#002244]">Sellers</span>
          </h2>
        </div>

        {/* Embla Carousel Viewport */}
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: false }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {bestSellers.map((product, index) => (
              <CarouselItem
                key={product.id}
                className="pl-4 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <BestSellerCard product={product} index={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Centered Navigation Buttons Below Carousel */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={scrollPrev}
            disabled={!canPrev}
            className="w-12 h-12 rounded-full border border-slate-200 bg-white hover:bg-[#005AA9] hover:border-[#005AA9] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-sm hover:shadow-lg hover:scale-110 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canNext}
            className="w-12 h-12 rounded-full border border-slate-200 bg-white hover:bg-[#005AA9] hover:border-[#005AA9] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-sm hover:shadow-lg hover:scale-110 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
