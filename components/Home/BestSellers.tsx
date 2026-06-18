"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
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

// ─── Custom Flat Product Card matching reference image ───
function BestSellerCard({ product, index }: { product: Product; index: number }) {
  const dispatch = useAppDispatch();
  const [imgError, setImgError] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleWishlistDb(product.id));
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
    switch (product.categorySlug) {
      case "cat":
        return "/images/products/cat1.avif";
      case "aquatic":
        return "/images/products/aqua1.avif";
      case "dog":
      default:
        return "/images/products/dog1.avif";
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-slate-100/80 overflow-hidden transition-all duration-300 hover:shadow-lg">
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
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition-colors hover:border-[#005AA9] hover:text-[#005AA9]"
          aria-label={`Compare ${product.name}`}
        >
          <Shuffle className="h-4 w-4" />
        </button>
        <Link
          href={`/product/${product.id}`}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition-colors hover:border-[#005AA9] hover:text-[#005AA9]"
          aria-label={`Quick view ${product.name}`}
        >
          <Search className="h-4 w-4" />
        </Link>
      </div>

      {/* Product Image Area - takes up majority of card */}
      <div className="relative h-[240px] w-full bg-white">
        {hasDiscount && (
          <span className="absolute top-3 right-3 z-20 rounded bg-[#FF9800] px-2 py-1 text-xs font-bold text-white shadow-sm">
            -{discountPercentage}%
          </span>
        )}

        <Link href={`/product/${product.id}`} className="block w-full h-full relative overflow-hidden">
          <motion.div
            initial={{ x: 120, opacity: 0, scale: 0.95 }}
            whileInView={{ x: 0, opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{
              type: "spring",
              stiffness: 60,
              damping: 14,
              delay: index * 0.08,
            }}
            className="w-full h-full relative"
          >
            <Image
              src={imgError ? getFallbackImage() : product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
              onError={() => setImgError(true)}
              priority
            />
          </motion.div>
        </Link>
      </div>

      {/* Text Content at Bottom */}
      <div className="flex flex-col p-4 gap-3">
        {/* Rating stars */}
        <div className="flex items-center justify-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.round(product.rating)
                  ? "fill-[#FFB300] text-[#FFB300]"
                  : "fill-slate-200 text-slate-200"
              }`}
            />
          ))}
        </div>

        {/* Product Title */}
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-slate-700 text-center line-clamp-2 hover:text-[#005AA9] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="flex items-center justify-center gap-2">
          {hasDiscount && (
            <span className="text-xs text-slate-400 line-through">
              ${product.compareAtPrice?.toFixed(2)}
            </span>
          )}
          <span className="text-lg font-bold text-[#002244]">
            ${product.price.toFixed(2)}
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
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          let sellers = (data.products as Product[]).filter(
            (p) => p.isBestSeller
          );
          // Fallback: If no products are flagged as isBestSeller, use products with the highest review count as a proxy
          if (sellers.length === 0) {
            sellers = [...(data.products as Product[])]
              .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
              .slice(0, 10);
          }
          setBestSellers(sellers);
        }
      })
      .catch((err) => console.error("BestSellers fetch error:", err));
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
    <section className="py-8 bg-[#fbf9f6] border-b border-slate-100">
      <div className="container mx-auto px-4">
        {/* Centered Heading */}
        <div className="text-center mb-4">
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
