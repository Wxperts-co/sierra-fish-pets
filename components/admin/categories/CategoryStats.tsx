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
      iconBg: "bg-[#eef6ff]",
      iconColor: "text-[#005AA9]",
      valueColor: "text-slate-800",
    },
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    {
      label: "Subcategories",
      value: totalSubcategories,
      icon: Layers,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      valueColor: "text-purple-600",
    },
    {
      label: "Avg. per Category",
      value: averageSubcategories,
      icon: Grid,
      iconBg: "bg-slate-50",
      iconColor: "text-slate-500",
      valueColor: "text-slate-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
              <h3 className={`text-2xl font-black mt-2 ${card.valueColor}`}>
                {loading ? "..." : card.value.toLocaleString()}
              </h3>
            </div>
            <div className={`p-3 ${card.iconBg} rounded-xl ${card.iconColor}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
