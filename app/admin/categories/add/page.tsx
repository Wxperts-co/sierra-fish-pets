"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "@/lib/toast";

const categorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image is required"),
  icon: z.string().min(1, "Icon is required"),
  productCount: z.coerce.number().nonnegative("Product count must be non-negative"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

type Subcategory = { id: string; name: string; slug: string };

const defaultValues: CategoryFormValues = {
  id: "",
  name: "",
  slug: "",
  description: "",
  image: "",
  icon: "",
  productCount: 0,
};

export default function AddCategoryPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: "image" | "icon", folder: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", folder);
    try {
      const res = await axios.post("/api/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success) {
        setValue(fieldName, res.data.url);
      }
    } catch (err) {
      console.error(err);
      showErrorToast("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const addSubcategory = () => {
    setSubcategories((prev) => [...prev, { id: "", name: "", slug: "" }]);
  };

  const removeSubcategory = (index: number) => {
    setSubcategories((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSubcategory = (index: number, field: keyof Subcategory, value: string) => {
    setSubcategories((prev) =>
      prev.map((sub, i) => (i === index ? { ...sub, [field]: value } : sub))
    );
  };

  const onSubmit = async (values: CategoryFormValues) => {
    setSubmitError(null);
    setSuccessMessage(null);

    const payload = {
      id: values.id.trim(),
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description.trim(),
      image: values.image.trim(),
      icon: values.icon.trim(),
      productCount: values.productCount,
      subcategories: subcategories.filter((s) => s.id && s.name && s.slug),
    };

    try {
      const response = await axios.post("/api/admin/categories", payload);

      if (response.data?.success) {
        setSuccessMessage("Category created successfully.");
        setTimeout(() => router.push("/admin/categories"), 700);
      } else {
        setSubmitError(response.data?.message || "Failed to create category.");
      }
    } catch (error: any) {
      console.error("Failed to create category:", error);
      setSubmitError(error?.response?.data?.message || "Failed to create category.");
      showErrorToast("Failed to create category.");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin/categories"
          className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-900">Add New Category</h1>
          <p className="mt-2 text-sm text-slate-500">
            Create a new category and define its subcategories for products.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Category ID</label>
              <Input type="text" {...register("id")} />
              {errors.id && <p className="text-xs text-rose-600">{errors.id.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <Input type="text" {...register("name")} />
              {errors.name && <p className="text-xs text-rose-600">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Slug</label>
              <Input type="text" {...register("slug")} />
              {errors.slug && <p className="text-xs text-rose-600">{errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Image</label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  {watch("image") && (
                    <img src={watch("image")} alt="Preview" className="h-10 w-10 object-cover rounded-lg border border-slate-200" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "image", "categories")}
                    disabled={uploading}
                    className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#005AA9] hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
                <Input type="text" placeholder="Or enter Image URL" {...register("image")} />
              </div>
              {errors.image && <p className="text-xs text-rose-600">{errors.image.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Icon</label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  {watch("icon") && (
                    <img src={watch("icon")} alt="Preview" className="h-10 w-10 object-cover rounded-lg border border-slate-200" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "icon", "categories")}
                    disabled={uploading}
                    className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#005AA9] hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
                <Input type="text" placeholder="Or enter Icon URL" {...register("icon")} />
              </div>
              {errors.icon && <p className="text-xs text-rose-600">{errors.icon.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Product Count</label>
              <Input type="number" {...register("productCount", { valueAsNumber: true })} />
              {errors.productCount && (
                <p className="text-xs text-rose-600">{errors.productCount.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              rows={4}
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#003B73] focus:ring-1 focus:ring-[#003B73]/20"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-rose-600">{errors.description.message}</p>
            )}
          </div>

          {/* Subcategories */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-slate-700">Subcategories</label>
                <p className="text-xs text-slate-400 mt-0.5">Add each subcategory with its ID, display name, and URL slug.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addSubcategory}
                className="h-8 rounded-lg px-3 text-xs gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Subcategory
              </Button>
            </div>

            {subcategories.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
                No subcategories yet. Click &quot;Add Subcategory&quot; to add one.
              </div>
            ) : (
              <div className="space-y-2">
                {/* Header Row */}
                <div className="grid grid-cols-[1fr_1fr_1fr_36px] gap-2 px-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">ID</span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Slug</span>
                  <span></span>
                </div>
                {subcategories.map((sub, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_1fr_36px] gap-2 items-center">
                    <Input
                      type="text"
                      placeholder="e.g. cat-dogs"
                      value={sub.id}
                      onChange={(e) => updateSubcategory(index, "id", e.target.value)}
                      className="h-9 text-sm"
                    />
                    <Input
                      type="text"
                      placeholder="e.g. Dogs"
                      value={sub.name}
                      onChange={(e) => updateSubcategory(index, "name", e.target.value)}
                      className="h-9 text-sm"
                    />
                    <Input
                      type="text"
                      placeholder="e.g. dogs"
                      value={sub.slug}
                      onChange={(e) => updateSubcategory(index, "slug", e.target.value)}
                      className="h-9 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubcategory(index)}
                      className="h-9 w-9 flex items-center justify-center rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {submitError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {submitError}
            </div>
          )}

          {successMessage && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/categories")}
              className="h-11 rounded-xl"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="h-11 rounded-xl">
              {isSubmitting ? "Saving..." : "Create Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
