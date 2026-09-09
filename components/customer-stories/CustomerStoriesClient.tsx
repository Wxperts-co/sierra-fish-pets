"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Quote,
  CheckCircle2,
  Sparkles,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Heart,
  Compass,
  Smile,
  MapPin,
  HelpCircle,
  Award,
  Calendar,
  Layers,
  Search,
  Check,
  Fish,
} from "lucide-react";
import reviewsData from "@/data/reviews.json";

// ─── Types & Data ─────────────────────────────────────────────────────────────
interface ReviewItem {
  name: string;
  review: string;
  avatar?: string;
  images?: string[];
}

// Multicolored Google SVG Icon
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

// Fallback helper for resolving image assets correctly
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
    "/images/reviews/shawnee_r.webp": "/images/reviews/shawnee_r.png",
  };
  return map[src] || src.replace(/\.webp$/, ".png");
};

function StoryAvatar({
  name,
  avatar,
  size = "md",
}: {
  name: string;
  avatar?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [imgError, setImgError] = useState(false);
  const initial = name ? name.trim().charAt(0).toUpperCase() : "U";
  const resolved = avatar ? resolveReviewImage(avatar) : "";

  const sizeClasses = {
    sm: "h-9 w-9 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-14 w-14 text-base sm:h-16 sm:w-16 sm:text-xl",
  }[size];

  return (
    <div
      className={`relative ${sizeClasses} rounded-full overflow-hidden bg-gradient-to-tr from-[#003DA5] to-[#0077C8] flex items-center justify-center text-white font-black shrink-0 shadow-sm border-2 border-white ring-1 ring-blue-200 select-none`}
    >
      {resolved && !imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolved}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="uppercase text-white font-black leading-none">{initial}</span>
      )}
    </div>
  );
}

