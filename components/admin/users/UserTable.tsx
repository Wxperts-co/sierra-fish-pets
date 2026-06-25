"use client";

import { ArrowUpDown, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Shield, Calendar } from "lucide-react";
import Image from "next/image";
import UserActions from "./UserActions";

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  status: "active" | "inactive" | "banned";
  isEmailVerified: boolean;
  avatar?: {
    url: string;
    public_id: string;
  };
  createdAt: string;
};

type UserTableProps = {
  users: User[];
  loading?: boolean;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus?: (user: User) => void;

  // Sort state & handlers
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;

  // Pagination state & handlers
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
};

export default function UserTable({
  users,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  sortBy = "createdAt",
  sortOrder = "desc",
  onSort,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0,
}: UserTableProps) {
  
  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const statusBadges = {
    active: "bg-green-50 text-green-700 border border-green-200/50",
    inactive: "bg-slate-50 text-slate-600 border border-slate-200/50",
    banned: "bg-rose-50 text-rose-700 border border-rose-200/50",
  };

  const roleBadges = {
    user: "bg-blue-50 text-blue-700 border border-blue-200/50",
    admin: "bg-purple-50 text-purple-700 border border-purple-200/50",
  };

  // Helper for computing page display entries
  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalItems || users.length);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
      {/* Scrollable Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
              <th className="py-4 px-6 font-semibold min-w-[300px]">
                <button
                  type="button"
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 hover:text-slate-800 transition uppercase tracking-wider font-semibold"
                >
                  User
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </th>
              <th className="py-4 px-6 font-semibold min-w-[120px]">
                <button
                  type="button"
                  onClick={() => handleSort("role")}
                  className="flex items-center gap-1 hover:text-slate-800 transition uppercase tracking-wider font-semibold"
                >
                  Role
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </th>
              <th className="py-4 px-6 font-semibold min-w-[120px]">
                <button
                  type="button"
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-1 hover:text-slate-800 transition uppercase tracking-wider font-semibold"
                >
                  Status
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </th>
              <th className="py-4 px-6 font-semibold text-center uppercase tracking-wider min-w-[100px]">
                Verified
              </th>
              <th className="py-4 px-6 font-semibold min-w-[140px]">
                <button
                  type="button"
                  onClick={() => handleSort("createdAt")}
                  className="flex items-center gap-1 hover:text-slate-800 transition uppercase tracking-wider font-semibold"
                >
                  Joined
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </th>
              <th className="py-4 px-6 font-semibold text-right uppercase tracking-wider min-w-[120px]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              // Skeleton rows loading
              [...Array(itemsPerPage || 5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-200 shrink-0" />
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-28" />
                        <div className="h-3 bg-slate-200 rounded w-36" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-6 bg-slate-200 rounded-full w-16" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-6 bg-slate-200 rounded-full w-20" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-5 bg-slate-200 rounded-full w-5 mx-auto" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-slate-200 rounded w-20" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end gap-2">
                      <div className="h-9 w-9 rounded-full bg-slate-200" />
                      <div className="h-9 w-9 rounded-full bg-slate-200" />
                      <div className="h-9 w-9 rounded-full bg-slate-200" />
                    </div>
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={6} className="py-12 px-6 text-center">
                  <div className="max-w-md mx-auto space-y-2">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                      <Shield className="h-6 w-6 text-slate-400" />
                    </div>
                    <h4 className="text-base font-semibold text-slate-800">No users found</h4>
                    <p className="text-sm text-slate-500">
                      Try adjusting your search criteria or resetting filters to find what you are looking for.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Users rows
              users.map((user) => {
                const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition duration-150">
                    {/* User Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0">
                          {user.avatar?.url ? (
                            <Image
                              src={user.avatar.url}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover border border-slate-150 shadow-sm"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#003B73] to-[#0077C8] flex items-center justify-center text-white text-sm font-bold shadow-sm select-none">
                              {user.name[0]?.toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="leading-tight">
                          <p className="font-semibold text-slate-800 text-sm hover:text-[#0077C8] transition cursor-pointer" onClick={() => onView(user)}>
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${roleBadges[user.role] || "bg-slate-100 text-slate-700"}`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusBadges[user.status] || "bg-slate-100 text-slate-700"}`}>
                        {user.status}
                      </span>
                    </td>

                    {/* Email Verified */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center">
                        {user.isEmailVerified ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-50" aria-label="Verified" />
                        ) : (
                          <XCircle className="h-5 w-5 text-slate-300" aria-label="Unverified" />
                        )}
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-6 text-slate-600 text-sm">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {joinDate}
                      </div>
                    </td>

                    {/* Action Panel */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end">
                        <UserActions
                          onView={() => onView(user)}
                          onEdit={() => onEdit(user)}
                          onDelete={() => onDelete(user)}
                          onToggleStatus={onToggleStatus ? () => onToggleStatus(user) : undefined}
                          status={user.status}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination panel */}
      {!loading && users.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-t border-slate-100 bg-slate-50/50">
          {/* Summary */}
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{startEntry}</span> to{" "}
            <span className="font-semibold text-slate-700">{endEntry}</span> of{" "}
            <span className="font-semibold text-slate-700">{totalItems || users.length}</span> entries
          </p>

          {/* Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;
              const isSelected = pageNumber === currentPage;
              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition ${
                    isSelected
                      ? "bg-[#003B73] text-white shadow-sm shadow-slate-900/10"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
