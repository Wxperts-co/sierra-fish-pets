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
      if (typeof value === "string" && value.trim() === "") return null;
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
  shippingType: z.enum(["standard", "free_shipping", "in_store_only", "drop_ship"]).optional().default("standard"),
  isNewArrival: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  dimensions: z.string().optional().default(""),
});

type ProductFormValues = z.infer<typeof productSchema>;

const defaultValues: ProductFormValues = {
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
  shippingType: "standard",
  isNewArrival: false,
  isFeatured: false,
  isBestSeller: false,
  dimensions: "",
};

export default function AddProductPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues,
  });

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: "images", folder: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const data = new FormData();
    data.append("folder", folder);
    for (let i = 0; i < files.length; i++) {
      data.append("file", files[i]);
    }
    try {
      const res = await axios.post("/api/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success) {
        const urls = res.data.urls || [res.data.url];
        const currentValue = watch("images") || "";
        const updatedValue = currentValue
          ? `${currentValue}, ${urls.join(", ")}`
          : urls.join(", ");
        setValue("images", updatedValue);
      }
    } catch (err) {
      console.error(err);
      showErrorToast("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitError(null);
    setSuccessMessage(null);

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
      shippingType: values.shippingType,
      isNewArrival: values.isNewArrival,
      isFeatured: values.isFeatured,
      isBestSeller: values.isBestSeller,
      dimensions: values.dimensions.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post("/api/admin/products", payload);

      if (response.data?.success) {
        setSuccessMessage("Product created successfully.");
        setTimeout(() => {
          router.push("/admin/products");
        }, 1000);
      } else {
        setSubmitError(response.data?.message || "Failed to create product");
      }
    } catch (error: any) {
      console.error(error);
      setSubmitError(error.response?.data?.message || "Failed to create product");
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="rounded-lg p-2 hover:bg-slate-100 transition"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add New Product</h1>
          <p className="text-xs text-slate-500">
            Create a new item in your catalog
          </p>
        </div>
      </div>

      {submitError && (
        <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600">
          {submitError}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-600">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4 shadow-sm">
          {/* GRID OF BASIC INPUTS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Product ID", field: "id" },
              { label: "Name", field: "name" },
              { label: "Slug", field: "slug" },
              { label: "SKU", field: "sku" },
              { label: "Category Slug", field: "categorySlug" },
              { label: "Subcategory Slug", field: "subcategorySlug" },
              { label: "Brand", field: "brand" },
              { label: "Price ($)", field: "price", type: "number" },
              { label: "Compare At Price ($)", field: "compareAtPrice", type: "number" },
              { label: "Stock Count", field: "stockCount", type: "number" },
              { label: "Dimensions", field: "dimensions" },
            ].map(({ label, field, type }) => (
              <div key={field} className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  {label}
                </label>
                <Input
                  type={type || "text"}
                  className="h-8 text-sm"
                  {...register(field as any)}
                />
                {(errors as any)[field] && (
                  <p className="text-[11px] text-red-600">
                    {(errors as any)[field]?.message}
                  </p>
                )}
              </div>
            ))}

            {/* Stock Status */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Stock Status
              </label>
              <select
                className="h-8 w-full rounded-lg border border-slate-200 px-2 text-sm"
                {...register("stockStatus")}
              >
                <option value="in_stock">In stock</option>
                <option value="low_stock">Low stock</option>
                <option value="out_of_stock">Out of stock</option>
              </select>
            </div>

            {/* Shipping Way / Fulfillment Mode */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">
                Shipping Way / Fulfillment
              </label>
              <select
                className="h-8 w-full rounded-lg border border-slate-200 px-2 text-sm"
                {...register("shippingType")}
              >
                <option value="standard">Standard Shipping (Calculated Freight)</option>
                <option value="free_shipping">Free Shipping</option>
                <option value="in_store_only">Store Pickup Only (In-Store)</option>
                <option value="drop_ship">Drop-Ship Direct (Free Shipping)</option>
              </select>
            </div>
          </div>

          {/* TEXT AREAS */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Short Description
              </label>
              <textarea
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm"
                {...register("shortDescription")}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Description
              </label>
              <textarea
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm"
                {...register("description")}
              />
            </div>
          </div>

          {/* LIST FIELDS */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Features
              </label>
              <Input
                className="h-8 text-sm"
                placeholder="comma separated"
                {...register("features")}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Tags
              </label>
              <Input
                className="h-8 text-sm"
                placeholder="comma separated"
                {...register("tags")}
              />
            </div>
          </div>

          {/* IMAGES */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Images
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e, "images", "products")}
                  disabled={uploading}
                  className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#005AA9] hover:file:bg-blue-100 cursor-pointer"
                />
                {uploading && <span className="text-xs text-slate-400 animate-pulse">Uploading...</span>}
              </div>
              <Input
                className="h-8 text-sm"
                placeholder="comma separated URLs"
                {...register("images")}
              />
              {watch("images") && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {watch("images")
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
                    .map((url, i) => (
                      <img key={i} src={url} alt={`Preview ${i}`} className="h-12 w-12 object-cover rounded-lg border border-slate-200" />
                    ))}
                </div>
              )}
            </div>
            {errors.images && (
              <p className="text-[11px] text-red-600">
                {errors.images.message}
              </p>
            )}
          </div>

          {/* CHECKBOXES */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-700">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("isNewArrival")} />
              New Arrival
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("isFeatured")} />
              Featured
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("isBestSeller")} />
              Best Seller
            </label>
          </div>

          {/* STATUS */}
          {submitError && (
            <div className="rounded-lg bg-red-50 p-2 text-xs text-red-600">
              {submitError}
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg bg-emerald-50 p-2 text-xs text-emerald-600">
              {successMessage}
            </div>
          )}

          {/* FOOTER */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-slate-500">
              All required fields must be filled.
            </p>

            <Button
              type="submit"
              className="min-w-[140px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Create"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}