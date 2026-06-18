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
    <AdminModal isOpen={isOpen} onClose={onClose} title={`Category details: ${category.name}`} size="lg">
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-50">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={imageSrc}
                alt={category.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 220px"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Slug</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{category.slug}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Description</p>
              <p className="mt-1 text-sm text-slate-600 leading-7">{description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Products</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{productCount}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Subcategories</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{subcategories.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">Subcategory list</p>
              <p className="text-xs text-slate-500">Showing all assigned subcategories.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            {subcategories.length > 0 ? (
              subcategories.map((sub) => (
                <div key={sub.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="font-semibold text-slate-900">{sub.name}</p>

                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No subcategories available.</p>
            )}
          </div>
        </div>
      </div>
    </AdminModal>
  );
}
