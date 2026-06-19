"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface Brand {
  id: string;
  name: string;
  logo: string;
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
    <section className=" bg-background py-12" >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl md:text-5xl font-bold tracking-tight">
            <span className="text-[#005AA9]">Popular</span>{" "}
            <span className="text-sierra-blue">Brands</span>
          </h2>
        </div>

        {/* Brand Marquee */}
        <div className="overflow-hidden rounded-2xl border bg-card ">
          <div
            className="flex w-max flex-nowrap items-center gap-10 px-6 py-8 animate-marquee bg-gradient-to-r from-[#EAF4FF] via-white to-[#EAF4FF]"
          >
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="inline-flex items-center justify-center h-52 w-48 shrink-0 rounded-2xl bg-white/80 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-muted/20"
              >
                <div className="relative h-24 w-32">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}