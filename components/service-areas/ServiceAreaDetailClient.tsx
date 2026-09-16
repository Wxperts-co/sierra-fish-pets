"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  Fish,
  Dog,
  ShoppingBag,
  Sliders,
  Sparkles,
  ChevronDown,
  Navigation,
  Award,
  ExternalLink
} from "lucide-react";
import { ServiceArea, SERVICE_AREAS } from "@/data/serviceAreas";

interface ServiceAreaDetailClientProps {
  area: ServiceArea;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Fish: <Fish className="w-5 h-5 text-[#005AA9]" />,
  Dog: <Dog className="w-5 h-5 text-[#005AA9]" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5 text-[#005AA9]" />,
  Sliders: <Sliders className="w-5 h-5 text-[#005AA9]" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-[#005AA9]" />,
};

export default function ServiceAreaDetailClient({
  area,
}: ServiceAreaDetailClientProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const otherAreas = SERVICE_AREAS.filter((a) => a.id !== area.id);

  // Schema.org Structured Data
  const jsonLdLocalBusiness = {
    "@context": "https://schema.org",
    "@type": "PetStore",
    "name": "Sierra Fish & Pets",
    "image": "https://sierrafishandpets.com/images/logo/logo3.png",
    "@id": "https://sierrafishandpets.com/#store",
    "url": "https://sierrafishandpets.com",
    "telephone": "+14252263215",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "601 S Grady Way Suite M",
      "addressLocality": "Renton",
      "addressRegion": "WA",
      "postalCode": "98057",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 47.4722,
      "longitude": -122.2171
    },
    "areaServed": {
      "@type": "City",
      "name": `${area.name}, WA`
    }
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": area.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    `${area.name}, WA`
  )}&destination=601+S+Grady+Way+Suite+M,+Renton,+WA+98057`;

  return (
    <>
      {/* Structured Data Script Tags */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <main className="min-h-screen bg-[#edf6fc] text-slate-800 font-lato pb-16">
        {/* ─── HERO HEADER SECTION WITH STANDARD INTERNAL PAGE BREADCRUMB ─── */}
        <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
          {/* Image Background */}
          <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
            {/* Mobile image */}
            <Image
              src="/images/banner/shophero5.png"
              alt={`${area.name}, WA Pet Supplies`}
              fill
              priority
              className="object-cover object-[center_60%] block md:hidden"
              sizes="100vw"
            />
            {/* Desktop image */}
            <Image
              src="/images/banner/shophero3.png"
              alt={`${area.name}, WA Pet Supplies`}
              fill
              priority
              className="object-cover object-[center_40%] hidden md:block"
              sizes="100vw"
            />
          </div>

          {/* Mobile overlay */}
          <div className="absolute inset-0 z-[2] block md:hidden bg-[linear-gradient(to_bottom,rgba(0,30,70,0.62)_0%,rgba(0,30,70,0.35)_60%,rgba(0,30,70,0.10)_100%)]" />

          {/* Centered text & Breadcrumb */}
          <div className="absolute inset-x-0 top-0 z-[3] flex h-full flex-col items-center justify-center px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center max-w-3xl"
            >
              <h1 className="mb-4 text-[clamp(2rem,4.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em] text-white drop-shadow-md md:bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] md:bg-clip-text md:text-transparent md:drop-shadow-none">
                {area.name}, {area.state}
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
                  <Link
                    href="/service-areas"
                    className="text-white md:text-slate-500 transition-colors duration-150 hover:text-[#00aaff] hover:underline"
                  >
                    Service Areas
                  </Link>
                  <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
                </span>
                <span className="flex items-center gap-0.5">
                  <span className="font-bold text-[#0d1b2a] md:text-[#0d1b2a] text-white">
                    {area.name}, {area.state}
                  </span>
                </span>
              </nav>
            </motion.div>
          </div>
        </section>

        {/* ── Overview & Action Bar ─────────────────────────────── */}
        <section className="container mx-auto px-4 max-w-5xl pt-10 pb-8 text-center">
          

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#005AA9] hover:bg-[#004785] px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition-all hover:scale-[1.02]"
            >
              <Navigation className="w-4 h-4" />
              Get Directions
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href="tel:4252263215"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-300 bg-white hover:bg-blue-50 px-6 py-3 text-sm font-bold text-slate-800 transition-all shadow-xs"
            >
              <Phone className="w-4 h-4 text-[#005AA9]" />
              Call Store: 425-226-3215
            </a>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-300 bg-[#d8ecf9] hover:bg-[#cbe6f7] px-6 py-3 text-sm font-bold text-[#004b8d] transition-all shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-[#005AA9]" />
              Shop Online
            </Link>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-[#e4f2fc] px-4 py-2 text-xs font-medium text-slate-700 shadow-2xs">
            <MapPin className="w-4 h-4 text-[#005AA9]" />
            <span>Store Location: 601 S Grady Way Suite M, Renton, WA 98057 • Mon-Sat 11AM-7PM, Sun 11AM-5PM</span>
          </div>
        </section>

        {/* ── Featured Supplies & Services Categories (Rich Bluish Themed Cards) ── */}
        <section className="py-8">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-5xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Popular Supplies &amp; Services for {area.name} Pet Owners
              </h2>
             
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {area.popularCategories.map((cat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl border-2 border-[#b9def8] bg-gradient-to-br from-[#dff0fb] via-[#e9f4fc] to-[#d2ecfa] p-5 shadow-sm hover:shadow-md hover:border-[#005AA9] hover:from-[#d5ebfa] hover:to-[#c3e4f7] transition-all duration-200 group"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-[#b2d9f7] shadow-xs mb-3.5 group-hover:scale-105 transition-transform">
                      {ICON_MAP[cat.iconName] || <Sparkles className="w-5 h-5 text-[#005AA9]" />}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-[#005AA9] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      {cat.description}
                    </p>
                  </div>

                  <Link
                    href={cat.link}
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#005AA9] group-hover:underline"
                  >
                    View Products <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── Targeted Local Searches Section (Bluish Keyword Chips) ────── */}
        <section className="py-8 bg-[#edf6fc] border-b border-blue-200/80">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h3 className="text-sm font-bold text-slate-800">
              Popular Searches for {area.name}, {area.state}
            </h3>

            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {area.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="rounded-xl border border-blue-300 bg-[#dbeffc] hover:bg-[#cbe7fa] px-3.5 py-1.5 text-xs font-semibold text-[#003B73] shadow-2xs transition-colors"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Frequently Asked Questions (Bluish Accented Accordion) ── */}
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Frequently Asked Questions ({area.name}, WA)
              </h2>
            </div>

            <div className="space-y-3">
              {area.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border-2 border-blue-200/80 bg-gradient-to-r from-[#e4f3fc] via-white to-[#e8f5fd] overflow-hidden shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-4.5 text-left font-bold text-slate-900 hover:text-[#005AA9] transition-colors"
                    >
                      <span className="text-sm md:text-base pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#005AA9] shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-slate-700 leading-relaxed border-t border-blue-200/60 bg-white/60">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Other Nearby Service Areas (Bluish Buttons) ─────────── */}
        <section className="py-8 bg-white/80 border-t border-blue-200/80">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-5">
              <h3 className="text-base font-bold text-slate-900">
                Other Service Areas Across King County
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {otherAreas.map((other) => (
                <Link
                  key={other.id}
                  href={`/service-areas/${other.slug}`}
                  className="p-3 rounded-xl border border-blue-300/80 bg-[#dbeffc] hover:bg-[#cce6f8] hover:border-[#005AA9] transition-all text-center text-xs font-bold text-[#003B73] hover:text-[#005AA9] shadow-2xs"
                >
                  {other.name}, WA
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
