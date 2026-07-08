"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import {
  MessageSquare,
  Search,
  X,
  Check,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import DataGrid from "@/components/admin/common/PersistentDataGrid";
import { showErrorToast } from "@/lib/toast";

interface Review {
  _id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment: string;
  images: string[];
  verifiedPurchase: boolean;
  helpfulCount: number;
  status: "published" | "hidden" | "reported";
  createdAt: string;
  updatedAt: string;
}

interface ReviewStats {
  total: number;
  published: number;
  hidden: number;
  reported: number;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [stats, setStats] = useState<ReviewStats>({
    total: 0,
    published: 0,
    hidden: 0,
    reported: 0,
  });

  // Modal / Interaction states
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  
  // Lightbox
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // In-component custom toasts
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "error" }[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Fetch reviews from database
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("limit", "100000"); // Retrieve all matching reviews for DataGrid sorting & paging
      if (search.trim()) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (ratingFilter !== "all") params.set("rating", ratingFilter);

      const response = await axios.get(`/api/admin/reviews?${params.toString()}`);
      if (response.data?.success) {
        setReviews(response.data.reviews || []);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      showErrorToast("Failed to retrieve reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, ratingFilter]);

  // Debounced search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchReviews();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Toggle status (Published <-> Hidden)
  const handleToggleStatus = async (review: Review) => {
    const newStatus = review.status === "published" ? "hidden" : "published";
    try {
      const { data } = await axios.patch(`/api/admin/reviews/${review._id}`, { status: newStatus });
      if (data.success) {
        showToast(`Review status updated to ${newStatus} successfully.`);
        fetchReviews();
      } else {
        showToast(data.message || "Failed to update review status", "error");
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      showToast(error.response?.data?.message || "Failed to update status", "error");
    }
  };

  // Quick report status set
  const handleSetReported = async (review: Review) => {
    try {
      const { data } = await axios.patch(`/api/admin/reviews/${review._id}`, { status: "reported" });
      if (data.success) {
        showToast(`Review flagged as reported.`);
        fetchReviews();
      } else {
        showToast(data.message || "Failed to update status", "error");
      }
    } catch (error: any) {
      console.error("Error setting reported status:", error);
      showToast(error.response?.data?.message || "Failed to update status", "error");
    }
  };

  // Delete review
  const handleDeleteReview = async () => {
    if (!deletingReview) return;
    try {
      const { data } = await axios.delete(`/api/admin/reviews/${deletingReview._id}`);
      if (data.success) {
        showToast("Review permanently deleted successfully.");
        setDeletingReview(null);
        fetchReviews();
      } else {
        showToast(data.message || "Failed to delete review", "error");
      }
    } catch (error: any) {
      console.error("Error deleting review:", error);
      showToast(error.response?.data?.message || "Failed to delete review", "error");
    }
  };

  // Lightbox navigation
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? lightboxImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === lightboxImages.length - 1 ? 0 : prev + 1));
  };

  // Class helper for status badges
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "reported":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "hidden":
        return "bg-slate-50 text-slate-600 border-slate-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  // Mapped Rows for DataGrid
  const rows = useMemo(() => {
    return reviews.map((review, index) => ({
      ...review,
      id: review._id,
      serial: index + 1,
    }));
  }, [reviews]);

  // Columns Definition for DataGrid
  const columns: GridColDef[] = [
    {
      field: "serial",
      headerName: "#",
      width: 70,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "userName",
      headerName: "User",
      flex: 1.2,
      minWidth: 160,
      renderCell: (params: GridRenderCellParams<Review>) => {
        const row = params.row;
        return (
          <div className="flex items-center gap-2.5 py-1.5 justify-center h-full">
            {row.userAvatar ? (
              <img
                src={row.userAvatar}
                alt={row.userName}
                className="h-8.5 w-8.5 rounded-full object-cover border border-slate-100 shrink-0"
              />
            ) : (
              <div className="h-8.5 w-8.5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                {row.userName.slice(0, 2)}
              </div>
            )}
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-slate-800 text-xs">{row.userName}</span>
              <span className="text-[10px] text-slate-400">
                {new Date(row.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      field: "productId",
      headerName: "Product Details",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<Review>) => {
        const row = params.row;
        return (
          <div className="flex flex-col py-1.5 leading-tight justify-center h-full">
            <Link
              href={`/product/${row.productId}`}
              target="_blank"
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline"
            >
              View Product
              <ExternalLink className="h-3 w-3" />
            </Link>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {row.productId}</span>
          </div>
        );
      },
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 120,
      renderCell: (params: GridRenderCellParams<Review>) => {
        const row = params.row;
        return (
          <div className="flex items-center gap-0.5 h-full">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < row.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                }`}
              />
            ))}
          </div>
        );
      },
    },
    {
      field: "comment",
      headerName: "Review Details",
      flex: 2.2,
      minWidth: 240,
      renderCell: (params: GridRenderCellParams<Review>) => {
        const row = params.row;
        return (
          <div className="flex flex-col py-1.5 leading-tight justify-center h-full max-w-md">
            {row.title && <span className="font-extrabold text-slate-800 text-xs mb-0.5 truncate">{row.title}</span>}
            <span className="text-slate-500 text-xs line-clamp-2 truncate whitespace-normal leading-normal">{row.comment}</span>
          </div>
        );
      },
    },
    {
      field: "images",
      headerName: "Media",
      width: 120,
      renderCell: (params: GridRenderCellParams<Review>) => {
        const row = params.row;
        if (!row.images || row.images.length === 0) {
          return <span className="text-[11px] text-slate-400 italic flex items-center h-full">No media</span>;
        }
        return (
          <div className="flex items-center gap-1 h-full">
            {row.images.slice(0, 3).map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setLightboxImages(row.images);
                  setLightboxIndex(idx);
                }}
                className="relative h-7.5 w-7.5 rounded-lg overflow-hidden border border-slate-200 hover:opacity-85 transition cursor-zoom-in shrink-0"
              >
                <img src={img} alt="review media" className="h-full w-full object-cover" />
                {idx === 2 && row.images.length > 3 && (
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-[9px] font-bold text-white">
                    +{row.images.length - 3}
                  </div>
                )}
              </button>
            ))}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.9,
      minWidth: 110,
      renderCell: (params: GridRenderCellParams<Review>) => {
        const row = params.row;
        return (
          <div className="flex items-center h-full">
            <span className={`inline-block border text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${getStatusBadgeClass(row.status)}`}>
              {row.status}
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
      flex: 1.2,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<Review>) => {
        const row = params.row;
        return (
          <div className="flex items-center justify-end gap-1.5 w-full pr-2 h-full">
            {/* Toggle published/hidden status */}
            {row.status === "published" ? (
              <button
                onClick={() => handleToggleStatus(row)}
                className="p-2 border border-slate-100 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition active:scale-95 cursor-pointer"
                title="Hide Review"
              >
                <EyeOff className="w-4 h-4 text-slate-500" />
              </button>
            ) : (
              <button
                onClick={() => handleToggleStatus(row)}
                className="p-2 border border-slate-100 hover:border-emerald-200 rounded-xl bg-white hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 transition active:scale-95 cursor-pointer"
                title="Publish Review"
              >
                <Check className="w-4 h-4 text-slate-500" />
              </button>
            )}

            {/* Flag reported */}
            {row.status !== "reported" && (
              <button
                onClick={() => handleSetReported(row)}
                className="p-2 border border-slate-100 hover:border-amber-200 rounded-xl bg-white hover:bg-amber-50 text-slate-500 hover:text-amber-600 transition active:scale-95 cursor-pointer"
                title="Flag Reported"
              >
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </button>
            )}

            {/* Delete permanently */}
            <button
              onClick={() => setDeletingReview(row)}
              className="p-2 border border-slate-100 hover:border-rose-200 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition active:scale-95 cursor-pointer"
              title="Delete Review"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 font-lato">
      {/* ── Title block ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Reviews Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium font-lato">
            Monitor product reviews, moderate customer ratings, manage reported content, and check attached photo uploads.
          </p>
        </div>
      </div>

      {/* ── Stats Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Reviews */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Reviews</p>
            <h3 className="text-2xl font-black text-slate-800 mt-2">{loading && stats.total === 0 ? "..." : stats.total}</h3>
          </div>
          <div className="p-3 bg-[#eef6ff] rounded-xl text-[#005AA9]">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Published Reviews */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Published</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-2">{loading && stats.published === 0 ? "..." : stats.published}</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
            <Check className="w-6 h-6 stroke-[3px]" />
          </div>
        </div>

        {/* Reported Reviews */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reported</p>
            <h3 className="text-2xl font-black text-amber-600 mt-2">{loading && stats.reported === 0 ? "..." : stats.reported}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Hidden Reviews */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hidden</p>
            <h3 className="text-2xl font-black text-slate-500 mt-2">{loading && stats.hidden === 0 ? "..." : stats.hidden}</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
            <EyeOff className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search reviews by comment, title, or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-100 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 transition font-semibold text-slate-700"
          />
        </div>

        {/* Status Dropdown */}
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-100 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer shadow-sm text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
            <option value="reported">Reported</option>
          </select>
        </div>

        {/* Rating Dropdown */}
        <div className="w-full sm:w-48">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-100 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer shadow-sm text-slate-700"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* ── Reviews Table Grid ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-x-auto" style={{ width: "100%" }}>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            storageKey="admin_grid_reviews"
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
          />
        </div>
      </div>

      {/* ── Image Lightbox Modal ── */}
      {lightboxImages.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-4 select-none cursor-zoom-out"
          onClick={() => setLightboxImages([])}
        >
          <button
            onClick={() => setLightboxImages([])}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition z-[310]"
          >
            <X className="h-6 w-6" />
          </button>

          {lightboxImages.length > 1 && (
            <button
              onClick={handlePrevImage}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition z-[310]"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          <div
            className="max-w-4xl max-h-[85vh] flex items-center justify-center relative cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImages[lightboxIndex]}
              alt="Fullscreen Review Media"
              className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl"
            />
            {lightboxImages.length > 1 && (
              <div className="absolute bottom-[-2.5rem] left-1/2 -translate-y-1/2 -translate-x-1/2 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/10">
                {lightboxIndex + 1} / {lightboxImages.length}
              </div>
            )}
          </div>

          {lightboxImages.length > 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition z-[310]"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deletingReview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="h-10 w-10 bg-rose-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Permanently Delete Review</h3>
            </div>
            
            <p className="text-slate-500 text-sm leading-relaxed">
              Are you sure you want to delete this review by <strong className="text-slate-700">{deletingReview.userName}</strong>? 
              This action cannot be undone and will permanently remove the rating and comment from the product list and statistics.
            </p>

            <div className="mt-3.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-500 italic line-clamp-3">
              "{deletingReview.comment}"
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeletingReview(null)}
                className="px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition duration-150 active:scale-95"
              >
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Floating Toasts Notifications ── */}
      <div className="fixed top-5 right-5 z-[500] flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold text-white transition duration-300 animate-in slide-in-from-top-4 ${
              t.type === "success"
                ? "bg-[#003B73]"
                : "bg-rose-600"
            }`}
          >
            {t.type === "success" ? (
              <Check className="h-5 w-5 shrink-0 bg-white/20 p-0.5 rounded-full" />
            ) : (
              <X className="h-5 w-5 shrink-0 bg-white/20 p-0.5 rounded-full" />
            )}
            <p className="flex-1">{t.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
