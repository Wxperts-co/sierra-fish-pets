"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import categoriesJson from "@/data/categories.json";
import type { Category } from "@/types";
import SubCategoryFilter from "./SubcategoryFilter";
import BrandFilter from "./BrandFilter";
import brands from "@/data/brands.json";

const categories = categoriesJson as Array<Partial<Category>>;
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleBrand,
  setPriceRange,
  setMinRating,
  setStockStatus,
  DEFAULT_MAX_PRICE,
} from "@/store/slices/filtersSlice";
import PriceFilter from "./PriceFilter";
import RatingFilter from "./RatingFilter";
import StockStatusFilter from "./StockStatusFilter";

interface FilterSidebarProps {
  selectedCategory: string | null;
  /** Currently active subcategory slug from Redux (null = all) */
  selectedSubcategory: string | null;
  /** Called when user clicks a subcategory checkbox — toggles it */
  onSubcategoryToggle: (slug: string) => void;

  onBrandToggle: (slug: string) => void;
  /** Called when user clicks "Clear all" */
  onClearFilters: () => void;

  onRatingChange: (
      rating: number | null
    ) => void;

  onPriceChange: (
    min: number,
    max: number
  ) => void;
}

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-1 text-sm font-semibold tracking-wide text-slate-700 transition-colors hover:text-[#379ae5] focus:outline-none cursor-pointer"
      >
        <span className="uppercase text-[10px] font-bold text-slate-400 tracking-wider">
          {title}
        </span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#379ae5]" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="mt-3.5 animate-in fade-in slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </div>
  );
}

export default function FilterSidebar({
  selectedCategory,
  selectedSubcategory,
  onSubcategoryToggle,
  onClearFilters,
  onBrandToggle,
  onRatingChange,
  onPriceChange,
}: FilterSidebarProps) {
  const category = categories.find((item) => item.slug === selectedCategory);

  // Adapt single-selection Redux state → array for SubCategoryFilter
  const selectedSubcategories = selectedSubcategory
    ? [selectedSubcategory]
    : [];

  const selectedBrands = useAppSelector((state) => state.filters.brands);

  const { minPrice, maxPrice } = useAppSelector((state) => state.filters);

  const selectedRating = useAppSelector((state) => state.filters.minRating);

  const selectedStockStatus = useAppSelector(
    (state) => state.filters.stockStatus,
  );

  const dispatch = useAppDispatch();

  // Accordion sections state (open by default: subcategory, price)
  const [openSections, setOpenSections] = useState({
    subcategory: true,
    price: true,
    rating: false,
    brands: false,
    stock: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isPriceModified = minPrice !== 0 || maxPrice !== DEFAULT_MAX_PRICE;
  const appliedFiltersCount =
    (selectedSubcategory ? 1 : 0) +
    selectedBrands.length +
    (isPriceModified ? 1 : 0) +
    (selectedRating ? 1 : 0) +
    (selectedStockStatus ? 1 : 0);

  return (
    <aside className="sticky top-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-bold text-slate-800">Filters</h2>
        {appliedFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs font-semibold text-[#379ae5] hover:text-[#005ca5] transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active category badge */}
      {category && (
        <div className="flex items-center gap-2 rounded-xl border border-[#75bcef]/30 bg-[#75bcef]/10 px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-[#75bcef]" />

          <span className="text-sm font-semibold capitalize text-[#005ca5]">
            {category.name}
          </span>

          <span className="ml-auto text-xs font-medium text-[#005ca5]">
            {category.productCount ?? 0} products
          </span>
        </div>
      )}

      {/* Collapsible Unified Filter Wrapper */}
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm divide-y divide-slate-100">
        {/* Subcategories */}
        {category?.subcategories && category.subcategories.length > 0 && (
          <CollapsibleSection
            title="Sub Categories"
            isOpen={openSections.subcategory}
            onToggle={() => toggleSection("subcategory")}
          >
            <SubCategoryFilter
              subcategories={category.subcategories}
              selectedSubcategories={selectedSubcategories}
              onToggle={onSubcategoryToggle}
            />
          </CollapsibleSection>
        )}

        {/* Price Range */}
        <CollapsibleSection
          title="Price Range"
          isOpen={openSections.price}
          onToggle={() => toggleSection("price")}
        >
          <PriceFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            onChange={onPriceChange}
          />
        </CollapsibleSection>

        {/* Rating */}
        <CollapsibleSection
          title="Customer Rating"
          isOpen={openSections.rating}
          onToggle={() => toggleSection("rating")}
        >
          <RatingFilter
            selectedRating={selectedRating}
            onSelect={onRatingChange}
          />
        </CollapsibleSection>

        {/* Brands */}
        <CollapsibleSection
          title="Brands"
          isOpen={openSections.brands}
          onToggle={() => toggleSection("brands")}
        >
          <BrandFilter
            brands={brands}
            selectedBrands={selectedBrands}
            onToggle={onBrandToggle}
          />
        </CollapsibleSection>

        {/* Availability */}
        <CollapsibleSection
          title="Availability"
          isOpen={openSections.stock}
          onToggle={() => toggleSection("stock")}
        >
          <StockStatusFilter
            selectedStatus={selectedStockStatus}
            onSelect={(status) => dispatch(setStockStatus(status))}
          />
        </CollapsibleSection>
      </div>

      {/* Selected count summary */}
      {appliedFiltersCount > 0 && (
        <p className="px-1 text-xs text-slate-400 font-medium">
          {appliedFiltersCount}{" "}
          {appliedFiltersCount === 1 ? "filter" : "filters"} applied
        </p>
      )}
    </aside>
  );
}
