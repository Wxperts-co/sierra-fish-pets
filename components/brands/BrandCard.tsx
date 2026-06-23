"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  categories: string[];
  featured: boolean;
  website: string;
}

interface BrandCardProps {
  brand: Brand;
}

const CATEGORY_COLOR: Record<string, string> = {
  dog: "bg-orange-50 text-orange-700",
  cat: "bg-purple-50 text-purple-700",
  aquatic: "bg-cyan-50 text-cyan-700",
  reptile: "bg-green-50 text-green-700",
  bird: "bg-yellow-50 text-yellow-700",
  "small-animal": "bg-pink-50 text-pink-700",
};

export default function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link href={`/brands/${brand.slug}`} className="group block h-full">
      <div className="h-full bg-white rounded-2xl border border-slate-200 hover:border-[#005AA9]/50 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">

        {/* Logo Section */}
        <div className="relative h-40 bg-slate-50 flex items-center justify-center p-6 shrink-0">
          {brand.featured && (
            <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-bold">
              <Star size={9} className="fill-amber-500 text-amber-500" />
              Featured
            </span>
          )}
          <Image
            src={brand.logo}
            alt={brand.name}
            fill
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 250px"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-sm font-bold text-[#002244] mb-2 line-clamp-1 group-hover:text-[#005AA9] transition-colors">
            {brand.name}
          </h3>

          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {brand.categories.slice(0, 2).map((category) => (
              <span
                key={category}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                  CATEGORY_COLOR[category] ?? "bg-blue-50 text-[#005AA9]"
                }`}
              >
                {category}
              </span>
            ))}
          </div>

          {/* Short Description */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">
            {brand.description}
          </p>

          {/* CTA */}
          <div className="flex items-center text-[#005AA9] font-bold text-xs group-hover:text-[#00aaff] transition-colors mt-auto">
            Learn More
            <ArrowRight
              size={13}
              className="ml-1.5 transition-transform group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}