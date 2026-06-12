"use client";

import { Dog, Cat, Bird, Fish, Rabbit, Turtle } from "lucide-react";

interface Category {
  id: string;
  label: string;
}

interface ArrivalCategoryNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories: Category[] = [
  {
    id: "all",
    label: "All Pets",
  },
  {
    id: "dogs",
    label: "Dog Arrivals",
  },
  {
    id: "cats",
    label: "Cat Arrivals",
  },
  {
    id: "birds",
    label: "Bird Arrivals",
  },
  {
    id: "freshwater",
    label: "Freshwater Arrivals",
  },
  {
    id: "saltwater",
    label: "Saltwater Arrivals",
  },
  {
    id: "reptiles",
    label: "Reptile Arrivals",
  },
  {
    id: "small-animals",
    label: "Small Animal Arrivals",
  },
];

const getIcon = (category: string) => {
  switch (category) {
    case "dogs":
      return <Dog size={18} />;
    case "cats":
      return <Cat size={18} />;
    case "birds":
      return <Bird size={18} />;
    case "fish":
      return <Fish size={18} />;
    case "small-pets":
      return <Rabbit size={18} />;
    case "exotic-pets":
      return <Turtle size={18} />;
    default:
      return null;
  }
};

export default function ArrivalCategoryNav({
  activeCategory,
  onCategoryChange,
}: ArrivalCategoryNavProps) {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 py-10">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((category) => {
            const active = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`
                  flex items-center gap-2 whitespace-nowrap rounded-full
                  border px-5 py-3 text-sm font-semibold transition-all duration-300
                  ${
                    active
                      ? "border-[#005AA9] bg-[#005AA9] text-white shadow-md"
                      : "border-slate-200 bg-white text-slate-700 hover:border-[#005AA9] hover:text-[#005AA9]"
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
