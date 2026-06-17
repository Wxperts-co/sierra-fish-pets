"use client";

import React from "react";
import { Search, Plus, Download } from "lucide-react";

interface AdminTableToolbarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  // Primary Add Action
  onAddClick?: () => void;
  addLabel?: string;
  // Export Action
  onExportClick?: () => void;
  exportLabel?: string;
  // Left-aligned controls or custom filters
  children?: React.ReactNode;
}

export default function AdminTableToolbar({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  onAddClick,
  addLabel = "Add New",
  onExportClick,
  exportLabel = "Export",
  children,
}: AdminTableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
      {/* Left section: Search and child filters */}
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {onSearchChange !== undefined && (
          <div className="relative w-full sm:max-w-xs shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-slate-200 outline-none focus:border-[#0077C8] focus:ring-1 focus:ring-[#0077C8] transition bg-slate-50/50"
            />
          </div>
        )}
        {children}
      </div>

      {/* Right section: Action Buttons */}
      <div className="flex items-center gap-2.5 justify-end shrink-0">
        {onExportClick && (
          <button
            type="button"
            onClick={onExportClick}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition active:translate-y-px"
          >
            <Download className="h-4 w-4" />
            {exportLabel}
          </button>
        )}

        {onAddClick && (
          <button
            type="button"
            onClick={onAddClick}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#003B73] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002f5c] transition active:translate-y-px shadow-sm shadow-[#003B73]/15"
          >
            <Plus className="h-4.5 w-4.5" />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}
