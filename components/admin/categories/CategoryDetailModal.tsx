"use client";

import Image from "next/image";
import AdminModal from "@/components/admin/common/AdminModal";
import type { AdminCategory } from "./types";

type CategoryDetailModalProps = {
  isOpen: boolean;
  category?: AdminCategory | null;
  onClose: () => void;
};

export default function CategoryDetailModal({
  isOpen,
  category,
  onClose,
}: CategoryDetailModalProps) {
  if (!isOpen || !category) return null;

  const imageSrc = category.image ?? "/images/categories/default.png";
  const description = category.description ?? "No description available";
  const productCount = category.productCount ?? 0;
  const subcategories = Array.from(
    new Map((category.subcategories ?? []).map((sub) => [sub.slug || sub.id, sub])).values()
  );

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={`Category details`} size="md">
      <div className="space-y-5">
        {/* Core Details Row */}
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Category Image */}
          <div className="w-full sm:w-36 h-28 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 relative">
            <Image
              src={imageSrc}
              alt={category.name}
              fill
              className="object-cover"
              sizes="144px"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category Name</p>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">{category.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Slug</p>
              <p className="text-sm font-semibold text-slate-600 mt-0.5 truncate">{category.slug}</p>
            </div>
          </div>
        </div>

        {/* Description Box */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</p>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100/80">
            {description}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-3 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Products</p>
            <p className="mt-1 text-xl font-black text-slate-800">{productCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-3 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subcategories</p>
            <p className="mt-1 text-xl font-black text-slate-800">{subcategories.length}</p>
          </div>
        </div>

        {/* Subcategories List */}
        <div className="rounded-2xl border border-slate-150 bg-slate-50/30 p-4">
          <p className="text-xs font-bold text-slate-700">Subcategories List</p>
          <div className="mt-2.5 max-h-32 overflow-y-auto space-y-1.5 pr-1">
            {subcategories.length > 0 ? (
              subcategories.map((sub) => (
                <div key={sub.id} className="rounded-xl border border-slate-200/60 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm flex items-center justify-between">
                  <span>{sub.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{sub.slug}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No subcategories assigned.</p>
            )}
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
