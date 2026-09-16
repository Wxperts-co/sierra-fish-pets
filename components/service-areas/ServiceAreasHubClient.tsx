"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  ArrowRight,
  Fish,
  Dog,
  ShoppingBag,
  Sliders,
  Phone,
  Navigation,
  ExternalLink
} from "lucide-react";
import { SERVICE_AREAS } from "@/data/serviceAreas";

export default function ServiceAreasHubClient() {
  const jsonLdHub = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Sierra Fish & Pets",
    "image": "https://sierrafishandpets.com/images/logo/logo3.png",
    "telephone": "+14252263215",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "601 S Grady Way Suite M",
      "addressLocality": "Renton",
      "addressRegion": "WA",
      "postalCode": "98057",
      "addressCountry": "US"
    },
    "areaServed": SERVICE_AREAS.map((a) => `${a.name}, WA`)
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHub) }}
      />

      <main className="min-h-screen bg-[#edf6fc] text-slate-800 font-lato pb-16">
        {/* ─── HERO HEADER SECTION WITH STANDARD INTERNAL PAGE BREADCRUMB ─── */}
        <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
          {/* Image Background */}
          <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
            {/* Mobile image */}
            <Image
              src="/images/banner/shophero5.png"
              alt="Service Areas banner"
              fill
              priority
              className="object-cover object-[center_60%] block md:hidden"
              sizes="100vw"
            />
            {/* Desktop image */}
            <Image
              src="/images/banner/shophero3.png"
              alt="Service Areas banner"
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
              className="flex flex-col items-center justify-center max-w-3xl"
            >
              <h1 className="mb-4 text-[clamp(2rem,4.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em] text-white drop-shadow-md md:bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] md:bg-clip-text md:text-transparent md:drop-shadow-none">
                Service Areas
              </h1>

              {/* Breadcrumb Navigation */}
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
                  <span className="font-bold text-[#0d1b2a] md:text-[#0d1b2a] text-white">
                    Service Areas
                  </span>
                </span>
              </nav>
            </motion.div>
          </div>
        </section>

        {/* ── Intro & Action Section ── */}
        <section className="container mx-auto px-4 max-w-5xl pt-10 pb-8 text-center">
         

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://maps.app.goo.gl/48Q7dQBbespuFhX27"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#005AA9] hover:bg-[#004785] px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition-all hover:scale-[1.02]"
            >
              <Navigation className="w-4 h-4" />
              Store Directions
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href="tel:4252263215"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-300 bg-white hover:bg-blue-50 px-6 py-3 text-sm font-bold text-slate-800 transition-all shadow-xs"
            >
              <Phone className="w-4 h-4 text-[#005AA9]" />
              425-226-3215
            </a>
          </div>
        </section>

        {/* ── City Grid Section (Rich Bluish Cards) ── */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Select Your Area
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Choose your city to view local pet and aquarium supplies, store directions, and information.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {SERVICE_AREAS.map((area) => (
                <Link
                  key={area.id}
                  href={`/service-areas/${area.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border-2 border-[#b9def8] bg-gradient-to-br from-[#dff0fb] via-[#eaf4fd] to-[#d2ecfa] p-6 shadow-xs hover:shadow-md hover:border-[#005AA9] hover:from-[#d5ebfa] hover:to-[#c3e4f7] transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#b2d9f7] flex items-center justify-center text-[#005AA9] shadow-xs group-hover:scale-105 transition-transform">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#005AA9] transition-colors">
                        {area.name}, {area.state}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed line-clamp-2 mt-1 font-normal">
                      {area.metaDescription}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-blue-200/80 flex items-center justify-between text-xs font-bold text-[#005AA9]">
                    <span>View {area.name} Page</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Store Info Banner ── */}
        <section className="py-10 bg-white/80 border-t border-blue-200/80 mt-6">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Visit Our Renton Showroom
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4">
              601 S Grady Way Suite M, Renton, WA 98057 • Open Monday - Saturday 11AM - 7PM, Sunday 11AM - 5PM
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-[#005AA9] hover:bg-[#004785] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Browse Online Store
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl border border-blue-300 bg-white hover:bg-blue-50 px-5 py-2.5 text-xs font-bold text-slate-800 transition-colors"
              >
                Aquarium Services
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
