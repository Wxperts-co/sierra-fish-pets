"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, Layers, Search, X, Star, ShoppingBag, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { showErrorToast } from "@/lib/toast";

interface AdminBanner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaLink: string;
  order: number;
  status: string;
}

const getButtonClass = (text: string) => {
  const lower = (text || "").toLowerCase();
  if (lower.includes("shop")) return "text-[#005AA9] bg-[#eef6ff] border-[#005AA9]/20 hover:bg-[#005AA9]/10";
  if (lower.includes("explore")) return "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100/30";
  if (lower.includes("view") || lower.includes("product")) return "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100/30";
  if (lower.includes("discover")) return "text-rose-600 bg-rose-50 border-rose-200 hover:bg-rose-100/30";
  return "text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100/30";
};

export default function AdminHeroSliderPage() {
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AdminBanner | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState("active");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/banners");
      if (response.data?.success) {
        setBanners(response.data.banners || []);
      }
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const stats = useMemo(() => {
    const total = banners.length;
    const active = banners.filter((b) => b.status === "active" || !b.status).length;
    const inactive = total - active;
    const nextOrder = banners.reduce((max, b) => Math.max(max, b.order), 0) + 1;
    return { total, active, inactive, nextOrder };
  }, [banners]);

  const filteredBanners = useMemo(() => {
    return banners.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        (b.ctaLabel || "").toLowerCase().includes(search.toLowerCase()) ||
        (b.ctaLink || "").toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [banners, search]);

  const handleOpenAddModal = () => {
    setEditingBanner(null);
    setTitle("");
    setSubtitle("");
    setCtaLabel("Shop Now");
    setCtaLink("/shop");
    setOrder(stats.nextOrder);
    setStatus("active");
    setImageUrl("");
    setSelectedFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (banner: AdminBanner) => {
    setEditingBanner(banner);
    setTitle(banner.title || "");
    setSubtitle(banner.subtitle || "");
    setCtaLabel(banner.ctaLabel || "");
    setCtaLink(banner.ctaLink || "");
    setOrder(banner.order ?? 0);
    setStatus(banner.status || "active");
    setImageUrl(banner.image || "");
    setSelectedFile(null);
    setImagePreview(banner.image || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this slider banner?");
    if (!confirmed) return;

    try {
      const response = await axios.delete(`/api/banners/${id}`);
      if (response.data?.success) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete banner:", error);
      showErrorToast("Failed to delete banner.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (!selectedFile && !imageUrl) {
      showErrorToast("Please select an image file to upload.");
      return;
    }

    try {
      setUploading(true);
      let finalImageUrl = imageUrl;

      // Upload file first if user selected a new file
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await axios.post("/api/upload-hero-slider", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (uploadRes.data?.success) {
          finalImageUrl = uploadRes.data.url;
        } else {
          throw new Error("Failed to upload banner image.");
        }
      }

      const payload: Partial<AdminBanner> = {
        title,
        subtitle,
        ctaLabel,
        ctaLink,
        order: Number(order),
        image: finalImageUrl,
        status,
      };

      if (editingBanner) {
        // Edit Mode
        const response = await axios.patch(`/api/banners/${editingBanner.id}`, payload);
        if (response.data?.success) {
          setBanners((prev) =>
            prev.map((b) => (b.id === editingBanner.id ? response.data.banner : b))
          );
        }
      } else {
        // Add Mode
        const newPayload = {
          ...payload,
          id: `banner-${String(Date.now()).slice(-3)}`,
        };
        const response = await axios.post("/api/banners", newPayload);
        if (response.data?.success) {
          setBanners((prev) => [...prev, response.data.banner].sort((x, y) => x.order - y.order));
        }
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Failed to save banner:", error);
      showErrorToast(error.response?.data?.message || "Failed to save hero banner.");
    } finally {
      setUploading(false);
    }
  };

  const rows = filteredBanners.map((banner, index) => ({
    ...banner,
    serial: index + 1,
  }));

  const columns: GridColDef[] = [
    {
      field: "serial",
      headerName: "#",
      width: 60,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "image",
      headerName: "Image",
      width: 170,
      sortable: false,
      renderCell: (params: GridRenderCellParams<AdminBanner>) => {
        return (
          <div className="flex items-center justify-center h-full py-1.5">
            <div className="relative w-32 h-16 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm">
              <img
                src={params.value}
                alt="Banner Thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        );
      },
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      renderCell: (params: GridRenderCellParams<AdminBanner>) => {
        return (
          <div className="flex items-center h-full">
            <span className="font-semibold text-slate-800 text-sm">{params.value}</span>
          </div>
        );
      },
    },
    {
      field: "subtitle",
      headerName: "Subtitle",
      flex: 1.5,
      renderCell: (params: GridRenderCellParams<AdminBanner>) => {
        return (
          <div className="flex items-center h-full">
            <span className="text-slate-500 text-sm font-medium leading-relaxed">{params.value}</span>
          </div>
        );
      },
    },
    {
      field: "ctaLabel",
      headerName: "Button Text",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<AdminBanner>) => {
        if (!params.value) return <span className="text-xs text-slate-400">-</span>;
        return (
          <div className="flex items-center justify-center h-full">
            <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full border text-xs font-bold transition-all ${getButtonClass(params.value)}`}>
              {params.value}
            </span>
          </div>
        );
      },
    },
    {
      field: "ctaLink",
      headerName: "Link",
      flex: 1,
      renderCell: (params: GridRenderCellParams<AdminBanner>) => {
        return (
          <div className="flex items-center h-full">
            <span className="text-slate-600 text-sm font-semibold">{params.value || "-"}</span>
          </div>
        );
      },
    },
    {
      field: "order",
      headerName: "Order",
      width: 80,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<AdminBanner>) => {
        return (
          <div className="flex items-center justify-center h-full">
            <span className="font-bold text-slate-800 text-sm">
              {params.value}
            </span>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<AdminBanner>) => {
        const isActive = params.value === "active" || !params.value;
        return (
          <div className="flex items-center justify-center h-full">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-bold select-none ${
              isActive
                ? "text-emerald-700 bg-emerald-50 border-emerald-150"
                : "text-rose-700 bg-rose-50 border-rose-150"
            }`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      width: 110,
      renderCell: (params: GridRenderCellParams<AdminBanner>) => {
        const row = params.row;
        return (
          <div className="flex items-center justify-end gap-2 w-full pr-2 py-1.5 h-full">
            <button
              onClick={() => handleOpenEditModal(row)}
              className="p-2 border border-slate-200 hover:border-sky-300 rounded-xl bg-white hover:bg-sky-50 text-[#005AA9] hover:text-[#003B73] transition-all active:scale-90 shadow-sm"
              title="Edit Banner"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="p-2 border border-slate-200 hover:border-red-300 rounded-xl bg-white hover:bg-red-50 text-red-500 hover:text-red-600 transition-all active:scale-90 shadow-sm"
              title="Delete Banner"
            >
              <Trash2 className="w-4 h-4" />
            </button>
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
          <h1 className="text-3xl font-black text-slate-800">Hero Slider</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Manage the homepage hero image slider, details, CTA buttons, and display orders.
          </p>
        </div>

        <Button
          onClick={handleOpenAddModal}
          className="h-11 rounded-2xl bg-[#005AA9] hover:bg-[#003B73] text-white font-bold text-sm px-6 shadow-md transition-all active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Slider Banner
        </Button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Slides</p>
            <h3 className="text-2xl font-black text-slate-800 mt-2">{loading ? "..." : stats.total}</h3>
          </div>
          <div className="p-3 bg-[#eef6ff] rounded-xl text-[#005AA9]">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Slides</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-2">{loading ? "..." : stats.active}</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <Check className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inactive Slides</p>
            <h3 className="text-2xl font-black text-rose-600 mt-2">{loading ? "..." : stats.inactive}</h3>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <X className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search banners by title, subtitle, CTA details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-100 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 transition font-semibold"
          />
        </div>
      </div>

      {/* ── Grid/Table ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden" style={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          loading={loading}
          autoHeight
          rowHeight={88}
        />
      </div>

      {/* ── Add/Edit Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

          {/* Modal Box */}
          <div className="relative w-full max-w-xl bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#003B73] px-6 py-4.5 text-white flex items-center justify-between shrink-0">
              <h2 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-300" />
                <span>{editingBanner ? "Edit Slider Banner" : "Create Slider Banner"}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Scrollable */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Image upload field */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                  Banner Background Image
                </label>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {/* Preview Container */}
                  <div className="w-full sm:w-48 aspect-[2.5/1] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shadow-inner relative shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Upload preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">No Image</span>
                    )}
                  </div>

                  {/* File Pick button */}
                  <div className="w-full relative">
                    <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 cursor-pointer text-sm font-semibold text-slate-600 transition-all select-none">
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span>{selectedFile ? selectedFile.name : "Choose custom image..."}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="mt-1 text-[10px] text-slate-400 font-semibold leading-tight">
                      Supported formats: JPG, PNG, WEBP. Banners will be saved inside public/images/heroslider.
                    </p>
                  </div>
                </div>
              </div>

              {/* Title field */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Slide Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Everything Your Pet Needs"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800"
                />
              </div>

              {/* Subtitle field */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Subtitle Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Premium food, accessories & supplies..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800 resize-none"
                />
              </div>

              {/* CTA details and Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shop Now"
                    value={ctaLabel}
                    onChange={(e) => setCtaLabel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    CTA Link / href
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /shop"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Display Order Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Status Toggle Switch */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <h5 className="text-xs font-black text-slate-700 uppercase tracking-wide">Status: Active</h5>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Toggle visibility on the home slider</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={status === "active"}
                      onChange={(e) => setStatus(e.target.checked ? "active" : "inactive")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-4 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={uploading}
                  className="h-11 rounded-2xl border-slate-200 font-semibold px-6 active:scale-95 transition-all text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploading}
                  className="h-11 rounded-2xl bg-[#005AA9] hover:bg-[#003B73] text-white font-bold px-8 active:scale-95 transition-all shadow-md flex items-center gap-2"
                >
                  {uploading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{editingBanner ? "Save Banner" : "Create Banner"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
