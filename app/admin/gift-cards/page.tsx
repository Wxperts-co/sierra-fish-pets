"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, Search, X, CreditCard, Globe, LayoutGrid, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { showErrorToast } from "@/lib/toast";

interface GiftCardItem {
  _id?: string;
  id: string;
  type: string;
  name: string;
  tagline: string;
  image: string;
  shortDescription: string;
  description: string;
  priceOptions: string[];
  features: string[];
  terms: string;
}

const TYPE_STYLES: Record<string, string> = {
  egift: "text-sky-700 bg-sky-50 border-sky-200",
  traditional: "text-amber-700 bg-amber-50 border-amber-200",
};

export default function AdminGiftCardsPage() {
  const [giftCards, setGiftCards] = useState<GiftCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGiftCard, setEditingGiftCard] = useState<GiftCardItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingGiftCard, setViewingGiftCard] = useState<GiftCardItem | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("egift");
  const [tagline, setTagline] = useState("");
  const [image, setImage] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [priceOptions, setPriceOptions] = useState("");
  const [features, setFeatures] = useState("");
  const [terms, setTerms] = useState("");

  const fetchGiftCards = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/gift-cards");
      if (data.success) setGiftCards(data.giftCards || []);
    } catch (err) {
      console.error("Failed to fetch gift cards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const stats = useMemo(() => {
    const total = giftCards.length;
    const uniqueTypes = new Set(giftCards.map((card) => card.type)).size;
    const totalPrices = giftCards.reduce((sum, card) => sum + (card.priceOptions?.length || 0), 0);
    return { total, uniqueTypes, totalPrices };
  }, [giftCards]);

  const filteredGiftCards = useMemo(() => {
    return giftCards.filter((card) => {
      const matchesSearch =
        card.name.toLowerCase().includes(search.toLowerCase()) ||
        card.description.toLowerCase().includes(search.toLowerCase()) ||
        card.tagline.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || card.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [giftCards, search, typeFilter]);

  const resetForm = () => {
    setName("");
    setType("egift");
    setTagline("");
    setImage("");
    setShortDescription("");
    setDescription("");
    setPriceOptions("");
    setFeatures("");
    setTerms("");
  };

  const handleOpenAddModal = () => {
    setEditingGiftCard(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (giftCard: GiftCardItem) => {
    setEditingGiftCard(giftCard);
    setName(giftCard.name);
    setType(giftCard.type);
    setTagline(giftCard.tagline);
    setImage(giftCard.image);
    setShortDescription(giftCard.shortDescription);
    setDescription(giftCard.description);
    setPriceOptions(giftCard.priceOptions.join(", "));
    setFeatures(giftCard.features.join("\n"));
    setTerms(giftCard.terms);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this gift card?")) return;
    try {
      const { data } = await axios.delete(`/api/gift-cards/${id}`);
      if (data.success) setGiftCards((prev) => prev.filter((card) => card.id !== id && card._id !== id));
    } catch (err) {
      console.error("Failed to delete gift card:", err);
      showErrorToast("Failed to delete gift card.");
    }
  };

  const parseListField = (value: string) =>
    value
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      id: editingGiftCard?.id || `giftcard-${Date.now()}`,
      type,
      name,
      tagline,
      image,
      shortDescription,
      description,
      priceOptions: parseListField(priceOptions),
      features: parseListField(features),
      terms,
    };

    try {
      if (editingGiftCard) {
        const { data } = await axios.patch(`/api/gift-cards/${editingGiftCard.id}`, payload);
        if (data.success) {
          setGiftCards((prev) => prev.map((card) => (card.id === editingGiftCard.id ? data.giftCard : card)));
        }
      } else {
        const { data } = await axios.post("/api/gift-cards", payload);
        if (data.success) setGiftCards((prev) => [...prev, data.giftCard]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save gift card:", err);
      showErrorToast(err.response?.data?.message || "Failed to save gift card.");
    }
  };

  const rows = filteredGiftCards.map((card, index) => ({
    ...card,
    id: card._id || card.id,
    serial: index + 1,
  }));

  const columns: GridColDef[] = [
    {
      field: "serial",
      headerName: "#",
      width: 60,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Gift Card",
      flex: 1.5,
      renderCell: (params: GridRenderCellParams<GiftCardItem>) => {
        const row = params.row;
        return (
          <div className="flex items-center gap-3 h-full">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0 flex items-center justify-center">
              {row.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.image} alt={row.name} className="w-full h-full object-contain p-1" />
              ) : (
                <CreditCard className="w-4 h-4 text-slate-300" />
              )}
            </div>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="font-semibold text-sm text-slate-900 truncate">{row.name}</span>
              <span className="text-xs text-slate-500 truncate">{row.tagline}</span>
            </div>
          </div>
        );
      },
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0.8,
      sortable: false,
      renderCell: (params: GridRenderCellParams<GiftCardItem>) => {
        const typeValue = params.value as string;
        return (
          <span className={`inline items-center px-2 py-0.5 rounded-full border text-[10px] font-black capitalize ${TYPE_STYLES[typeValue] || "text-slate-600 bg-slate-100 border-slate-200"}`}>
            {typeValue.replace("egift", "e-Gift").replace("traditional", "Traditional")}
          </span>
        );
      },
    },
    {
      field: "priceOptions",
      headerName: "Price Options",
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams<GiftCardItem>) => (
        <span className="text-xs text-slate-500 line-clamp-2">
          {(params.row.priceOptions || []).join(", ") || "—"}
        </span>
      ),
    },
    {
      field: "shortDescription",
      headerName: "Description",
      flex: 2,
      sortable: false,
      renderCell: (params: GridRenderCellParams<GiftCardItem>) => (
        <span className="text-xs text-slate-500 line-clamp-2">
          {params.value || <span className="italic text-slate-300">No description</span>}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      width: 150,
      renderCell: (params: GridRenderCellParams<GiftCardItem>) => {
        const row = params.row;
        return (
          <div className="flex items-center justify-end gap-2 w-full pr-1 h-full">
            <button
              onClick={() => {
                setViewingGiftCard(row);
                setIsDetailModalOpen(true);
              }}
              className="p-2 border border-slate-200 hover:border-slate-350 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all active:scale-90 cursor-pointer"
              title="View Details"
            >
              <Eye className="w-4 h-4 text-slate-500" />
            </button>
            <button
              onClick={() => handleOpenEditModal(row)}
              className="p-2 border border-slate-200 hover:border-sky-300 rounded-xl bg-white hover:bg-sky-50 text-slate-600 hover:text-[#005AA9] transition-all active:scale-90 cursor-pointer"
              title="Edit Gift Card"
            >
              <Edit2 className="w-4 h-4 text-blue-500" />
            </button>
            <button
              onClick={() => handleDelete(row.id || row._id || "")}
              className="p-2 border border-slate-200 hover:border-red-300 rounded-xl bg-white hover:bg-red-50 text-slate-600 hover:text-red-500 transition-all active:scale-90 cursor-pointer"
              title="Delete Gift Card"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Gift Cards</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Manage gift card types, pricing options, and details for the storefront.
          </p>
        </div>
        <Button
          onClick={handleOpenAddModal}
          className="h-11 rounded-2xl bg-[#005AA9] hover:bg-[#003B73] text-white font-bold text-sm px-6 shadow-md transition-all active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Gift Card
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Gift Cards</p>
            <h3 className="text-2xl font-black text-slate-800 mt-2">{loading ? "..." : stats.total}</h3>
          </div>
          <div className="p-3 bg-[#eef6ff] rounded-xl text-[#005AA9]">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gift Card Types</p>
            <h3 className="text-2xl font-black text-amber-500 mt-2">{loading ? "..." : stats.uniqueTypes}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <LayoutGrid className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Price Options</p>
            <h3 className="text-2xl font-black text-slate-500 mt-2">{loading ? "..." : stats.totalPrices}</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
            <Globe className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, tagline or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-100 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 transition font-semibold"
          />
        </div>
        <div className="w-full sm:w-52">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-100 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer shadow-sm"
          >
            <option value="all">All Types</option>
            <option value="egift">e-Gift Card</option>
            <option value="traditional">Traditional</option>
          </select>
        </div>
      </div>

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
            rowHeight={72}
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

          <div className="relative w-full max-w-xl bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="bg-[#003B73] px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h2 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-300" />
                <span>{editingGiftCard ? "Edit Gift Card" : "Add Gift Card"}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Gift Card Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e-Gift Card"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-[#005AA9]/5 font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                  >
                    <option value="egift">e-Gift Card</option>
                    <option value="traditional">Traditional Gift Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Tagline</label>
                <input
                  type="text"
                  placeholder="Send instantly via email"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Image URL</label>
                <input
                  type="text"
                  placeholder="/images/gift-cards/egift.png"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="The perfect last-minute gift."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-[#005AA9]/5 font-semibold text-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Long Description</label>
                <textarea
                  rows={4}
                  placeholder="Full description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-[#005AA9]/5 font-semibold text-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Price Options</label>
                <textarea
                  rows={2}
                  placeholder="$10, $25, $50"
                  value={priceOptions}
                  onChange={(e) => setPriceOptions(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-[#005AA9]/5 font-semibold text-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Features</label>
                <textarea
                  rows={3}
                  placeholder="Instant delivery, customizable message, redeem online"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-[#005AA9]/5 font-semibold text-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Terms</label>
                <textarea
                  rows={3}
                  placeholder="Redeemable for merchandise and services..."
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-[#005AA9]/5 font-semibold text-slate-800 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="h-11 rounded-2xl border-slate-200 font-semibold px-6 active:scale-95 transition-all text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-11 rounded-2xl bg-[#005AA9] hover:bg-[#003B73] text-white font-bold px-8 active:scale-95 transition-all shadow-md"
                >
                  Save Gift Card
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Detail View Modal ── */}
      {isDetailModalOpen && viewingGiftCard && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div onClick={() => setIsDetailModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#003B73] px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h2 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-300" />
                <span>Gift Card Details</span>
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
                  {viewingGiftCard.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={viewingGiftCard.image} alt={viewingGiftCard.name} className="w-full h-full object-contain p-1.5" />
                  ) : (
                    <CreditCard className="w-6 h-6 text-slate-300" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-800">{viewingGiftCard.name}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{viewingGiftCard.tagline}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Type</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-black capitalize mt-1 block w-fit ${TYPE_STYLES[viewingGiftCard.type] || "text-slate-600 bg-slate-100 border-slate-200"}`}>
                    {viewingGiftCard.type.replace("egift", "e-Gift").replace("traditional", "Traditional")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">ID code</span>
                  <span className="text-sm text-slate-700 font-bold mt-1 block">{viewingGiftCard.id}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Short Description</span>
                <p className="text-sm text-slate-600 mt-1 font-medium">{viewingGiftCard.shortDescription || "No short description."}</p>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Description</span>
                <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap font-medium">{viewingGiftCard.description || "No full description provided."}</p>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Price Options</span>
                <div className="flex flex-wrap gap-1.5">
                  {(viewingGiftCard.priceOptions || []).map(price => (
                    <span key={price} className="bg-emerald-50 border border-emerald-150 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {price}
                    </span>
                  ))}
                </div>
              </div>
              {viewingGiftCard.features && viewingGiftCard.features.length > 0 && (
                <div className="border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Features & Benefits</span>
                  <ul className="list-disc list-inside text-sm text-slate-600 font-semibold space-y-1">
                    {viewingGiftCard.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              {viewingGiftCard.terms && (
                <div className="border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Terms & Conditions</span>
                  <p className="text-xs text-slate-400 font-semibold mt-1">{viewingGiftCard.terms}</p>
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
