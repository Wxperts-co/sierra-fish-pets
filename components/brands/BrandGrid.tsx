"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BrandCard from "./BrandCard";

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

interface BrandGridProps {
  brands: Brand[];
}

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Brands",
  dog: "Dog",
  cat: "Cat",
  aquatic: "Aquatic",
  reptile: "Reptile",
  bird: "Bird",
  "small-animal": "Small Animal",
};

export default function BrandGrid({ brands }: BrandGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Always read the active category from the live URL
  const activeCategory = searchParams.get("category") ?? "all";

  // Build the list of categories that actually exist in the data
//   const availableCategories = useMemo(() => {
//     const cats = new Set<string>();
//     brands.forEach((b) => b.categories.forEach((c) => cats.add(c)));
//     return ["all", ...Array.from(cats)];
//   }, [brands]);

    const availableCategories = [
  "all",
  "dog",
  "cat",
  "aquatic",
  "bird",
  "reptile",
  "small-animal",
];

  const filtered = useMemo(() => {
    if (activeCategory === "all") return brands;
    return brands.filter((b) => b.categories.includes(activeCategory));
  }, [brands, activeCategory]);

  // Update the URL when a category pill is clicked
  function handleCategoryChange(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.push(`/brands?${params.toString()}`);
  }

  return (
    <div>
      {/* ── Main Grid Section ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">

          {/* Header + Filter Tabs */}
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-[#002244]">
                {activeCategory === "all"
                  ? "All Brands"
                  : `${CATEGORY_LABELS[activeCategory] ?? activeCategory} Brands`}
              </h2>
              <p className="mt-1 text-slate-500 text-sm">
                {filtered.length} trusted brand{filtered.length !== 1 ? "s" : ""} available
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-[#005AA9] text-white border-[#005AA9] shadow-md"
                      : "bg-white text-slate-600 border-slate-200 hover:border-[#005AA9] hover:text-[#005AA9]"
                  }`}
                >
                  {CATEGORY_LABELS[cat] ?? cat}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 mb-10" />

          {/* Empty State */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 rounded-3xl bg-slate-50 border border-slate-200">
              <h3 className="text-2xl font-bold text-[#002244] mb-3">
                No Brands Found
              </h3>
              <p className="text-slate-600">
                We couldn&apos;t find any brands matching this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filtered.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}