"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showErrorToast } from "@/lib/toast";

const productSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  sku: z.string().min(1, "SKU is required"),
  categorySlug: z.string().min(1, "Category slug is required"),
  subcategorySlug: z.string().min(1, "Subcategory slug is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.coerce.number().nonnegative(),
  compareAtPrice: z.preprocess(
    (value) => {
      if (typeof value === "string" && value.trim() === "") {
        return null;
      }
      return value === null ? null : Number(value);
    },
    z.number().nonnegative().nullable().optional()
  ),
  images: z.string().min(1, "Enter one or more image URLs separated by commas"),
  shortDescription: z.string().min(1, "Short description is required"),
  description: z.string().min(1, "Description is required"),
  features: z.string().optional().default(""),
  tags: z.string().optional().default(""),
  stockStatus: z.enum(["in_stock", "low_stock", "out_of_stock"]),
  stockCount: z.coerce.number().nonnegative(),
  isNewArrival: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  dimensions: z.string().optional().default(""),
});

type ProductFormValues = z.infer<typeof productSchema>;

function normalizeList(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(", ");
  return "";
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Array.isArray(params?.productid) ? params?.productid[0] : params?.productid;

  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      id: "",
      name: "",
      slug: "",
      sku: "",
      categorySlug: "",
      subcategorySlug: "",
      brand: "",
      price: 0,
      compareAtPrice: null,
      images: "",
      shortDescription: "",
      description: "",
      features: "",
      tags: "",
      stockStatus: "in_stock",
      stockCount: 0,
      isNewArrival: false,
      isFeatured: false,
      isBestSeller: false,
      dimensions: "",
    },
  });

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/admin/products/${productId}`);

        if (response.data?.success) {
          const item = response.data.product;
          reset({
            id: item.id,
            name: item.name,
            slug: item.slug,
            sku: item.sku,
            categorySlug: item.categorySlug,
            subcategorySlug: item.subcategorySlug,
            brand: item.brand,
            price: item.price,
            compareAtPrice: item.compareAtPrice ?? null,
            images: normalizeList(item.images),
            shortDescription: item.shortDescription,
            description: item.description,
            features: normalizeList(item.features),
            tags: normalizeList(item.tags),
            stockStatus: item.stockStatus,
            stockCount: item.stockCount,
            isNewArrival: item.isNewArrival,
            isFeatured: item.isFeatured,
            isBestSeller: item.isBestSeller,
            dimensions: item.dimensions ?? "",
          });
        } else {
          showErrorToast(response.data?.message || "Failed to load product");
        }
      } catch (error) {
        console.error("Failed to load product:", error);
        showErrorToast("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, reset]);

  const onSubmit = async (values: ProductFormValues) => {
    if (!productId) return;
    setSubmitError(null);

    const payload = {
      id: values.id.trim(),
      name: values.name.trim(),
      slug: values.slug.trim(),
      sku: values.sku.trim(),
      categorySlug: values.categorySlug.trim(),
      subcategorySlug: values.subcategorySlug.trim(),
      brand: values.brand.trim(),
      price: values.price,
      compareAtPrice: values.compareAtPrice ?? null,
      images: values.images
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      shortDescription: values.shortDescription.trim(),
      description: values.description.trim(),
      features: values.features
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      tags: values.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      stockStatus: values.stockStatus,
      stockCount: values.stockCount,
      isNewArrival: values.isNewArrival,
      isFeatured: values.isFeatured,
      isBestSeller: values.isBestSeller,
      dimensions: values.dimensions.trim(),
    };

    try {
      const response = await axios.patch(`/api/admin/products/${productId}`, payload);

      if (response.data?.success) {
        router.push("/admin/products");
      } else {
        setSubmitError(response.data?.message || "Failed to save product");
      }
    } catch (error: any) {
      console.error("Failed to save product:", error);
      setSubmitError(error?.response?.data?.message || "Failed to save product");
      showErrorToast("Failed to save product");
    }
  };

  const handleDelete = async () => {
    if (!productId || isDeleting) return;

    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await axios.delete(`/api/admin/products/${productId}`);
      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to delete product:", error);
      showErrorToast("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin/products"
          className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isDeleting ? "Deleting..." : "Delete Product"}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-900">Edit Product</h1>
          <p className="mt-2 text-sm text-slate-500">Update product details or inventory values.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Product ID</label>
              <Input type="text" {...register("id")} />
              {errors.id && <p className="text-xs text-red-600">{errors.id.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <Input type="text" {...register("name")} />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Slug</label>
              <Input type="text" {...register("slug")} />
              {errors.slug && <p className="text-xs text-red-600">{errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">SKU</label>
              <Input type="text" {...register("sku")} />
              {errors.sku && <p className="text-xs text-red-600">{errors.sku.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Category Slug</label>
              <Input type="text" {...register("categorySlug")} />
              {errors.categorySlug && (
                <p className="text-xs text-red-600">{errors.categorySlug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Subcategory Slug</label>
              <Input type="text" {...register("subcategorySlug")} />
              {errors.subcategorySlug && (
                <p className="text-xs text-red-600">{errors.subcategorySlug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Brand</label>
              <Input type="text" {...register("brand")} />
              {errors.brand && <p className="text-xs text-red-600">{errors.brand.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Price</label>
              <Input type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
              {errors.price && <p className="text-xs text-red-600">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Compare At Price</label>
              <Input type="number" step="0.01" {...register("compareAtPrice")} />
              {errors.compareAtPrice && (
                <p className="text-xs text-red-600">{errors.compareAtPrice.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Image URLs</label>
              <Input type="text" {...register("images")} placeholder="Enter URLs separated by commas" />
              {errors.images && <p className="text-xs text-red-600">{errors.images.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Features</label>
              <Input type="text" {...register("features")} placeholder="comma-separated feature list" />
              {errors.features && <p className="text-xs text-red-600">{errors.features.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Tags</label>
              <Input type="text" {...register("tags")} placeholder="comma-separated tags" />
              {errors.tags && <p className="text-xs text-red-600">{errors.tags.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Stock Status</label>
              <select
                className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
                {...register("stockStatus")}
              >
                <option value="in_stock">In stock</option>
                <option value="low_stock">Low stock</option>
                <option value="out_of_stock">Out of stock</option>
              </select>
              {errors.stockStatus && (
                <p className="text-xs text-red-600">{errors.stockStatus.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Stock Count</label>
              <Input type="number" {...register("stockCount", { valueAsNumber: true })} />
              {errors.stockCount && (
                <p className="text-xs text-red-600">{errors.stockCount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Dimensions</label>
              <Input type="text" {...register("dimensions")} />
              {errors.dimensions && (
                <p className="text-xs text-red-600">{errors.dimensions.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Short Description</label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
                {...register("shortDescription")}
              />
              {errors.shortDescription && (
                <p className="text-xs text-red-600">{errors.shortDescription.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register("isNewArrival")} />
              New arrival
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register("isFeatured")} />
              Featured
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register("isBestSeller")} />
              Best seller
            </label>
          </div>

          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-slate-500">Edit and save product details for the storefront.</p>
            </div>
            <Button type="submit" className="min-w-[160px]" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
