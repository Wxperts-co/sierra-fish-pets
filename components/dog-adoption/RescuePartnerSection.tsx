"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink, Heart, ShieldCheck, PawPrint } from "lucide-react";

export default function RescuePartnerSection() {
  return (
    <section className="relative py-16 bg-gradient-to-br from-[#002244] via-[#003d73] to-[#005AA9] text-white overflow-hidden shadow-inner">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Text Information */}
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#00aaff] bg-[#00aaff]/10 border border-[#00aaff]/20 px-4 py-1.5 rounded-full mb-4">
              <ShieldCheck className="w-4 h-4" />
              Primary Rescue Partner
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              Ginger&apos;s Pet Rescue
            </h2>

            <p className="text-base md:text-lg text-blue-100/90 font-light leading-relaxed mb-6">
              Sierra Fish &amp; Pets works primarily with <strong className="font-semibold text-white">Ginger&apos;s Pet Rescue</strong>—a non-profit 501(c)(3) organization dedicated to rescuing dogs from high-kill shelters and finding them safe, loving forever homes. Explore their live adoptable dogs directory below!
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {/* Primary Link: Adoptable Dogs */}
              <a
                href="https://www.gingerspetrescue.org/adoptable-dogs/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#00aaff] hover:bg-[#0099e6] text-slate-900 font-extrabold px-6 py-3.5 rounded-2xl text-sm shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <PawPrint className="w-4 h-4 fill-slate-900" />
                <span>View Adoptable Dogs Directory</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Secondary Link: Main Website */}
              <a
                href="https://www.gingerspetrescue.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold border border-white/30 px-6 py-3.5 rounded-2xl text-sm hover:scale-105 active:scale-95 transition-all"
              >
                <span>Visit Ginger&apos;s Pet Rescue Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Highlight Card */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col items-center justify-center bg-white/10 border border-white/20 rounded-2xl p-6 text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-[#00aaff]/20 border border-[#00aaff]/40 flex items-center justify-center text-[#00aaff] mb-4">
              <Heart className="w-8 h-8 fill-[#00aaff]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Save a Life Today</h3>
            <p className="text-xs text-blue-100/80 mb-4 leading-relaxed">
              Every adoption directly supports rescue efforts and frees up foster care space for another dog in need.
            </p>
            <a
              href="https://www.gingerspetrescue.org/adoptable-dogs/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#00aaff] hover:underline inline-flex items-center gap-1"
            >
              Browse Adoptable Dogs List <ArrowRightIcon className="w-3 h-3" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
