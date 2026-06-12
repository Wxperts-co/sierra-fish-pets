"use client";

import { Dog, Cat, Bird, Fish, Rabbit, Turtle, BookOpen } from "lucide-react";

interface Category {
  id: string;
  label: string;
}

interface BlogCategoryNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories: Category[] = [
  {
    id: "all",
    label: "All Articles",
  },
  {
    id: "dog",
    label: "Dogs",
  },
  {
    id: "cat",
    label: "Cats",
  },
  {
    id: "aquatic",
    label: "Aquatic",
  },
  {
    id: "reptile",
    label: "Reptiles",
  },
  {
    id: "bird",
    label: "Birds",
  },
  {
    id: "small-animal",
    label: "Small Animals",
  },
];

const getIcon = (category: string, size = 16) => {
  switch (category) {
    case "all":
      return <BookOpen size={size} />;
    case "dog":
      return <Dog size={size} />;
    case "cat":
      return <Cat size={size} />;
    case "bird":
      return <Bird size={size} />;
    case "aquatic":
      return <Fish size={size} />;
    case "small-animal":
      return <Rabbit size={size} />;
    case "reptile":
      return <Turtle size={size} />;
    default:
      return null;
  }
};

export default function BlogCategoryNav({
  activeCategory,
  onCategoryChange,
}: BlogCategoryNavProps) {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-10">
      <div className="container mx-auto px-4">
        {/* Centered Glassmorphism Container */}
        <div className="mx-auto max-w-5xl rounded-3xl bg-slate-100/60 p-2 border border-slate-200/50 shadow-inner backdrop-blur-md">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {categories.map((category) => {
              const active = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`
                    flex items-center gap-2.5 whitespace-nowrap rounded-2xl
                    px-5 py-3 text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer group
                    ${
                      active
                        ? "bg-gradient-to-br from-[#005AA9] to-[#0077C8] text-white shadow-md shadow-blue-500/10 scale-[1.02]"
                        : "border border-slate-200/40 bg-white text-slate-600 hover:border-blue-200 hover:text-[#005AA9] hover:bg-blue-50/10 hover:-translate-y-0.5 hover:shadow-sm"
                    }
                  `}
                >
                  <span
                    className={`transition-colors duration-300 ${
                      active
                        ? "text-white"
                        : "text-slate-400 group-hover:text-[#005AA9]"
                    }`}
                  >
                    {getIcon(category.id, 18)}
                  </span>
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
