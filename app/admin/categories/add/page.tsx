"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "@/lib/toast";

const categorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image URL is required"),
  icon: z.string().min(1, "Icon URL is required"),
  productCount: z.coerce.number().nonnegative("Product count must be non-negative"),
  subcategories: z
    .string()
    .optional()
    .transform((value) =>
      value
        ?.split(";")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((entry) => {
          const [id, name, slug] = entry.split(",").map((part) => part.trim());
          return { id, name, slug };
        })
    )
    .refine((list) => list?.every((item) => item.id && item.name && item.slug), {
      message: "Subcategories must be entered as id,name,slug separated by semicolons",
    }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const defaultValues: CategoryFormValues = {
  id: "",
  name: "",
  slug: "",
  description: "",
  image: "",
  icon: "",
  productCount: 0,
  subcategories: undefined,
};

export default function AddCategoryPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues,
  });

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
      subcategories: values.subcategories || [],
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
              <label className="block text-sm font-medium text-slate-700">Image URL</label>
              <Input type="text" {...register("image")} />
              {errors.image && <p className="text-xs text-rose-600">{errors.image.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Icon URL</label>
              <Input type="text" {...register("icon")} />
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Subcategories
            </label>
            <textarea
              rows={4}
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#003B73] focus:ring-1 focus:ring-[#003B73]/20"
              placeholder="Enter subcategories as id,name,slug; separate multiple with semicolons"
              {...register("subcategories")}
            />
            {errors.subcategories && (
              <p className="text-xs text-rose-600">{errors.subcategories.message}</p>
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
