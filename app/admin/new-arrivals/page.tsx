"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import {
  PawPrint,
  Search,
  X,
  Check,
  Edit2,
  Trash2,
  AlertTriangle,
  Star,
  Plus,
  Info,
  Calendar,
  Eye,
} from "lucide-react";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import DataGrid from "@/components/admin/common/PersistentDataGrid";
import { showErrorToast } from "@/lib/toast";
import ActionsDropdown from "@/components/admin/common/ActionsDropdown";

interface ArrivalPet {
  id: string;
  name: string;
  slug: string;
  category: string;
  breed: string;
  gender: string;
  age: string;
  size: string;
  price: number;
  discountPrice?: number;
  arrivalDate: string;
  status: "available" | "adopted" | "unavailable";
  featured: boolean;
  vaccinated: boolean;
  dewormed: boolean;
  microchipped: boolean;
  description: string;
  highlights: string[];
  images: string[];
  location: string;
  stock: number;
  seo?: {
    title: string;
    description: string;
  };
}

interface ArrivalStats {
  total: number;
  available: number;
  adopted: number;
  featured: number;
}

export default function AdminNewArrivalsPage() {
  const [arrivals, setArrivals] = useState<ArrivalPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState<ArrivalStats>({
    total: 0,
    available: 0,
    adopted: 0,
    featured: 0,
  });

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedArrival, setSelectedArrival] = useState<ArrivalPet | null>(null);

  // Form Inputs
  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("dogs");
  const [formBreed, setFormBreed] = useState("");
  const [formGender, setFormGender] = useState("Male");
  const [formAge, setFormAge] = useState("");
  const [formSize, setFormSize] = useState("Medium");
  const [formPrice, setFormPrice] = useState("");
  const [formDiscountPrice, setFormDiscountPrice] = useState("");
  const [formArrivalDate, setFormArrivalDate] = useState("");
  const [formStatus, setFormStatus] = useState<"available" | "adopted" | "unavailable">("available");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formVaccinated, setFormVaccinated] = useState(false);
  const [formDewormed, setFormDewormed] = useState(false);
  const [formMicrochipped, setFormMicrochipped] = useState(false);
  const [formDescription, setFormDescription] = useState("");
  const [formHighlights, setFormHighlights] = useState("");
  const [formImages, setFormImages] = useState("");
  const [formLocation, setFormLocation] = useState("Renton Store");
  const [formStock, setFormStock] = useState("1");
  const [formSaving, setFormSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // In-component custom toasts
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "error" }[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const toastId = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 4000);
  }, []);

  // Fetch arrivals from API
  const fetchArrivals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search);
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const response = await axios.get(`/api/admin/new-arrivals?${params.toString()}`);
      if (response.data?.success) {
        setArrivals(response.data.arrivals || []);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      }
    } catch (error) {
      console.error("Failed to fetch arrivals:", error);
      showErrorToast("Failed to retrieve arrivals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArrivals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, statusFilter]);

  // Debounced search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchArrivals();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Open Form for Adding
  const handleOpenAddModal = () => {
    setSelectedArrival(null);
    setFormId("");
    setFormName("");
    setFormCategory("dogs");
    setFormBreed("");
    setFormGender("Male");
    setFormAge("");
    setFormSize("Medium");
    setFormPrice("");
    setFormDiscountPrice("");
    setFormArrivalDate(new Date().toISOString().split("T")[0]);
    setFormStatus("available");
    setFormFeatured(false);
    setFormVaccinated(false);
    setFormDewormed(false);
    setFormMicrochipped(false);
    setFormDescription("");
    setFormHighlights("");
    setFormImages("");
    setFormLocation("Renton Store");
    setFormStock("1");
    setIsFormModalOpen(true);
  };

  // Open Modal for Viewing Details
  const handleOpenViewModal = (pet: ArrivalPet) => {
    setSelectedArrival(pet);
    setIsViewModalOpen(true);
  };

  // Open Form for Editing
  const handleOpenEditModal = (pet: ArrivalPet) => {
    setSelectedArrival(pet);
    setFormId(pet.id);
    setFormName(pet.name);
    setFormCategory(pet.category);
    setFormBreed(pet.breed);
    setFormGender(pet.gender);
    setFormAge(pet.age);
    setFormSize(pet.size);
    setFormPrice(String(pet.price));
    setFormDiscountPrice(pet.discountPrice ? String(pet.discountPrice) : "");
    setFormArrivalDate(pet.arrivalDate);
    setFormStatus(pet.status);
    setFormFeatured(pet.featured);
    setFormVaccinated(pet.vaccinated);
    setFormDewormed(pet.dewormed);
    setFormMicrochipped(pet.microchipped);
    setFormDescription(pet.description || "");
    setFormHighlights(pet.highlights ? pet.highlights.join(", ") : "");
    setFormImages(pet.images ? pet.images.join(", ") : "");
    setFormLocation(pet.location || "Renton Store");
    setFormStock(String(pet.stock || 1));
    setIsFormModalOpen(true);
  };

  // Save changes (Create or Update)
  const handleSaveArrival = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId.trim() || !formName.trim() || !formBreed.trim() || !formPrice.trim()) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    setFormSaving(true);
    try {
      const payload = {
        id: formId,
        name: formName,
        category: formCategory,
        breed: formBreed,
        gender: formGender,
        age: formAge,
        size: formSize,
        price: Number(formPrice),
        discountPrice: formDiscountPrice ? Number(formDiscountPrice) : null,
        arrivalDate: formArrivalDate,
        status: formStatus,
        featured: formFeatured,
        vaccinated: formVaccinated,
        dewormed: formDewormed,
        microchipped: formMicrochipped,
        description: formDescription,
        highlights: formHighlights.split(",").map((s) => s.trim()).filter(Boolean),
        images: formImages.split(",").map((s) => s.trim()).filter(Boolean),
        location: formLocation,
        stock: Number(formStock),
      };

      let response;
      if (selectedArrival) {
        // Edit Mode
        response = await axios.patch(`/api/admin/new-arrivals/${selectedArrival.id}`, payload);
      } else {
        // Add Mode
        response = await axios.post("/api/admin/new-arrivals", payload);
      }

      if (response.data?.success) {
        showToast(selectedArrival ? "Arrival pet updated successfully." : "New arrival pet added successfully.");
        fetchArrivals();
        setIsFormModalOpen(false);
      } else {
        showToast(response.data.message || "Failed to save record.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to save changes.", "error");
    } finally {
      setFormSaving(false);
    }
  };

  // Trigger Delete Modal
  const handleDeleteTrigger = (pet: ArrivalPet) => {
    setSelectedArrival(pet);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!selectedArrival) return;
    try {
      const response = await axios.delete(`/api/admin/new-arrivals/${selectedArrival.id}`);
      if (response.data?.success) {
        showToast("Arrival pet permanently deleted.");
        fetchArrivals();
        setIsDeleteModalOpen(false);
      } else {
        showToast(response.data.message || "Failed to delete record.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to delete arrival.", "error");
    }
  };

  // Format Helper for Price
  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  // Status Badge classes
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "adopted":
        return "bg-[#eef6ff] text-[#005AA9] border-blue-100";
      case "unavailable":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  // Category Badge classes
  const getCategoryBadgeClass = (cat: string) => {
    const colorMap: Record<string, string> = {
      dogs: "bg-amber-50 text-amber-700 border-amber-100",
      cats: "bg-purple-50 text-purple-700 border-purple-100",
      birds: "bg-sky-50 text-sky-700 border-sky-100",
      freshwater: "bg-cyan-50 text-cyan-700 border-cyan-100",
      saltwater: "bg-blue-50 text-blue-700 border-blue-100",
      reptiles: "bg-emerald-50 text-emerald-700 border-emerald-100",
      "small-animals": "bg-pink-50 text-pink-700 border-pink-100",
    };
    return colorMap[cat.toLowerCase()] || "bg-slate-50 text-slate-700 border-slate-100";
  };

  // Mapped rows
  const rows = useMemo(() => {
    return arrivals.map((pet, index) => ({
      ...pet,
      serial: index + 1,
    }));
  }, [arrivals]);

  // Columns definition for DataGrid
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
      field: "id",
      headerName: "ID",
      width: 100,
      renderCell: (params: GridRenderCellParams<ArrivalPet>) => (
        <span className="font-mono font-bold text-slate-800 text-xs">{params.row.id}</span>
      ),
    },
    {
      field: "name",
      headerName: "Pet Details",
      flex: 1.5,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams<ArrivalPet>) => {
        const row = params.row;
        return (
          <div className="flex flex-col py-1.5 leading-tight justify-center h-full">
            <span className="font-extrabold text-slate-800 text-sm">{row.name}</span>
            <span className="text-[11px] text-slate-400 mt-0.5">{row.breed} ({row.age})</span>
          </div>
        );
      },
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<ArrivalPet>) => {
        const row = params.row;
        return (
          <div className="flex items-center h-full">
            <span className={`inline-block border text-[10px] font-black uppercase tracking-wider px-2.5  rounded-full ${getCategoryBadgeClass(row.category)}`}>
              {row.category}
            </span>
          </div>
        );
      },
    },
    {
      field: "price",
      headerName: "Price Listing",
      flex: 1,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<ArrivalPet>) => {
        const row = params.row;
        return (
          <div className="flex flex-col py-1.5 leading-tight justify-center h-full">
            <span className="font-mono font-bold text-slate-900 text-sm">
              {formatPrice(row.price)}
            </span>
            {row.discountPrice && (
              <span className="text-[10px] text-slate-400 line-through mt-0.5">
                {formatPrice(row.discountPrice)}
              </span>
            )}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Listing Status",
      flex: 1,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<ArrivalPet>) => {
        const row = params.row;
        return (
          <div className="flex items-center h-full">
            <span className={`inline-block border text-[10px] font-black uppercase tracking-wider px-2.5  rounded-full ${getStatusBadgeClass(row.status)}`}>
              {row.status}
            </span>
          </div>
        );
      },
    },
    {
      field: "featured",
      headerName: "Featured",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<ArrivalPet>) => (
        <div className="flex items-center justify-center h-full">
          {params.row.featured ? (
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          ) : (
            <span className="text-slate-300">-</span>
          )}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      flex: 1,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<ArrivalPet>) => {
        const row = params.row;
        return (
          <div className="flex items-center justify-end gap-2 w-full pr-2 h-full">
            <ActionsDropdown
              actions={[
                { label: "View", icon: <Eye className="w-4 h-4 text-slate-500" />, onClick: () => handleOpenViewModal(row) },
                { label: "Edit", icon: <Edit2 className="w-4 h-4 text-blue-500" />, onClick: () => handleOpenEditModal(row) },
                { label: "Delete", icon: <Trash2 className="w-4 h-4 text-red-500" />, onClick: () => handleDeleteTrigger(row) },
              ]}
            />
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
          <h1 className="text-3xl font-black text-slate-800">New Arrivals</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium font-lato">
            Manage newest pet arrivals, vaccination records, size highlights, pricing options, and display features.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#005AA9] hover:bg-[#003DA5] text-white font-bold text-sm shadow-md transition active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Arrival
        </button>
      </div>

      {/* ── Stats Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Arrivals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Arrivals</p>
            <h3 className="text-2xl font-black text-slate-800 mt-2">{loading && stats.total === 0 ? "..." : stats.total}</h3>
          </div>
          <div className="p-3 bg-[#eef6ff] rounded-xl text-[#005AA9]">
            <PawPrint className="w-6 h-6" />
          </div>
        </div>

        {/* Available */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-2">{loading && stats.available === 0 ? "..." : stats.available}</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
            <Check className="w-6 h-6 stroke-[3px]" />
          </div>
        </div>

        {/* Adopted / Unavailable */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Adopted / Gone</p>
            <h3 className="text-2xl font-black text-rose-500 mt-2">{loading && stats.adopted === 0 ? "..." : stats.adopted}</h3>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl text-rose-500">
            <X className="w-6 h-6 stroke-[3px]" />
          </div>
        </div>

        {/* Featured */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Featured Pets</p>
            <h3 className="text-2xl font-black text-amber-600 mt-2">{loading && stats.featured === 0 ? "..." : stats.featured}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <Star className="w-6 h-6" />
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
            placeholder="Search arrivals by pet ID, name, or breed..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-100 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 transition font-semibold text-slate-700"
          />
        </div>

        {/* Category Dropdown */}
        <div className="w-full sm:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-100 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer shadow-sm text-slate-700"
          >
            <option value="all">All Categories</option>
            <option value="dogs">Dogs</option>
            <option value="cats">Cats</option>
            <option value="birds">Birds</option>
            <option value="freshwater">Freshwater Fish</option>
            <option value="saltwater">Saltwater Fish</option>
            <option value="reptiles">Reptiles</option>
            <option value="small-animals">Small Animals</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-100 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer shadow-sm text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="adopted">Adopted</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {/* ── Table Grid ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-x-auto" style={{ width: "100%" }}>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            storageKey="admin_grid_new_arrivals"
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
            sx={{
              '& .MuiDataGrid-cell': { overflow: 'visible !important' },
              '& .MuiDataGrid-row': { overflow: 'visible !important' },
            }}
          />
        </div>
      </div>

      {/* ── CREATE / EDIT DIALOG FORM MODAL ── */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div onClick={() => setIsFormModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          
          <form
            onSubmit={handleSaveArrival}
            className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 overflow-hidden text-slate-700"
          >
            {/* Header */}
            <div className="bg-[#003B73] px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h2 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-sky-300" />
                <span>{selectedArrival ? `Edit Pet Record - ${formId}` : "Add New Arrival Pet"}</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Fields */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Pet ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={!!selectedArrival}
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    placeholder="e.g. DOG001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#005AA9]/30 disabled:bg-slate-50 disabled:text-slate-400"
                    required
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Display Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Golden Retriever Puppy"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#005AA9]/30"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer bg-white"
                    required
                  >
                    <option value="dogs">Dogs</option>
                    <option value="cats">Cats</option>
                    <option value="birds">Birds</option>
                    <option value="freshwater">Freshwater Fish</option>
                    <option value="saltwater">Saltwater Fish</option>
                    <option value="reptiles">Reptiles</option>
                    <option value="small-animals">Small Animals</option>
                  </select>
                </div>

                {/* Breed */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Breed / Species <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formBreed}
                    onChange={(e) => setFormBreed(e.target.value)}
                    placeholder="e.g. Golden Retriever"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#005AA9]/30"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Price ($) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#005AA9]/30"
                    required
                  />
                </div>

                {/* Discount Price */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Discount Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formDiscountPrice}
                    onChange={(e) => setFormDiscountPrice(e.target.value)}
                    placeholder="e.g. 1050"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#005AA9]/30"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Age</label>
                  <input
                    type="text"
                    value={formAge}
                    onChange={(e) => setFormAge(e.target.value)}
                    placeholder="e.g. 3 Months"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#005AA9]/30"
                  />
                </div>

                {/* Arrival Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Arrival Date</label>
                  <input
                    type="date"
                    value={formArrivalDate}
                    onChange={(e) => setFormArrivalDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#005AA9]/30 bg-white"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unknown">Unknown / Shared</option>
                  </select>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Size Class</label>
                  <select
                    value={formSize}
                    onChange={(e) => setFormSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer bg-white"
                  >
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer bg-white"
                  >
                    <option value="available">Available</option>
                    <option value="adopted">Adopted</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Stock Count</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#005AA9]/30"
                  />
                </div>
              </div>

              {/* Boolean checkboxes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Featured Listing
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formVaccinated}
                    onChange={(e) => setFormVaccinated(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Vaccinated
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formDewormed}
                    onChange={(e) => setFormDewormed(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Dewormed
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formMicrochipped}
                    onChange={(e) => setFormMicrochipped(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Microchipped
                </label>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Store Location</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Renton Store"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#005AA9]/30"
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Highlights (Comma separated list)
                </label>
                <input
                  type="text"
                  value={formHighlights}
                  onChange={(e) => setFormHighlights(e.target.value)}
                  placeholder="e.g. Friendly Nature, Vaccinated, Good With Children"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#005AA9]/30"
                />
              </div>

              {/* Image urls */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Images
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        setUploading(true);
                        const data = new FormData();
                        data.append("folder", "new-arrivals");
                        for (let i = 0; i < files.length; i++) {
                          data.append("file", files[i]);
                        }
                        try {
                          const res = await axios.post("/api/upload", data, {
                            headers: { "Content-Type": "multipart/form-data" },
                          });
                          if (res.data?.success) {
                            const urls = res.data.urls || [res.data.url];
                            setFormImages((prev) => (prev ? `${prev}, ${urls.join(", ")}` : urls.join(", ")));
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
                    type="text"
                    value={formImages}
                    onChange={(e) => setFormImages(e.target.value)}
                    placeholder="e.g. /images/newarrivals/dog1.jpg, /images/newarrivals/dog2.jpg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#005AA9]/30"
                  />
                  {formImages && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formImages
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((url, i) => (
                          <img key={i} src={url} alt={`Preview ${i}`} className="h-12 w-12 object-cover rounded-lg border border-slate-200" />
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Provide description of the animal..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#005AA9]/30"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4.5 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="px-4.5 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-bold transition active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formSaving}
                className="px-5.5 py-2.5 rounded-2xl bg-[#005AA9] hover:bg-[#003DA5] text-white text-sm font-bold shadow-md transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {formSaving ? "Saving..." : selectedArrival ? "Save Changes" : "Create Listing"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── VIEW ARRIVAL DETAILS MODAL ── */}
      {isViewModalOpen && selectedArrival && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-800">New Arrival Details</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">ID: {selectedArrival.id}</p>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition active:scale-95 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-750">
              {/* Pet Info */}
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Image */}
                <div className="w-full sm:w-48 h-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-150 flex-shrink-0 flex items-center justify-center relative">
                  {selectedArrival.images?.[0] ? (
                    <img
                      src={selectedArrival.images[0]}
                      alt={selectedArrival.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-slate-400">No Image</span>
                  )}
                </div>

                {/* Grid */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pet Name</span>
                    <p className="text-sm font-extrabold text-slate-800 mt-0.5">{selectedArrival.name}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</span>
                    <p className="text-sm font-bold text-slate-700 mt-0.5 capitalize">{selectedArrival.category}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Breed</span>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{selectedArrival.breed}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</span>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{selectedArrival.gender}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Age</span>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{selectedArrival.age}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Size</span>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{selectedArrival.size}</p>
                  </div>
                </div>
              </div>

              {/* Price & Location & Status */}
              <div className="border-t border-slate-100 pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pricing</span>
                  <div className="mt-0.5">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {formatPrice(selectedArrival.price)}
                    </span>
                    {selectedArrival.discountPrice && (
                      <span className="text-[10px] text-slate-400 line-through ml-2">
                        {formatPrice(selectedArrival.discountPrice)}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location / Stock</span>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">
                    {selectedArrival.location || "Renton Store"} ({selectedArrival.stock || 1} left)
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Listing Status</span>
                  <div className="mt-1">
                    <span className={`inline-block border text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusBadgeClass(selectedArrival.status)}`}>
                      {selectedArrival.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges/Characteristics */}
              <div className="border-t border-slate-100 pt-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Characteristics</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                    selectedArrival.vaccinated ? "bg-emerald-50 text-emerald-700 border-emerald-150" : "bg-slate-50 text-slate-400 border-slate-200"
                  }`}>
                    {selectedArrival.vaccinated ? "✓ Vaccinated" : "✗ Not Vaccinated"}
                  </span>
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                    selectedArrival.dewormed ? "bg-emerald-50 text-emerald-700 border-emerald-150" : "bg-slate-50 text-slate-400 border-slate-200"
                  }`}>
                    {selectedArrival.dewormed ? "✓ Dewormed" : "✗ Not Dewormed"}
                  </span>
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                    selectedArrival.microchipped ? "bg-emerald-50 text-emerald-700 border-emerald-150" : "bg-slate-50 text-slate-400 border-slate-200"
                  }`}>
                    {selectedArrival.microchipped ? "✓ Microchipped" : "✗ Not Microchipped"}
                  </span>
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                    selectedArrival.featured ? "bg-amber-50 text-amber-700 border-amber-150" : "bg-slate-50 text-slate-400 border-slate-200"
                  }`}>
                    ★ Featured Listing
                  </span>
                </div>
              </div>

              {/* Highlights */}
              {selectedArrival.highlights && selectedArrival.highlights.length > 0 && (
                <div className="border-t border-slate-100 pt-6">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Highlights</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedArrival.highlights.map((h, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-xs font-semibold text-slate-600 border border-slate-200">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="border-t border-slate-100 pt-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Description</span>
                <p className="text-xs text-slate-600 leading-relaxed mt-2 bg-slate-50 p-4 rounded-2xl border border-slate-100/60 whitespace-pre-line">
                  {selectedArrival.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer transition active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {isDeleteModalOpen && selectedArrival && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200 text-slate-700">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="h-10 w-10 bg-rose-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Permanently Delete Listing</h3>
            </div>
            
            <p className="text-slate-500 text-sm leading-relaxed">
              Are you sure you want to permanently delete the arrival listing for <strong className="text-slate-700">{selectedArrival.name}</strong> (ID: {selectedArrival.id})? 
              This action cannot be undone and will permanently remove this record from the new arrivals catalog.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4.5 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition duration-150 active:scale-95 cursor-pointer"
              >
                Delete Listing
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
