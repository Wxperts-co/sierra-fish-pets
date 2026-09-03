"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import {
  Plus,
  Edit2,
  Trash2,
  Images,
  Search,
  X,
  Upload,
  Eye,
  Check,
  Grid,
  Store,
  Dog,
  Fish,
  Bug,
  Bird,
  Rabbit,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import DataGrid from "@/components/admin/common/PersistentDataGrid";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

interface GalleryItem {
  _id?: string;
  id: string;
  image: string;
  caption: string;
  categorySlug: string;
  order: number;
  status: "active" | "inactive";
  createdAt?: string;
}

const CATEGORY_OPTIONS = [
  { value: "store", label: "Store Front & Displays", icon: Store, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "dog-cat", label: "Dog & Cat", icon: Dog, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "fish", label: "Fish & Aquatics", icon: Fish, color: "bg-teal-50 text-teal-700 border-teal-200" },
  { value: "reptile", label: "Reptiles & Terrariums", icon: Bug, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "bird", label: "Birds & Aviary", icon: Bird, color: "bg-sky-50 text-sky-700 border-sky-200" },
  { value: "small-pet", label: "Small Animals", icon: Rabbit, color: "bg-rose-50 text-rose-700 border-rose-200" },
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Form State
  const [caption, setCaption] = useState("");
  const [categorySlug, setCategorySlug] = useState("store");
  const [order, setOrder] = useState<number>(0);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/gallery");
      if (res.data?.success) {
        setItems(res.data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
      showErrorToast("Failed to load gallery items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((i) => i.status === "active" || !i.status).length;
    const inactive = total - active;
    const uniqueCategories = new Set(items.map((i) => i.categorySlug)).size;
    const nextOrder = items.reduce((max, i) => Math.max(max, i.order || 0), 0) + 1;
    return { total, active, inactive, uniqueCategories, nextOrder };
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        (item.caption || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.categorySlug || "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || item.categorySlug === categoryFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? item.status === "active" || !item.status : item.status === "inactive");
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, search, categoryFilter, statusFilter]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setCaption("");
    setCategorySlug("store");
    setOrder(stats.nextOrder);
    setStatus("active");
    setImageUrl("");
    setSelectedFile(null);
    setFilePreview("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setCaption(item.caption || "");
    setCategorySlug(item.categorySlug || "store");
    setOrder(item.order ?? 0);
    setStatus(item.status || "active");
    setImageUrl(item.image || "");
    setSelectedFile(null);
    setFilePreview(item.image || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (item: GalleryItem) => {
    const targetId = item._id || item.id;
    const confirmed = window.confirm(`Are you sure you want to delete "${item.caption || "this image"}"?`);
    if (!confirmed) return;

    try {
      const res = await axios.delete(`/api/gallery/${targetId}`);
      if (res.data?.success) {
        setItems((prev) => prev.filter((i) => i.id !== item.id && i._id !== targetId));
        showSuccessToast("Gallery image deleted successfully.");
      }
    } catch (error: any) {
      console.error("Failed to delete gallery item:", error);
      showErrorToast(error.response?.data?.message || "Failed to delete item.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      showErrorToast("Caption is required.");
      return;
    }

    if (!selectedFile && !imageUrl) {
      showErrorToast("Please select or provide an image.");
      return;
    }

    try {
      setUploading(true);
      let finalImageUrl = imageUrl;

      // Upload file if new file selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("folder", "gallery");

        const uploadRes = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (uploadRes.data?.success && uploadRes.data?.url) {
          finalImageUrl = uploadRes.data.url;
        } else {
          throw new Error("Failed to upload image file.");
        }
      }

      const payload = {
        caption: caption.trim(),
        categorySlug,
        order: Number(order),
        status,
        image: finalImageUrl,
      };

      if (editingItem) {
        const targetId = editingItem._id || editingItem.id;
        const res = await axios.patch(`/api/gallery/${targetId}`, payload);
        if (res.data?.success) {
          setItems((prev) =>
            prev.map((i) =>
              i.id === editingItem.id || (i._id && i._id === targetId) ? res.data.item : i
            )
          );
          showSuccessToast("Gallery photo updated successfully!");
        }
      } else {
        const res = await axios.post("/api/gallery", payload);
        if (res.data?.success) {
          setItems((prev) => [res.data.item, ...prev]);
          showSuccessToast("New photo added to gallery!");
        }
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving gallery photo:", error);
      showErrorToast(error.response?.data?.message || "Failed to save gallery photo.");
    } finally {
      setUploading(false);
    }
  };

  const rows = filteredItems.map((item, index) => ({
    ...item,
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
      headerName: "Thumbnail",
      width: 110,
      sortable: false,
      renderCell: (params: GridRenderCellParams<GalleryItem>) => {
        return (
          <div className="flex items-center justify-center h-full py-1">
            <button
              onClick={() => setPreviewImage(params.value)}
              className="group relative w-16 h-14 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm cursor-pointer transition hover:scale-105"
              title="Click to view full size"
            >
              <img
                src={params.value}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Eye className="w-4 h-4" />
              </div>
            </button>
          </div>
        );
      },
    },
    {
      field: "caption",
      headerName: "Caption / Description",
      flex: 1.8,
      minWidth: 220,
      renderCell: (params: GridRenderCellParams<GalleryItem>) => {
        return (
          <div className="flex items-center h-full py-2">
            <span className="font-semibold text-slate-800 text-sm line-clamp-2">
              {params.value}
            </span>
          </div>
        );
      },
    },
    {
      field: "categorySlug",
      headerName: "Category",
      width: 170,
      renderCell: (params: GridRenderCellParams<GalleryItem>) => {
        const catInfo =
          CATEGORY_OPTIONS.find((c) => c.value === params.value) || {
            label: params.value || "General",
            color: "bg-slate-100 text-slate-700 border-slate-200",
          };
        return (
          <div className="flex items-center h-full">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${catInfo.color}`}
            >
              {catInfo.label}
            </span>
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
      renderCell: (params: GridRenderCellParams<GalleryItem>) => {
        return (
          <div className="flex items-center justify-center h-full">
            <span className="font-bold text-slate-700 text-sm">
              {params.value ?? 0}
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
      renderCell: (params: GridRenderCellParams<GalleryItem>) => {
        const isActive = params.value === "active" || !params.value;
        return (
          <div className="flex items-center justify-center h-full">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-100 text-slate-500 border-slate-200"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isActive ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params: GridRenderCellParams<GalleryItem>) => {
        return (
          <div className="flex items-center justify-center gap-1.5 h-full">
            <button
              onClick={() => handleOpenEditModal(params.row)}
              className="p-2 rounded-xl text-slate-500 hover:text-[#005AA9] hover:bg-blue-50 transition cursor-pointer"
              title="Edit photo"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(params.row)}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Delete photo"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[linear-gradient(135deg,#003B73_0%,#005AA9_100%)] text-white rounded-2xl shadow-md shadow-blue-900/20">
            <Images className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Gallery Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Upload, organize, and manage images displayed in the public store photo gallery.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/gallery"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Live Gallery
          </a>
          <Button
            onClick={handleOpenAddModal}
            className="bg-[#005AA9] hover:bg-[#003B73] text-white rounded-2xl px-4 py-2.5 shadow-md shadow-blue-900/10 transition active:scale-95 flex items-center gap-2 cursor-pointer font-bold text-sm"
          >
            <Plus className="h-4 w-4" />
            Add Photo
          </Button>
        </div>
      </div>

      {/* ── KPI Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 text-[#005AA9]">
            <Images className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Photos</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <Check className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Active Published</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.active}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Categories Used</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.uniqueCategories}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-slate-100 text-slate-600">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Next Slot Order</p>
            <h3 className="text-2xl font-bold text-slate-900">#{stats.nextOrder}</h3>
          </div>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by caption or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#005AA9]/20 focus:border-[#005AA9] transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 focus:outline-none focus:border-[#005AA9] transition"
          >
            <option value="all">All Categories</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 focus:outline-none focus:border-[#005AA9] transition"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* ── Data Grid ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-2">
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row: any) => row._id || row.id || Math.random().toString()}
        />
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-[linear-gradient(135deg,#003B73_0%,#005AA9_100%)] text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  {editingItem ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {editingItem ? "Edit Gallery Photo" : "Add New Gallery Photo"}
                  </h3>
                  <p className="text-xs text-blue-100">
                    {editingItem ? "Update image metadata, order or status" : "Upload an image and assign category"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Image Upload Area */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Photo Asset <span className="text-rose-500">*</span>
                </label>

                {filePreview || imageUrl ? (
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
                    <img
                      src={filePreview || imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-bold shadow-md hover:bg-slate-50 transition cursor-pointer"
                      >
                        Change File
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setFilePreview("");
                          setImageUrl("");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-44 border-2 border-dashed border-slate-300 hover:border-[#005AA9] bg-slate-50/50 hover:bg-blue-50/30 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition p-4 text-center"
                  >
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 text-[#005AA9]">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Click to upload photo</p>
                      <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Direct Image URL input as fallback */}
                <div className="pt-2">
                  <span className="text-xs text-slate-400 font-medium">Or paste an existing image URL:</span>
                  <input
                    type="text"
                    placeholder="/images/gallery/example.jpg or https://..."
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (!selectedFile) setFilePreview(e.target.value);
                    }}
                    className="w-full mt-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005AA9]/20 focus:border-[#005AA9]"
                  />
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Caption / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Freshwater display tank — 200 gallon planted community"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005AA9]/20 focus:border-[#005AA9]"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Category Section <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = categorySlug === cat.value;
                    const Icon = cat.icon;
                    return (
                      <button
                        type="button"
                        key={cat.value}
                        onClick={() => setCategorySlug(cat.value)}
                        className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? "border-[#005AA9] bg-blue-50/70 text-[#005AA9] shadow-xs"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order and Status */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005AA9]/20 focus:border-[#005AA9]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Visibility Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005AA9]/20 focus:border-[#005AA9]"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={uploading}
                  className="bg-[#005AA9] hover:bg-[#003B73] text-white rounded-2xl px-6 py-2.5 font-bold shadow-md shadow-blue-900/15 transition active:scale-95 cursor-pointer"
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : editingItem ? (
                    "Update Photo"
                  ) : (
                    "Save Photo"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── LIGHTBOX PREVIEW MODAL ── */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
