"use client";

import React from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Inbox } from "lucide-react";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T | string;
  sortable?: boolean;
  cell?: (item: T) => React.ReactNode;
}

interface AdminDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  // Sort
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
  // Pagination
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

export default function AdminDataTable<T>({
  data,
  columns,
  loading = false,
  sortBy,
  sortOrder = "desc",
  onSort,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0,
}: AdminDataTableProps<T>) {
  
  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalItems || data.length);

  const paginationRange = (() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1];
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);

    if (left > 2) {
      pages.push(-1);
    }

    for (let page = left; page <= right; page += 1) {
      pages.push(page);
    }

    if (right < totalPages - 1) {
      pages.push(-1);
    }

    pages.push(totalPages);
    return pages;
  })();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col w-full">
      {/* Table responsive container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
              {columns.map((column, idx) => {
                const sortKey = (column.accessorKey as string) || "";
                const isSorted = sortBy === sortKey;

                return (
                  <th key={idx} className="py-4 px-6 font-semibold">
                    {column.sortable && onSort && sortKey ? (
                      <button
                        type="button"
                        onClick={() => handleSort(sortKey)}
                        className={`flex items-center gap-1 hover:text-slate-800 transition uppercase tracking-wider font-semibold ${
                          isSorted ? "text-slate-800" : ""
                        }`}
                      >
                        {column.header}
                        <ArrowUpDown className={`h-3.5 w-3.5 ${isSorted ? "text-[#0077C8]" : "text-slate-400"}`} />
                      </button>
                    ) : (
                      <span>{column.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              // Skeleton rows loading state
              [...Array(itemsPerPage || 5)].map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="py-4 px-6">
                      <div className="h-4 bg-slate-200 rounded w-2/3" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={columns.length} className="py-16 px-6 text-center">
                  <div className="max-w-md mx-auto space-y-2">
                    <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
                      <Inbox className="h-6 w-6 text-slate-400" />
                    </div>
                    <h4 className="text-base font-semibold text-slate-850">No records found</h4>
                    <p className="text-sm text-slate-500">
                      There is no data available to show right now.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((item, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/50 transition duration-150">
                  {columns.map((column, cIdx) => {
                    let cellContent: React.ReactNode;

                    if (column.cell) {
                      cellContent = column.cell(item);
                    } else if (column.accessorKey) {
                      const value = getNestedValue(item, column.accessorKey as string);
                      cellContent = value !== undefined && value !== null ? String(value) : "";
                    }

                    return (
                      <td key={cIdx} className="py-4 px-6 text-slate-700 text-sm">
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination component footer */}
      {!loading && data.length > 0 && onPageChange && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-t border-slate-100 bg-slate-50/50">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{startEntry}</span> to{" "}
            <span className="font-semibold text-slate-700">{endEntry}</span> of{" "}
            <span className="font-semibold text-slate-700">{totalItems || data.length}</span> entries
          </p>

          <nav className="flex items-center gap-2" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {paginationRange.map((pageNumber, idx) =>
              pageNumber === -1 ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-sm text-slate-400">
                  …
                </span>
              ) : (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`inline-flex min-w-[36px] h-9 items-center justify-center rounded-full px-3 text-sm font-semibold transition ${
                    pageNumber === currentPage
                      ? "bg-[#003B73] text-white shadow-sm shadow-slate-900/10"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            )}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
