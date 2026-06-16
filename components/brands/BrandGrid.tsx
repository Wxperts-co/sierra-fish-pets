"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const activeCategory = searchParams?.get("category") ?? "all";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 2 : 10);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return brands;
    return brands.filter((b) => b.categories.includes(activeCategory));
  }, [brands, activeCategory]);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginatedBrands = useMemo(() => {
    return filtered.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filtered, currentPage, itemsPerPage]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  // Update the URL when a category pill is clicked
  function handleCategoryChange(cat: string) {
    const params = new URLSearchParams(searchParams?.toString() || "");
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
      <section className="py-4 sm:py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-6">

          {/* Header + Filter Tabs */}
          <div className="mb-4 md:mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl md:text-4xl font-black text-[#002244]">
                {activeCategory === "all"
                  ? "All Brands"
                  : `${CATEGORY_LABELS[activeCategory] ?? activeCategory} Brands`}
              </h2>
              <p className="mt-1 text-slate-500 text-sm">
                {filtered.length} trusted brand{filtered.length !== 1 ? "s" : ""} available
              </p>
            </div>

            {/* Category Pills (Desktop) */}
            <div className="hidden md:flex flex-wrap gap-2">
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

            {/* Category Dropdown (Mobile) */}
            <div className="relative block md:hidden w-full">
              <select
                value={activeCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full appearance-none rounded-full border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005AA9]/20 cursor-pointer"
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat] ?? cat}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">▼</span>
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
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
                {paginatedBrands.map((brand) => (
                  <BrandCard key={brand.id} brand={brand} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:border-[#005ca5] hover:text-[#005ca5] disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all cursor-pointer bg-white"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {getPageNumbers().map((page, index) => {
                    if (page === "...") {
                      return (
                        <span key={`dots-${index}`} className="px-2 text-slate-400 select-none">
                          ...
                        </span>
                      );
                    }
                    const isActive = page === currentPage;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page as number)}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#379ae5] text-white shadow-md shadow-[#379ae5]/30"
                            : "border border-slate-200 text-slate-600 hover:border-[#005ca5] hover:text-[#005ca5] bg-white"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:border-[#005ca5] hover:text-[#005ca5] disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all cursor-pointer bg-white"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}