"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Product } from "@/types";

interface ProductImageViewerProps {
  product: Product;
}

// Helper function to strip sizes, colors, weights, and volumes from product names
function getBaseProductName(name: string): string {
  let base = name;

  // 1. Remove parenthesized sizes like (10 lb), (4 lb)
  base = base.replace(/\s*\([^)]*\)/gi, "");

  // 2. Remove standalone volume/weight keywords like 8 oz, 250ml, 100g
  base = base.replace(/\s*\d+\s*(lb|oz|ml|g|ct|pack|pk)s?\b/gi, "");

  // 3. Remove dimensions and layout tags like 9"-13", 4*3*2
  base = base.replace(/\s*\d+(["']?)\s*[-*]\s*\d+\1(\s*[-*]\s*\d+\1)?/gi, "");
  base = base.replace(/\s*\d+\s*\*\s*\d+(\s*\*\s*\d+)?/gi, "");

  // 4. Remove trailing generic size qualifiers
  base = base.replace(/\s+(sm|md|lrg|small|medium|large|med|mini)\b/gi, "");

  return base.replace(/\s+/g, " ").trim();
}

export default function ProductImageViewer({ product }: ProductImageViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [variantImages, setVariantImages] = useState<string[]>([]);

  // Fetch similar products dynamically from DB to show as variants/similar views
  useEffect(() => {
    const loadVariants = async () => {
      try {
        const baseName = getBaseProductName(product.name);
        const res = await fetch(`/api/products?q=${encodeURIComponent(baseName)}&limit=10`);
        const data = await res.json();
        if (data.success && data.products) {
          const targetBase = baseName.toLowerCase();
          const imgs = data.products
            .filter((p: Product) => p.id !== product.id && getBaseProductName(p.name).toLowerCase() === targetBase)
            .map((p: Product) => p.images?.[0])
            .filter(Boolean);
          const uniqueImgs = Array.from(new Set(imgs)) as string[];
          setVariantImages(uniqueImgs);
        }
      } catch (err) {
        console.error("Failed to load variants:", err);
      }
    };
    loadVariants();
  }, [product.id, product.name, product.images]);

  // Ensure we always have multiple premium product options for demonstration
  const images = useMemo(() => {
    const list = [...(product.images || [])];
    if (list.length === 0) {
       list.push("/placeholderimg.png");
    }

    // Append fetched variant images
    for (const img of variantImages) {
      if (!list.includes(img)) {
        list.push(img);
      }
    }

    // Fallback premium ACANA product images (from uploads folder) if we only have 1 image
    if (list.length === 1) {
      const fallbacks = product.categorySlug?.includes("cat")
        ? [
            "/uploads/products/64992685119.jpg",
            "/uploads/products/64992686048.jpg",
            "/uploads/products/64992686116.jpg"
          ]
        : [
            "/uploads/products/64992714031.jpg",
            "/uploads/products/64992714055.jpg",
            "/uploads/products/64992713959.jpg"
          ];

      for (const fallback of fallbacks) {
        if (!list.includes(fallback)) {
          list.push(fallback);
        }
      }
    }
    return list.slice(0, 3);
  }, [product, variantImages]);

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
                className={`w-16 h-16 rounded-xl border overflow-hidden bg-slate-50 p-1 transition-all cursor-pointer shrink-0 ${isActive
                    ? "border-[#005AA9] ring-2 ring-[#005AA9]/10 shadow-sm"
                    : "border-slate-200 hover:border-[#005AA9]/60"
                  }`}
              >
                <div className="relative w-full h-full">
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-contain p-1"
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
        <img
          src={activeImage}
          alt={product.name}
          className="w-full h-full object-contain p-6 transition-all duration-300"
        />
      </div>
    </div>
  );
}
