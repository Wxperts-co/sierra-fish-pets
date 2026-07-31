"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Brand {
  id: string;
  name: string;
  logo: string;
  slug?: string;
  categories?: string[];
}

export default function PopularBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.brands)) {
          setBrands(data.brands);
        }
      })
      .catch((err) => console.error("Failed to load brands:", err));
  }, []);

  if (brands.length === 0) return null;

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-5xl font-bold tracking-tight">
            <span className="text-[#005AA9]">Popular</span>{" "}
            <span className="text-sierra-blue">Brands</span>
          </h2>
        </div>

        {/* Brand Marquee Slider */}
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="flex w-max flex-nowrap items-center gap-8 px-6 py-6 animate-marquee bg-gradient-to-r from-[#EAF4FF] via-white to-[#EAF4FF]">
            {[...brands, ...brands].map((brand, index) => {
              const categoryParam = brand.categories?.[0] ? `?category=${brand.categories[0]}` : "";
              return (
                <Link
                  key={`${brand.id}-${index}`}
                  href={`/brands${categoryParam}`}
                  className="inline-flex items-center justify-center h-44 w-44 shrink-0 rounded-2xl bg-white/90 border border-slate-100 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-white p-4 group"
                >
                  <div className="relative h-20 w-32 group-hover:scale-105 transition-transform">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                      sizes="128px"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}