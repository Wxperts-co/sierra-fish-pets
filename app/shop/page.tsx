"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ShopHero from "@/components/shop/ShopHero";
import FilterSidebar from "@/components/shop/FilterSidebar";
import ProductGrid from "@/components/shop/ProductGrid";
import { getProductsByCategory } from "@/data";

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "dog";

  const [selectedCategory, setSelectedCategory] =
    useState(initialCategory);

  const [
    selectedSubcategories,
    setSelectedSubcategories,
  ] = useState<string[]>([]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    router.replace(`/shop?category=${slug}`);
  };

  const products = getProductsByCategory(selectedCategory);

  return (
    <>
      <ShopHero
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
      />

      <div className="container mx-auto py-10">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <FilterSidebar
              selectedCategory={selectedCategory}
              selectedSubcategories={
                selectedSubcategories
              }
              setSelectedSubcategories={
                setSelectedSubcategories
              }
            />
          </div>

          <div className="col-span-9">
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </>
  );
}