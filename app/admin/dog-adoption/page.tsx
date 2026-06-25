"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Plus, Edit2, Trash2, PawPrint, Search, X, Check, Star, Heart,
  ShieldCheck, Users, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { showErrorToast } from "@/lib/toast";
import ActionsDropdown from "@/components/admin/common/ActionsDropdown";

interface DogItem {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  image: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  color: string;
  vaccinated: boolean;
  neutered: boolean;
  goodWithKids: boolean;
  goodWithDogs: boolean;
  goodWithCats: boolean;
  adoptionStatus: string;
  featured: boolean;
  description: string;
  personality: string[];
  adoptionFee: string;
}

const STATUS_STYLES: Record<string, string> = {
  available: "text-emerald-700 bg-emerald-50 border-emerald-200",
  pending: "text-amber-700 bg-amber-50 border-amber-200",
  adopted: "text-slate-500 bg-slate-100 border-slate-200",
};

const SIZES = ["Small", "Medium", "Large", "Extra Large"];
const GENDERS = ["Male", "Female"];

export default function AdminDogAdoptionPage() {
  const [dogs, setDogs] = useState<DogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDog, setEditingDog] = useState<DogItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingDog, setViewingDog] = useState<DogItem | null>(null);
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [size, setSize] = useState("Medium");
  const [color, setColor] = useState("");
  const [adoptionFee, setAdoptionFee] = useState("$0");
  const [adoptionStatus, setAdoptionStatus] = useState("available");
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState("");
  const [vaccinated, setVaccinated] = useState(false);
  const [neutered, setNeutered] = useState(false);
  const [goodWithKids, setGoodWithKids] = useState(false);
  const [goodWithDogs, setGoodWithDogs] = useState(false);
  const [goodWithCats, setGoodWithCats] = useState(false);
  const [personality, setPersonality] = useState<string[]>([]);
  const [personalityInput, setPersonalityInput] = useState("");

  const fetchDogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/dogs");
      if (data.success) setDogs(data.dogs || []);
    } catch (err) {
      console.error("Failed to fetch dogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDogs(); }, []);

  // Stats
  const stats = useMemo(() => {
    const total = dogs.length;
    const available = dogs.filter((d) => d.adoptionStatus === "available").length;
    const pending = dogs.filter((d) => d.adoptionStatus === "pending").length;
    const featuredCount = dogs.filter((d) => d.featured).length;
    return { total, available, pending, featuredCount };
  }, [dogs]);

  const filteredDogs = useMemo(() => {
    return dogs.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.breed.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || d.adoptionStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [dogs, search, statusFilter]);

  const resetForm = () => {
    setName(""); setBreed(""); setAge(""); setGender("Male"); setSize("Medium");
    setColor(""); setAdoptionFee("$0"); setAdoptionStatus("available");
    setFeatured(false); setDescription(""); setVaccinated(false);
    setNeutered(false); setGoodWithKids(false); setGoodWithDogs(false);
    setGoodWithCats(false); setPersonality([]); setPersonalityInput("");
    setImage("");
  };

  const handleOpenAddModal = () => {
    setEditingDog(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dog: DogItem) => {
    setEditingDog(dog);
    setName(dog.name);
    setBreed(dog.breed);
    setAge(dog.age);
    setGender(dog.gender);
    setSize(dog.size);
    setColor(dog.color);
    setAdoptionFee(dog.adoptionFee);
    setAdoptionStatus(dog.adoptionStatus);
    setFeatured(dog.featured);
    setDescription(dog.description);
    setVaccinated(dog.vaccinated);
    setNeutered(dog.neutered);
    setGoodWithKids(dog.goodWithKids);
    setGoodWithDogs(dog.goodWithDogs);
    setGoodWithCats(dog.goodWithCats);
    setPersonality(dog.personality || []);
    setPersonalityInput("");
    setImage(dog.image || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this dog record?")) return;
    try {
      const { data } = await axios.delete(`/api/dogs/${id}`);
      if (data.success) setDogs((prev) => prev.filter((d) => d.id !== id && d._id !== id));
    } catch (err) {
      console.error("Failed to delete dog:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !breed.trim()) return;

    const payload = {
      name, breed, age, gender, size, color, adoptionFee,
      adoptionStatus, featured, description, vaccinated,
      neutered, goodWithKids, goodWithDogs, goodWithCats, personality,
      image,
    };

    try {
      if (editingDog) {
        const dogId = editingDog._id || editingDog.id;
        const { data } = await axios.patch(`/api/dogs/${dogId}`, payload);
        if (data.success) {
          setDogs((prev) => prev.map((d) => (d._id === dogId || d.id === dogId ? data.dog : d)));
        }
      } else {
        const newPayload = {
          ...payload,
          id: `dog-custom-${Date.now()}`,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
        };
        const { data } = await axios.post("/api/dogs", newPayload);
        if (data.success) setDogs((prev) => [...prev, data.dog]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save dog:", err);
      showErrorToast(err.response?.data?.message || "Failed to save dog record.");
    }
  };

  const handleAddPersonality = () => {
    const tag = personalityInput.trim();
    if (tag && !personality.includes(tag)) {
      setPersonality((prev) => [...prev, tag]);
    }
    setPersonalityInput("");
  };

  const rows = filteredDogs.map((dog, index) => ({
    ...dog,
    id: dog._id || dog.id,
    serial: index + 1,
  }));

  const columns: GridColDef[] = [
    {
      field: "serial", headerName: "#", width: 60,
      sortable: false, filterable: false, align: "center", headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Dog Details",
      flex: 1.5,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams<DogItem>) => {
        const row = params.row;
        return (
          <div className="flex flex-col py-1.5 leading-tight justify-center h-full">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">{row.name}</span>
              {row.featured && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full select-none">
                  FEATURED
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 truncate max-w-xs mt-0.5">{row.breed} · {row.age} · {row.gender}</div>
          </div>
        );
      },
    },
    {
      field: "adoptionStatus",
      headerName: "Status",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<DogItem>) => {
        const row = params.row;
        const cls = STATUS_STYLES[row.adoptionStatus] || "text-slate-600 bg-slate-100 border-slate-200";
        const emoji = row.adoptionStatus === "available" ? "🐾" : row.adoptionStatus === "pending" ? "⏳" : "🏠";
        return (
          <div className="flex items-center h-full">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black select-none ${cls}`}>
              <span>{emoji}</span>
              <span className="capitalize">{row.adoptionStatus}</span>
            </span>
          </div>
        );
      },
    },
    {
      field: "size",
      headerName: "Details",
      flex: 0.9,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<DogItem>) => {
        const row = params.row;
        return (
          <div className="flex flex-col py-1.5 leading-tight justify-center h-full text-xs text-slate-600">
            <span className="font-semibold">{row.size} · {row.color}</span>
            <span className="text-slate-400 mt-0.5">{row.adoptionFee}</span>
          </div>
        );
      },
    },
    {
      field: "vaccinated",
      headerName: "Health",
      flex: 0.9,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<DogItem>) => {
        const row = params.row;
        return (
          <div className="flex items-center h-full w-full">
            <div className="flex flex-wrap gap-1">
              {row.vaccinated && (
                <span className="inline-flex items-center text-[10px] leading-none font-semibold bg-sky-50 text-sky-700 border border-sky-200 p-2 rounded-full">
                  Vaccinated
                </span>
              )}
 
              {row.neutered && (
                <span className="inline-flex items-center text-[10px] leading-none font-semibold bg-purple-50 text-purple-700 border border-purple-200 p-2 rounded-full">
                  Neutered
                </span>
              )}
            </div>
          </div>
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
      renderCell: (params: GridRenderCellParams<DogItem>) => {
        const row = params.row;
        return (
          <div className="flex items-center justify-end gap-2 w-full pr-2 py-1.5 h-full">
            <ActionsDropdown
              actions={[
                {
                  label: "View",
                  icon: <Eye className="w-4 h-4 text-slate-500" />,
                  onClick: () => {
                    setViewingDog(row);
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
          <h1 className="text-3xl font-black text-slate-800">Dog Adoption</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Manage adoptable dogs, their health records, personalities, and adoption status.
          </p>
        </div>
        <Button
          onClick={handleOpenAddModal}
          className="h-11 rounded-2xl bg-[#005AA9] hover:bg-[#003B73] text-white font-bold text-sm px-6 shadow-md transition-all active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Dog
        </Button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Dogs</p>
            <h3 className="text-2xl font-black text-slate-800 mt-2">{loading ? "..." : stats.total}</h3>
          </div>
          <div className="p-3 bg-[#eef6ff] rounded-xl text-[#005AA9]">
            <PawPrint className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-2">{loading ? "..." : stats.available}</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <Check className="w-6 h-6" />
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
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Adoption</p>
            <h3 className="text-2xl font-black text-slate-500 mt-2">{loading ? "..." : stats.pending}</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, breed or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-100 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 transition font-semibold"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-100 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer shadow-sm"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="adopted">Adopted</option>
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

          <div className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#003B73] px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h2 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-sky-300" />
                <span>{editingDog ? "Edit Dog Record" : "Add Dog for Adoption"}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Name & Breed */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Dog Name</label>
                  <input
                    required type="text" placeholder="e.g. Max"
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Breed</label>
                  <input
                    required type="text" placeholder="e.g. Golden Retriever"
                    value={breed} onChange={(e) => setBreed(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Age, Gender, Size, Color */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Age</label>
                  <input
                    type="text" placeholder="e.g. 2 Years"
                    value={age} onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Gender</label>
                  <select
                    value={gender} onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer"
                  >
                    {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Size</label>
                  <select
                    value={size} onChange={(e) => setSize(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer"
                  >
                    {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Color</label>
                  <input
                    type="text" placeholder="e.g. Golden"
                    value={color} onChange={(e) => setColor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Adoption Status & Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Adoption Status</label>
                  <select
                    value={adoptionStatus} onChange={(e) => setAdoptionStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer"
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="adopted">Adopted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Adoption Fee</label>
                  <input
                    type="text" placeholder="e.g. $250"
                    value={adoptionFee} onChange={(e) => setAdoptionFee(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Description</label>
                <textarea
                  rows={3} placeholder="Describe the dog's personality and story..."
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800 resize-none"
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Dog Image</label>
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
                        data.append("folder", "dog-adoption");
                        try {
                          const res = await axios.post("/api/upload", data, {
                            headers: { "Content-Type": "multipart/form-data" },
                          });
                          if (res.data?.success) {
                            setImage(res.data.url);
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
                    placeholder="Or enter Image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                  />
                  {image && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <img src={image} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-slate-200" />
                    </div>
                  )}
                </div>
              </div>

              {/* Personality Tags */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Personality Traits</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text" placeholder="e.g. Friendly"
                    value={personalityInput} onChange={(e) => setPersonalityInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddPersonality(); } }}
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                  />
                  <button
                    type="button" onClick={handleAddPersonality}
                    className="px-4 py-2.5 rounded-2xl bg-[#eef6ff] border border-[#005AA9]/20 text-[#005AA9] text-xs font-bold hover:bg-[#005AA9]/10 transition-all"
                  >
                    Add
                  </button>
                </div>
                {personality.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {personality.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#eef6ff] border border-[#005AA9]/20 text-[#005AA9]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => setPersonality((prev) => prev.filter((t) => t !== tag))}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Compatibility & Health Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                {/* Health */}
                <div className="space-y-2">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Health</p>
                  {[
                    { label: "Vaccinated", val: vaccinated, set: setVaccinated },
                    { label: "Neutered / Spayed", val: neutered, set: setNeutered },
                  ].map(({ label, val, set }) => (
                    <div key={label} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-xs font-black text-slate-700">{label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#005AA9]" />
                      </label>
                    </div>
                  ))}
                </div>

                {/* Compatibility */}
                <div className="space-y-2">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Good With</p>
                  {[
                    { label: "Kids", val: goodWithKids, set: setGoodWithKids },
                    { label: "Other Dogs", val: goodWithDogs, set: setGoodWithDogs },
                    { label: "Cats", val: goodWithCats, set: setGoodWithCats },
                  ].map(({ label, val, set }) => (
                    <div key={label} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-xs font-black text-slate-700">{label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <h5 className="text-xs font-black text-slate-700 uppercase tracking-wide">Featured Dog</h5>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Show on homepage adoption section</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#005AA9]" />
                </label>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-4 shrink-0">
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
                  Save Dog Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Detail View Modal ── */}
      {isDetailModalOpen && viewingDog && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div onClick={() => setIsDetailModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#003B73] px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h2 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-sky-300" />
                <span>Dog Details</span>
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
                <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <PawPrint className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-800">{viewingDog.name}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{viewingDog.breed}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Description</span>
                <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap font-medium">{viewingDog.description || "No description provided."}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Age</span>
                  <span className="text-sm text-slate-700 font-bold mt-1 block">{viewingDog.age}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Gender</span>
                  <span className="text-sm text-slate-700 font-bold mt-1 block">{viewingDog.gender}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Size</span>
                  <span className="text-sm text-slate-700 font-bold mt-1 block">{viewingDog.size}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Color</span>
                  <span className="text-sm text-slate-700 font-bold mt-1 block">{viewingDog.color || "N/A"}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Adoption Fee</span>
                  <span className="text-sm text-emerald-600 font-bold mt-1 block">{viewingDog.adoptionFee}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Status</span>
                  <span className="text-sm text-slate-700 font-bold capitalize mt-1 block">{viewingDog.adoptionStatus}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Vaccinated</span>
                  <span className="text-sm text-slate-700 font-bold mt-1 block">{viewingDog.vaccinated ? "Yes" : "No"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Neutered / Spayed</span>
                  <span className="text-sm text-slate-700 font-bold mt-1 block">{viewingDog.neutered ? "Yes" : "No"}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Good With</span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingDog.goodWithKids && <span className="bg-emerald-50 border border-emerald-150 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full">Kids</span>}
                  {viewingDog.goodWithDogs && <span className="bg-emerald-50 border border-emerald-150 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full">Other Dogs</span>}
                  {viewingDog.goodWithCats && <span className="bg-emerald-50 border border-emerald-150 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full">Cats</span>}
                </div>
              </div>
              {viewingDog.personality && viewingDog.personality.length > 0 && (
                <div className="border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Personality Traits</span>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingDog.personality.map(tag => (
                      <span key={tag} className="bg-slate-50 border border-slate-150 text-slate-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
