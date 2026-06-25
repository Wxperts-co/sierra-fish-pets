"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ShopHero from "@/components/shop/ShopHero";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";
import type { Product } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setCategory,
  setSubcategory,
  clearFilters,
  setSortBy,
  toggleBrand,
  setBrands,
  setMinRating,
  setPriceRange,
  setSearch,
} from "@/store/slices/filtersSlice";
import type { CategorySlug } from "@/types";

const sortOptions = [
  { label: "Default Sorting", value: "featured" as const },
  { label: "Newest", value: "newest" as const },
  { label: "Best Selling", value: "best-selling" as const },
  { label: "Price: Low to High", value: "price-low-high" as const },
  { label: "Price: High to Low", value: "price-high-low" as const },
  { label: "Rating", value: "rating" as const },
];

const ITEMS_PER_PAGE = 12;

function ShopPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string; subcategories?: { id: string; name: string; slug: string }[] }[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => { if (data.success) setCategories(data.categories); })
      .catch(() => {});
  }, []);

  // Read category, subcategory & brands from Redux
  const selectedCategory = useAppSelector((state) => state.filters.category);
  const selectedSubcategory = useAppSelector(
    (state) => state.filters.subcategory,
  );
  const selectedBrands = useAppSelector((state) => state.filters.brands);
  const { minPrice, maxPrice, minRating, stockStatus, sortBy, search } = useAppSelector(
    (state) => state.filters,
  );

  // Sync URL query param → Redux on mount / param change
  useEffect(() => {
    const categoryFromUrl = searchParams?.get(
      "category",
    ) as CategorySlug | null;
    const subcategoryFromUrl = searchParams?.get("subcategory") || null;
    const brandsFromUrl = searchParams?.get("brand")?.split(",") || [];
    const ratingFromUrl = searchParams?.get("rating");
    const sortFromUrl = searchParams?.get("sort");
    const searchFromUrl = searchParams?.get("q") || "";
    const pageFromUrl = Number(searchParams?.get("page") || "1");

    setCurrentPage(pageFromUrl > 0 ? pageFromUrl : 1);

    if (categoryFromUrl) {
      dispatch(setCategory(categoryFromUrl));
    } else {
      dispatch(setCategory(null));
    }

    if (sortFromUrl) {
      dispatch(
        setSortBy(
          sortFromUrl as
            | "featured"
            | "newest"
            | "best-selling"
            | "price-low-high"
            | "price-high-low"
            | "rating",
        ),
      );
    } else {
      dispatch(setSortBy("featured"));
    }

    // Clear subcategory when category changes via URL
    dispatch(setSubcategory(subcategoryFromUrl));

    dispatch(setBrands(brandsFromUrl));

    dispatch(setMinRating(ratingFromUrl ? Number(ratingFromUrl) : null));
    dispatch(setSearch(searchFromUrl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Track filters to reset page number and prevent double fetches
  const prevFiltersRef = useRef({
    selectedCategory,
    selectedSubcategory,
    selectedBrands: selectedBrands.join(","),
    minPrice,
    maxPrice,
    minRating,
    stockStatus,
    sortBy,
    search,
  });

  // Fetch products from DB via API (paginated, sorted, and filtered)
  useEffect(() => {
    const currentFilters = {
      selectedCategory,
      selectedSubcategory,
      selectedBrands: selectedBrands.join(","),
      minPrice,
      maxPrice,
      minRating,
      stockStatus,
      sortBy,
      search,
    };

    const filtersChanged =
      prevFiltersRef.current.selectedCategory !== currentFilters.selectedCategory ||
      prevFiltersRef.current.selectedSubcategory !== currentFilters.selectedSubcategory ||
      prevFiltersRef.current.selectedBrands !== currentFilters.selectedBrands ||
      prevFiltersRef.current.minPrice !== currentFilters.minPrice ||
      prevFiltersRef.current.maxPrice !== currentFilters.maxPrice ||
      prevFiltersRef.current.minRating !== currentFilters.minRating ||
      prevFiltersRef.current.stockStatus !== currentFilters.stockStatus ||
      prevFiltersRef.current.sortBy !== currentFilters.sortBy ||
      prevFiltersRef.current.search !== currentFilters.search;

    prevFiltersRef.current = currentFilters;

    if (filtersChanged) {
      setCurrentPage(1);
      if (currentPage !== 1) {
        return;
      }
    }

    let cancelled = false;
    setIsLoadingProducts(true);

    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("limit", String(ITEMS_PER_PAGE));
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedSubcategory) params.set("subcategory", selectedSubcategory);
    if (selectedBrands.length > 0) params.set("brand", selectedBrands.join(","));
    if (minPrice !== undefined) params.set("minPrice", String(minPrice));
    if (maxPrice !== undefined) params.set("maxPrice", String(maxPrice));
    if (minRating) params.set("rating", String(minRating));
    if (stockStatus) params.set("stockStatus", stockStatus);
    if (sortBy) params.set("sort", sortBy);
    if (search) params.set("q", search);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success) {
          setProducts(data.products as Product[]);
          setTotalPages(data.totalPages || 1);
          setTotalCount(data.count || 0);
        }
      })
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => {
        if (!cancelled) setIsLoadingProducts(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    currentPage,
    selectedCategory,
    selectedSubcategory,
    selectedBrands,
    minPrice,
    maxPrice,
    minRating,
    stockStatus,
    sortBy,
  ]);

  const handleCategoryChange = (slug: string) => {
    dispatch(setCategory(slug as CategorySlug));
    dispatch(setSubcategory(null));

    setCurrentPage(1);

    const params = new URLSearchParams(window.location.search);

    params.set("category", slug);
    params.delete("subcategory");
    params.delete("brand");
    params.set("page", "1");

    const newUrl = `/shop?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  const handleSubcategoryToggle = (slug: string) => {
    const newValue = selectedSubcategory === slug ? null : slug;

    dispatch(setSubcategory(newValue));
    setCurrentPage(1);

    const params = new URLSearchParams(window.location.search);

    if (newValue) {
      params.set("subcategory", newValue);
    } else {
      params.delete("subcategory");
    }

    params.set("page", "1");
    const newUrl = `/shop?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  const handleBrandToggle = (slug: string) => {
    dispatch(toggleBrand(slug));
    setCurrentPage(1);

    const params = new URLSearchParams(window.location.search);

    const currentBrands = params.get("brand")?.split(",") || [];

    let updatedBrands: string[];

    if (currentBrands.includes(slug)) {
      updatedBrands = currentBrands.filter((brand) => brand !== slug);
    } else {
      updatedBrands = [...currentBrands, slug];
    }

    if (updatedBrands.length > 0) {
      params.set("brand", updatedBrands.join(","));
    } else {
      params.delete("brand");
    }

    params.set("page", "1");
    const newUrl = `/shop?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  const handleRatingChange = (rating: number | null) => {
    dispatch(setMinRating(rating));
    setCurrentPage(1);

    const params = new URLSearchParams(window.location.search);

    if (rating) {
      params.set("rating", rating.toString());
    } else {
      params.delete("rating");
    }

    params.set("page", "1");
    const newUrl = `/shop?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  const handlePriceChange = (min: number, max: number) => {
    dispatch(setPriceRange({ min, max }));
    setCurrentPage(1);

    const params = new URLSearchParams(window.location.search);

    if (min === 0 && max === 400) {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else {
      params.set("minPrice", String(min));
      params.set("maxPrice", String(max));
    }

    params.set("page", "1");
    const newUrl = `/shop?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setCurrentPage(1);

    const params = new URLSearchParams(window.location.search);
    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }
    params.delete("subcategory");
    params.delete("brand");
    params.delete("rating");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.set("page", "1");

    const newUrl = `/shop?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  const handleSortChange = (value: (typeof sortOptions)[number]["value"]) => {
    dispatch(setSortBy(value));
    setCurrentPage(1);

    const params = new URLSearchParams(window.location.search);

    params.set("sort", value);
    params.set("page", "1");

    const newUrl = `/shop?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  const startIndex =
    totalCount > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endIndex = Math.min(
    currentPage * ITEMS_PER_PAGE,
    totalCount,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: "smooth" });

    const params = new URLSearchParams(window.location.search);
    params.set("page", String(page));
    const newUrl = `/shop?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

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

  const currentSortOption =
    sortOptions.find((o) => o.value === sortBy) || sortOptions[0];



  return (
    <>
      <ShopHero
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
      />

      {/* ═══════════════════════════════════════════════════
          MOBILE FILTER ROW — hidden on desktop
      ═══════════════════════════════════════════════════ */}
      <div className="md:hidden bg-white border-b border-slate-100 px-4 py-3 flex flex-wrap gap-2 sticky top-[96px] z-20 shadow-sm">
        {/* Category */}
        <div className="relative flex-1 min-w-[130px]">
          <select
            value={selectedCategory ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val) handleCategoryChange(val);
              else {
                dispatch(setCategory(null));
                dispatch(setSubcategory(null));
                setCurrentPage(1);
                window.history.replaceState(null, "", "/shop");
              }
            }}
            className="w-full appearance-none rounded-full border border-slate-200 bg-white pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005AA9]/20 cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
            ▼
          </span>
        </div>

        {/* Subcategory — only if category selected */}
        {selectedCategory &&
          (() => {
            const cat = categories.find((c) => c.slug === selectedCategory);
            return cat?.subcategories?.length ? (
              <div className="relative flex-1 min-w-[130px]">
                <select
                  value={selectedSubcategory ?? ""}
                  onChange={(e) => handleSubcategoryToggle(e.target.value)}
                  className="w-full appearance-none rounded-full border border-slate-200 bg-white pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005AA9]/20 cursor-pointer"
                >
                  <option value="">All Sub-types</option>
                  {cat.subcategories.map((sub) => (
                    <option key={sub.slug} value={sub.slug}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
                  ▼
                </span>
              </div>
            ) : null;
          })()}

        {/* Sort */}
      </div>

      <div className="container mx-auto py-6 md:py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar — desktop only */}
          <div className="hidden md:block md:col-span-3">
            <FilterSidebar
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              onSubcategoryToggle={handleSubcategoryToggle}
              onClearFilters={handleClearFilters}
              onBrandToggle={handleBrandToggle}
              onRatingChange={handleRatingChange}
              onPriceChange={handlePriceChange}
            />
          </div>

          <div className="col-span-full md:col-span-9">
            <div className="flex justify-between items-center mb-6">
              <p className="text-[12px] text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {startIndex}–{endIndex}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800">
                  {totalCount}
                </span>{" "}
                products
              </p>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-900 bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 focus:outline-none cursor-pointer"
                >
                  <span>{currentSortOption.label}</span>
                  <span className="text-[8px] text-slate-800">▼</span>
                </button>
                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg z-20">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            handleSortChange(option.value);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-50 ${
                            sortBy === option.value
                              ? "text-[#005ca5] font-semibold bg-[#379ae5]/10"
                              : "text-slate-600"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="relative">
              {isLoadingProducts && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center min-h-[400px] z-10 rounded-3xl transition-all duration-200">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#005AA9]"></div>
                </div>
              )}
              <ProductGrid products={products} />
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
                      <span
                        key={`dots-${index}`}
                        className="px-2 text-slate-400 select-none"
                      >
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
          </div>
        </div>
      </div>
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#005AA9]"></div>
        </div>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
}
