"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Quote,
  Heart,
  CheckCircle2,
  Sparkles,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageSquareHeart,
  ExternalLink,
  PenLine,
} from "lucide-react";
import reviewsData from "@/data/reviews.json";

// ─── Types & Data ─────────────────────────────────────────────────────────────
interface ReviewItem {
  name: string;
  review: string;
  avatar?: string;
  images?: string[];
}

interface EnrichedReview extends ReviewItem {
  id: string;
  category: "aquatics" | "small-animals" | "general";
  tag: string;
  rating: number;
  highlightPhrase?: string;
  featured?: boolean;
}

// Google Multicolored SVG Icon Component
function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

// Fallback image helper for safe asset resolution
const resolveReviewImage = (src: string): string => {
  const map: Record<string, string> = {
    "/images/reviews/derek.png": "/images/reviews/darek.png",
    "/images/reviews/derek_r1.png": "/images/reviews/darek_r1.png",
    "/images/reviews/derek_r2.png": "/images/reviews/darek_r2.png",
    "/images/reviews/derek_r1.webp": "/images/reviews/darek_r1.png",
    "/images/reviews/derek_r2.webp": "/images/reviews/darek_r2.png",
    "/images/reviews/qz_r1.webp": "/images/reviews/q_r1.png",
    "/images/reviews/qz_r2.webp": "/images/reviews/q_r2.png",
    "/images/reviews/qz_r3.webp": "/images/reviews/q_r3.png",
    "/images/reviews/qz_r1.png": "/images/reviews/q_r1.png",
    "/images/reviews/qz_r2.png": "/images/reviews/q_r2.png",
    "/images/reviews/qz_r3.png": "/images/reviews/q_r3.png",
    "/images/reviews/shawnee.png": "/images/reviews/shawnee.png",
  };
  return map[src] || src.replace(/\.webp$/, ".png");
};

function StoryAvatar({ name, avatar }: { name: string; avatar?: string }) {
  const [imgError, setImgError] = useState(false);
  const initial = name ? name.trim().charAt(0).toUpperCase() : "U";
  const resolved = avatar ? resolveReviewImage(avatar) : "";

  return (
    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gradient-to-tr from-[#003DA5] to-[#005AA9] flex items-center justify-center text-white font-black text-lg shrink-0 shadow-sm select-none">
      {resolved && !imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolved}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="uppercase text-white font-black text-lg leading-none">
          {initial}
        </span>
      )}
    </div>
  );
}

// Enrich static reviews with category tags and thematic metadata
const ENRICHED_REVIEWS: EnrichedReview[] = (reviewsData as ReviewItem[]).map(
  (r, idx) => {
    let category: "aquatics" | "small-animals" | "general" = "general";
    let tag = "Pet Parent";
    let highlightPhrase = "";
    let featured = false;

    const lower = (r.review + " " + r.name).toLowerCase();

    if (r.name.includes("Sarah")) {
      category = "aquatics";
      tag = "First-Time Fish Family";
      highlightPhrase = "“She even played along with our lies about Santa to really make Christmas so special!”";
      featured = true;
    } else if (r.name.includes("Joe")) {
      category = "aquatics";
      tag = "Freshwater Keeper";
      highlightPhrase = "“The sort of ma and pa shop full of experts and animal lovers that you are glad exists.”";
    } else if (r.name.includes("Q Z")) {
      category = "small-animals";
      tag = "Baby Bunny Parent";
      highlightPhrase = "“Their staff gave me many professional advice, very patient! My bunny is very healthy now!”";
    } else if (r.name.includes("Nathan")) {
      category = "small-animals";
      tag = "Aquatics & Small Pets";
      highlightPhrase = "“Best store for finding everything to set up my tank, plus birds and small mammals.”";
    } else if (r.name.includes("Derek")) {
      category = "aquatics";
      tag = "Aquarium Enthusiast";
      highlightPhrase = "“I went to about 6 pet stores along the 405... this place had the best selection.”";
    } else if (r.name.includes("Schuyler")) {
      category = "aquatics";
      tag = "Aquatics & Corals";
      highlightPhrase = "“Super helpful and friendly. Fresh water fish with corals and macroalgae too.”";
    } else if (r.name.includes("Shawnee")) {
      category = "aquatics";
      tag = "Fish Supplies Specialist";
      highlightPhrase = "“You can find different types of fish that you don't see everyday.”";
    }

    return {
      ...r,
      id: `story-${idx + 1}`,
      avatar: r.avatar,
      category,
      tag,
      rating: 5,
      highlightPhrase,
      featured,
    };
  }
);

