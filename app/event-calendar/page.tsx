"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  Mail,
  Send,
  X,
  Sparkles,
  CheckCircle,
  Download,
  ExternalLink,
} from "lucide-react";
import eventsData from "@/data/events.json";
import categoriesData from "@/data/eventCategories.json";

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface Recurrence {
  enabled: boolean;
  frequency: string | null;
  rule: string | null;
}

interface EventItem {
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

// ─── Category Settings ───────────────────────────────────────────────────────
const categoryStyles: Record<
  string,
  { bg: string; text: string; border: string; dot: string; emoji: string }
> = {
  adoption: {
    bg: "bg-[#eefcf0]",
    text: "text-[#1b5e20]",
    border: "border-[#A8D5A2]",
    dot: "bg-[#4caf50]",
    emoji: "🐾",
  },
  vaccination: {
    bg: "bg-[#fff7ed]",
    text: "text-[#c2410c]",
    border: "border-[#FFD4B2]",
    dot: "bg-[#f97316]",
    emoji: "💉",
  },
  workshop: {
    bg: "bg-[#eff6ff]",
    text: "text-[#1d4ed8]",
    border: "border-[#A9D6FF]",
    dot: "bg-[#3b82f6]",
    emoji: "🐠",
  },
  sale: {
    bg: "bg-[#fff1f2]",
    text: "text-[#be123c]",
    border: "border-[#FFB6C1]",
    dot: "bg-[#f43f5e]",
    emoji: "🏷️",
  },
  tour: {
    bg: "bg-[#faf5ff]",
    text: "text-[#6b21a8]",
    border: "border-[#D9C2FF]",
    dot: "bg-[#a855f7]",
    emoji: "🧭",
  },
};

const getEventImage = (eventId: string): string => {
  switch (eventId) {
    case "evt-001":
      return "/images/categories/dog.jpeg";
    case "evt-002":
      return "/images/categories/cat.jpeg";
    case "evt-003":
      return "/images/categories/aquatic.jpeg";
    case "evt-004":
      return "/images/banner/hero3.jpeg";
    case "evt-005":
      return "/images/banner/shophero.jpg";
    default:
      return "/images/categories/aquatic.jpeg";
  }
};

export default function EventCalendarPage() {
  // Initialize to current date (today)
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Dynamic Events list state with localStorage persistence
  const [events, setEvents] = useState<EventItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sierra_events");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return eventsData as EventItem[];
  });

  // Save changes to localStorage
  React.useEffect(() => {
    localStorage.setItem("sierra_events", JSON.stringify(events));
  }, [events]);

  // Form states for adding custom events
  const [clickedDate, setClickedDate] = useState<Date | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("workshop");
  const [newStartTime, setNewStartTime] = useState("10:00");
  const [newEndTime, setNewEndTime] = useState("12:00");
  const [newLocation, setNewLocation] = useState("Sierra Fish Pets Store");
  const [newDescription, setNewDescription] = useState("");

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clickedDate || !newTitle.trim()) return;

    const startHour = parseInt(newStartTime.split(":")[0]);
    const startMin = parseInt(newStartTime.split(":")[1]);
    const endHour = parseInt(newEndTime.split(":")[0]);
    const endMin = parseInt(newEndTime.split(":")[1]);

    const start = new Date(clickedDate);
    start.setHours(startHour, startMin, 0, 0);

    const end = new Date(clickedDate);
    end.setHours(endHour, endMin, 0, 0);

    const newEvent: EventItem = {
      id: `evt-custom-${Date.now()}`,
      title: newTitle,
      description: newDescription,
      category: newCategory,
      petType: ["dog", "cat", "fish"],
      image: "",
      location: newLocation,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      status: "upcoming",
      featured: false,
      ctaText: "View Details",
      ctaLink: "#",
      recurrence: {
        enabled: false,
        frequency: null,
        rule: null,
      },
    };

    setEvents((prev) => [...prev, newEvent]);

    // Reset
    setNewTitle("");
    setNewCategory("workshop");
    setNewStartTime("10:00");
    setNewEndTime("12:00");
    setNewLocation("Sierra Fish Pets Store");
    setNewDescription("");
    setIsAddModalOpen(false);
    setClickedDate(null);
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // ─── Recurrence Logic & Date Checkers ───────────────────────────────────────
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getNthDayOfWeekInMonth = (date: Date): number => {
    return Math.ceil(date.getDate() / 7);
  };

  const getEventsForDate = (date: Date, filterCategory: string | null) => {
    return events.filter((event) => {
      if (filterCategory && event.category !== filterCategory) {
        return false;
      }

      const start = new Date(event.startDate);

      // 1. Direct date check
      if (isSameDay(date, start)) {
        return true;
      }

      // 2. Recurrence check
      if (event.recurrence && event.recurrence.enabled) {
        const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
        const occurrence = getNthDayOfWeekInMonth(date);

        const startDayOnly = new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate()
        );
        const currentDayOnly = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );

        if (currentDayOnly < startDayOnly) {
          return false;
        }

        if (event.recurrence.rule === "first-saturday") {
          return dayOfWeek === 6 && occurrence === 1;
        }

        if (event.recurrence.rule === "third-saturday") {
          return dayOfWeek === 6 && occurrence === 3;
        }

        if (event.recurrence.rule === "2nd-and-4th-weekend") {
          const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;
          return isWeekend && (occurrence === 2 || occurrence === 4);
        }
      }

      return false;
    });
  };

  // ─── Calendar Grid Generation ───────────────────────────────────────────────
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevTotalDays = new Date(currentYear, currentMonth, 0).getDate();

    const cells: { date: Date; isCurrentMonth: boolean; dayNumber: number }[] = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevTotalDays - i;
      cells.push({
        date: new Date(currentYear, currentMonth - 1, dayNum),
        isCurrentMonth: false,
        dayNumber: dayNum,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      cells.push({
        date: new Date(currentYear, currentMonth, i),
        isCurrentMonth: true,
        dayNumber: i,
      });
    }

    // Next month padding (complete grid of 35 or 42 cells depending on requirements)
    const totalDaysIncludingPadding = firstDayIndex + totalDays;
    const totalCellsNeeded = totalDaysIncludingPadding > 35 ? 42 : 35;
    const remaining = totalCellsNeeded - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({
        date: new Date(currentYear, currentMonth + 1, i),
        isCurrentMonth: false,
        dayNumber: i,
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  // ─── Upcoming Events Selection ──────────────────────────────────────────────
  const upcomingEvents = useMemo(() => {
    // Sort all events by date. For demonstration, show them ordered starting from currentMonth.
    return events
      .filter((e) => {
        const start = new Date(e.startDate);
        return (
          start.getFullYear() > currentYear ||
          (start.getFullYear() === currentYear && start.getMonth() >= currentMonth)
        );
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 3);
  }, [events, currentYear, currentMonth]);

  // ─── Navigation Handlers ───────────────────────────────────────────────────
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // ─── Calendar Feeds (.ICS file creation) ──────────────────────────────────
  const handleDownloadFeed = () => {
    let icsContent =
      "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Sierra Fish Pets//Event Calendar//EN\n";

    events.forEach((event) => {
      const start = new Date(event.startDate)
        .toISOString()
        .replace(/-|:|\.\d\d\d/g, "");
      const end = new Date(event.endDate)
        .toISOString()
        .replace(/-|:|\.\d\d\d/g, "");

      icsContent += "BEGIN:VEVENT\n";
      icsContent += `UID:${event.id}@sierrafishpets.com\n`;
      icsContent += `DTSTART:${start}\n`;
      icsContent += `DTEND:${end}\n`;
      icsContent += `SUMMARY:${event.title}\n`;
      icsContent += `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}\n`;
      icsContent += `LOCATION:${event.location}\n`;
      icsContent += "END:VEVENT\n";
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sierra-fish-pets-events.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

 

  // Helper to format date label (e.g. JUN 03)
  const formatBadgeDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const m = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const day = String(d.getDate()).padStart(2, "0");
    return { month: m, day };
  };

  return (
    <main className="relative min-h-screen bg-[#fafbfd] pb-8 text-slate-800">
      {/* ─── 1. SEA LIFE HEADER BANNER ─── */}
      <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
        {/* Image — clipped to banner bounds */}
        <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
          {/* Mobile image */}
          <Image
            src="/images/banner/shophero5.png"
            alt="Event calendar banner"
            fill
            priority
            className="object-cover object-[center_60%] block md:hidden"
            sizes="100vw"
          />
          {/* Desktop image */}
          <Image
            src="/images/banner/shophero3.png"
            alt="Event calendar banner"
            fill
            priority
            className="object-cover object-[center_40%] hidden md:block"
            sizes="100vw"
          />
        </div>

        {/* Mobile overlay — darkens image so text is readable */}
        <div className="absolute inset-0 z-[2] block md:hidden bg-[linear-gradient(to_bottom,rgba(0,30,70,0.62)_0%,rgba(0,30,70,0.35)_60%,rgba(0,30,70,0.10)_100%)]" />

        {/* Centered text block */}
        <div className="absolute inset-x-0 top-0 z-[3] flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="flex items-center gap-2 mb-3 text-[#005AA9] font-bold text-xs uppercase tracking-widest bg-[#eef6ff] md:bg-[#eef6ff] bg-opacity-90 px-4 py-1.5 rounded-full select-none border border-[#005AA9]/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sierra Events Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white md:text-[#0d1b2a] tracking-tight flex items-center justify-center gap-3 drop-shadow-sm">
              <span className="animate-bounce">🐟</span>
              <span className="bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] bg-clip-text text-transparent">Event Calendar</span>
              
              <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>🐟</span>
            </h1>
         

            {/* Breadcrumb */}
            <nav
              aria-label="breadcrumb"
              className="flex flex-wrap items-center justify-center gap-0.5 text-sm font-medium text-white drop-shadow-md md:text-slate-500 md:drop-shadow-none mt-4"
            >
              <span className="flex items-center gap-0.5">
                <Link
                  href="/"
                  className="text-white md:text-slate-500 transition-colors duration-150 hover:text-teal-600 hover:underline"
                >
                  Home
                </Link>
                <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
              </span>
              <span className="flex items-center gap-0.5">
                <span className="font-bold text-[#0d1b2a] md:text-[#0d1b2a] text-white">Event Calendar</span>
              </span>
            </nav>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. CALENDAR & SIDEBAR CONTENT ─── */}
      <section className="container mx-auto px-4 max-w-6xl mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: CALENDAR VIEW */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-4 md:p-6 mt-8">
            
            {/* Calendar Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-slate-100 pb-5">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <button
                  id="btn-prev-month"
                  onClick={prevMonth}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 active:scale-95"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <h2 className="text-lg md:text-xl font-extrabold text-[#032B53] min-w-[140px] text-center flex items-center justify-center gap-2.5">
                  <Calendar className="w-5 h-5 text-sky-500 hidden sm:block" />
                  <span>{monthNames[currentMonth]} {currentYear}</span>
                </h2>

                <button
                  id="btn-next-month"
                  onClick={nextMonth}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 active:scale-95"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 md:gap-px bg-[#005AA9] rounded-2xl overflow-hidden border border-[#005AA9] mb-4">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div
                  key={day}
                  className="text-center py-2.5 md:py-3 text-[10px] md:text-xs font-black text-white/90 select-none tracking-wider font-semibold"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {calendarCells.map((cell, idx) => {
                const dayEvents = getEventsForDate(cell.date, selectedCategory);
                const isToday = isSameDay(cell.date, new Date());
                const hasEvents = dayEvents.length > 0;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setClickedDate(cell.date);
                      setIsAddModalOpen(true);
                    }}
                    className={`min-h-[90px] md:min-h-[105px] border border-slate-100 rounded-xl md:rounded-2xl p-1.5 md:p-2.5 flex flex-col justify-between transition-all cursor-pointer ${
                      cell.isCurrentMonth
                        ? "bg-white hover:border-sky-200 hover:shadow-sm hover:bg-sky-50/10"
                        : "bg-slate-50/50 text-slate-400 border-dashed hover:bg-slate-100/30"
                    } ${hasEvents ? "ring-1 ring-sky-200 bg-sky-50/50" : ""}`}
                  >
                    {/* Day Number */}
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs md:text-sm font-black h-6 w-6 md:h-7 md:w-7 flex items-center justify-center rounded-full flex-shrink-0 ${
                          isToday
                            ? "bg-[#005AA9] text-white"
                            : cell.isCurrentMonth
                            ? "text-slate-700"
                            : "text-slate-300"
                        }`}
                      >
                        {cell.dayNumber}
                      </span>
                    
                    </div>

                    {/* Events list in Day */}
                    <div className="flex-1 flex flex-col gap-0.5 md:gap-1 overflow-y-auto max-h-[60px] md:max-h-[70px] scrollbar-none">
                      {dayEvents.slice(0, 2).map((evt) => {
                        const style = categoryStyles[evt.category] || {
                          bg: "bg-slate-100",
                          text: "text-slate-800",
                          border: "border-slate-200",
                          dot: "bg-slate-400",
                          emoji: "📅",
                        };

                        return (
                           <button
                            key={evt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveEvent(evt);
                            }}
                            className={`w-full text-left rounded-lg border p-1 px-1 md:px-1.5 flex items-center gap-1 transition-transform duration-100 hover:scale-[1.02] active:scale-[0.98] group ${style.bg} ${style.border}`}
                            title={evt.title}
                          >
                            <span className={`text-[9px] md:text-xs font-black shrink-0 ${style.text}`}>
                              {style.emoji}
                            </span>
                            <span className={`text-[8px] md:text-[9px] font-semibold truncate ${style.text}`}>
                              {evt.title}
                            </span>
                          </button>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <div className="text-[8px] md:text-[9px] font-semibold text-sky-600 px-1 py-0.5">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Category Legend & Filter */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 select-none">
                Legend / Filter by Category
              </p>
              <div className="flex flex-wrap gap-3.5">
                {categoriesData.map((cat) => {
                  const style = categoryStyles[cat.id] || { dot: "bg-slate-400" };
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() =>
                        setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
                      }
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                        isSelected
                          ? "border-[#005AA9] bg-[#eef6ff] text-[#005AA9] shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}

                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 text-xs font-bold transition-all hover:bg-slate-100 active:scale-95"
                  >
                    <span>Clear Filter</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT: SIDEBAR WIDGETS */}
          <div className="lg:col-span-4 flex flex-col gap-8 mt-8">
            
            {/* WIDGET 1: UPCOMING EVENTS */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="bg-gradient-to-r from-[#0b4f6c] to-[#005AA9] px-6 py-4.5 text-white flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-sky-300" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">Upcoming Events</h3>
              </div>

              <div className="p-5 flex flex-col gap-4">
                {upcomingEvents.map((evt) => {
                  const style = categoryStyles[evt.category] || {
                    bg: "bg-slate-100",
                    text: "text-slate-800",
                    dot: "bg-slate-400",
                    emoji: "📅",
                  };
                  const badge = formatBadgeDate(evt.startDate);

                  return (
                    <div
                      key={evt.id}
                      onClick={() => setActiveEvent(evt)}
                      className="group flex items-center gap-3.5 p-3 rounded-2xl border border-slate-100 hover:border-sky-100 hover:bg-sky-50/20 transition-all duration-200 cursor-pointer active:scale-98"
                    >
                      {/* Left: Date Badge */}
                      <div
                        className={`relative w-14 h-14 shrink-0 rounded-2xl flex flex-col items-center justify-center p-1.5 border border-[#000000]/05 shadow-sm overflow-hidden ${style.bg}`}
                      >
                        {/* Accent notch top-left */}
                        <div className={`absolute left-0 top-0 w-3.5 h-3.5 rounded-tl-xl rounded-br-md ${style.dot}`} />
                        
                        <span className={`text-[9px] font-black tracking-wider mt-1.5 ${style.text}`}>
                          {badge.month}
                        </span>
                        <span className="text-base font-black leading-none text-slate-800">
                          {badge.day}
                        </span>
                      </div>

                      {/* Middle: Image Thumbnail */}
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shrink-0">
                        <Image
                          src={getEventImage(evt.id)}
                          alt={evt.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Right: Content details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-[#005AA9] transition-colors leading-snug line-clamp-2">
                          {evt.title}
                        </h4>
                        <div className="flex flex-col gap-0.5 mt-1 text-slate-500 font-semibold text-[11px]">
                          <div>
                            {new Date(evt.startDate).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(evt.endDate).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5 text-slate-400 font-medium">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{evt.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-full border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                  <span>View All Events</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

        

          </div>

        </div>
      </section>

      {/* ─── 3. DETAILS MODAL POPUP ─── */}
      <AnimatePresence>
        {activeEvent && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveEvent(null)}
              className="fixed inset-0 z-50 bg-black"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 top-[10%] bottom-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[500px] md:h-fit max-h-[80vh] z-50 overflow-y-auto bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveEvent(null)}
                className="absolute right-4 top-4 p-2 border border-slate-100 rounded-full hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-600 active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Category Badge */}
              <div className="flex">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    categoryStyles[activeEvent.category]?.bg || "bg-slate-100"
                  } ${categoryStyles[activeEvent.category]?.text || "text-slate-800"}`}
                >
                  <span>{categoryStyles[activeEvent.category]?.emoji || "📅"}</span>
                  <span>{activeEvent.category}</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="font-extrabold text-2xl text-slate-800 mt-4 leading-tight">
                {activeEvent.title}
              </h3>

              {/* Image Banner */}
              <div className="relative w-full h-48 rounded-2xl overflow-hidden mt-5 border border-slate-100">
                <Image
                  src={getEventImage(activeEvent.id)}
                  alt={activeEvent.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Timings & Location details */}
              <div className="flex flex-col gap-2.5 mt-6 border-y border-slate-100 py-4.5 text-xs text-slate-600 font-semibold">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>
                    {new Date(activeEvent.startDate).toLocaleDateString([], {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    •{" "}
                    {new Date(activeEvent.startDate).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(activeEvent.endDate).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                
                {activeEvent.recurrence?.enabled && (
                  <div className="flex items-center gap-2.5 pl-6.5 text-[11px] text-[#005AA9] font-bold">
                    <span>🔁</span>
                    <span>Recurring event schedule: {activeEvent.recurrence.rule?.replace(/-/g, " ")}</span>
                  </div>
                )}

                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>{activeEvent.location}</span>
                </div>
              </div>

              {/* Description */}
              <p className="mt-5 text-sm text-slate-500 font-medium leading-relaxed flex-1">
                {activeEvent.description}
              </p>

              {/* Action Button */}
              <div className="mt-8 flex gap-3">
                <Link
                  href={activeEvent.ctaLink}
                  onClick={() => setActiveEvent(null)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#005AA9] hover:bg-[#004b8d] text-white py-3.5 rounded-2xl text-sm font-bold shadow-md shadow-blue-500/10 transition-colors active:scale-95"
                >
                  {activeEvent.ctaText}
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setActiveEvent(null)}
                  className="px-5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm rounded-2xl transition-colors active:scale-95"
                >
                  Close
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      
    </main>
  );
}
