"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

import AdminDataTable from "@/components/admin/common/AdminDataTable";
import { showErrorToast } from "@/lib/toast";
import { Download, Plus, Upload } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
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
      await importProductsFromExcel(file);
      
      // Refresh products after import
      const response = await axios.get("/api/admin/products");
      if (response.data?.success) {
        setProducts(response.data.products || []);
        setCurrentPage(1);
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

  const itemsPerPage = 10;
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/products/${product._id}`}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            View
          </Link>
          <Link
            href={`/admin/products/${product._id}`}
            className="inline-flex items-center rounded-lg bg-[#003B73] px-3 py-1 text-xs font-semibold text-white hover:bg-[#002f5c]"
          >
            Edit
          </Link>
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
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Products</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">In Stock</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.inStock}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Low Stock</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.lowStock}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Out of Stock</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.outOfStock}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(event) => {
                setFilters((prev) => ({ ...prev, search: event.target.value }));
                setCurrentPage(1);
              }}
              placeholder="Search product name, SKU, brand..."
              className="w-full h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none focus:border-[#0077C8] focus:ring-1 focus:ring-[#0077C8]/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Stock status</label>
            <select
              value={filters.stockStatus}
              onChange={(event) => {
                setFilters((prev) => ({ ...prev, stockStatus: event.target.value }));
                setCurrentPage(1);
              }}
              className="w-full h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-[#0077C8] focus:ring-1 focus:ring-[#0077C8]/50"
            >
              <option value="all">All stock statuses</option>
              <option value="in_stock">In stock</option>
              <option value="low_stock">Low stock</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
          </div>
        </div>
      </div>

      <AdminDataTable
        data={displayedProducts}
        columns={columns}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
      />
    </div>
  );
}
