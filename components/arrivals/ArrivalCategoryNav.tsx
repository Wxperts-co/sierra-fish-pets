"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";

interface Category {
  id: string;
  label: string;
}

interface ArrivalCategoryNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const categories: Category[] = [
  { id: "all",           label: "All Arrivals" },
  { id: "fish",          label: "Fish" },
  { id: "freshwater",    label: "Freshwater" },
  { id: "saltwater",     label: "Saltwater" },
  { id: "reptiles",      label: "Reptiles" },
  { id: "birds",         label: "Birds" },
  { id: "small-animals", label: "Small Animals" },
  { id: "dogs",          label: "Dogs" },
  { id: "cats",          label: "Cats" },
];

export default function ArrivalCategoryNav({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: ArrivalCategoryNavProps) {
  const [localInput, setLocalInput] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localInput.trim());
  };

  const handleClear = () => {
    setLocalInput("");
    onSearchChange("");
  };

  return (
    <section className="bg-white border-b border-slate-200/80 shadow-xs">
      <div className="container mx-auto px-4 py-6 space-y-4 max-w-7xl">
        {/* Top Controls: Search Bar & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full sm:max-w-md relative flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search species, fish, or pet name..."
                value={localInput}
                onChange={(e) => {
                  setLocalInput(e.target.value);
                  // Live update if cleared
                  if (!e.target.value) onSearchChange("");
                }}
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#005AA9]/20 focus:border-[#005AA9] transition"
              />
              {localInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#005AA9] hover:bg-[#003B73] text-white text-sm font-bold rounded-2xl shadow-sm hover:shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {searchQuery && (
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-2 self-start sm:self-auto">
              <span>Showing results for: <strong className="text-slate-800">"{searchQuery}"</strong></span>
              <button
                onClick={handleClear}
                className="text-[#005AA9] hover:underline font-bold"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Single Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-1 pb-1">
          {categories.map((category) => {
            const active = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`
                  flex items-center gap-2 whitespace-nowrap rounded-full
                  px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer
                  ${
                    active
                      ? "bg-[#005AA9] text-white shadow-md shadow-blue-500/20 ring-2 ring-[#005AA9]/20 scale-[1.02]"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-[#005AA9] hover:text-[#005AA9] hover:bg-blue-50/40"
                  }
                `}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
