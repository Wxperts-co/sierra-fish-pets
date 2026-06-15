"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import { Product } from "@/types";

interface ProductImageViewerProps {
  product: Product;
}

export default function ProductImageViewer({ product }: ProductImageViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Ensure we always have multiple image options for demonstration
  const images = useMemo(() => {
    const list = [...(product.images || [])];
    if (list.length === 0) {
      list.push("/images/products/dog1.avif");
    }
    // Append fallback images if there's only 1 image to show multiple picture options
    if (list.length === 1) {
      if (product.categorySlug === "cat") {
        list.push("/images/products/cat1.avif", "/images/products/cat2.avif", "/images/products/cat3.avif");
      } else if (product.categorySlug === "aquatic") {
        list.push("/images/products/aqua1.avif", "/images/products/aqua2.avif", "/images/products/aqua3.avif");
      } else {
        list.push("/images/products/dog1.avif", "/images/products/dog2.avif", "/images/products/dog3.avif");
      }
    }
    return list;
  }, [product]);

  const activeImage = images[activeIndex] || images[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 items-start w-full">
      {/* ── LEFT: Thumbnail List ── */}
      <div className="flex flex-row lg:flex-col items-center gap-2 shrink-0 w-full lg:w-auto justify-center">
        <button
          onClick={handlePrev}
          className="hidden lg:block p-1 rounded-full hover:bg-slate-100 transition text-slate-500 active:scale-90 cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronUp className="h-4 w-4" />
        </button>

        <div className="flex flex-row lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto max-w-full lg:max-h-[400px] scrollbar-none py-1">
          {images.map((img, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-16 h-16 rounded-xl border overflow-hidden bg-slate-50 p-1 transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "border-[#005AA9] ring-2 ring-[#005AA9]/10 shadow-sm"
                    : "border-slate-200 hover:border-[#005AA9]/60"
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-contain p-1"
                  />
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="hidden lg:block p-1 rounded-full hover:bg-slate-100 transition text-slate-500 active:scale-90 cursor-pointer"
          aria-label="Next image"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* ── RIGHT: Main Image Viewer ── */}
      <div className="relative w-full lg:flex-1 h-[350px] sm:h-[450px] lg:h-[500px] rounded-2xl border border-slate-100 bg-white overflow-hidden flex items-center justify-center shadow-sm">
        {/* Zoom icon in the top right corner */}
       

        <Image
          src={activeImage}
          alt={product.name}
          fill
          priority
          className="object-contain p-6 transition-all duration-300"
        />
      </div>
    </div>
  );
}
