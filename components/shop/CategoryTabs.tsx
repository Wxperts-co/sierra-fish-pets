"use client";

import categories from "@/data/categories.json";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCategory } from "@/store/slices/filtersSlice";
import type { CategorySlug } from "@/types";

export default function CategoryTabs() {
  const dispatch = useAppDispatch();
  const activeCategory = useAppSelector(
    (state) => state.filters.category ?? "all"
  );

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