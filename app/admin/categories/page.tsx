"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Plus } from "lucide-react";

import CategoryFilters from "@/components/admin/categories/CategoryFilters";
import CategoryStats from "@/components/admin/categories/CategoryStats";
import CategoryDataGrid from "@/components/admin/categories/CategoryDataGrid";
import CategoryDetailModal from "@/components/admin/categories/CategoryDetailModal";
import SubcategoriesManageModal from "@/components/admin/categories/SubcategoriesManageModal";
import type { AdminCategory } from "@/components/admin/categories/types";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "@/lib/toast";
import { exportCategoriesToExcel } from "@/lib/export/categoriesExport";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<AdminCategory | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSubcategoriesModalOpen, setIsSubcategoriesModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/admin/categories");

        if (response.data?.success) {
          setCategories(response.data.categories || []);
        } else {
          showErrorToast(response.data?.message || "Failed to load categories");
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
        showErrorToast("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    return categories.filter((category) => {
      const description = String(category.description || "").toLowerCase();
      return (
        !term ||
        category.name.toLowerCase().includes(term) ||
        category.slug.toLowerCase().includes(term) ||
        description.includes(term)
      );
    });
  }, [categories, search]);

  const itemsPerPage = 10;
  const totalItems = filteredCategories.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const displayedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteCategory = async (categoryId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    try {
      await axios.delete(`/api/admin/categories/${categoryId}`);
      setCategories((prev) => prev.filter((category) => category._id !== categoryId));
    } catch (error) {
      console.error("Failed to delete category:", error);
      showErrorToast("Failed to delete category");
    }
  };

  const handleViewCategory = (category: AdminCategory) => {
    setSelectedCategory(category);
    setIsDetailModalOpen(true);
  };

  const handleEditCategory = (category: AdminCategory) => {
    router.push(`/admin/categories/${category._id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Categories</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Manage catalog categories, metadata, and subcategory structure.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => exportCategoriesToExcel(categories)}
            className="h-11 rounded-2xl border-slate-200 font-semibold px-5 active:scale-95 transition-all text-slate-600 hover:bg-slate-50"
          >
            Export Excel
          </Button>

          <Button
            type="button"
            onClick={() => router.push("/admin/categories/add")}
            className="h-11 rounded-2xl bg-[#005AA9] hover:bg-[#003B73] text-white font-bold text-sm px-6 shadow-md transition-all active:scale-95"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      <CategoryStats categories={categories} loading={loading} />

      <div className="grid gap-6">
        <CategoryFilters
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          onReset={() => {
            setSearch("");
            setCurrentPage(1);
          }}
        />

        <CategoryDataGrid
          categories={categories}
          loading={loading}
          onView={handleViewCategory}
          onEdit={handleEditCategory}
          onDelete={(category) => handleDeleteCategory(category._id)}
          onManageSubcategories={(category) => {
            setSelectedCategory(category);
            setIsSubcategoriesModalOpen(true);
          }}
        />

        <CategoryDetailModal
          isOpen={isDetailModalOpen}
          category={selectedCategory}
          onClose={() => setIsDetailModalOpen(false)}
        />

        <SubcategoriesManageModal
          isOpen={isSubcategoriesModalOpen}
          category={selectedCategory}
          onClose={() => setIsSubcategoriesModalOpen(false)}
          onUpdateCategory={(updatedCategory) => {
            setCategories((prev) =>
              prev.map((c) => (c._id === updatedCategory._id ? updatedCategory : c))
            );
            setSelectedCategory(updatedCategory);
          }}
        />
      </div>
    </div>
  );
}
