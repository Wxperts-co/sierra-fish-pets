"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AdoptionHero() {
  const [availableDogsCount, setAvailableDogsCount] = useState(0);

  useEffect(() => {
    fetch("/api/dogs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.dogs)) {
          setAvailableDogsCount(
            data.dogs.filter((d: any) => d.adoptionStatus === "available").length
          );
        }
      })
      .catch((err) => console.error("Failed to load dog count:", err));
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden w-full h-[220px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
      {/* Background Image with Premium Overlay (Fixed Parallax) */}
      <div className="absolute md:fixed inset-x-0 top-0 w-full h-[220px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
        {/* Mobile image */}
        <Image
          src="/images/banner/shophero5.png"
          alt="Dog Adoption"
          fill
          priority
          className="object-cover object-[center_60%] block md:hidden filter brightness-[0.9]"
          sizes="100vw"
        />
        {/* Desktop image */}
        <Image
          src="/images/banner/dog-adoption.png"
          alt="Dog Adoption"
          fill
          priority
          className="object-cover object-center hidden md:block filter brightness-[0.9]"
          sizes="100vw"
        />
      </div>

      {/* Mobile overlay — darkens image so text is readable */}
      <div className="absolute inset-0 z-[2] block md:hidden bg-[linear-gradient(to_bottom,rgba(0,30,70,0.65)_0%,rgba(0,30,70,0.40)_60%,rgba(0,30,70,0.15)_100%)]" />

      {/* Centered text block */}
      <div className="absolute inset-x-0 top-0 z-[3] flex h-full flex-col items-center justify-center px-4 text-center">
        <div className="flex flex-col items-center justify-center max-w-4xl">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white drop-shadow-md md:bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] md:bg-clip-text md:text-transparent md:drop-shadow-none tracking-tight leading-tight mb-2 sm:mb-3">
            Dog Adoption &amp; Rescue Events
          </h1>
          {/* Breadcrumb */}
          <nav
            aria-label="breadcrumb"
            className="flex flex-wrap items-center justify-center gap-0.5 text-xs sm:text-sm font-medium text-white drop-shadow-md md:text-slate-300 md:drop-shadow-none mb-3 sm:mb-4"
          >
            <span className="flex items-center gap-0.5">
              <Link
                href="/"
                className="text-white hover:text-cyan-300 md:text-slate-300 transition-colors duration-150 hover:underline"
              >
                Home
              </Link>
              <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
            </span>
            <span className="flex items-center gap-0.5">
              <Link
                href="/services"
                className="text-white hover:text-cyan-300 md:text-slate-300 transition-colors duration-150 hover:underline"
              >
                Services
              </Link>
              <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
            </span>
            <span className="flex items-center gap-0.5">
              <span className="font-bold text-white">Dog Adoption</span>
            </span>
          </nav>

          <div>
            <button
              onClick={() => scrollToSection("dogs")}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-[#005AA9] hover:bg-[#004b8d] text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-base font-bold shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>
                View Available Dogs{availableDogsCount > 0 ? ` (${availableDogsCount})` : ""}
              </span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}