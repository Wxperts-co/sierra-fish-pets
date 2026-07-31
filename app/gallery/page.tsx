"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, ZoomIn, Grid, Store, Dog, Fish, Bug, Bird, Rabbit } from "lucide-react";
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

function GalleryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams?.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const cat = searchParams?.get("category");
    if (cat && CATEGORIES.some((c) => c.id === cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    if (catId === "all") {
      router.push("/gallery", { scroll: false });
    } else {
      router.push(`/gallery?category=${catId}`, { scroll: false });
    }
  };

  const filteredImages = activeCategory === "all"
    ? galleryImages
    : galleryImages.filter((item) => {
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
            <h1 className="mb-4 text-[clamp(2rem,4.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em] bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] bg-clip-text text-transparent drop-shadow-sm">
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

      {/* ─── CATEGORY FILTER TABS ─── */}
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 bg-white p-3 rounded-full border border-slate-200 shadow-sm max-w-4xl mx-auto">
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
      <section className="container mx-auto px-6 max-w-6xl mt-12">
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                className="relative aspect-square rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer border border-slate-100 bg-white"
                onClick={() => setSelectedImage(item.image)}
              >
                <Image
                  src={item.image}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4">
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-full mb-2 scale-75 group-hover:scale-100 transition-transform duration-300">
                    <ZoomIn className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold tracking-wide text-center">
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
