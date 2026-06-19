"use client";

import { Search, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type CategoryFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
};

export default function CategoryFilters({ search, onSearchChange, onReset }: CategoryFiltersProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, slug, or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-100 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 transition font-semibold"
          />
        </div>

        {/* Reset */}
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="h-11 rounded-2xl border-slate-200 font-semibold px-5 active:scale-95 transition-all text-slate-600 hover:bg-slate-50 shrink-0"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}