export default function CustomerStoriesClient() {
  const [expandedStory, setExpandedStory] = useState<Record<string, boolean>>({});

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
      title: `${author}'s Setup Photos`,
      author,
    });
  };

  const nextLightboxImage = () => {
    if (!lightbox) return;
    setLightbox((prev) =>
      prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null
    );
  };

  const prevLightboxImage = () => {
    if (!lightbox) return;
    setLightbox((prev) =>
      prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedStory((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Raw reviews references
  const sarahReview = (reviewsData as ReviewItem[]).find((r) => r.name.includes("Sarah"))?.review || "";
  const derekReview = (reviewsData as ReviewItem[]).find((r) => r.name.includes("Derek"))?.review || "";
  const joeReview = (reviewsData as ReviewItem[]).find((r) => r.name.includes("Joe"))?.review || "";
  const qzReview = (reviewsData as ReviewItem[]).find((r) => r.name.includes("Q Z"))?.review || "";
  const nathanReview = (reviewsData as ReviewItem[]).find((r) => r.name.includes("Nathan"))?.review || "";
  const schuylerReview = (reviewsData as ReviewItem[]).find((r) => r.name.includes("Schuyler"))?.review || "";
  const shawneeReview = (reviewsData as ReviewItem[]).find((r) => r.name.includes("Shawnee"))?.review || "";

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-800 selection:bg-[#005AA9] selection:text-white pb-24">
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
            <h1 className="mb-4 text-[clamp(2rem,4.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em] text-white drop-shadow-md md:bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] md:bg-clip-text md:text-transparent md:drop-shadow-none">
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

      {/* ─── MAIN EDITORIAL STORYTELLING CONTENT ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 relative z-10">

        {/* ─── Page Intro Header ─── */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/70 border border-blue-200 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#005AA9] shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Community Stories • Renton, Washington</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-4xl font-black text-slate-900 tracking-tight leading-[1.15]">
            From First Steps to
            <span className="bg-gradient-to-r from-[#003DA5] via-[#005AA9] to-[#0084DE] bg-clip-text text-transparent">
              &nbsp;Lifelong Pet Journeys
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-5xl mx-auto">
            Discover real experiences from pet parents, beginners, and hobbyists in our community.
            See what they hoped to create, the guidance they received, and how their companions are thriving today.
          </p>
        </div>

        {/* ─── DIVERSE STORYTELLING FLOW (Unique Layouts for Each Journey) ─── */}
        <div className="space-y-4 sm:space-y-12">

          {/* ══════════════════════════════════════════════════════════════════
              STORY 1: Sarah Proctor • The Holiday Wish & Transformation Spread
             ══════════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-gradient-to-br from-[#eef6ff] via-white to-[#e4f0fc] border-2 border-blue-200/90 p-4 sm:p-5 md:p-6 shadow-xl relative overflow-hidden"
          >
            {/* Badge & Google Pill */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white bg-[#005AA9] px-3.5 py-1.5 rounded-full shadow-xs">
                  <Heart className="h-3.5 w-3.5 fill-white" />
                  <span>Featured Family Story</span>
                </span>
                <span className="text-xs font-bold text-[#005AA9] bg-blue-100/80 px-3 py-1.5 rounded-full">
                  First-Time Fish Family
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/90 border border-blue-100 px-3.5 py-1 rounded-full shadow-2xs">
                <GoogleIcon className="h-3.5 w-3.5" />
                <span className="text-xs font-bold text-slate-700"></span>
                <div className="flex items-center text-amber-400 ml-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 stroke-none" />
                  ))}
                </div>
              </div>
            </div>

            {/* Title Header */}
            <div className="space-y-2 mb-8">
              <h3 className="text-2xl sm:text-3xl md:text-[32px] font-black text-slate-900 tracking-tight leading-tight">
                The Christmas Cory Catfish Wish: Becoming “Fish People”
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-3xl">
                How a family turned first-time aquarium nervousness into pure holiday magic for their nephew with dedicated guidance from Alyssa.
              </p>
            </div>

            {/* Magazine 2-Column Split: Photos Left, Journey Path Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
              {/* Visual Photo Showcase */}
              <div className="lg:col-span-5 space-y-3">
                <div
                  onClick={() =>
                    openLightbox(
                      [
                        "/images/reviews/sarah_r1.png",
                        "/images/reviews/sarah_r2.png",
                        "/images/reviews/sarah_r3.png",
                        "/images/reviews/sarah_r4.png",
                      ],
                      0,
                      "Sarah Proctor"
                    )
                  }
                  className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-md bg-slate-900 border-2 border-white ring-1 ring-blue-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/reviews/sarah_r1.png"
                    alt="Sarah's aquarium setup"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-lg">
                      <Camera className="h-3.5 w-3.5 text-cyan-300" />
                      <span>View 4 Setup Photos</span>
                    </span>
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    "/images/reviews/sarah_r1.png",
                    "/images/reviews/sarah_r2.png",
                    "/images/reviews/sarah_r3.png",
                    "/images/reviews/sarah_r4.png",
                  ].map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        openLightbox(
                          [
                            "/images/reviews/sarah_r1.png",
                            "/images/reviews/sarah_r2.png",
                            "/images/reviews/sarah_r3.png",
                            "/images/reviews/sarah_r4.png",
                          ],
                          idx,
                          "Sarah Proctor"
                        )
                      }
                      className="group/t relative h-16 rounded-xl overflow-hidden cursor-pointer border-2 border-white shadow-2xs hover:border-[#005AA9] transition-all bg-slate-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover group-hover/t:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Journey Progression Steps */}
              <div className="lg:col-span-7 space-y-4">
                {/* Step 1: The Goal & The Challenge */}
                <div className="rounded-2xl bg-white/90 p-4 sm:p-5 border border-blue-100/90 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#005AA9]">
                    <span className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-[11px]">1</span>
                    <span>The Holiday Wish &amp; Initial Nerves</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Her nephew had just one Christmas wish: a live Cory Catfish tank. As brand-new fish parents, they visited Sierra half a dozen times to plan out every detail and avoid any rookie mistakes.
                  </p>
                </div>

                {/* Step 2: The Sierra Experience */}
                <div className="rounded-2xl bg-white/90 p-4 sm:p-5 border border-blue-100/90 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700">
                    <span className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-[11px]">2</span>
                    <span>Alyssa’s Patient Guidance &amp; Santa Teamwork</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Alyssa literally held their hand through tank sizing, sand substrate, and filtration—even playing along with their Santa story to keep the Christmas surprise intact.
                  </p>
                </div>

                {/* Step 3: The Transformation */}
                <div className="rounded-2xl bg-emerald-50/80 p-4 sm:p-5 border border-emerald-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800">
                    <span className="h-5 w-5 rounded-full bg-emerald-200 flex items-center justify-center text-[11px] text-emerald-900">3</span>
                    <span>Transformation: “I guess we are fish people now!”</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
                    The tank thrived effortlessly. Now the whole family is hooked, expanding with shrimp, glass suckers, and guppies.
                  </p>
                </div>
              </div>
            </div>

            {/* Quote Banner */}
            <div className="relative rounded-2xl bg-white p-5 text-sm sm:text-base font-semibold text-slate-800 italic border-l-4 border-[#005AA9] shadow-xs mb-6">
              <Quote className="h-6 w-6 text-blue-200 absolute -top-3 -left-3 bg-white rounded-full p-1 border border-blue-100" />
              <p className="pl-2 leading-relaxed">
                “Alyssa literally held my hand walked me through all my options and how to best take care of our Cory Catfish... She even played along with our lies about Santa to really make our christmas so special!”
              </p>
            </div>

            {/* Verified Full Narrative Toggle */}
            <div className="rounded-2xl bg-blue-50/50 border border-blue-100/80 p-4 mb-6">
              <button
                onClick={() => toggleExpand("sarah")}
                className="w-full flex items-center justify-between text-xs font-bold text-[#005AA9] hover:underline cursor-pointer"
              >
                <span>{expandedStory["sarah"] ? "Hide Full Review Transcript" : "Read Full Story in Customer’s Own Words"}</span>
                <ArrowRight className={`h-3.5 w-3.5 transition-transform ${expandedStory["sarah"] ? "rotate-90" : ""}`} />
              </button>
              {expandedStory["sarah"] && (
                <p className="mt-3 pt-3 border-t border-blue-100 text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {sarahReview}
                </p>
              )}
            </div>

            {/* Story Author Footer */}
            <div className="pt-4 border-t border-blue-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <StoryAvatar name="Sarah Proctor" size="md" />
                <div>
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm sm:text-base">
                    <span>Sarah Proctor</span>
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    First-Time Fish Family • Renton, WA
                  </span>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/2Zua6rJNEGvrA1Z68"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005AA9] hover:underline bg-white border border-blue-200 px-4 py-2 rounded-xl shadow-2xs hover:bg-blue-50 transition-colors"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.section>

          {/* ══════════════════════════════════════════════════════════════════
              STORY 2: Derek Marks • The 405 Corridor Exploration Journal
             ══════════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-[#f0f7ff] border border-blue-100/90 p-5 sm:p-6 md:p-8 shadow-lg relative"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#005AA9] bg-blue-100 px-3.5 py-1.5 rounded-full">
                  <Compass className="h-3.5 w-3.5" />
                  <span>The Hobbyist Quest</span>
                </span>
                <span className="text-xs font-bold text-slate-500 bg-white border border-blue-100 px-3 py-1.5 rounded-full">
                  6 Stores Compared Along I-405
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white px-3.5 py-1 rounded-full border border-blue-100 shadow-2xs">
                <GoogleIcon className="h-3.5 w-3.5" />
                <span className="text-xs font-bold text-slate-700"></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Narrative Left */}
              <div className="md:col-span-7 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  Searching 6 Pet Stores Along The 405 for The Ultimate Setup
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Derek traveled across King County, visiting roughly six pet stores from family-owned shops to retail chains. He was looking for two things: vibrant species selection and an authentic, pet-loving store vibe.
                </p>

                {/* Highlights Pill Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3.5 rounded-2xl border border-blue-100 shadow-2xs">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">The Discovery</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">“Best selection by far along the 405”</div>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-blue-100 shadow-2xs">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">The Store Vibe</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">Authentic passion &amp; healthy livestock</div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4 text-xs sm:text-sm font-semibold text-slate-700 italic border-l-4 border-[#005AA9] shadow-2xs">
                  “If you get into aquariums I would suggest coming here. I went to about 6 pet stores along the 405... this place has a very cool vibe to it.”
                </div>

                <button
                  onClick={() => toggleExpand("derek")}
                  className="text-xs font-bold text-[#005AA9] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{expandedStory["derek"] ? "Show Less" : "Read Full Story Transcript"}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>

                {expandedStory["derek"] && (
                  <p className="p-4 rounded-2xl bg-white/80 border border-blue-100 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {derekReview}
                  </p>
                )}
              </div>

              {/* Photo Evidence Right */}
              <div className="md:col-span-5 space-y-3">
                <div
                  onClick={() =>
                    openLightbox(
                      ["/images/reviews/darek_r1.png", "/images/reviews/darek_r2.png"],
                      0,
                      "Derek Marks"
                    )
                  }
                  className="group relative h-56 sm:h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md bg-slate-900 border-2 border-white ring-1 ring-blue-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/reviews/darek_r1.png"
                    alt="Derek's aquarium livestock"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-black/60 backdrop-blur-xs px-3 py-1 rounded-lg">
                      <Camera className="h-3.5 w-3.5 text-cyan-300" />
                      <span>View 2 Photos</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {["/images/reviews/darek_r1.png", "/images/reviews/darek_r2.png"].map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        openLightbox(
                          ["/images/reviews/darek_r1.png", "/images/reviews/darek_r2.png"],
                          idx,
                          "Derek Marks"
                        )
                      }
                      className="relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 border-white shadow-2xs hover:border-[#005AA9] transition-all bg-slate-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt="Aquarium livestock preview"
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-blue-100/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StoryAvatar name="Derek Marks" avatar="/images/reviews/darek.png" size="sm" />
                <div>
                  <span className="font-bold text-slate-900 text-sm block">Derek Marks</span>
                  <span className="text-[11px] text-slate-500">Aquarium Enthusiast • Verified Reviewer</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ══════════════════════════════════════════════════════════════════
              STORY 3: Joe Tobin • The Mentorship & Chemistry Journey
             ══════════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-gradient-to-br from-white via-[#f0f7ff] to-[#e6f2fc] border border-blue-200/90 p-5 sm:p-6 md:p-8 shadow-lg relative"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white bg-[#005AA9] px-3.5 py-1.5 rounded-full">
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>Mentorship Spotlight</span>
                </span>
                <span className="text-xs font-bold text-[#005AA9] bg-blue-100/70 px-3 py-1.5 rounded-full">
                  Water Chemistry &amp; Cycling
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white px-3.5 py-1 rounded-full border border-blue-100 shadow-2xs">
                <GoogleIcon className="h-3.5 w-3.5" />
                <span className="text-xs font-bold text-slate-700"></span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                From Chemistry Anxiety to a Thriving Planted Ecosystem
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                Being new to fish keeping, Joe visited Sierra multiple times over a month with endless questions about tank cycling, nitrogen balance, substrate, and species compatibility.
              </p>
            </div>

            {/* Story Narrative Box with Side-by-Side Photos */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-6">
              <div className="md:col-span-7 space-y-4">
                <div className="rounded-2xl bg-white p-5 text-xs sm:text-sm font-semibold text-slate-700 italic border-l-4 border-[#005AA9] shadow-xs">
                  “This is the sort of ma and pa shop full of experts and animal lovers that you are glad exists so you aren’t forced to shop solely at the Petcos of the world. Their selection of fish, plants, and equipment FAR outweighs the box stores anyway.”
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-[#005AA9]">The Sierra Mentorship:</strong> Alyssa and the team patiently worked through every water chemistry hurdle with Joe, recommending the ideal live plants and compatible fish for his specific tank dimensions.
                </div>
              </div>

              <div className="md:col-span-5 grid grid-cols-2 gap-2">
                {["/images/reviews/joe_r1.png", "/images/reviews/joe_r2.png"].map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      openLightbox(
                        ["/images/reviews/joe_r1.png", "/images/reviews/joe_r2.png"],
                        idx,
                        "Joe Tobin"
                      )
                    }
                    className="group relative h-44 sm:h-52 rounded-2xl overflow-hidden cursor-pointer border-2 border-white shadow-sm hover:shadow-md transition-all bg-slate-900"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt="Joe's planted tank setup"
                      className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                      <Camera className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Review Excerpt */}
            <div className="rounded-2xl bg-white/80 p-4 border border-blue-100/80 mb-6">
              <button
                onClick={() => toggleExpand("joe")}
                className="w-full flex items-center justify-between text-xs font-bold text-[#005AA9] hover:underline cursor-pointer"
              >
                <span>{expandedStory["joe"] ? "Hide Full Story Transcript" : "Read Full Story Transcript"}</span>
                <ArrowRight className={`h-3.5 w-3.5 transition-transform ${expandedStory["joe"] ? "rotate-90" : ""}`} />
              </button>
              {expandedStory["joe"] && (
                <p className="mt-3 pt-3 border-t border-blue-100 text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {joeReview}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StoryAvatar name="Joe Tobin" size="sm" />
                <div>
                  <span className="font-bold text-slate-900 text-sm block">Joe Tobin</span>
                  <span className="text-[11px] text-slate-500">Freshwater Hobbyist • Renton, WA</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ══════════════════════════════════════════════════════════════════
              STORY 4: Q Z • First-Time Bunny Parent Journey
             ══════════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-gradient-to-br from-[#fff7f0] via-[#f0f7ff] to-[#e8f3fc] border-2 border-amber-200/60 p-5 sm:p-6 md:p-8 shadow-lg relative overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white bg-amber-600 px-3.5 py-1.5 rounded-full shadow-xs">
                  <Smile className="h-3.5 w-3.5" />
                  <span>Small Animal Care</span>
                </span>
                <span className="text-xs font-bold text-slate-600 bg-white border border-amber-200 px-3 py-1.5 rounded-full">
                  First-Time Bunny Parent
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white px-3.5 py-1 rounded-full border border-blue-100 shadow-2xs">
                <GoogleIcon className="h-3.5 w-3.5" />
                <span className="text-xs font-bold text-slate-700"></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Photo Stack Left */}
              <div className="md:col-span-5 space-y-3">
                <div
                  onClick={() =>
                    openLightbox(
                      ["/images/reviews/q_r1.png", "/images/reviews/q_r2.png", "/images/reviews/q_r3.png"],
                      0,
                      "Q Z"
                    )
                  }
                  className="group relative h-60 sm:h-68 rounded-2xl overflow-hidden cursor-pointer shadow-md bg-slate-900 border-2 border-white ring-1 ring-amber-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/reviews/q_r1.png"
                    alt="Baby pet rabbit"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-lg">
                      <Camera className="h-3.5 w-3.5 text-amber-300" />
                      <span>View 3 Photos</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {["/images/reviews/q_r1.png", "/images/reviews/q_r2.png", "/images/reviews/q_r3.png"].map(
                    (img, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          openLightbox(
                            ["/images/reviews/q_r1.png", "/images/reviews/q_r2.png", "/images/reviews/q_r3.png"],
                            idx,
                            "Q Z"
                          )
                        }
                        className="relative h-16 rounded-xl overflow-hidden cursor-pointer border-2 border-white shadow-2xs hover:border-amber-500 transition-all bg-slate-100"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt="Baby rabbit thumbnail"
                          className="h-full w-full object-cover hover:scale-110 transition-transform duration-200"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Narrative Right */}
              <div className="md:col-span-7 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  Raising Baby Buns: From First-Time Nerves to a Thriving Bunny
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Bringing home a fragile baby rabbit for the very first time brings both excitement and nervous questions. Sierra’s small animal staff offered patient, step-by-step guidance on habitat safety, feeding schedules, and gentle handling.
                </p>

                <div className="rounded-2xl bg-white p-5 text-sm font-semibold text-slate-800 italic border-l-4 border-amber-500 shadow-xs">
                  “This is my first time to raise baby rabbit. I felt exciting and nervous. Their staff gave me many professional advice, very patient! My bunny is very healthy now! Yay!”
                </div>

                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-bold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Outcome: Happy, energetic, and fully thriving rabbit</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StoryAvatar name="Q Z" avatar="/images/reviews/QZ.png" size="sm" />
                <div>
                  <span className="font-bold text-slate-900 text-sm block">Q Z</span>
                  <span className="text-[11px] text-slate-500">First-Time Bunny Parent • Renton, WA</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ══════════════════════════════════════════════════════════════════
              STORY 5: Nathan Drysdale • The All-in-One Multi-Pet Sanctuary
             ══════════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-[#f0f7ff] border border-blue-200/90 p-5 sm:p-6 md:p-8 shadow-lg relative"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#005AA9] bg-blue-100 px-3.5 py-1.5 rounded-full">
                  <Layers className="h-3.5 w-3.5" />
                  <span>Complete Sanctuary Setup</span>
                </span>
                <span className="text-xs font-bold text-slate-500 bg-white border border-blue-100 px-3 py-1.5 rounded-full">
                  Aquarium, Birds &amp; Small Mammals
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white px-3.5 py-1 rounded-full border border-blue-100 shadow-2xs">
                <GoogleIcon className="h-3.5 w-3.5" />
                <span className="text-xs font-bold text-slate-700"></span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                The Multi-Pet Sanctuary: Equipping Aquariums, Birds &amp; Small Mammals
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                Nathan needed a clean, deeply stocked store where he could find specialized equipment for his custom aquarium tank as well as healthy supplies for birds and small mammals under one roof.
              </p>
            </div>

            {/* 5-Photo Collage Grid */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500">
                <span>Visual Habitat Documentation (5 Photos)</span>
                <span className="text-blue-600 font-bold">Click to zoom in HD</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  "/images/reviews/nathan_r1.png",
                  "/images/reviews/nathan_r2.png",
                  "/images/reviews/nathan_r3.png",
                  "/images/reviews/nathan_r4.png",
                  "/images/reviews/nathan_r5.png",
                ].map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      openLightbox(
                        [
                          "/images/reviews/nathan_r1.png",
                          "/images/reviews/nathan_r2.png",
                          "/images/reviews/nathan_r3.png",
                          "/images/reviews/nathan_r4.png",
                          "/images/reviews/nathan_r5.png",
                        ],
                        idx,
                        "Nathan Drysdale"
                      )
                    }
                    className="group relative h-28 sm:h-36 rounded-2xl overflow-hidden cursor-pointer border-2 border-white shadow-xs hover:shadow-md transition-all bg-slate-900"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Nathan setup documentation ${idx + 1}`}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Camera className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote & Cleanliness Note */}
            <div className="rounded-2xl bg-white p-5 text-sm font-semibold text-slate-800 italic border-l-4 border-[#005AA9] shadow-xs mb-6">
              “This has been the best store for finding everything that I have been wanting to set up my tank. They also had a great selection for taking care of your birds and small mammals. One of the things that I appreciated the most about this store was that it was kept very clean and organized.”
            </div>

            <div className="pt-4 border-t border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StoryAvatar name="Nathan Drysdale" avatar="/images/reviews/nathan.png" size="sm" />
                <div>
                  <span className="font-bold text-slate-900 text-sm block">Nathan Drysdale</span>
                  <span className="text-[11px] text-slate-500">Aquatics &amp; Small Animals • Verified Customer</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ══════════════════════════════════════════════════════════════════
              STORIES 6 & 7: Schuyler Summers & Shawnee Knight (Double Feature)
             ══════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Schuyler: Corals & Macroalgae */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl bg-[#f0f7ff] border border-blue-100/90 p-5 sm:p-6 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#005AA9] bg-blue-100 px-3 py-1 rounded-full">
                    🪸 Corals &amp; Macroalgae
                  </span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 stroke-none" />
                    ))}
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  Curating Live Corals &amp; Rare Macroalgae
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Schuyler appreciates the friendly aquatics staff who curate not only healthy freshwater fish, but also specialty coral frags and rare macroalgae varieties.
                </p>

                {/* 2 Photos */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {["/images/reviews/schuyler_r1.png", "/images/reviews/schyler_r2.png"].map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        openLightbox(
                          ["/images/reviews/schuyler_r1.png", "/images/reviews/schyler_r2.png"],
                          idx,
                          "Schuyler Summers"
                        )
                      }
                      className="group relative h-32 rounded-2xl overflow-hidden cursor-pointer border-2 border-white shadow-2xs hover:shadow-md transition-all bg-slate-900"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt="Coral and macroalgae preview"
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                        <Camera className="h-3.5 w-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-white p-4 text-xs font-semibold text-slate-700 italic border-l-4 border-[#005AA9] shadow-2xs">
                  “The staff in aquatics are super helpful and friendly. They have mainly fresh water fish with a small selection of corals and occasionally macroalgae too.”
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <StoryAvatar name="Schuyler Summers" avatar="/images/reviews/schuyler.png" size="sm" />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Schuyler Summers</span>
                    <span className="text-[10px] text-slate-500">Reef &amp; Planted Aquarium Enthusiast</span>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Shawnee: Rare Finds */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-3xl bg-[#f0f7ff] border border-blue-100/90 p-5 sm:p-6 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-[#005AA9] bg-blue-100 px-3 py-1 rounded-full">
                    🐡 Rare &amp; Exotic Fish
                  </span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 stroke-none" />
                    ))}
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  Uncovering Fish You Don’t See Everyday
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Shawnee highlights Sierra’s big selection of supplies and uncommon fish varieties that make the store a mandatory stop whenever visiting the area.
                </p>

                {/* 1 Photo */}
                <div
                  onClick={() => openLightbox(["/images/reviews/shawnee_r.png"], 0, "Shawnee Knight")}
                  className="group relative h-32 rounded-2xl overflow-hidden cursor-pointer border-2 border-white shadow-2xs hover:shadow-md transition-all bg-slate-900"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/reviews/shawnee_r.png"
                    alt="Specialty fish selection"
                    className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                    <Camera className="h-3.5 w-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4 text-xs font-semibold text-slate-700 italic border-l-4 border-[#005AA9] shadow-2xs">
                  “The staff is very helpful and knowledgeable. They have a big selection on supplies for your fish... You can find different types of fish that you don't see everyday. Worth going to!”
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-100 flex items-center gap-2.5">
                <StoryAvatar name="Shawnee Knight" avatar="/images/reviews/shawnee.png" size="sm" />
                <div>
                  <span className="font-bold text-slate-900 text-xs block">Shawnee Knight</span>
                  <span className="text-[10px] text-slate-500">Fish Supplies Specialist</span>
                </div>
              </div>
            </motion.section>
          </div>
        </div>

        {/* ─── SEMANTIC KEYNOTES & NER TAGS ACCORDION ─── */}
        <div className="mt-12 sm:mt-16">
          <details className="group rounded-3xl bg-white border border-blue-100/90 p-5 sm:p-7 shadow-sm transition-all duration-200 hover:border-blue-200 text-slate-800">
            <summary className="cursor-pointer font-bold text-base sm:text-lg text-slate-900 flex items-center justify-between select-none list-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2.5">
                <span className="text-xs sm:text-sm font-black text-[#005AA9] transition-transform duration-200 group-open:rotate-90">
                  ▶
                </span>
                <span>Semantic Keynotes &amp; Named Entity Recognition (NER) Tags</span>
              </span>
            </summary>

            <div className="mt-6 space-y-6 text-sm sm:text-base leading-relaxed pt-4 border-t border-slate-100">
              {/* Semantic Keynotes Section */}
              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Semantic Keynotes
                </h3>
                <ul className="space-y-3.5 pl-1 sm:pl-2">
                  <li className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                    <span className="text-slate-900 font-bold leading-none mt-1.5">•</span>
                    <div>
                      <strong className="font-bold text-slate-900">
                        Beginner Aquarium Mentorship &amp; Holiday Wishes:
                      </strong>{" "}
                      <span>
                        Highlights how first-time fish owners receive step-by-step guidance on tank sizing, substrate, filtration, and species care, turning holiday surprise nervousness into thriving family aquariums.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                    <span className="text-slate-900 font-bold leading-none mt-1.5">•</span>
                    <div>
                      <strong className="font-bold text-slate-900">
                        Comprehensive Multi-Store Regional Comparison:
                      </strong>{" "}
                      <span>
                        Explores how dedicated hobbyists compared six independent and retail pet stores across the I-405 corridor in King County, discovering unmatched livestock health, cleanliness, and authentic passion at Sierra Fish &amp; Pets.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                    <span className="text-slate-900 font-bold leading-none mt-1.5">•</span>
                    <div>
                      <strong className="font-bold text-slate-900">
                        Overcoming Nitrogen Cycle &amp; Water Chemistry Anxiety:
                      </strong>{" "}
                      <span>
                        Details expert aquatic consultations that guide beginners through tank cycling, water parameters, live plant selection, and compatibility to establish thriving planted freshwater ecosystems.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                    <span className="text-slate-900 font-bold leading-none mt-1.5">•</span>
                    <div>
                      <strong className="font-bold text-slate-900">
                        First-Time Small Animal &amp; Rabbit Parenting Care:
                      </strong>{" "}
                      <span>
                        Emphasizes specialized, patient staff guidance for new pet owners covering baby rabbit nutrition, safe habitat setups, and gentle handling practices.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                    <span className="text-slate-900 font-bold leading-none mt-1.5">•</span>
                    <div>
                      <strong className="font-bold text-slate-900">
                        Integrated All-in-One Multi-Pet Sanctuary Supply:
                      </strong>{" "}
                      <span>
                        Focuses on the convenience of a deeply stocked, organized store catering simultaneously to custom aquariums, exotic birds, and small mammals under one roof.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                    <span className="text-slate-900 font-bold leading-none mt-1.5">•</span>
                    <div>
                      <strong className="font-bold text-slate-900">
                        Specialty Saltwater Corals, Rare Macroalgae &amp; Exotic Livestock:
                      </strong>{" "}
                      <span>
                        Showcases specialized livestock curation, from rare macroalgae varieties and coral frags to uncommon freshwater and marine fish not typically found in standard big-box stores.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                    <span className="text-slate-900 font-bold leading-none mt-1.5">•</span>
                    <div>
                      <strong className="font-bold text-slate-900">
                        Authentic Community Trust &amp; Verified Social Proof:
                      </strong>{" "}
                      <span>
                        Demonstrates genuine 5-star Google review ratings and verified photographic evidence from real local pet parents in Renton, Washington.
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* NER Tags Section */}
              <div className="space-y-3 pt-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  NER Tags
                </h3>
                <ul className="space-y-3.5 pl-1 sm:pl-2">
                  <li className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                    <span className="text-slate-900 font-bold leading-none mt-1.5">•</span>
                    <div>
                      <strong className="font-bold text-slate-900">ORGANIZATION (ORG):</strong>{" "}
                      <span>Sierra Fish &amp; Pets, Google, Google Maps</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                    <span className="text-slate-900 font-bold leading-none mt-1.5">•</span>
                    <div>
                      <strong className="font-bold text-slate-900">PERSON (PER):</strong>{" "}
                      <span>
                        Alyssa (Aquatics Specialist), Sarah Proctor (Customer), Derek Marks (Customer), Joe Tobin (Customer), Q Z (Customer), Nathan Drysdale (Customer), Schuyler Summers (Customer), Shawnee Knight (Customer)
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                    <span className="text-slate-900 font-bold leading-none mt-1.5">•</span>
                    <div>
                      <strong className="font-bold text-slate-900">LOCATION (LOC):</strong>{" "}
                      <span>
                        Renton, Washington, King County, Pacific Northwest (PNW), I-405 Corridor, 305 Burnett Ave S
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                    <span className="text-slate-900 font-bold leading-none mt-1.5">•</span>
                    <div>
                      <strong className="font-bold text-slate-900">PRODUCT / SERVICE (PRODUCT):</strong>{" "}
                      <span>
                        Freshwater aquariums &amp; livestock, Saltwater fish &amp; corals, Rare macroalgae, Live planted tanks, Cory catfish, Substrate &amp; sand, Filtration systems &amp; pumps, Water chemistry testing &amp; cycling, Small mammal supplies, Baby rabbit care habitats, Bird nutrition &amp; accessories, Custom aquarium consulting
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                    <span className="text-slate-900 font-bold leading-none mt-1.5">•</span>
                    <div>
                      <strong className="font-bold text-slate-900">CONCEPT / THEME (MISC):</strong>{" "}
                      <span>
                        Aquarium nitrogen cycle, Beginner pet mentorship, Water chemistry management, Small animal husbandry, Biofiltration, Habitat enrichment, Independent pet retail vs. big-box chains, Customer testimonials, Community pet education
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </details>
        </div>

        {/* ─── CTA: SHARE YOUR STORY BANNER ─── */}
        <div className="mt-16 sm:mt-20 rounded-3xl bg-gradient-to-br from-[#003B73] via-[#005AA9] to-[#0077C8] text-white p-7 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden border border-blue-300/30">
          {/* Decorative ambient background glows */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-900/40 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5">
            {/* Trust & Google Rating Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-4 py-1.5 border border-white/20 shadow-xs">
              <GoogleIcon className="h-4 w-4 shrink-0" />
              <div className="flex items-center text-amber-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-300 stroke-none" />
                ))}
              </div>
              <span className="text-xs font-bold text-white tracking-wide">
                5.0 Rated on Google Maps
              </span>
            </div>

            {/* Headline */}
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-xs">
              Have a Sierra Story with Your Pet?
            </h3>

       

            {/* Clear Dual Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
              <a
                href="https://maps.app.goo.gl/2Zua6rJNEGvrA1Z68"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white text-[#005AA9] hover:bg-blue-50 px-7 py-3.5 text-sm font-black shadow-lg hover:shadow-xl hover:scale-102 transition-all duration-200 cursor-pointer group"
              >
                <GoogleIcon className="h-4 w-4 shrink-0" />
                <span>Write a Review</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform text-[#005AA9]" />
              </a>

              <a
                href="https://maps.app.goo.gl/2Zua6rJNEGvrA1Z68"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-7 py-3.5 text-sm font-bold shadow-sm hover:shadow-md hover:scale-102 transition-all duration-200 cursor-pointer group"
              >
                <GoogleIcon className="h-4 w-4 shrink-0" />
                <span>Read More on Google</span>
                <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform text-white/80" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FULL-SCREEN HIGH-RES LIGHTBOX MODAL ─── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6"
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
              className="relative max-w-5xl w-full flex flex-col items-center justify-center mx-auto my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full min-h-[350px] sm:min-h-[500px] md:min-h-[600px] max-h-[82vh] flex items-center justify-center bg-black/50 rounded-2xl p-2 sm:p-4 border border-white/10 shadow-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lightbox.images[lightbox.index]}
                  alt={`${lightbox.author} documentation photo ${lightbox.index + 1}`}
                  className="w-auto h-auto max-h-[78vh] max-w-full object-contain rounded-xl shadow-2xl select-none"
                />

                {/* Left/Right Navigation */}
                {lightbox.images.length > 1 && (
                  <>
                    <button
                      onClick={prevLightboxImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-black/90 hover:scale-110 transition-all cursor-pointer shadow-lg border border-white/15"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextLightboxImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-black/90 hover:scale-110 transition-all cursor-pointer shadow-lg border border-white/15"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Photo Information & Thumbnails */}
              <div className="mt-4 text-center text-white">
                <div className="text-base font-bold tracking-tight">{lightbox.title}</div>
                <div className="text-xs text-white/70 mt-0.5">
                  Photo {lightbox.index + 1} of {lightbox.images.length}
                </div>

                {lightbox.images.length > 1 && (
                  <div className="flex items-center justify-center gap-2.5 mt-3 flex-wrap">
                    {lightbox.images.map((thumb, tIdx) => (
                      <button
                        key={tIdx}
                        onClick={() =>
                          setLightbox((prev) =>
                            prev ? { ...prev, index: tIdx } : null
                          )
                        }
                        className={`h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shadow-md ${
                          lightbox.index === tIdx
                            ? "border-cyan-400 scale-105 ring-2 ring-cyan-400/40"
                            : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
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
