"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import ProductCard from "@/components/shop/ProductCard";
import type { Product } from "@/types";

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
      delay: 0.15 + index * 0.1,
    },
  }),
};

export default function NewArrivals() {
  const containerRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.top < viewportHeight * 0.8 && rect.bottom > 0) {
        setHasAnimated(true);
      } else if (rect.top >= viewportHeight) {
        setHasAnimated(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [newArrivals.length]);

  // Fetch new arrival products from DB via API
  useEffect(() => {
    const loadNewArrivals = async () => {
      try {
        // 1. Try fetching products with isNewArrival flag
        const res = await fetch("/api/products?isNewArrival=true&limit=12");
        const data = await res.json();
        if (data.success && data.products && data.products.length > 0) {
          setNewArrivals(data.products);
          return;
        }

        // 2. Fallback: If no products are flagged as isNewArrival, fetch products sorted by newest creation date
        const fallbackRes = await fetch("/api/products?sort=newest&limit=12");
        const fallbackData = await fallbackRes.json();
        if (fallbackData.success) {
          setNewArrivals(fallbackData.products);
        }
      } catch (err) {
        console.error("NewArrivals fetch error:", err);
      }
    };
    loadNewArrivals();
  }, []);

  if (!newArrivals.length) {
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
              Just Arrived
            </p>
            <h2 className="text-2xl md:text-5xl font-extrabold leading-tight font-lato text-[#002244]">
              New <span className="text-[#005AA9]">Arrivals</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-gray-500">
              The freshest picks just landed in our store — discover what&apos;s
              new for your furry, feathered, and finned friends.
            </p>
          </div>
        </motion.div>

        {/* ── Products Grid (2 columns on mobile, 3 on tablet/lg, 6 on desktop/xl) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          {newArrivals.slice(0, 12).map((product, index) => (
            <motion.div
              key={product.id}
              custom={index}
              variants={cardVariants}
              className={cn(
                "w-full h-full",
                index >= 4 ? "hidden sm:block" : "block"
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
            Shop New Arrivals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
