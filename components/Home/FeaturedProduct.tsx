"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import ProductCard from "@/components/shop/ProductCard";
import type { Product } from "@/types";

const CATEGORY_SLUGS = [
  "dog",
  "cat",
  "aquatic",
  "reptile",
  "bird",
  "small-animal",
];

const headingVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.95 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: 0.15 + index * 0.1, // Staggered delays starting after the heading animates
    },
  }),
};

export default function FeaturedProducts() {
  const containerRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Enter from bottom of screen (scrolling down)
      if (rect.top < viewportHeight * 0.8 && rect.bottom > 0) {
        setHasAnimated(true);
      } else if (rect.top >= viewportHeight) {
        // Reset only if element goes completely below screen (scrolling back up to top)
        setHasAnimated(false);
      }
      // If rect.bottom <= 0, user scrolled past it. hasAnimated stays true, preventing re-animating when scrolling up.
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch all products from DB via API
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAllProducts(data.products as Product[]);
      })
      .catch((err) => console.error("FeaturedProducts fetch error:", err));
  }, []);

  // Fetch the latest 2 products for each category, ordered so that all #1 latest are in row 1, and all #2 latest are in row 2
  const latestProductsByCategory = (() => {
    const row1 = CATEGORY_SLUGS.map((slug) => {
      const catProducts = allProducts.filter(
        (p) => p.categorySlug === slug || p.categorySlug?.startsWith(slug + "-/-")
      );
      const sorted = [...catProducts].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      return sorted[0];
    }).filter(Boolean);

    const row2 = CATEGORY_SLUGS.map((slug) => {
      const catProducts = allProducts.filter(
        (p) => p.categorySlug === slug || p.categorySlug?.startsWith(slug + "-/-")
      );
      const sorted = [...catProducts].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      return sorted[1];
    }).filter(Boolean);

    return [...row1, ...row2];
  })();

  if (!latestProductsByCategory.length) {
    return null;
  }

  return (
    <motion.section
      ref={containerRef}
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      className="py-16 bg-[#fafbfd]/50"
    >
      <div className="container mx-auto px-4">
        {/* ── Section Header ── */}
        <motion.div
          variants={headingVariants}
          className="mb-12 flex flex-col items-center gap-4 text-center"
        >
          <div>
            {/* Eyebrow label */}
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#005AA9]">
              Freshly Stocked
            </p>
            <h2 className="text-2xl md:text-5xl font-extrabold leading-tight font-lato text-[#002244]">
              New Arrivals by <span className="text-[#005AA9]">Category</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-gray-500">
              Explore the latest additions to our store, hand-picked for your
              pets' comfort and happiness.
            </p>
          </div>
        </motion.div>

        {/* ── Products Grid (2 columns on mobile, 3 on tablet/lg, 6 on desktop/xl) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          {latestProductsByCategory.map((product, index) => (
            <motion.div
              key={product.id}
              custom={index}
              variants={cardVariants}
              className={cn(
                "w-full h-full",
                index >= 4 ? "hidden sm:block" : "block",
              )}
            >
              <ProductCard
                product={product}
                className="border border-[#b8dfff]/40 shadow-[0_8px_30px_rgba(0,90,169,0.05)] hover:border-[#7fc4ff] hover:shadow-[0_16px_36px_rgba(0,90,169,0.12)] transition-all duration-300 w-full h-full"
              />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-4 flex justify-center">
          <Link
            href="/shop"
            className="flex items-center gap-2 rounded-full border-2 border-[#005AA9] px-6 py-3 text-sm font-bold text-[#005AA9] transition-all duration-200 hover:bg-[#005AA9] hover:text-white hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            Show All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
