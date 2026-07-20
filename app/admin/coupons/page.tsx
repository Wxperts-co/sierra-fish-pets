"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Tag, Plus, Edit2, Trash2, Search, X, Eye, Check, Copy,
  ToggleLeft, ToggleRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import DataGrid from "@/components/admin/common/PersistentDataGrid";
import ActionsDropdown from "@/components/admin/common/ActionsDropdown";

interface CouponItem {
  _id?: string;
  id?: string;
  code: string;
  title: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumPurchase: number;
  maximumDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  applicableCategories: string[];
  terms?: string;
}

const CATEGORY_OPTIONS = ["dog", "cat", "aquatic", "reptile", "bird", "small-animal"];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingCoupon, setViewingCoupon] = useState<CouponItem | null>(null);

  // Form state
  const [form, setForm] = useState({
    code: "",
    title: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    minimumPurchase: "",
    maximumDiscount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    isActive: true,
    applicableCategories: [] as string[],
    terms: "",
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/coupons?all=true");
      if (data.success) setCoupons(data.coupons || []);
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const filteredCoupons = useMemo(() => {
    const term = search.trim().toLowerCase();
    return coupons.filter((c) =>
      !term ||
      c.code.toLowerCase().includes(term) ||
      c.title.toLowerCase().includes(term)
    );
  }, [coupons, search]);

  const resetForm = () =>
    setForm({
      code: "", title: "", description: "",
      discountType: "percentage", discountValue: "",
      minimumPurchase: "", maximumDiscount: "",
      startDate: "", endDate: "",
      usageLimit: "", isActive: true,
      applicableCategories: [], terms: "",
    });

  const handleOpenCreate = () => {
    resetForm();
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coupon: CouponItem) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      title: coupon.title,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minimumPurchase: String(coupon.minimumPurchase || ""),
      maximumDiscount: String(coupon.maximumDiscount || ""),
      startDate: coupon.startDate ? coupon.startDate.slice(0, 10) : "",
      endDate: coupon.endDate ? coupon.endDate.slice(0, 10) : "",
      usageLimit: String(coupon.usageLimit || ""),
      isActive: coupon.isActive,
      applicableCategories: coupon.applicableCategories || [],
      terms: coupon.terms || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        title: form.title,
        description: form.description,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minimumPurchase: Number(form.minimumPurchase || 0),
        maximumDiscount: form.maximumDiscount ? Number(form.maximumDiscount) : undefined,
        startDate: form.startDate,
        endDate: form.endDate,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        isActive: form.isActive,
        applicableCategories: form.applicableCategories,
        terms: form.terms,
      };

      if (editingCoupon?._id) {
        const { data } = await axios.put(`/api/coupons/${editingCoupon._id}`, payload);
        if (data.success) {
          setCoupons((prev) => prev.map((c) => (c._id === editingCoupon._id ? { ...c, ...data.coupon } : c)));
        }
      } else {
        const { data } = await axios.post("/api/coupons", payload);
        if (data.success) setCoupons((prev) => [data.coupon, ...prev]);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error("Save coupon error:", err);
      alert(err?.response?.data?.message || "Failed to save coupon.");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !window.confirm("Delete this coupon permanently?")) return;
    try {
      await axios.delete(`/api/coupons/${id}`);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete coupon error:", err);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Coupon Code",
      flex: 1,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams) => (
        <span className="font-mono font-black text-[#003d73] text-sm tracking-widest">{params.value}</span>
      ),
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1.5,
      minWidth: 160,
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex flex-col py-1.5 justify-center h-full">
          <span className="font-bold text-slate-800 text-xs">{params.value}</span>
          <span className="text-slate-400 text-[10px] mt-0.5 truncate max-w-[160px]">{params.row.description}</span>
        </div>
      ),
    },
    {
      field: "discountValue",
      headerName: "Discount",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) => (
        <span className="inline-flex items-center gap-1 bg-[#003d73] text-white text-xs font-extrabold px-2.5 py-1 rounded-full">
          <Tag className="w-3 h-3" />
          {params.row.discountType === "percentage" ? `${params.value}%` : `$${params.value}`} OFF
        </span>
      ),
    },
    {
      field: "endDate",
      headerName: "Expires",
      flex: 0.9,
      minWidth: 110,
      renderCell: (params: GridRenderCellParams) => (
        <span className="text-xs text-slate-600 font-medium">
          {new Date(params.value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
    {
      field: "usageCount",
      headerName: "Usage",
      flex: 0.6,
      minWidth: 90,
      renderCell: (params: GridRenderCellParams) => (
        <span className="text-xs text-slate-600 font-semibold">
          {params.value}/{params.row.usageLimit || "∞"}
        </span>
      ),
    },
    {
      field: "isActive",
      headerName: "Status",
      flex: 0.7,
      minWidth: 90,
      renderCell: (params: GridRenderCellParams) => (
        params.value ? (
          <span className="text-emerald-700 text-[10px] font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">Active</span>
        ) : (
          <span className="text-slate-500 text-[10px] font-bold bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">Inactive</span>
        )
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <ActionsDropdown
          actions={[
            {
              label: "View",
              icon: <Eye className="w-4 h-4 text-slate-500" />,
              onClick: () => { setViewingCoupon(params.row as CouponItem); setIsDetailModalOpen(true); },
            },
            {
              label: "Edit",
              icon: <Edit2 className="w-4 h-4 text-blue-500" />,
              onClick: () => handleOpenEdit(params.row as CouponItem),
            },
            {
              label: "Delete",
              icon: <Trash2 className="w-4 h-4 text-rose-500" />,
              onClick: () => handleDelete(params.row._id),
            },
          ]}
        />
      ),
    },
  ];

  const toggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      applicableCategories: prev.applicableCategories.includes(cat)
        ? prev.applicableCategories.filter((c) => c !== cat)
        : [...prev.applicableCategories, cat],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Coupons</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Create and manage discount coupon codes displayed on the Coupons page.</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-[#005AA9] hover:bg-[#00407a] text-white rounded-2xl px-6 py-2.5 text-xs font-bold shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Coupon
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by code or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        <DataGrid
          rows={filteredCoupons.map((c) => ({ ...c, id: c._id || c.code }))}
          columns={columns}
          loading={loading}
          autoHeight
          pageSizeOptions={[10, 20, 50]}
        />
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-6">
              {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Code & Title */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Coupon Code *</label>
                  <input
                    type="text" required placeholder="e.g. SAVE20"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono font-bold focus:outline-none focus:border-[#005AA9] uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title *</label>
                  <input
                    type="text" required placeholder="e.g. 20% Off Dog Food"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                  />
                </div>
              </div>

              {/* Discount Type + Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Discount Type *</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value as "percentage" | "fixed" })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Discount Value * ({form.discountType === "percentage" ? "%" : "$"})
                  </label>
                  <input
                    type="number" required min="0" step="0.01"
                    placeholder={form.discountType === "percentage" ? "20" : "10.00"}
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                  />
                </div>
              </div>

              {/* Min Purchase & Max Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Min. Purchase ($)</label>
                  <input
                    type="number" min="0" step="0.01" placeholder="0"
                    value={form.minimumPurchase}
                    onChange={(e) => setForm({ ...form, minimumPurchase: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Max. Discount ($)</label>
                  <input
                    type="number" min="0" step="0.01" placeholder="Optional"
                    value={form.maximumDiscount}
                    onChange={(e) => setForm({ ...form, maximumDiscount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Start Date *</label>
                  <input
                    type="date" required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">End Date *</label>
                  <input
                    type="date" required
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                  />
                </div>
              </div>

              {/* Usage Limit & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Usage Limit</label>
                  <input
                    type="number" min="0" placeholder="Unlimited"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${form.isActive ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-100 border-slate-200 text-slate-600"}`}
                  >
                    {form.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    {form.isActive ? "Active" : "Inactive"}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short coupon description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                />
              </div>

              {/* Applicable Categories */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Applicable Categories (leave empty for all)</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer border ${form.applicableCategories.includes(cat) ? "bg-[#005AA9] text-white border-[#005AA9]" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Terms &amp; Conditions</label>
                <textarea
                  rows={2}
                  placeholder="Optional terms..."
                  value={form.terms}
                  onChange={(e) => setForm({ ...form, terms: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#005AA9] hover:bg-[#00407a] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {editingCoupon ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {isDetailModalOpen && viewingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#005AA9] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {viewingCoupon.isActive ? "Active" : "Inactive"}
              </span>
              <div className="mt-3 bg-slate-50 border border-dashed border-slate-300 rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-2xl font-black text-[#003d73] tracking-widest font-mono">{viewingCoupon.code}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(viewingCoupon.code)}
                  className="ml-auto bg-[#005AA9] text-white p-2 rounded-xl hover:bg-[#00407a] cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Discount</span>
                  <span className="text-slate-800 font-bold mt-0.5 block">
                    {viewingCoupon.discountType === "percentage" ? `${viewingCoupon.discountValue}%` : `$${viewingCoupon.discountValue}`} OFF
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Min. Purchase</span>
                  <span className="text-slate-800 font-bold mt-0.5 block">${viewingCoupon.minimumPurchase || 0}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Start Date</span>
                  <span className="text-slate-800 font-bold mt-0.5 block">{new Date(viewingCoupon.startDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">End Date</span>
                  <span className="text-slate-800 font-bold mt-0.5 block">{new Date(viewingCoupon.endDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Usage</span>
                  <span className="text-slate-800 font-bold mt-0.5 block">{viewingCoupon.usageCount} / {viewingCoupon.usageLimit || "∞"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Categories</span>
                  <span className="text-slate-800 font-bold mt-0.5 block capitalize">
                    {viewingCoupon.applicableCategories.length > 0 ? viewingCoupon.applicableCategories.join(", ") : "All"}
                  </span>
                </div>
              </div>
              {viewingCoupon.description && (
                <div className="border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Description</span>
                  <p className="text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">{viewingCoupon.description}</p>
                </div>
              )}
              {viewingCoupon.terms && (
                <div className="border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Terms</span>
                  <p className="text-slate-500 font-medium text-[10px] leading-relaxed">{viewingCoupon.terms}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
