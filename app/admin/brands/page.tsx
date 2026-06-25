"use client";

import { useEffect, useState, useMemo } from "react";

import axios from "axios";
import {
  Plus, Edit2, Trash2, Search, X, Star, Globe, Tag, LayoutGrid, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { showErrorToast } from "@/lib/toast";
import ActionsDropdown from "@/components/admin/common/ActionsDropdown";

interface BrandItem {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  categories: string[];
  featured: boolean;
  website: string;
}

const CATEGORY_OPTIONS = ["dog", "cat", "bird", "fish", "reptile", "aquatic", "small animal"];

const CATEGORY_STYLES: Record<string, string> = {
  dog: "text-amber-700 bg-amber-50 border-amber-200",
  cat: "text-purple-700 bg-purple-50 border-purple-200",
  bird: "text-sky-700 bg-sky-50 border-sky-200",
  fish: "text-teal-700 bg-teal-50 border-teal-200",
  reptile: "text-green-700 bg-green-50 border-green-200",
  aquatic: "text-blue-700 bg-blue-50 border-blue-200",
  "small animal": "text-rose-700 bg-rose-50 border-rose-200",
};

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingBrand, setViewingBrand] = useState<BrandItem | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [featured, setFeatured] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/brands");
      if (data.success) setBrands(data.brands || []);
    } catch (err) {
      console.error("Failed to fetch brands:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const stats = useMemo(() => {
    const total = brands.length;
    const featuredCount = brands.filter((b) => b.featured).length;
    const categoriesSet = new Set(brands.flatMap((b) => b.categories));
    return { total, featuredCount, uniqueCategories: categoriesSet.size };
  }, [brands]);

  const filteredBrands = useMemo(() => {
    return brands.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || b.categories.includes(categoryFilter);
      return matchesSearch && matchesCategory;
    });
  }, [brands, search, categoryFilter]);

  const resetForm = () => {
    setName(""); setSlug(""); setLogo(""); setDescription("");
    setWebsite(""); setFeatured(false); setSelectedCategories([]);
  };

  const handleOpenAddModal = () => {
    setEditingBrand(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (brand: BrandItem) => {
    setEditingBrand(brand);
    setName(brand.name);
    setSlug(brand.slug);
    setLogo(brand.logo);
    setDescription(brand.description);
    setWebsite(brand.website);
    setFeatured(brand.featured);
    setSelectedCategories(brand.categories || []);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    try {
      const { data } = await axios.delete(`/api/brands/${id}`);
      if (data.success) setBrands((prev) => prev.filter((b) => b.id !== id && b._id !== id));
    } catch (err) {
      console.error("Failed to delete brand:", err);
    }
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingBrand) {
      setSlug(val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name, slug, logo, description, website, featured,
      categories: selectedCategories,
    };

    try {
      if (editingBrand) {
        const brandId = editingBrand._id || editingBrand.id;
        const { data } = await axios.patch(`/api/brands/${brandId}`, payload);
        if (data.success) {
          setBrands((prev) =>
            prev.map((b) => (b._id === brandId || b.id === brandId ? data.brand : b))
          );
        }
      } else {
        const newPayload = {
          ...payload,
          id: `brand-custom-${Date.now()}`,
        };
        const { data } = await axios.post("/api/brands", newPayload);
        if (data.success) setBrands((prev) => [...prev, data.brand]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save brand:", err);
      showErrorToast(err.response?.data?.message || "Failed to save brand.");
    }
  };

  const rows = filteredBrands.map((brand, index) => ({
    ...brand,
    id: brand._id || brand.id,
    serial: index + 1,
  }));

  const columns: GridColDef[] = [
    {
      field: "serial", headerName: "#", width: 60,
      sortable: false, filterable: false, align: "center", headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Brand",
      flex: 1.5,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams<BrandItem>) => {
        const row = params.row;
        return (
          <div className="flex items-center gap-3 h-full">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0 flex items-center justify-center">
              {row.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.logo} alt={row.name} className="w-full h-full object-contain p-1" />
              ) : (
                <Tag className="w-4 h-4 text-slate-300" />
              )}
            </div>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="font-semibold text-sm text-slate-900 truncate">{row.name}</span>
              {row.featured && (
                <span className="mt-0.5 w-fit bg-amber-100 text-amber-800 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                  FEATURED
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      field: "categories",
      headerName: "Categories",
      flex: 1,
      minWidth: 130,
      sortable: false,
      renderCell: (params: GridRenderCellParams<BrandItem>) => {
        const row = params.row;
        return (
          <div className="flex items-center h-full w-full">
            <div className="flex flex-wrap gap-1">
              {(row.categories || []).map((cat) => {
                const cls =
                  CATEGORY_STYLES[cat] ||
                  "text-slate-600 bg-slate-100 border-slate-200";

                return (
                  <span
                    key={cat}
                    className={`inline-flex items-center justify-center px-2 py-0.5 text-xs leading-none rounded-full border font-semibold capitalize ${cls}`}
                  >
                    {cat}
                  </span>
                );
              })}
            </div>
          </div>
        );
      },
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      minWidth: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams<BrandItem>) => (
        <span className="text-xs text-slate-500 line-clamp-2">
          {params.row.description || <span className="italic text-slate-300">No description</span>}
        </span>
      ),
    },
    {
      field: "website",
      headerName: "Website",
      flex: 1,
      minWidth: 130,
      sortable: false,
      renderCell: (params: GridRenderCellParams<BrandItem>) => {
        const url = params.row.website;
        if (!url) return <span className="text-slate-300 text-xs italic">—</span>;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#005AA9] hover:underline max-w-[130px] truncate"
            onClick={(e) => e.stopPropagation()}
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{url.replace(/^https?:\/\/(www\.)?/, "")}</span>
          </a>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false, filterable: false,
      align: "right", headerAlign: "right",
      flex: 1,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<BrandItem>) => {
        const row = params.row;
        return (
          <div className="flex items-center justify-end gap-2 w-full pr-1 h-full">
            <ActionsDropdown
              actions={[
                {
                  label: "View",
                  icon: <Eye className="w-4 h-4 text-slate-500" />,
                  onClick: () => {
                    setViewingBrand(row);
                    setIsDetailModalOpen(true);
                  },
                },
                {
                  label: "Edit",
                  icon: <Edit2 className="w-4 h-4 text-blue-500" />,
                  onClick: () => handleOpenEditModal(row),
                },
                {
                  label: "Delete",
                  icon: <Trash2 className="w-4 h-4 text-red-500" />,
                  onClick: () => handleDelete(row.id || row._id || ""),
                },
              ]}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Title block ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Brands</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Manage your partner brands, logos, categories, and website links.
          </p>
        </div>
        <Button
          onClick={handleOpenAddModal}
          className="h-11 rounded-2xl bg-[#005AA9] hover:bg-[#003B73] text-white font-bold text-sm px-6 shadow-md transition-all active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Brand
        </Button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Brands</p>
            <h3 className="text-2xl font-black text-slate-800 mt-2">{loading ? "..." : stats.total}</h3>
          </div>
          <div className="p-3 bg-[#eef6ff] rounded-xl text-[#005AA9]">
            <Tag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Featured</p>
            <h3 className="text-2xl font-black text-amber-500 mt-2">{loading ? "..." : stats.featuredCount}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pet Categories</p>
            <h3 className="text-2xl font-black text-slate-500 mt-2">{loading ? "..." : stats.uniqueCategories}</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
            <LayoutGrid className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-100 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 transition font-semibold"
          />
        </div>
        <div className="w-full sm:w-52">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-100 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer shadow-sm"
          >
            <option value="all">All Categories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c} className="capitalize">{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── DataGrid ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-x-auto" style={{ width: "100%" }}>
        <div style={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pagination
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            loading={loading}
            autoHeight
            rowHeight={64}
            sx={{
              '& .MuiDataGrid-cell': { overflow: 'visible !important' },
              '& .MuiDataGrid-row': { overflow: 'visible !important' },
            }}
          />
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

          <div className="relative w-full max-w-lg bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#003B73] px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h2 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-5 h-5 text-sky-300" />
                <span>{editingBrand ? "Edit Brand" : "Add Brand"}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Brand Name</label>
                  <input
                    required type="text" placeholder="e.g. Blue Buffalo"
                    value={name} onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Slug</label>
                  <input
                    type="text" placeholder="blue-buffalo"
                    value={slug} onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Logo & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Logo</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploading(true);
                          const data = new FormData();
                          data.append("file", file);
                          data.append("folder", "brands");
                          try {
                            const res = await axios.post("/api/upload", data, {
                              headers: { "Content-Type": "multipart/form-data" },
                            });
                            if (res.data?.success) {
                              setLogo(res.data.url);
                            }
                          } catch (err) {
                            console.error(err);
                            showErrorToast("Failed to upload image.");
                          } finally {
                            setUploading(false);
                          }
                        }}
                        disabled={uploading}
                        className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#005AA9] hover:file:bg-blue-100 cursor-pointer"
                      />
                      {uploading && <span className="text-xs text-slate-400 animate-pulse">Uploading...</span>}
                    </div>
                    <input
                      type="text" placeholder="/images/brands/logo.jpg"
                      value={logo} onChange={(e) => setLogo(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                    />
                    {logo && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <img src={logo} alt="Preview" className="h-10 w-10 object-contain rounded-lg border border-slate-200" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Website URL</label>
                  <input
                    type="text" placeholder="https://..."
                    value={website} onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Description</label>
                <textarea
                  rows={3} placeholder="Describe the brand..."
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800 resize-none"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Pet Categories</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-bold capitalize transition-all ${isSelected
                          ? "bg-[#005AA9] border-[#005AA9] text-white"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <h5 className="text-xs font-black text-slate-700 uppercase tracking-wide">Featured Brand</h5>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Display prominently on the Brands page</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#005AA9]" />
                </label>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-4">
                <Button
                  type="button" variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="h-11 rounded-2xl border-slate-200 font-semibold px-6 active:scale-95 transition-all text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-11 rounded-2xl bg-[#005AA9] hover:bg-[#003B73] text-white font-bold px-8 active:scale-95 transition-all shadow-md"
                >
                  Save Brand
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Detail View Modal ── */}
      {isDetailModalOpen && viewingBrand && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div onClick={() => setIsDetailModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#003B73] px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h2 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-5 h-5 text-sky-300" />
                <span>Brand Details</span>
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Details Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0 flex items-center justify-center">
                  {viewingBrand.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={viewingBrand.logo} alt={viewingBrand.name} className="w-full h-full object-contain p-1.5" />
                  ) : (
                    <Tag className="w-6 h-6 text-slate-300" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-800">{viewingBrand.name}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{viewingBrand.slug}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Description</span>
                <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap font-medium">{viewingBrand.description || "No description provided."}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Featured Status</span>
                  <span className="text-sm font-bold mt-1 block">
                    {viewingBrand.featured ? (
                      <span className="text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full text-xs border border-amber-100 font-extrabold uppercase">Featured</span>
                    ) : (
                      <span className="text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full text-xs border border-slate-100 font-semibold uppercase">Standard</span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Website Link</span>
                  {viewingBrand.website ? (
                    <a
                      href={viewingBrand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-bold text-[#005AA9] hover:underline mt-1 block truncate max-w-[180px]"
                    >
                      <Globe className="w-4 h-4 shrink-0" />
                      <span className="truncate">{viewingBrand.website.replace(/^https?:\/\/(www\.)?/, "")}</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 text-sm font-medium mt-1 block">No website link</span>
                  )}
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Categories Linked</span>
                <div className="flex flex-wrap gap-1.5">
                  {(viewingBrand.categories || []).map(cat => (
                    <span key={cat} className="bg-slate-50 border border-slate-150 text-slate-600 text-xs font-bold px-2.5 py-0.5 rounded-full capitalize">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-slate-100 p-6 shrink-0 bg-slate-50/50">
              <Button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="h-11 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold px-8 active:scale-95 transition-all shadow-md"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
