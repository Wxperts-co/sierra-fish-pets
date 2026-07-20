"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Plus, Edit2, Trash2, Fish, Search, X, Check, Eye, RefreshCw, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import DataGrid from "@/components/admin/common/PersistentDataGrid";
import { showErrorToast } from "@/lib/toast";
import ActionsDropdown from "@/components/admin/common/ActionsDropdown";

interface SpecialOrderPet {
  _id?: string;
  id: string;
  name: string;
  category: "fish" | "reptile" | "bird";
  type: string;
  leadTime: string;
  image: string;
  description: string;
  careDetails?: string;
  status: "available" | "unavailable";
}

const CATEGORY_STYLES: Record<string, string> = {
  fish: "text-[#005AA9] bg-blue-50 border-blue-200",
  reptile: "text-emerald-700 bg-emerald-50 border-emerald-200",
  bird: "text-amber-700 bg-amber-50 border-amber-200",
};

export default function AdminSpecialOrderPetsPage() {
  const [pets, setPets] = useState<SpecialOrderPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<SpecialOrderPet | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingPet, setViewingPet] = useState<SpecialOrderPet | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "fish" as "fish" | "reptile" | "bird",
    type: "",
    leadTime: "1-2 Weeks",
    image: "",
    description: "",
    careDetails: "",
    status: "available" as "available" | "unavailable",
  });

  const fetchPets = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/special-order-pets?all=true");
      if (res.data.success && Array.isArray(res.data.pets)) {
        setPets(res.data.pets);
      }
    } catch (err) {
      console.error("Failed to load special order pets:", err);
      showErrorToast("Failed to fetch special order pets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleOpenCreate = () => {
    setEditingPet(null);
    setFormData({
      id: `sp-${Date.now()}`,
      name: "",
      category: "fish",
      type: "Freshwater Fish",
      leadTime: "1-2 Weeks",
      image: "",
      description: "",
      careDetails: "",
      status: "available",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pet: SpecialOrderPet) => {
    setEditingPet(pet);
    setFormData({
      id: pet.id,
      name: pet.name,
      category: pet.category,
      type: pet.type,
      leadTime: pet.leadTime,
      image: pet.image,
      description: pet.description,
      careDetails: pet.careDetails || "",
      status: pet.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this special order pet?")) return;
    try {
      const res = await axios.delete(`/api/special-order-pets/${id}`);
      if (res.data.success) {
        setPets((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      showErrorToast("Failed to delete pet");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      const res = await axios.post("/api/upload", fd);
      if (res.data.url) {
        setFormData((prev) => ({ ...prev, image: res.data.url }));
      }
    } catch (err) {
      showErrorToast("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPet) {
        const res = await axios.put(`/api/special-order-pets/${editingPet.id}`, formData);
        if (res.data.success) {
          setPets((prev) =>
            prev.map((p) => (p.id === editingPet.id ? res.data.pet : p))
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await axios.post("/api/special-order-pets", formData);
        if (res.data.success) {
          setPets((prev) => [res.data.pet, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || "Failed to save pet");
    }
  };

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(search.toLowerCase()) ||
        pet.type.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || pet.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [pets, search, categoryFilter]);

  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: "Image",
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 relative mt-1.5 border border-slate-200">
          <img
            src={params.value || "/placeholder-product.png"}
            alt="pet"
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 160,
      renderCell: (params: GridRenderCellParams) => (
        <span className="font-bold text-slate-800 text-sm">{params.value}</span>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <span
          className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full border ${
            CATEGORY_STYLES[params.value as string] || "bg-slate-100 text-slate-700"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "type",
      headerName: "Species / Type",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <span className="text-xs text-slate-600 font-medium">{params.value}</span>
      ),
    },
    {
      field: "leadTime",
      headerName: "Lead Time",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <span className="text-xs text-slate-500 font-semibold">{params.value}</span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <span
          className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
            params.value === "available"
              ? "text-emerald-700 bg-emerald-50"
              : "text-slate-500 bg-slate-100"
          }`}
        >
          {params.value}
        </span>
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
              label: "View Pet",
              icon: <Eye className="w-4 h-4 text-slate-500" />,
              onClick: () => {
                setViewingPet(params.row as SpecialOrderPet);
                setIsDetailModalOpen(true);
              },
            },
            {
              label: "Edit Pet",
              icon: <Edit2 className="w-4 h-4 text-blue-500" />,
              onClick: () => handleOpenEdit(params.row as SpecialOrderPet),
            },
            {
              label: "Delete",
              icon: <Trash2 className="w-4 h-4 text-rose-500" />,
              onClick: () => handleDelete(params.row.id),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
         
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Manage Special Order Fish &amp; Pets
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Add and manage adoptable/special order fish, reptiles, and birds shown on the Special Order Animals page.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-[#005AA9] hover:bg-[#00407a] text-white rounded-2xl px-6 py-2.5 text-xs font-bold shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Special Order Pet
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["all", "fish", "reptile", "bird"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                categoryFilter === cat
                  ? "bg-[#005AA9] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        <DataGrid
          rows={filteredPets.map((p) => ({ ...p, id: p.id }))}
          columns={columns}
          loading={loading}
          autoHeight
          pageSizeOptions={[10, 20, 50]}
        />
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-6">
              {editingPet ? "Edit Special Order Pet" : "Add New Special Order Pet"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Pet Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wild Heckel Cross Discus"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                  >
                    <option value="fish">Fish</option>
                    <option value="reptile">Reptile</option>
                    <option value="bird">Bird</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Species / Type *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Freshwater Fish"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Estimated Arrival
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3-5 Days"
                    value={formData.leadTime}
                    onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Image URL or Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="/images/categories/aquatic_category.png"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="pet-img-upload"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="pet-img-upload"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer"
                  >
                    {uploading ? "..." : "Upload"}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short pet description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#005AA9] hover:bg-[#00407a] text-white text-xs font-bold shadow-md"
                >
                  Save Pet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Pet Details Modal */}
      {isDetailModalOpen && viewingPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 relative shrink-0 border border-slate-200">
                <img
                  src={viewingPet.image || "/placeholder-product.png"}
                  alt={viewingPet.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#005AA9] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {viewingPet.category}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {viewingPet.name}
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Species / Type</span>
                  <span className="text-slate-800 font-bold mt-0.5 block">{viewingPet.type}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Est. Arrival</span>
                  <span className="text-slate-800 font-bold mt-0.5 block">{viewingPet.leadTime}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Status</span>
                  <span className="text-emerald-700 font-bold capitalize mt-0.5 block">{viewingPet.status}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Pet ID</span>
                  <span className="text-slate-800 font-bold mt-0.5 block">{viewingPet.id}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Description</span>
                <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {viewingPet.description || "No description provided."}
                </p>
              </div>

              {viewingPet.careDetails && (
                <div className="border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Care &amp; Habitat Details</span>
                  <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {viewingPet.careDetails}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
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
