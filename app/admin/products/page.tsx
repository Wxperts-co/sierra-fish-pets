"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import ProductDataGrid from "@/components/admin/products/ProductDataGrid";
import { showErrorToast } from "@/lib/toast";
import {
  AlertTriangle,
  Box,
  CheckCircle2,
  Download,
  Edit3,
  Eye,
  Filter,
  Package,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  exportProductsToExcel,
  importProductsFromExcel,
  ExportProduct,
} from "@/lib/export/productsExport";
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
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [filters, setFilters] = useState({ search: "", stockStatus: "all" });
  const [searchInput, setSearchInput] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [stats, setStats] = useState({
    total: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedProductForView, setSelectedProductForView] = useState<Product | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Reset page when stock filter changes
  const handleStockStatusChange = (status: string) => {
    setFilters((prev) => ({ ...prev, stockStatus: status }));
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.set("page", String(paginationModel.page + 1));
        params.set("limit", String(paginationModel.pageSize));
        if (filters.search) params.set("search", filters.search);
        if (filters.stockStatus !== "all")
          params.set("stockStatus", filters.stockStatus);

        const response = await axios.get(
          `/api/admin/products?${params.toString()}`,
        );

        if (response.data?.success) {
          setProducts(response.data.products || []);
          setTotalCount(response.data.count || 0);
          if (response.data.stats) {
            setStats(response.data.stats);
          }
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
  }, [
    paginationModel.page,
    paginationModel.pageSize,
    filters.search,
    filters.stockStatus,
  ]);

  const statCards = [
    {
      label: "Total Products",
      value: stats.total,
      icon: Package,
      iconBg: "bg-[#eef6ff]",
      iconColor: "text-[#005AA9]",
      valueColor: "text-slate-800",
    },
    {
      label: "In Stock",
      value: stats.inStock,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    {
      label: "Low Stock",
      value: stats.lowStock,
      icon: AlertTriangle,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      valueColor: "text-amber-500",
    },
    {
      label: "Out of Stock",
      value: stats.outOfStock,
      icon: Box,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      valueColor: "text-rose-600",
    },
  ];

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.stockStatus !== "all")
        params.set("stockStatus", filters.stockStatus);
      params.set("limit", "100000"); // Retrieve all matching products

      const response = await axios.get(
        `/api/admin/products?${params.toString()}`,
      );
      const exportProductsData = response.data?.products || [];

      if (exportProductsData.length === 0) {
        showErrorToast("No products available to export");
        return;
      }

      const exportProducts: ExportProduct[] = exportProductsData.map(
        (p: any) => ({
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
        }),
      );

      exportProductsToExcel(exportProducts);
    } catch (err) {
      console.error("Failed to export products:", err);
      showErrorToast("Failed to export products");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportExcel = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const resData = await importProductsFromExcel(file);

      // Refresh products after import
      const params = new URLSearchParams();
      params.set("page", String(paginationModel.page + 1));
      params.set("limit", String(paginationModel.pageSize));
      if (filters.search) params.set("search", filters.search);
      if (filters.stockStatus !== "all")
        params.set("stockStatus", filters.stockStatus);

      const response = await axios.get(
        `/api/admin/products?${params.toString()}`,
      );
      if (response.data?.success) {
        setProducts(response.data.products || []);
        setTotalCount(response.data.count || 0);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
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
              `First few errors:\n• ${errorList || "None"}`,
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/admin/products/${productId}`);
      // Re-fetch current page products and stats
      const params = new URLSearchParams();
      params.set("page", String(paginationModel.page + 1));
      params.set("limit", String(paginationModel.pageSize));
      if (filters.search) params.set("search", filters.search);
      if (filters.stockStatus !== "all")
        params.set("stockStatus", filters.stockStatus);

      const response = await axios.get(
        `/api/admin/products?${params.toString()}`,
      );
      if (response.data?.success) {
        setProducts(response.data.products || []);
        setTotalCount(response.data.count || 0);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      showErrorToast("Failed to delete product");
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      const response = await axios.patch(`/api/admin/products/${productId}`, {
        stockCount: newStock,
      });
      if (response.data?.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p._id === productId
              ? {
                  ...p,
                  stockCount: response.data.product.stockCount,
                  stockStatus: response.data.product.stockStatus,
                }
              : p
          )
        );
        const params = new URLSearchParams();
        params.set("page", String(paginationModel.page + 1));
        params.set("limit", String(paginationModel.pageSize));
        if (filters.search) params.set("search", filters.search);
        if (filters.stockStatus !== "all")
          params.set("stockStatus", filters.stockStatus);

        const res = await axios.get(
          `/api/admin/products?${params.toString()}`,
        );
        if (res.data?.success) {
          if (res.data.stats) {
            setStats(res.data.stats);
          }
        }
        return true;
      } else {
        showErrorToast(response.data?.message || "Failed to update stock");
        return false;
      }
    } catch (error: any) {
      console.error("Failed to update stock:", error);
      showErrorToast(error?.response?.data?.message || "Failed to update stock");
      return false;
    }
  };

  const displayedProducts = products;

  const columns = [
    {
      header: "Image",
      cell: (product: Product) => (
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
              No img
            </div>
          )}
        </div>
      ),
    },
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
      cell: (product: Product) =>
        new Date(product.createdAt).toLocaleDateString(),
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
            <Eye className="h-4 w-4 text-slate-500" />
          </button>
          <button
            type="button"
            onClick={() => router.push(`/admin/products/${product._id}`)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
            aria-label="Edit product"
          >
            <Edit3 className="h-4 w-4 text-blue-500" />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteProduct(product._id)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white hover:bg-rose-600 transition"
            aria-label="Delete product"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Title block ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Products</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Manage catalog products, pricing, and inventory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleExportExcel}
            disabled={isExporting}
            variant="outline"
            className="h-11 rounded-2xl border-slate-200 font-semibold px-5 active:scale-95 transition-all text-slate-600 hover:bg-slate-50"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? "Exporting..." : "Export Excel"}
          </Button>

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            variant="outline"
            className="h-11 rounded-2xl border-slate-200 font-semibold px-5 active:scale-95 transition-all text-slate-600 hover:bg-slate-50"
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
            className="h-11 rounded-2xl bg-[#005AA9] hover:bg-[#003B73] text-white font-bold text-sm px-6 shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                <h3 className={`text-2xl font-black mt-2 ${card.valueColor}`}>
                  {loading ? "..." : card.value.toLocaleString()}
                </h3>
              </div>
              <div className={`p-3 ${card.iconBg} rounded-xl ${card.iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Filter className="h-4 w-4 text-[#003B73]" />
          <h3 className="text-sm font-semibold text-slate-800">
            Filter Products
          </h3>
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
                value={searchInput}
                onChange={(event) => {
                  setSearchInput(event.target.value);
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
                handleStockStatusChange(event.target.value);
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
                setSearchInput("");
                setFilters({ search: "", stockStatus: "all" });
                setPaginationModel((prev) => ({ ...prev, page: 0 }));
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
        onView={(p) => setSelectedProductForView(p)}
        onEdit={(p) => router.push(`/admin/products/${p._id}`)}
        onDelete={(p) => handleDeleteProduct(p._id)}
        rowCount={totalCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onUpdateStock={handleUpdateStock}
      />

      {selectedProductForView && (
        <ProductViewModal
          product={selectedProductForView}
          onClose={() => setSelectedProductForView(null)}
        />
      )}
    </div>
  );
}

type ProductViewModalProps = {
  product: Product;
  onClose: () => void;
};

function ProductViewModal({ product, onClose }: ProductViewModalProps) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-800">Product Details</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">ID: {product.id || product._id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition active:scale-95 cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Info */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-150 flex-shrink-0 flex items-center justify-center">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-slate-400">No Image</span>
              )}
            </div>

            {/* Details Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Name</span>
                <p className="text-sm font-extrabold text-slate-800 mt-0.5">{product.name}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SKU</span>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{product.sku || "N/A"}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Brand</span>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{product.brand || "N/A"}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Price</span>
                <p className="text-sm font-extrabold text-[#005AA9] mt-0.5">${product.price.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Status</span>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    product.stockStatus === "in_stock"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-250"
                      : product.stockStatus === "low_stock"
                      ? "bg-amber-50 text-amber-700 border border-amber-250"
                      : "bg-rose-50 text-rose-700 border border-rose-250"
                  }`}>
                    {stockLabels[product.stockStatus]} ({product.stockCount} units)
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Featured Status</span>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">
                  {product.isFeatured ? "★ Featured Product" : "Regular Product"}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-slate-100 pt-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</span>
            <p className="text-sm text-slate-600 leading-relaxed mt-2 whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {product.description || product.shortDescription || "No description provided."}
            </p>
          </div>

          {/* Category */}
          <div className="border-t border-slate-100 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</span>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                {product.categorySlug ? product.categorySlug.split("-/-").join(" > ").split("-").join(" ") : "Uncategorized"}
              </p>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subcategory</span>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                {product.subcategorySlug ? product.subcategorySlug.split("-").join(" ") : "None"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 flex justify-end bg-slate-50/50">
          <button
            onClick={onClose}
            className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 cursor-pointer transition active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
