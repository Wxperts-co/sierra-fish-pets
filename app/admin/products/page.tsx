"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import ProductDataGrid from "@/components/admin/products/ProductDataGrid";
import { showErrorToast } from "@/lib/toast";
import { AlertTriangle, Box, CheckCircle2, Download, Edit3, Eye, Filter, Package, Plus, RotateCcw, Search, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportProductsToExcel, importProductsFromExcel, ExportProduct } from "@/lib/export/productsExport";
import type { IRetailerCsvData } from "@/lib/products/retailerCsvColumns";

type Product = {
  _id: string;
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  price: number;
  compareAtPrice?: number | null;
  categorySlug?: string;
  subcategorySlug?: string;
  images?: string[];
  description?: string;
  shortDescription?: string;
  tags?: string[];
  isFeatured?: boolean;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  stockCount: number;
  createdAt: string;
  retailerCsvData?: Partial<IRetailerCsvData>;
};

const stockLabels: Record<Product["stockStatus"], string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [filters, setFilters] = useState({ search: "", stockStatus: "all" });
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/admin/products");

        if (response.data?.success) {
          setProducts(response.data.products || []);
        } else {
          showErrorToast(response.data?.message || "Failed to load products");
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        showErrorToast("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = filters.search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term);

      const matchesStock =
        filters.stockStatus === "all" || product.stockStatus === filters.stockStatus;

      return matchesSearch && matchesStock;
    });
  }, [products, filters]);

  const stats = {
    total: products.length,
    inStock: products.filter((product) => product.stockStatus === "in_stock").length,
    lowStock: products.filter((product) => product.stockStatus === "low_stock").length,
    outOfStock: products.filter((product) => product.stockStatus === "out_of_stock").length,
  };

  const statCards = [
    {
      label: "Total Products",
      value: stats.total,
      icon: Package,
      color: "from-[#003B73] to-[#005EA8]",
      bgGlow: "bg-blue-500/10",
    },
    {
      label: "In Stock",
      value: stats.inStock,
      icon: CheckCircle2,
      color: "from-emerald-600 to-teal-500",
      bgGlow: "bg-emerald-500/10",
    },
    {
      label: "Low Stock",
      value: stats.lowStock,
      icon: AlertTriangle,
      color: "from-purple-600 to-indigo-500",
      bgGlow: "bg-purple-500/10",
    },
    {
      label: "Out of Stock",
      value: stats.outOfStock,
      icon: Box,
      color: "from-rose-600 to-red-500",
      bgGlow: "bg-rose-500/10",
    },
  ];

  const handleExportExcel = async () => {
    if (!filteredProducts || filteredProducts.length === 0) {
      showErrorToast("No products available to export");
      return;
    }

    try {
      setIsExporting(true);
      const exportProducts: ExportProduct[] = filteredProducts.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        brand: p.brand,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        stockCount: p.stockCount,
        categorySlug: p.categorySlug,
        subcategorySlug: p.subcategorySlug,
        images: p.images,
        description: p.description,
        shortDescription: p.shortDescription,
        tags: p.tags,
        isFeatured: p.isFeatured,
        retailerCsvData: p.retailerCsvData,
      }));

      exportProductsToExcel(exportProducts);
    } catch (err) {
      console.error("Failed to export products:", err);
      showErrorToast("Failed to export products");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const resData = await importProductsFromExcel(file);
      
      // Refresh products after import
      const response = await axios.get("/api/admin/products");
      if (response.data?.success) {
        setProducts(response.data.products || []);
      }

      // Show detailed alert to user
      if (resData?.results) {
        const { successful, failed, errors } = resData.results;
        if (failed > 0) {
          const errorList = errors.slice(0, 5).join("\n• ");
          alert(
            `Import completed!\n\n` +
            `• Successfully imported: ${successful}\n` +
            `• Failed to import: ${failed}\n\n` +
            `First few errors:\n• ${errorList || "None"}`
          );
        } else {
          alert(`Successfully imported ${successful} products!`);
        }
      } else {
        alert(resData?.message || "Import completed successfully!");
      }
    } catch (err: any) {
      console.error("Failed to import products:", err);
      showErrorToast(err?.message || "Failed to import products");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      await axios.delete(`/api/admin/products/${productId}`);
      setProducts((prev) => prev.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Failed to delete product:", error);
      showErrorToast("Failed to delete product");
    }
  };

  const displayedProducts = filteredProducts;

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "SKU", accessorKey: "sku" },
    { header: "Brand", accessorKey: "brand" },
    {
      header: "Price",
      cell: (product: Product) => `$${product.price.toFixed(2)}`,
    },
    {
      header: "Stock",
      cell: (product: Product) =>
        `${product.stockCount} (${stockLabels[product.stockStatus]})`,
    },
    {
      header: "Created",
      cell: (product: Product) => new Date(product.createdAt).toLocaleDateString(),
    },
    {
      header: "Actions",
      cell: (product: Product) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push(`/admin/products/${product._id}`)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            aria-label="View product"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => router.push(`/admin/products/${product._id}`)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
            aria-label="Edit product"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteProduct(product._id)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white hover:bg-rose-600 transition"
            aria-label="Delete product"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Products</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage catalog products, pricing, and inventory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleExportExcel}
            disabled={isExporting}
            variant="outline"
            className="h-10 px-4 rounded-xl border-slate-200"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? "Exporting..." : "Export Excel"}
          </Button>

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            variant="outline"
            className="h-10 px-4 rounded-xl border-slate-200"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isImporting ? "Importing..." : "Import Excel"}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleImportExcel}
            disabled={isImporting}
            style={{ display: "none" }}
          />

          <Button
            onClick={() => router.push("/admin/products/add")}
            className="h-10 px-5 rounded-xl bg-[#5B3DF5] hover:bg-[#4c31df]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5"
            >
              <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${card.bgGlow} blur-xl group-hover:scale-150 transition-transform duration-500`} />

              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-500">{card.label}</span>
                  <p className="text-3xl font-extrabold text-slate-900 leading-none">
                    {card.value.toLocaleString()}
                  </p>
                </div>

                <div className={`p-3.5 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-sm shadow-slate-900/10`}>
                  <Icon className="h-5.5 w-5.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Filter className="h-4 w-4 text-[#003B73]" />
          <h3 className="text-sm font-semibold text-slate-800">Filter Products</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Search Product
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Name, SKU, brand..."
                value={filters.search}
                onChange={(event) => {
                  setFilters((prev) => ({ ...prev, search: event.target.value }));
                }}
                className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-slate-200 outline-none focus:border-[#0077C8] focus:ring-1 focus:ring-[#0077C8] transition bg-slate-50/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Stock status
            </label>
            <select
              value={filters.stockStatus}
              onChange={(event) => {
                setFilters((prev) => ({ ...prev, stockStatus: event.target.value }));
              }}
              className="w-full h-9 px-3 text-sm rounded-lg border border-slate-200 outline-none focus:border-[#0077C8] focus:ring-1 focus:ring-[#0077C8] transition bg-slate-50/50 text-slate-700 font-medium"
            >
              <option value="all">All stock statuses</option>
              <option value="in_stock">In stock</option>
              <option value="low_stock">Low stock</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
          </div>

          <div className="lg:col-span-2" />

          <div className="flex justify-end lg:justify-start">
            <button
              type="button"
              onClick={() => {
                setFilters({ search: "", stockStatus: "all" });
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition active:translate-y-px"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <ProductDataGrid
        products={displayedProducts}
        loading={loading}
        onView={(p) => router.push(`/admin/products/${p._id}`)}
        onEdit={(p) => router.push(`/admin/products/${p._id}`)}
        onDelete={(p) => handleDeleteProduct(p._id)}
      />
    </div>
  );
}
