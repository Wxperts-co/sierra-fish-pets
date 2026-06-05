"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
  ShoppingCart,
  Shuffle,
  Star,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getNewArrivals } from "@/data/products";
import { Product } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";

// ─── Custom Flat Product Card for New Arrivals ───
function NewArrivalCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart(product));
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleWishlist(product.id));
  };

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  const getFallbackImage = () => {
    switch (product.categorySlug) {
      case "cat":
        return "/images/products/cat2.avif";
      case "aquatic":
        return "/images/products/aqua2.avif";
      case "dog":
      default:
        return "/images/products/dog2.avif";
    }
  };

  return (
    <div className="group relative flex flex-col rounded-xl border border-[#d9ecff] bg-[#f4faff] p-4 shadow-sm transition-all duration-300 hover:border-[#b9ddff] hover:shadow-lg h-[390px] justify-between">
      <div className="pointer-events-none absolute right-3 top-9 z-30 flex translate-x-8 flex-col gap-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
        <Link
          href={`/product/${product.id}`}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition-colors hover:border-[#005AA9] hover:text-[#005AA9]"
          aria-label={`View ${product.name}`}
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={handleWishlist}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition-colors hover:border-[#e8473f] hover:text-[#e8473f]"
          aria-label={`Add ${product.name} to wishlist`}
        >
          <Heart className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition-colors hover:border-[#005AA9] hover:text-[#005AA9]"
          aria-label={`Compare ${product.name}`}
        >
          <Shuffle className="h-4 w-4" />
        </button>
        <Link
          href={`/product/${product.id}`}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition-colors hover:border-[#005AA9] hover:text-[#005AA9]"
          aria-label={`Quick view ${product.name}`}
        >
          <Search className="h-4 w-4" />
        </Link>
      </div>

      {/* Badges on Corners */}
      {/* Top Left: New and Sale badges */}
      <div className="absolute top-3.5 left-3.5 z-20 flex flex-col gap-1.5">
        {product.isNewArrival && (
          <span className="px-2.5 py-1 rounded-full bg-[#00AEEF] text-[9px] font-bold text-white shadow-sm uppercase tracking-wider leading-none">
            New
          </span>
        )}
        {hasDiscount && (
          <span className="px-2.5 py-1 rounded-full bg-[#E53935] text-[9px] font-bold text-white shadow-sm uppercase tracking-wider leading-none">
            Sale
          </span>
        )}
      </div>

      {/* Top Right: Hot badge */}
      <div className="absolute top-3.5 right-3.5 z-20">
        {product.isBestSeller && (
          <span className="px-2.5 py-1 rounded-full bg-[#FF9800] text-[9px] font-bold text-white shadow-sm uppercase tracking-wider leading-none">
            Hot
          </span>
        )}
      </div>

      {/* Product Image Area */}
      <div 
        className={`relative w-full h-[180px] bg-white flex items-center justify-center mb-3 overflow-hidden rounded-lg border border-white/80 shadow-[inset_0_0_0_1px_rgba(0,90,169,0.04)] ${isHovered ? 'animate-flash' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/product/${product.id}`} className="block w-full h-full relative">
          <Image
            src={imgError ? getFallbackImage() : product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            priority
          />
        </Link>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1">
        {/* Brand Name */}
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          {product.brand}
        </span>

        {/* Title */}
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug hover:text-[#005AA9] transition-colors mb-2 min-h-[40px]">
            {product.name}
          </h3>
        </Link>

        {/* Rating stars + review count */}
        <div className="flex items-center gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < Math.round(product.rating)
                  ? "fill-[#FFB300] text-[#FFB300]"
                  : "fill-slate-200 text-slate-200"
              }`}
            />
          ))}
          <span className="ml-1.5 text-[11px] text-slate-400 font-medium">
            ({product.reviewCount})
          </span>
        </div>
      </div>

      {/* Pricing Styling & Cart Button */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#d9ecff]">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">
            ${product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.compareAtPrice?.toFixed(2)}
            </span>
          )}
        </div>

        {/* Cart Action Button */}
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 hover:border-[#005AA9] hover:bg-[#005AA9]/5 text-slate-500 hover:text-[#005AA9] transition-all cursor-pointer"
          title="Add to Cart"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── NewArrivals (redesigned client section) ───
export default function NewArrivals() {
  const newArrivals = getNewArrivals();
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Autoplay Plugin config
  const autoplay = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
    autoplay.current.reset();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
    autoplay.current.reset();
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

  if (!newArrivals.length) {
    return null;
  }

  // Animation variants
  const sectionReveal: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 1, 0.5, 1] as const,
      },
    },
  };

  const titleAnim: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const cardsContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardFadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionReveal}
      className="relative bg-white overflow-hidden border-b border-slate-100 py-12"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Centered Heading */}
        <div className="text-center mb-16 relative">
          {/* Subtle pet paw watermark background */}
          <div className="absolute inset-0 flex items-center justify-center -z-10 select-none pointer-events-none -translate-y-4">
            <svg
              className="w-44 h-44 text-[#005AA9] opacity-[0.03]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 14c-2.3 0-4.2 1.9-4.2 4.2 0 2.3 1.9 4.2 4.2 4.2s4.2-1.9 4.2-4.2c0-2.3-1.9-4.2-4.2-4.2zm-4.7-4.5c-.8 0-1.5.8-1.5 1.7 0 .9.7 1.7 1.5 1.7s1.5-.8 1.5-1.7c0-.9-.7-1.7-1.5-1.7zm9.4 0c-.8 0-1.5.8-1.5 1.7 0 .9.7 1.7 1.5 1.7s1.5-.8 1.5-1.7c0-.9-.7-1.7-1.5-1.7zm-6.7-4c-.7 0-1.3.7-1.3 1.5 0 .8.6 1.5 1.3 1.5s1.3-.7 1.3-1.5c0-.8-.6-1.5-1.3-1.5zm4 0c-.7 0-1.3.7-1.3 1.5 0 .8.6 1.5 1.3 1.5s1.3-.7 1.3-1.5c0-.8-.6-1.5-1.3-1.5z" />
            </svg>
          </div>

          <motion.div variants={titleAnim}>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B6B61] mb-2 inline-block">
              NEW ARRIVALS
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight font-lato">
              <span className="text-[#FF5A36]">New</span> <span className="text-[#002244]">Trending Collection</span>
            </h2>
          </motion.div>
        </div>

        {/* Carousel Content */}
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          plugins={[autoplay.current]}
          className="w-full"
        >
          <motion.div variants={cardsContainer}>
            <CarouselContent className="-ml-4">
              {newArrivals.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4"
                >
                  <motion.div variants={cardFadeUp} className="h-full">
                    <NewArrivalCard product={product} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </motion.div>
        </Carousel>

        {/* Centered Navigation Buttons Below Carousel */}
        <div className="flex items-center justify-center gap-3 mt-12">
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
    </motion.section>
  );
}
