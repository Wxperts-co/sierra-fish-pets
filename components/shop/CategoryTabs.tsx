"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCategory } from "@/store/slices/filtersSlice";
import type { CategorySlug } from "@/types";

export default function CategoryTabs() {
  const dispatch = useAppDispatch();
  const activeCategory = useAppSelector(
    (state) => state.filters.category ?? "all"
  );
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => { if (data.success) setCategories(data.categories); })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <button
        onClick={() => dispatch(setCategory(null))}
        className={activeCategory === null ? "font-bold" : ""}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() =>
            dispatch(setCategory(category.slug as CategorySlug))
          }
          className={activeCategory === category.slug ? "font-bold" : ""}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}