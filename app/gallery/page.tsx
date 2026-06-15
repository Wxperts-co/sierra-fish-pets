"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import galleryData from "@/data/gallery.json";

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface GalleryItem {
  id: string;
  image: string;
  caption: string;
  categorySlug: string | null;
}

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const galleryImages = galleryData as GalleryItem[];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <main className="relative text-slate-800 min-h-screen overflow-x-hidden pb-24 bg-slate-50">
      {/* ─── HERO HEADER SECTION ─── */}
      <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
        {/* Image — clipped to banner bounds */}
        <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
          {/* Mobile image */}
          <Image
            src="/images/banner/shophero5.png"
            alt="Gallery banner"
            fill
            priority
            className="object-cover object-[center_60%] block md:hidden"
            sizes="100vw"
          />
          {/* Desktop image */}
          <Image
            src="/images/banner/shophero3.png"
            alt="Gallery banner"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="mb-4 text-[clamp(2rem,4.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em] bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] bg-clip-text text-transparent drop-shadow-sm">
              Our Gallery
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

      {/* ─── GALLERY GRID SECTION ─── */}
      <section className="container mx-auto px-6 max-w-6xl mt-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {galleryImages.map((item, index) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
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
        </motion.div>
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
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors active:scale-95 z-50"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Image */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl max-h-[85vh] aspect-video sm:aspect-square md:aspect-auto md:h-[80vh] md:w-[80vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Enlarged View"
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
