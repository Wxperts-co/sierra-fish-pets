"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Product } from "@/types";

interface ProductImageViewerProps {
  product: Product;
}

export default function ProductImageViewer({ product }: ProductImageViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Extract all valid images from product.images
  const images = useMemo(() => {
    const list = Array.isArray(product?.images)
      ? product.images.filter((img) => typeof img === "string" && img.trim() !== "")
      : [];
    
    if (list.length === 0) {
      return ["/placeholderimg.png"];
    }
    return list;
  }, [product?.images]);

  const activeImage = images[activeIndex] || images[0] || "/placeholderimg.png";

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 items-start w-full">
      {/* ── LEFT: Thumbnail List ── */}
      {images.length > 0 && (
        <div className="flex flex-row lg:flex-col items-center gap-2 shrink-0 w-full lg:w-auto justify-center">
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="hidden lg:block p-1 rounded-full hover:bg-slate-100 transition text-slate-500 active:scale-90 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          )}

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
                    <img
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholderimg.png";
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="hidden lg:block p-1 rounded-full hover:bg-slate-100 transition text-slate-500 active:scale-90 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* ── RIGHT: Main Image Viewer ── */}
      <div className="relative w-full lg:flex-1 h-[350px] sm:h-[450px] lg:h-[500px] rounded-2xl border border-slate-100 bg-white overflow-hidden flex items-center justify-center shadow-sm">
        <img
          src={activeImage}
          alt={product.name}
          className="w-full h-full object-contain p-6 transition-all duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholderimg.png";
          }}
        />
      </div>
    </div>
  );
}
