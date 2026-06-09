"use client";

import { useState } from "react";
import categories from "@/data/categories.json";

export default function CategoryTabs() {
  const [activeCategory, setActiveCategory] =
    useState("all");

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <button
        onClick={() => setActiveCategory("all")}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() =>
            setActiveCategory(category.slug)
          }
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}