import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Paintbrush,
  Droplets,
  Sparkles,
  Fish,
  Scissors,
  Store,
  HeartHandshake,
  Wrench,
} from "lucide-react";
import servicesData from "@/data/services.json";

export const metadata: Metadata = {
  title: "Professional Pet & Aquarium Services | Sierra Fish & Pets",
  description:
    "Explore Sierra Fish & Pets professional services including custom aquarium design, installation, water testing, pet nail & wing trims, and adoption events in Renton, WA.",
  alternates: {
    canonical: "https://www.sierrafishandpets.com/services",
  },
};

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  price: string;
  features: string[];
}

const CATEGORY_MAP: Record<string, { parent: string; icon: React.ReactNode }> = {
  "about-aqua-jet-water-cleaning-system": {
    parent: "aquarium",
    icon: <Droplets className="w-5 h-5 text-[#005AA9]" />,
  },
  "aquarium-consulting-design": {
    parent: "aquarium",
    icon: <Sparkles className="w-5 h-5 text-[#005AA9]" />,
  },
  "custom-aquariums": {
    parent: "aquarium",
    icon: <Paintbrush className="w-5 h-5 text-[#005AA9]" />,
  },
  "aquarium-installation": {
    parent: "aquarium",
    icon: <Wrench className="w-5 h-5 text-[#005AA9]" />,
  },
  "aquarium-water-testing": {
    parent: "in-store",
    icon: <Droplets className="w-5 h-5 text-[#005AA9]" />,
  },
  "fish-of-month-club": {
    parent: "in-store",
    icon: <Fish className="w-5 h-5 text-[#005AA9]" />,
  },
  "pet-nail-wing-trims": {
    parent: "in-store",
    icon: <Scissors className="w-5 h-5 text-[#005AA9]" />,
  },
  "store-tours": {
    parent: "in-store",
    icon: <Store className="w-5 h-5 text-[#005AA9]" />,
  },
  "dog-adoption-events": {
    parent: "dog-adoption",
    icon: <HeartHandshake className="w-5 h-5 text-[#005AA9]" />,
  },
};

const SERVICE_GROUPS = [
  {
    title: "Aquarium Services",
    description: "Bespoke consultations, custom designs, water cleaning systems, and professional installations.",
    slug: "aquarium",
    slugs: [
      "about-aqua-jet-water-cleaning-system",
      "aquarium-consulting-design",
      "custom-aquariums",
      "aquarium-installation",
    ],
  },
  {
    title: "In-Store Services",
    description: "Water quality testing, monthly membership programs, store tours, and quick grooming trims.",
    slug: "in-store",
    slugs: [
      "aquarium-water-testing",
      "fish-of-month-club",
      "pet-nail-wing-trims",
      "store-tours",
    ],
  },
  {
    title: "Dog Adoption Events",
    description: "Meet adoptable dogs from our partner rescue groups and find your new family member.",
    slug: "dog-adoption",
    slugs: ["dog-adoption-events"],
  },
];

