"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, ZoomIn, Grid, Store, Dog, Fish, Bug, Bird, Rabbit, ChevronDown, Check } from "lucide-react";
import galleryData from "@/data/gallery.json";

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface GalleryItem {
  id: string;
  image: string;
  caption: string;
  categorySlug: string | null;
}

const CATEGORIES = [
  { id: "all", label: "All Photos", icon: Grid },
  { id: "store", label: "Store", icon: Store },
  { id: "dog-cat", label: "Dog / Cat", icon: Dog },
  { id: "fish", label: "Fish", icon: Fish },
  { id: "reptile", label: "Reptiles", icon: Bug }, // Closest match
  { id: "bird", label: "Bird", icon: Bird },
  { id: "small-pet", label: "Small Pet", icon: Rabbit },
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

const galleryImages = galleryData as GalleryItem[];

export function GalleryContent({ initialCat }: { initialCat?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = initialCat || searchParams?.get("category") || "all";

  const [items, setItems] = useState<GalleryItem[]>(galleryImages);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchLiveGallery = async () => {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          const activeOnly = data.items.filter((i: any) => i.status === "active" || !i.status);
          if (activeOnly.length > 0) {
            setItems(activeOnly);
          }
        }
      } catch (err) {
        console.error("Could not fetch live gallery:", err);
      }
    };
    fetchLiveGallery();
  }, []);

  useEffect(() => {
    const cat = searchParams?.get("category");
    if (cat && CATEGORIES.some((c) => c.id === cat)) {
      router.replace(`/gallery/category/${cat}`);
    } else if (initialCat && CATEGORIES.some((c) => c.id === initialCat)) {
      setActiveCategory(initialCat);
    }
  }, [searchParams, initialCat, router]);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    if (catId === "all") {
      router.push("/gallery", { scroll: false });
    } else {
      router.push(`/gallery/category/${catId}`, { scroll: false });
    }
  };

  const currentCategory = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];
  const CurrentCategoryIcon = currentCategory.icon;

  const filteredImages = activeCategory === "all"
    ? items
    : items.filter((item) => {
        if (!item.categorySlug) return false;
        if (activeCategory === "dog-cat") {
          return item.categorySlug === "dog-cat" || item.categorySlug === "dog" || item.categorySlug === "cat";
        }
        if (activeCategory === "fish") {
          return item.categorySlug === "fish" || item.categorySlug === "aquatic";
        }
        if (activeCategory === "reptile") {
          return item.categorySlug === "reptile" || item.categorySlug === "reptiles";
        }
        return item.categorySlug === activeCategory;
      });

  return (
    <main className="relative text-slate-800 min-h-screen overflow-x-hidden pb-24 bg-slate-50">
      {/* ─── HERO HEADER SECTION ─── */}
      <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
        {/* Image — clipped to banner bounds */}
        <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
          <Image
            src="/images/banner/shophero5.png"
            alt="Gallery banner"
            fill
            priority
            className="object-cover object-[center_60%] block md:hidden"
            sizes="100vw"
          />
          <Image
            src="/images/banner/shophero3.png"
            alt="Gallery banner"
            fill
            priority
            className="object-cover object-[center_40%] hidden md:block"
            sizes="100vw"
          />
        </div>

        {/* Mobile overlay */}
        <div className="absolute inset-0 z-[2] block md:hidden bg-[linear-gradient(to_bottom,rgba(0,30,70,0.62)_0%,rgba(0,30,70,0.35)_60%,rgba(0,30,70,0.10)_100%)]" />

        {/* Centered text block */}
        <div className="absolute inset-x-0 top-0 z-[3] flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="mb-4 text-[clamp(2rem,4.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em] text-white drop-shadow-md md:bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] md:bg-clip-text md:text-transparent md:drop-shadow-none">
              Our Photo Gallery
            </h1>

            {/* Breadcrumb */}
            <nav
              aria-label="breadcrumb"
              className="flex flex-wrap items-center justify-center gap-0.5 text-sm font-medium text-white drop-shadow-md md:text-slate-500 md:drop-shadow-none"
            >
              <span className="flex items-center gap-0.5">
                <Link
                  href="/"
                  className="text-white md:text-slate-500 transition-colors duration-150 hover:text-[#00aaff] hover:underline"
                >
                  Home
                </Link>
                <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
              </span>
              <span className="flex items-center gap-0.5">
                <span className="font-bold text-[#0d1b2a] md:text-[#0d1b2a] text-white">Gallery</span>
              </span>
            </nav>
          </motion.div>
        </div>
      </section>

      {/* ─── CATEGORY FILTER TABS / MOBILE DROPDOWN ─── */}
      <section className="py-6 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          {/* Custom Styled Mobile Dropdown Filter */}
          <div ref={dropdownRef} className="block md:hidden relative max-w-xs mx-auto z-30">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-3 bg-white border border-blue-200/90 hover:border-blue-400 text-slate-800 font-bold text-sm rounded-full py-2.5 px-4 shadow-sm active:scale-[0.99] transition-all cursor-pointer"
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-full bg-blue-50 text-[#005AA9] shrink-0">
                  <CurrentCategoryIcon className="w-4 h-4" />
                </div>
                <span className="truncate text-slate-900 font-bold text-sm">
                  {currentCategory.label}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${
                  isDropdownOpen ? "rotate-180 text-[#005AA9]" : ""
                }`}
              />
            </button>

            {/* Custom Animated Dropdown Popover */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden py-1.5 z-50 divide-y divide-slate-50"
                  role="listbox"
                >
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = activeCategory === cat.id;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          handleCategoryChange(cat.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-blue-50/80 text-[#005AA9] font-bold"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 ${
                              isSelected ? "text-[#005AA9]" : "text-slate-400"
                            }`}
                          />
                          <span>{cat.label}</span>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#005AA9] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Pills Filter */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-2 md:gap-3 bg-white p-3 rounded-full border border-slate-200 shadow-sm max-w-4xl mx-auto">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#005AA9] text-white shadow-md scale-105"
                      : "text-slate-600 hover:bg-slate-100 hover:text-[#005AA9]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── GALLERY GRID SECTION ─── */}
      <section className="container mx-auto px-4 sm:px-6 max-w-6xl mt-4 sm:mt-12">
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((item) => (
              <motion.div
                key={item.id}
                layout
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -6 }}
                className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer border border-slate-100 bg-white"
                onClick={() => setSelectedImage(item.image)}
              >
                <Image
                  src={item.image}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Hover / Active overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-2 sm:p-4 text-center">
                  <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-md rounded-full mb-1 sm:mb-2 scale-75 group-hover:scale-100 transition-transform duration-300">
                    <ZoomIn className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold tracking-wide line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredImages.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-base font-semibold">No photos available in this category yet.</p>
          </div>
        )}
      </section>

      {/* ─── LIGHTBOX MODAL ─── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Selected gallery image"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 pt-24 text-center">Loading Gallery...</div>}>
      <GalleryContent />
    </Suspense>
  );
}
