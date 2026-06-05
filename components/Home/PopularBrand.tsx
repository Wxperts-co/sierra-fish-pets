"use client";

import Image from "next/image";
import brands from "@/data/brands.json";

export default function PopularBrands() {
  return (
    <section className=" bg-background py-12" >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            <span className="text-[#005AA9]">Popular</span>{" "}
            <span className="text-sierra-blue">Brands</span>
          </h2>
        </div>

        {/* Brand Grid */}
        <div className="overflow-hidden rounded-2xl border bg-card">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {brands.map((brand, index) => (
              <div
                key={brand.id}
                className={`
                  flex h-52 items-center justify-center
                  transition-all duration-300
                  hover:bg-muted/40
                  hover:scale-[1.02]
                  ${index !== brands.length - 1 ? "border-r" : ""}
                `}
              >
                <div className="relative h-28 w-40 transition-all duration-300 hover:grayscale-0">
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