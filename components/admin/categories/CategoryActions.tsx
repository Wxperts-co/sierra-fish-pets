"use client";

import { Eye, Edit3, Trash2 } from "lucide-react";

type CategoryActionsProps = {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function CategoryActions({ onView, onEdit, onDelete }: CategoryActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onView}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
        aria-label="View category"
      >
        <Eye className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
        aria-label="Edit category"
      >
        <Edit3 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white hover:bg-rose-600 transition"
        aria-label="Delete category"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
