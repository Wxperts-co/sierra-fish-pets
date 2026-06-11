"use client";

import Image from "next/image";
import Link from "next/link";
import { Globe, ArrowLeft, Star, ShieldCheck, Truck } from "lucide-react";

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

interface BrandDetailProps {
  brand: Brand;
  relatedBrands?: Brand[];
}

const CATEGORY_LABELS: Record<string, string> = {
  dog: "🐕 Dog",
  cat: "🐈 Cat",
  aquatic: "🐠 Aquatic",
  reptile: "🦎 Reptile",
  bird: "🦜 Bird",
  "small-animal": "🐹 Small Animal",
};

export default function BrandDetail({
  brand,
  relatedBrands = [],
}: BrandDetailProps) {
  return (
    <div className="bg-white">

      {/* ── Brand Overview ── */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">

          {/* Back link */}
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 text-sm text-[#005AA9] font-semibold mb-10 hover:text-[#003d73] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to All Brands
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Logo Card — Apple-style zoom on hover */}
            <div className="group h-[280px] lg:h-[360px] bg-slate-50 rounded-3xl border border-slate-200 flex items-center justify-center p-10 overflow-hidden">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={400}
                height={300}
                className="max-h-full w-auto object-contain transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
            </div>

            {/* Details */}
            <div>
              {brand.featured && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-4">
                  <Star size={12} className="fill-amber-500 text-amber-500" />
                  Featured Brand
                </div>
              )}

              <h1 className="text-4xl md:text-5xl font-black text-[#002244] mb-4 leading-tight">
                {brand.name}
              </h1>

              {/* Category badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {brand.categories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1.5 rounded-full bg-blue-50 text-[#005AA9] text-sm font-semibold border border-blue-100"
                  >
                    {CATEGORY_LABELS[category] ?? category}
                  </span>
                ))}
              </div>

              <p className="text-slate-600 leading-relaxed text-base mb-8">
                {brand.description}
              </p>

              {/* Trust signals */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <ShieldCheck size={20} className="text-[#005AA9] shrink-0" />
                  <span className="text-sm font-semibold text-slate-700">Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <Truck size={20} className="text-[#005AA9] shrink-0" />
                  <span className="text-sm font-semibold text-slate-700">In-Store Available</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#005AA9] text-white font-bold hover:bg-[#003d73] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Globe size={18} />
                  Official Website
                </a>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[#005AA9] text-[#005AA9] font-bold hover:bg-blue-50 transition-all duration-200"
                >
                  Ask In-Store
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Brands ── */}
      {relatedBrands.length > 0 && (
        <section className="py-16 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-6 max-w-6xl">

            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#005AA9] mb-1">
                  You May Also Like
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-[#002244]">
                  Related Brands
                </h2>
              </div>
              <Link
                href="/brands"
                className="text-sm font-semibold text-[#005AA9] hover:text-[#003d73] transition-colors hidden sm:block"
              >
                View All Brands →
              </Link>
            </div>


            <div className="flex gap-5">
              {relatedBrands.map((item) => (
                <Link
                  key={item.id}
                  href={`/brands/${item.slug}`}
                  className="group flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#00aaff] hover:shadow-lg transition-all duration-200"
                >
                  <div className="relative h-24 w-full mb-4">
                    <Image
                      src={item.logo}
                      alt={item.name}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-bold text-center text-[#002244] text-sm group-hover:text-[#005AA9] transition-colors">
                    {item.name}
                  </h3>
                </Link>
              ))}
            </div>

          </div>
        </section>
      )}

    </div>
  );
}