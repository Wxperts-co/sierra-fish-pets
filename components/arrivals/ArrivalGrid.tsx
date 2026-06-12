"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ArrivalCard, { ArrivalPet } from "./ArrivalCard";

interface ArrivalGridProps {
  pets: ArrivalPet[];
  activeCategory: string;
  onViewDetails?: (pet: ArrivalPet) => void;
}

const ITEMS_PER_PAGE = 4;

export default function ArrivalGrid({
  pets,
  activeCategory,
  onViewDetails,
}: ArrivalGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination to first page when active category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const filteredPets =
    activeCategory === "all"
      ? pets
      : pets.filter((pet) => pet.category === activeCategory);

  if (!filteredPets.length) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center">
            <h3 className="text-2xl font-bold text-slate-800">
              No Pets Found
            </h3>

            <p className="mt-3 text-slate-500">
              There are currently no arrivals in this category.
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
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Result Count */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Latest Arrivals
          </h2>

          <span className="text-sm text-slate-500">
            Showing {paginatedPets.length} of {filteredPets.length} Pets Found
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