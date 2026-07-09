"use client";

import { Search, RotateCcw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FilterState = {
  search: string;
  role: string;
  status: string;
  isEmailVerified: string;
};

type UserFiltersProps = {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
};

export default function UserFilters({
  filters,
  onFilterChange,
  onReset,
}: UserFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleSelectChange = (field: keyof FilterState) => (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onFilterChange({ [field]: e.target.value });
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
      {/* Header section of filters */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Filter className="h-4 w-4 text-[#003B73]" />
        <h3 className="text-sm font-semibold text-slate-800">Filter Customers</h3>
      </div>

      {/* Input controls grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Search */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Search User
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Name, email, phone..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-slate-200 outline-none focus:border-[#0077C8] focus:ring-1 focus:ring-[#0077C8] transition bg-slate-50/50"
            />
          </div>
        </div>

        {/* Role */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Role
          </label>
          <select
            value={filters.role}
            onChange={handleSelectChange("role")}
            className="w-full h-9 px-3 text-sm rounded-lg border border-slate-200 outline-none focus:border-[#0077C8] focus:ring-1 focus:ring-[#0077C8] transition bg-slate-50/50 text-slate-700 font-medium"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Administrator</option>
            <option value="manager">Manager</option>
            <option value="sales">Sales</option>
            <option value="delivery boy">Delivery Boy</option>
          </select>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Status
          </label>
          <select
            value={filters.status}
            onChange={handleSelectChange("status")}
            className="w-full h-9 px-3 text-sm rounded-lg border border-slate-200 outline-none focus:border-[#0077C8] focus:ring-1 focus:ring-[#0077C8] transition bg-slate-50/50 text-slate-700 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="banned">Banned</option>
          </select>
        </div>

        {/* Email Verification */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Verification
          </label>
          <select
            value={filters.isEmailVerified}
            onChange={handleSelectChange("isEmailVerified")}
            className="w-full h-9 px-3 text-sm rounded-lg border border-slate-200 outline-none focus:border-[#0077C8] focus:ring-1 focus:ring-[#0077C8] transition bg-slate-50/50 text-slate-700 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      {/* Footer controls: Reset action */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition active:translate-y-px"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Filters
        </button>
      </div>
    </div>
  );
}
