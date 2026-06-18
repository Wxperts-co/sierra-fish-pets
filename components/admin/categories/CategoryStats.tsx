"use client";

import { Package, Layers, Tag, Grid } from "lucide-react";
import type { AdminCategory } from "./types";

type CategoryStatsProps = {
  categories: AdminCategory[];
  loading?: boolean;
};

export default function CategoryStats({ categories = [], loading = false }: CategoryStatsProps) {
  const totalCategories = categories.length;
  const totalProducts = categories.reduce((sum, category) => sum + (category.productCount || 0), 0);
  const totalSubcategories = categories.reduce(
    (sum, category) => sum + (category.subcategories?.length || 0),
    0
  );
  const averageSubcategories = totalCategories
    ? Math.round((totalSubcategories / totalCategories) * 100) / 100
    : 0;

  const cards = [
    {
      label: "Total Categories",
      value: totalCategories,
      icon: Tag,
      color: "from-[#003B73] to-[#005EA8]",
      bgGlow: "bg-blue-500/10",
    },
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "from-emerald-600 to-teal-500",
      bgGlow: "bg-emerald-500/10",
    },
    {
      label: "Subcategories",
      value: totalSubcategories,
      icon: Layers,
      color: "from-purple-600 to-indigo-500",
      bgGlow: "bg-purple-500/10",
    },
    {
      label: "Avg. per Category",
      value: averageSubcategories,
      icon: Grid,
      color: "from-rose-600 to-red-500",
      bgGlow: "bg-rose-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className={`absolute -right-6 -bottom-6 h-24 w-24 rounded-full ${card.bgGlow} blur-xl`} />
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{card.value.toLocaleString()}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${card.color} text-white shadow-sm shadow-slate-900/10`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
