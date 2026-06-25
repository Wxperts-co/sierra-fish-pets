"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, Calendar, MapPin, Search, X, Check, Star, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { showErrorToast } from "@/lib/toast";
import ActionsDropdown from "@/components/admin/common/ActionsDropdown";

interface Recurrence {
  enabled: boolean;
  frequency: string | null;
  rule: string | null;
}

interface EventItem {
  _id?: string;
  id: string;
  title: string;
  description: string;
  category: string;
  petType: string[];
  image: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  featured: boolean;
  ctaText: string;
  ctaLink: string;
  recurrence?: Recurrence;
}

const CATEGORIES = [
  { id: "adoption", label: "Adoption", emoji: "🐾", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  { id: "vaccination", label: "Vaccination", emoji: "💉", color: "text-orange-600 bg-orange-50 border-orange-100" },
  { id: "workshop", label: "Workshop", emoji: "🐠", color: "text-blue-600 bg-blue-50 border-blue-100" },
  { id: "sale", label: "Sale", emoji: "🏷️", color: "text-rose-600 bg-rose-50 border-rose-100" },
  { id: "tour", label: "Tour", emoji: "🧭", color: "text-purple-600 bg-purple-50 border-purple-100" },
];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<EventItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("workshop");
  const [location, setLocation] = useState("Sierra Fish Pets Store");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [featured, setFeatured] = useState(false);
  const [ctaText, setCtaText] = useState("View Details");
  const [ctaLink, setCtaLink] = useState("#");
  const [petTypes, setPetTypes] = useState<string[]>(["dog", "cat", "fish"]);
  const [recurrenceEnabled, setRecurrenceEnabled] = useState(false);
  const [recurrenceFreq, setRecurrenceFreq] = useState("monthly");
  const [recurrenceRule, setRecurrenceRule] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/events");
      if (response.data?.success) {
        setEvents(response.data.events || []);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Stats computation
  const stats = useMemo(() => {
    const total = events.length;
    const upcoming = events.filter((e) => new Date(e.startDate) > new Date()).length;
    const featuredCount = events.filter((e) => e.featured).length;
    const past = total - upcoming;
    return { total, upcoming, featuredCount, past };
  }, [events]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || e.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [events, search, categoryFilter]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setTitle("");
    setDescription("");
    setCategory("workshop");
    setLocation("Sierra Fish Pets Store");
    
    // Set default start/end dates to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    const end = new Date(tomorrow);
    end.setHours(12, 0, 0, 0);
    
    // Format to local date-time input format: YYYY-MM-DDTHH:MM
    const formatDateTime = (d: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setStartDate(formatDateTime(tomorrow));
    setEndDate(formatDateTime(end));
    setStatus("upcoming");
    setFeatured(false);
    setCtaText("View Details");
    setCtaLink("#");
    setPetTypes(["dog", "cat", "fish"]);
    setRecurrenceEnabled(false);
    setRecurrenceFreq("monthly");
    setRecurrenceRule("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (event: EventItem) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setCategory(event.category);
    setLocation(event.location);
    
    // Convert ISO string to YYYY-MM-DDTHH:MM local format
    const formatIsoToLocalInput = (isoString: string) => {
      if (!isoString) return "";
      const d = new Date(isoString);
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    setStartDate(formatIsoToLocalInput(event.startDate));
    setEndDate(formatIsoToLocalInput(event.endDate));
    setStatus(event.status || "upcoming");
    setFeatured(event.featured || false);
    setCtaText(event.ctaText || "View Details");
    setCtaLink(event.ctaLink || "#");
    setPetTypes(event.petType || []);
    setRecurrenceEnabled(event.recurrence?.enabled || false);
    setRecurrenceFreq(event.recurrence?.frequency || "monthly");
    setRecurrenceRule(event.recurrence?.rule || "");
    setIsModalOpen(true);
  };

  // Delete event
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    try {
      const response = await axios.delete(`/api/events/${id}`);
      if (response.data?.success) {
        setEvents((prev) => prev.filter((e) => e.id !== id && e._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate || !endDate) return;

    if (new Date(endDate) <= new Date(startDate)) {
      showErrorToast("End date must be ahead of start date.");
      return;
    }

    const eventPayload: Partial<EventItem> = {
      title,
      description,
      category,
      location,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      status,
      featured,
      ctaText,
      ctaLink,
      petType: petTypes,
      recurrence: {
        enabled: recurrenceEnabled,
        frequency: recurrenceEnabled ? recurrenceFreq : null,
        rule: recurrenceEnabled && recurrenceRule ? recurrenceRule : null,
      },
    };

    try {
      if (editingEvent) {
        // Edit Mode
        const eventId = editingEvent._id || editingEvent.id;
        const response = await axios.patch(`/api/events/${eventId}`, eventPayload);
        if (response.data?.success) {
          setEvents((prev) =>
            prev.map((e) => (e._id === eventId || e.id === eventId ? response.data.event : e))
          );
        }
      } else {
        // Add Mode
        const newPayload = {
          ...eventPayload,
          id: `evt-custom-${Date.now()}`,
          image: "",
        };
        const response = await axios.post("/api/events", newPayload);
        if (response.data?.success) {
          setEvents((prev) => [...prev, response.data.event]);
        }
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Failed to save event:", error);
      showErrorToast(error.response?.data?.message || "Failed to save event. Please check the inputs.");
    }
  };

  // Pet Types toggle helper
  const handleTogglePetType = (type: string) => {
    if (petTypes.includes(type)) {
      setPetTypes((prev) => prev.filter((t) => t !== type));
    } else {
      setPetTypes((prev) => [...prev, type]);
    }
  };

  const rows = filteredEvents.map((evt, index) => ({
    ...evt,
    id: evt._id || evt.id,
    serial: index + 1,
  }));

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
      field: "title",
      headerName: "Event Details",
      flex: 1.5,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams<EventItem>) => {
        const row = params.row;
        return (
          <div className="flex flex-col py-1.5 leading-tight justify-center h-full">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">{row.title}</span>
              
            </div>
           
          </div>
        );
      },
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0.8,
      minWidth: 110,
      renderCell: (params: GridRenderCellParams<EventItem>) => {
        const row = params.row;
        const style = CATEGORIES.find((c) => c.id === row.category) || {
          label: row.category,
          emoji: "📅",
          color: "text-slate-600 bg-slate-50 border-slate-100",
        };
        return (
          <div className="flex items-center h-full">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black select-none ${style.color}`}>
              <span>{style.emoji}</span>
              <span>{style.label}</span>
            </span>
          </div>
        );
      },
    },
    {
      field: "startDate",
      headerName: "Schedule",
      flex: 1,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<EventItem>) => {
        const row = params.row;
        return (
          <div className="flex flex-col py-1.5 leading-tight justify-center h-full">
            <span className="font-semibold text-slate-900">
              {new Date(row.startDate).toLocaleDateString([], {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="text-xs text-slate-500 mt-0.5">
              {new Date(row.startDate).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              {" - "}
              {new Date(row.endDate).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </span>
          </div>
        );
      },
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<EventItem>) => {
        const row = params.row;
        return (
          <div className="flex items-center gap-1.5 py-1.5 text-xs text-slate-600 font-semibold truncate h-full">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{row.location}</span>
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
      flex: 1,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<EventItem>) => {
        const row = params.row;
        return (
          <div className="flex items-center justify-end gap-2 w-full pr-2 py-1.5 h-full">
            <ActionsDropdown
              actions={[
                {
                  label: "View",
                  icon: <Eye className="w-4 h-4 text-slate-500" />,
                  onClick: () => {
                    setViewingEvent(row);
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
          <h1 className="text-3xl font-black text-slate-800">Events Management</h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Manage pet adoption drives, vaccination clinics, aquarium workshops, and promotional calendar sales.
          </p>
        </div>

        <Button
          onClick={handleOpenAddModal}
          className="h-11 rounded-2xl bg-[#005AA9] hover:bg-[#003B73] text-white font-bold text-sm px-6 shadow-md transition-all active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Store Event
        </Button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Calendar Events</p>
            <h3 className="text-2xl font-black text-slate-800 mt-2">{loading ? "..." : stats.total}</h3>
          </div>
          <div className="p-3 bg-[#eef6ff] rounded-xl text-[#005AA9]">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Events</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-2">{loading ? "..." : stats.upcoming}</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <Check className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Featured Events</p>
            <h3 className="text-2xl font-black text-amber-500 mt-2">{loading ? "..." : stats.featuredCount}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed / Past</p>
            <h3 className="text-2xl font-black text-slate-500 mt-2">{loading ? "..." : stats.past}</h3>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search events by title, description, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-100 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 transition font-semibold"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-100 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer shadow-sm"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Grid/Table ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-x-auto" style={{ width: "100%" }}>
        <div style={{ height: 500, width: "100%" }}>
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
            sx={{
              '& .MuiDataGrid-cell': { overflow: 'visible !important' },
              '& .MuiDataGrid-row': { overflow: 'visible !important' },
            }}
          />
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

          {/* Modal Box */}
          <div className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#003B73] px-6 py-4.5 text-white flex items-center justify-between shrink-0">
              <h2 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-300" />
                <span>{editingEvent ? "Edit Store Event" : "Create Store Event"}</span>
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
              {/* Event Title */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Puppy Socialization Hour"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800"
                />
              </div>

              {/* Grid 1: Category & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-semibold outline-none focus:border-[#005AA9]/30 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sierra Aquatics Room"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Grid 2: Schedule dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800 cursor-pointer"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Event Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe what will happen at the event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 focus:ring-4 focus:ring-[#005AA9]/5 font-semibold text-slate-800 resize-none"
                />
              </div>

              {/* Grid 3: CTA Button configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    CTA Link / Destination
                  </label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm outline-none focus:border-[#005AA9]/30 font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Pet Types selector */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5">
                  Target Pet Types
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {["dog", "cat", "fish", "bird", "small-animal", "reptile"].map((type) => {
                    const isSelected = petTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleTogglePetType(type)}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all ${
                          isSelected
                            ? "bg-[#eef6ff] border-[#005AA9] text-[#005AA9]"
                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        {type.replace("-", " ")}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Switches: Featured, Recurrence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <h5 className="text-xs font-black text-slate-700 uppercase tracking-wide">Featured Event</h5>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Prioritize on home sliders and calendar sidebars</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#005AA9]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <h5 className="text-xs font-black text-slate-700 uppercase tracking-wide">Recurring Schedule</h5>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Enable repeating rules (e.g. Monthly clinics)</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={recurrenceEnabled}
                      onChange={(e) => setRecurrenceEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#005AA9]"></div>
                  </label>
                </div>
              </div>

              {/* Recurrence fields */}
              {recurrenceEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4.5 rounded-2xl bg-[#eef6ff]/40 border border-sky-100/50 animate-in slide-in-from-top-2 duration-200">
                  <div>
                    <label className="block text-xs font-black text-sky-700 uppercase tracking-widest mb-1.5">
                      Frequency
                    </label>
                    <select
                      value={recurrenceFreq}
                      onChange={(e) => setRecurrenceFreq(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-sky-100 bg-white text-sm font-semibold outline-none text-slate-800"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-sky-700 uppercase tracking-widest mb-1.5">
                      Recurrence Rule Slug
                    </label>
                    <select
                      value={recurrenceRule}
                      onChange={(e) => setRecurrenceRule(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-sky-100 bg-white text-sm font-semibold outline-none text-slate-800 cursor-pointer"
                    >
                      <option value="">None / Specific Date Only</option>
                      <option value="first-saturday">1st Saturday of Month</option>
                      <option value="third-saturday">3rd Saturday of Month</option>
                      <option value="2nd-and-4th-weekend">2nd and 4th Weekend of Month</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-4 shrink-0">
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
                  Save Store Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Detail View Modal ── */}
      {isDetailModalOpen && viewingEvent && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div onClick={() => setIsDetailModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#003B73] px-6 py-4 text-white flex items-center justify-between shrink-0">
              <h2 className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-300" />
                <span>Event Details</span>
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
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Title</span>
                <h4 className="text-base font-bold text-slate-800 mt-1">{viewingEvent.title}</h4>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Description</span>
                <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap font-medium">{viewingEvent.description || "No description provided."}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Category</span>
                  <span className="text-sm text-slate-700 font-bold capitalize mt-1 block">{viewingEvent.category}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Featured Status</span>
                  <span className="text-sm font-bold mt-1 block">
                    {viewingEvent.featured ? (
                      <span className="text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full text-xs border border-amber-100 font-extrabold uppercase">Featured</span>
                    ) : (
                      <span className="text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full text-xs border border-slate-100 font-semibold uppercase">Standard</span>
                    )}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Location</span>
                  <div className="flex items-center gap-1.5 text-sm text-slate-700 font-bold mt-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{viewingEvent.location}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Start Date & Time</span>
                  <span className="text-sm text-slate-700 font-bold mt-1 block">
                    {new Date(viewingEvent.startDate).toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">End Date & Time</span>
                  <span className="text-sm text-slate-700 font-bold mt-1 block">
                    {new Date(viewingEvent.endDate).toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">CTA Text</span>
                  <span className="text-sm text-slate-700 font-semibold mt-1 block">{viewingEvent.ctaText || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">CTA Link</span>
                  <span className="text-sm text-[#005AA9] font-bold mt-1 block truncate">{viewingEvent.ctaLink || "N/A"}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Target Pet Types</span>
                <div className="flex flex-wrap gap-1.5">
                  {(viewingEvent.petType || []).map(type => (
                    <span key={type} className="bg-slate-50 border border-slate-150 text-slate-600 text-xs font-bold px-2.5 py-0.5 rounded-full capitalize">
                      {type}
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