export default function CustomerStoriesClient() {
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  // Lightbox Modal State
  const [lightbox, setLightbox] = useState<{
    images: string[];
    index: number;
    title: string;
    author: string;
  } | null>(null);

  const openLightbox = (images: string[], index: number, author: string) => {
    setLightbox({
      images: images.map(resolveReviewImage),
      index,
      title: `${author}'s Photos`,
      author,
    });
  };

  const nextLightboxImage = () => {
    if (!lightbox) return;
    setLightbox((prev) =>
      prev
        ? {
          ...prev,
          index: (prev.index + 1) % prev.images.length,
        }
        : null
    );
  };

  const prevLightboxImage = () => {
    if (!lightbox) return;
    setLightbox((prev) =>
      prev
        ? {
          ...prev,
          index: (prev.index - 1 + prev.images.length) % prev.images.length,
        }
        : null
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#005AA9] selection:text-white">
      {/* ─── HERO HEADER SECTION ─── */}
      <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
        {/* Image — clipped to banner bounds */}
        <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
          <Image
            src="/images/banner/shophero5.png"
            alt="Customer Stories"
            fill
            priority
            className="object-cover object-[center_60%] block md:hidden"
            sizes="100vw"
          />
          <Image
            src="/images/banner/shophero3.png"
            alt="Customer Stories"
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
              Customer Stories
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
                <span className="font-bold text-[#0d1b2a] md:text-[#0d1b2a] text-white">Customer Stories</span>
              </span>
            </nav>
          </motion.div>
        </div>
      </section>

      {/* ─── Main Content Area ─── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">





        {/* ─── Story Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {ENRICHED_REVIEWS.map((item, index) => {
              const isExpanded = !!expandedReviews[item.id];
              const reviewShort =
                item.review.length > 220 && !isExpanded
                  ? item.review.slice(0, 220) + "..."
                  : item.review;

              return (
                <motion.div
                  key={item.id}
                  id={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex flex-col justify-between rounded-2xl bg-white border border-slate-100 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group"
                >
                  <div>
                    {/* Card Header: User Info & Tag */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar with reliable initial fallback */}
                        <StoryAvatar name={item.name} avatar={item.avatar} />

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                              {item.name}
                            </h3>
                            <span title="Verified Customer" className="inline-flex items-center">
                              <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 mt-0.5">
                            <GoogleIcon className="h-3 w-3 shrink-0" />
                            <span>Google Review</span>
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center text-amber-400 shrink-0">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3.5 w-3.5 fill-amber-400 stroke-none"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Highlight quote pill if exists */}
                    {item.highlightPhrase && (
                      <div className="mb-3 rounded-xl bg-slate-50 border-l-4 border-[#005AA9] p-2.5 text-xs font-semibold text-slate-700 italic">
                        {item.highlightPhrase}
                      </div>
                    )}

                    {/* Story Body */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-4">
                      {reviewShort}
                    </p>

                    {/* Expand / Collapse Button */}
                    {item.review.length > 220 && (
                      <button
                        onClick={() =>
                          setExpandedReviews((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                          }))
                        }
                        className="text-xs font-bold text-[#005AA9] hover:underline mb-4 inline-block focus:outline-none cursor-pointer"
                      >
                        {isExpanded ? "Show Less" : "Read Full Story →"}
                      </button>
                    )}

                    {/* Attached Photo Gallery */}
                    {item.images && item.images.length > 0 && (
                      <div className="mb-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                          <Camera className="h-3 w-3" />
                          <span>Customer Photos ({item.images.length})</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {item.images.slice(0, 3).map((img, iIdx) => {
                            const resolved = resolveReviewImage(img);
                            const isExtra = iIdx === 2 && item.images!.length > 3;
                            const extraCount = item.images!.length - 3;

                            return (
                              <div
                                key={iIdx}
                                onClick={() =>
                                  openLightbox(item.images!, iIdx, item.name)
                                }
                                className="group/photo relative h-20 rounded-xl overflow-hidden bg-slate-100 cursor-pointer shadow-xs border border-slate-100"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={resolved}
                                  alt={`${item.name}'s photo ${iIdx + 1}`}
                                  className="h-full w-full object-cover group-hover/photo:scale-105 transition-transform duration-200"
                                />
                                {isExtra && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-black">
                                    +{extraCount} more
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ─── Action Buttons (Write a Review & Read More) ─── */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://maps.app.goo.gl/2Zua6rJNEGvrA1Z68"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#005AA9] hover:bg-[#004280] text-white px-7 py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <GoogleIcon className="h-4 w-4 shrink-0" />
            <span>Write a Review</span>
          </a>

          <a
            href="https://maps.app.goo.gl/2Zua6rJNEGvrA1Z68"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-white border-2 border-[#005AA9] text-[#005AA9] hover:bg-[#005AA9] hover:text-white px-7 py-3.5 text-sm font-bold shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <GoogleIcon className="h-4 w-4 shrink-0" />
            <span>Read More</span>
            <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* ─── Lightbox Modal ─── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightbox(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
              aria-label="Close photo view"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Content Container */}
            <div
              className="relative max-w-4xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-h-[75vh] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lightbox.images[lightbox.index]}
                  alt={`${lightbox.author} photo ${lightbox.index + 1}`}
                  className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
                />

                {/* Left/Right Navigation */}
                {lightbox.images.length > 1 && (
                  <>
                    <button
                      onClick={prevLightboxImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextLightboxImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Photo Information & Thumbnails */}
              <div className="mt-4 text-center text-white">
                <div className="text-sm font-bold">{lightbox.title}</div>
                <div className="text-xs text-white/60 mt-0.5">
                  Photo {lightbox.index + 1} of {lightbox.images.length}
                </div>

                {lightbox.images.length > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-3">
                    {lightbox.images.map((thumb, tIdx) => (
                      <button
                        key={tIdx}
                        onClick={() =>
                          setLightbox((prev) =>
                            prev ? { ...prev, index: tIdx } : null
                          )
                        }
                        className={`h-12 w-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${lightbox.index === tIdx
                          ? "border-cyan-400 scale-105"
                          : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumb}
                          alt="Thumbnail"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
