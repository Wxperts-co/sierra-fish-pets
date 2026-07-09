"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Switch from "@mui/material/Switch";
import { Trash2 } from "lucide-react";
import AdminModal from "@/components/admin/common/AdminModal";
import type { AdminCategory } from "./types";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

type SubcategoriesManageModalProps = {
  isOpen: boolean;
  category?: AdminCategory | null;
  onClose: () => void;
  onUpdateCategory: (updatedCategory: AdminCategory) => void;
};

export default function SubcategoriesManageModal({
  isOpen,
  category,
  onClose,
  onUpdateCategory,
}: SubcategoriesManageModalProps) {
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setSubcategories(category.subcategories ?? []);
    } else {
      setSubcategories([]);
    }
  }, [category]);

  if (!isOpen || !category) return null;

  const handleToggle = async (subId: string, currentActive: boolean) => {
    setSavingId(subId);
    
    // Optimistic local state update
    const updatedSubcategories = subcategories.map((sub) =>
      sub.id === subId ? { ...sub, isActive: !currentActive } : sub
    );
    setSubcategories(updatedSubcategories);

    try {
      const response = await axios.patch(`/api/admin/categories/${category._id}`, {
        subcategories: updatedSubcategories,
      });

      if (response.data?.success) {
        showSuccessToast("Subcategory visibility updated successfully.");
        if (onUpdateCategory) {
          onUpdateCategory(response.data.category);
        }
      } else {
        // Revert on error
        setSubcategories(subcategories);
        showErrorToast(response.data?.message || "Failed to update subcategory visibility.");
      }
    } catch (error) {
      // Revert on error
      setSubcategories(subcategories);
      console.error("Failed to update subcategory visibility:", error);
      showErrorToast("Failed to update subcategory visibility.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (subId: string, subName: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete the subcategory "${subName}"?`);
    if (!confirmed) return;

    setSavingId(subId);

    // Optimistic local state update
    const updatedSubcategories = subcategories.filter((sub) => sub.id !== subId);
    setSubcategories(updatedSubcategories);

    try {
      const response = await axios.patch(`/api/admin/categories/${category._id}`, {
        subcategories: updatedSubcategories,
      });

      if (response.data?.success) {
        showSuccessToast("Subcategory deleted successfully.");
        if (onUpdateCategory) {
          onUpdateCategory(response.data.category);
        }
      } else {
        // Revert on error
        setSubcategories(subcategories);
        showErrorToast(response.data?.message || "Failed to delete subcategory.");
      }
    } catch (error) {
      // Revert on error
      setSubcategories(subcategories);
      console.error("Failed to delete subcategory:", error);
      showErrorToast("Failed to delete subcategory.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={`Manage Subcategories - ${category.name}`} size="md">
      <div className="space-y-4">
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Toggle subcategories on or off. Disabled subcategories will be hidden from client-side navigation, mobile menus, sidebars, and filters.
        </p>

        <div className="rounded-2xl border border-slate-150 bg-slate-50/30 p-4 max-h-96 overflow-y-auto space-y-2.5">
          {subcategories.length > 0 ? (
            subcategories.map((sub) => {
              const isActive = sub.isActive !== false;
              const isSaving = savingId === sub.id;

              return (
                <div
                  key={sub.id}
                  className="rounded-xl border border-slate-200/60 bg-white px-4 py-3 text-sm shadow-sm flex items-center justify-between transition-all hover:border-slate-300"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800">{sub.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{sub.slug}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isActive ? "text-[#005AA9]" : "text-slate-400"}`}>
                        {isActive ? "Show" : "Hide"}
                      </span>
                      <Switch
                        checked={isActive}
                        disabled={isSaving}
                        size="small"
                        onChange={() => handleToggle(sub.id, isActive)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#005AA9',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#005AA9',
                          },
                        }}
                      />
                    </div>
                    <button
                      onClick={() => handleDelete(sub.id, sub.name)}
                      disabled={isSaving}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg active:scale-95 transition-all disabled:opacity-50"
                      title="Delete subcategory"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 italic text-center py-6">No subcategories assigned to this category.</p>
          )}
        </div>
      </div>
    </AdminModal>
  );
}
