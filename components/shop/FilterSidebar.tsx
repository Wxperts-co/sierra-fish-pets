"use client";

import React from "react";
import categories from "@/data/categories.json";
import SubCategoryFilter from "./SubcategoryFilter";

interface FilterSidebarProps {
  selectedCategory: string;
  selectedSubcategories: string[];
  setSelectedSubcategories: React.Dispatch<
    React.SetStateAction<string[]>
  >;
}

export default function FilterSidebar({
  selectedCategory,
  selectedSubcategories,
  setSelectedSubcategories,
}: FilterSidebarProps) {
  const category = categories.find(
    (item) => item.slug === selectedCategory
  );

  const handleToggleSubcategory = (subcategorySlug: string) => {
    setSelectedSubcategories((prev) => {
      if (prev.includes(subcategorySlug)) {
        return prev.filter((item) => item !== subcategorySlug);
      }
      return [...prev, subcategorySlug];
    });
  };

  const handleClearAll = () => setSelectedSubcategories([]);

  return (
    <aside className="sticky top-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-bold text-slate-800">Filters</h2>
        {selectedSubcategories.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active category badge */}
      {category && (
        <div className="flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-teal-500" />
          <span className="text-sm font-semibold text-teal-700 capitalize">
            {category.name}
          </span>
          <span className="ml-auto text-xs text-teal-500">
            {category.productCount} products
          </span>
        </div>
      )}

      {/* Sub-category checkboxes */}
      <SubCategoryFilter
        subcategories={category?.subcategories || []}
        selectedSubcategories={selectedSubcategories}
        onToggle={handleToggleSubcategory}
      />

      {/* Selected count summary */}
      {selectedSubcategories.length > 0 && (
        <p className="px-1 text-xs text-slate-400">
          {selectedSubcategories.length} filter
          {selectedSubcategories.length > 1 ? "s" : ""} applied
        </p>
      )}
    </aside>
  );
}