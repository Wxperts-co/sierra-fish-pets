"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, FileText, ArrowLeft, Printer } from "lucide-react";

export default function FlyersPage() {
  

  return (
    <main className="relative text-slate-800 min-h-screen overflow-x-hidden pb-24 bg-slate-50">
      
      {/* ─── HERO HEADER SECTION ─── */}
      <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
        {/* Image — clipped to banner bounds */}
        <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
          {/* Mobile image */}
          <Image
            src="/images/banner/shophero5.png"
            alt="Weekly flyers banner"
            fill
            priority
            className="object-cover object-[center_60%] block md:hidden"
            sizes="100vw"
          />
          {/* Desktop image */}
          <Image
            src="/images/banner/shophero3.png"
            alt="Weekly flyers banner"
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
              Weekly Flyers & Specials
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
                <span className="font-bold text-[#0d1b2a] md:text-[#0d1b2a] text-white">Weekly Flyers</span>
              </span>
            </nav>
          </motion.div>
        </div>
      </section>

      {/* ─── FLYERS CONTENT SECTION ─── */}
      <section className="container mx-auto px-6 max-w-5xl mt-12">
        
        {/* Header/Actions Sub-bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-200/60 p-8">
          <div>
            
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#002244] leading-tight">
               Offers & Promotions
            </h2>
            <p className="mt-2 text-slate-500 text-sm max-w-xl font-light">
              Explore our latest deals, featured pets, and high-quality supplies currently on special in-store and online.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/images/flyers.png"
              download="sierra-weekly-flyer.png"
              className="inline-flex items-center gap-2 bg-[#005AA9] hover:bg-[#004b8d] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-all duration-200 active:scale-95"
            >
              <Download className="w-4 h-4" />
              Download Flyer
            </a>
          </div>
        </div>

        {/* Flyer Card display */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl border border-slate-200/60 p-4 md:p-8 shadow-xl shadow-slate-100/50 flex flex-col items-center"
        >
          {/* Main flyer image container */}
          <div className="relative w-full overflow-hidden rounded-2xl bg-slate-50 shadow-inner group border border-slate-100 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/flyers.png"
              alt="Sierra Weekly Flyer"
              className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-2xl transition-all duration-300"
            />
          </div>

          {/* Footer note inside the container */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between w-full text-center sm:text-left gap-4 text-xs text-slate-400 font-medium pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#005AA9]" />
              <span>Offers valid while supplies last. Selection varies by location.</span>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-[#005AA9] hover:underline font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Shopping
            </Link>
          </div>
        </motion.div>

      </section>

    </main>
  );
}
