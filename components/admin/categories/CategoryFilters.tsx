"use client";

import { Search, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CategoryFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
};

export default function CategoryFilters({ search, onSearchChange, onReset }: CategoryFiltersProps) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#003B73]" />
          <h3 className="text-sm font-semibold text-slate-800">Filter Categories</h3>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="inline-flex h-10 items-center gap-2 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          Reset filters
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Search categories
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by name, slug, or description"
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
