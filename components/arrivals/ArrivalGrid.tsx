"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import ArrivalCard, { ArrivalPet } from "./ArrivalCard";

interface ArrivalGridProps {
  pets: ArrivalPet[];
  activeCategory: string;
  searchQuery?: string;
  onViewDetails?: (pet: ArrivalPet) => void;
}

const ITEMS_PER_PAGE = 8;

export default function ArrivalGrid({
  pets,
  activeCategory,
  searchQuery = "",
  onViewDetails,
}: ArrivalGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination to first page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const filteredPets = (() => {
    let list = pets;

    // 1. Category Filter
    if (activeCategory !== "all") {
      list = list.filter((p) => {
        const cat = (p.category || "").toLowerCase();
        const sub = (p.subcategory || "").toLowerCase();
        const breed = (p.breed || "").toLowerCase();

        if (activeCategory === "fish") {
          return cat === "fish" || cat === "freshwater" || cat === "saltwater" || cat === "aquatic" || sub.includes("fish") || breed.includes("fish");
        }
        if (activeCategory === "freshwater") {
          return cat === "freshwater" || sub.includes("freshwater") || breed.includes("freshwater") || (cat === "fish" && !sub.includes("saltwater"));
        }
        if (activeCategory === "saltwater") {
          return cat === "saltwater" || sub.includes("saltwater") || breed.includes("saltwater") || breed.includes("marine");
        }
        if (activeCategory === "small-animals") {
          return cat === "small animals" || cat === "small-animals" || cat === "small pet" || cat === "small-pet";
        }
        if (activeCategory === "reptiles") {
          return cat === "reptiles" || cat === "reptile";
        }
        if (activeCategory === "dogs") {
          return cat === "dogs" || cat === "dog";
        }
        if (activeCategory === "cats") {
          return cat === "cats" || cat === "cat";
        }
        if (activeCategory === "birds") {
          return cat === "birds" || cat === "bird";
        }
        return cat === activeCategory.toLowerCase();
      });
    }

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const breed = (p.breed || "").toLowerCase();
        const sub = (p.subcategory || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();
        return (
          name.includes(q) ||
          breed.includes(q) ||
          sub.includes(q) ||
          desc.includes(q) ||
          cat.includes(q)
        );
      });
    }

    return list;
  })();

  if (!filteredPets.length) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <SearchX className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">
              No Arrivals Found
            </h3>
            <p className="mt-2 text-slate-500 max-w-md mx-auto text-sm">
              {searchQuery
                ? `No live arrivals matched "${searchQuery}". Try a different keyword or category.`
                : "There are currently no new arrivals in this category. Please check back soon!"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Pagination calculation
  const totalPages = Math.ceil(filteredPets.length / ITEMS_PER_PAGE);
  const paginatedPets = filteredPets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Result Count */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Latest Arrivals
          </h2>

          <span className="text-xs sm:text-sm font-semibold text-slate-500 bg-white px-3.5 py-1.5 rounded-full border border-slate-200">
            Showing {paginatedPets.length} of {filteredPets.length} Arrivals
          </span>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedPets.map((pet) => (
            <ArrivalCard
              key={pet.id}
              pet={pet}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-[#005AA9] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer active:scale-95 ${
                    isActive
                      ? "bg-[#005AA9] text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#005AA9]"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-[#005AA9] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}