export default function ServicesPage() {
  const services = servicesData as ServiceItem[];

  return (
    <main className="relative text-slate-800 min-h-screen overflow-x-hidden bg-white">
      {/* ─── HERO HEADER SECTION ─── */}
      <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
        {/* Image — clipped to banner bounds */}
        <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
          {/* Mobile image */}
          <Image
            src="/images/banner/shophero5.png"
            alt="Services banner"
            fill
            priority
            className="object-cover object-[center_60%] block md:hidden"
            sizes="100vw"
          />
          {/* Desktop image */}
          <Image
            src="/images/banner/shophero3.png"
            alt="Services banner"
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
          <div className="flex flex-col items-center justify-center max-w-3xl">
            <h1 className="mb-4 text-[clamp(2rem,4.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em] text-white drop-shadow-md md:bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] md:bg-clip-text md:text-transparent md:drop-shadow-none">
              Our Services
            </h1>

            {/* Breadcrumb */}
            <nav
              aria-label="breadcrumb"
              className="flex flex-wrap items-center justify-center gap-0.5 text-sm font-medium text-white drop-shadow-md md:text-slate-500 md:drop-shadow-none"
            >
              <span className="flex items-center gap-0.5">
                <Link
                  href="/"
                  className="text-white md:text-slate-500 transition-colors duration-150 hover:text-teal-600 hover:underline"
                >
                  Home
                </Link>
                <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
              </span>
              <span className="flex items-center gap-0.5">
                <span className="font-bold text-[#0d1b2a] md:text-[#0d1b2a] text-white">Services</span>
              </span>
            </nav>
          </div>
        </div>
      </section>

      {/* ── Intro Section ── */}
      <section className="container mx-auto px-6 max-w-5xl pt-10 pb-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-[#edf6fc] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#005AA9] mb-4 shadow-2xs">
          <span>Expert Pet &amp; Aquatic Care</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
          Professional Services Tailored to Your Pets
        </h2>
        <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          From custom aquarium design and water chemistry diagnostics to pet nail trimming and adoption events—we bring decades of trusted Pacific Northwest expertise to every service.
        </p>
      </section>

      {/* ── Services Grouping Section (Light Theme + Rich Bluish Cards) ── */}
      <section className="py-8 md:pt-12">
        <div className="container mx-auto px-6 max-w-6xl">
          {SERVICE_GROUPS.map((group, groupIdx) => {
            const groupServices = services.filter((s) => group.slugs.includes(s.slug));

            return (
              <div
                key={group.slug}
                className={`mb-14 md:mb-20 ${groupIdx > 0 ? "pt-12 border-t border-blue-100" : ""}`}
              >
                <div className="max-w-2xl mb-8">
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2 text-[#002244]">
                    {group.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 font-normal">
                    {group.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {groupServices.map((service) => {
                    const mapping = CATEGORY_MAP[service.slug];
                    const detailUrl =
                      service.slug === "about-aqua-jet-water-cleaning-system"
                        ? "/about-aqua-jet-water-cleaning-system"
                        : `/services/${mapping?.parent || "consulting"}/${service.slug}`;

                    return (
                      <div
                        key={service.id}
                        className="flex flex-col justify-between rounded-2xl border-2 border-[#b9def8] bg-gradient-to-br from-[#ebf5fc] via-[#f4f9fd] to-[#e4f2fb] p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-[#005AA9] transition-all duration-300 hover:-translate-y-1 group"
                      >
                        <div>
                          {/* Service Header Info */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#b9def8] shadow-xs group-hover:scale-105 transition-transform">
                              {mapping?.icon || <ShieldCheck className="w-4.5 h-4.5 text-[#005AA9]" />}
                            </div>
                            <span className="text-[10.5px] font-bold text-[#005AA9] bg-white border border-[#b9def8] px-2.5 py-0.5 rounded-full shadow-2xs">
                              {service.price}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-base sm:text-lg text-[#002244] mb-1.5 tracking-tight group-hover:text-[#005AA9] transition-colors">
                            {service.name}
                          </h4>

                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3.5">
                            {service.shortDescription}
                          </p>

                          {/* Features list snapshot */}
                          <ul className="flex flex-col gap-1.5 mb-4">
                            {service.features.slice(0, 3).map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#005AA9] shrink-0 mt-0.5" />
                                <span className="text-xs font-medium text-slate-700 leading-normal line-clamp-1">
                                  {feat}
                                </span>
                              </li>
                            ))}
                            {service.features.length > 3 && (
                              <li className="text-[11px] font-bold text-[#005AA9] pl-5">
                                + {service.features.length - 3} more key features
                              </li>
                            )}
                          </ul>
                        </div>

                        <div>
                          <Link
                            href={detailUrl}
                            className="w-full inline-flex items-center justify-center gap-1.5 bg-[#005AA9] hover:bg-[#004785] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-900/10 transition-all duration-200 group-hover:shadow-lg active:scale-98 cursor-pointer"
                          >
                            <span>Learn Details</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
