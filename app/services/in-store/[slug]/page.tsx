import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Calendar,
  UserCheck,
  ShieldCheck,
  Leaf,
  Award,
  Handshake,
} from "lucide-react";
import servicesData from "@/data/services.json";

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

const ALLOWED_SLUGS = [
  "aquarium-water-testing",
  "fish-of-month-club",
  "pet-nail-wing-trims",
];

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!ALLOWED_SLUGS.includes(slug)) {
    notFound();
  }

  const service = (servicesData as ServiceItem[]).find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <main className="min-h-screen bg-slate-950">
        {/* ─── Hero Banner Section ─── */}
        <section className="relative overflow-hidden w-full h-[380px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
          {/* Background Image with Premium Overlay (Fixed Parallax) */}
          <div className="fixed inset-x-0 top-0 w-full h-[380px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
            <Image
              src={service.image}
              alt={service.name}
              fill
              priority
              className="object-cover object-center filter brightness-[0.9]"
              sizes="100vw"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-br from-[#002244]/30 via-[#003d73]/70 to-[#005AA9]/20 z-10" /> */}
          </div>

          {/* Centered text block */}
          <div className="absolute inset-x-0 top-0 z-[3] flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="flex flex-col items-center justify-center max-w-4xl">
              <h1 className="text-3xl md:text-3xl lg:text-4xl font-black bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] bg-clip-text text-transparent tracking-tight leading-tight mb-6">
                {service.name}
              </h1>
              {/* Breadcrumb */}
              <nav
                aria-label="breadcrumb"
                className="flex flex-wrap items-center justify-center gap-0.5 text-sm font-medium text-slate-300 mb-4"
              >
                <span className="flex items-center gap-0.5">
                  <Link
                    href="/"
                    className="text-slate-300 transition-colors duration-150 hover:text-[#00aaff] hover:underline"
                  >
                    Home
                  </Link>
                  <span className="px-0.5 text-slate-400"> › </span>
                </span>
                <span className="flex items-center gap-0.5">
                  <Link
                    href="/services"
                    className="text-slate-300 transition-colors duration-150 hover:text-[#00aaff] hover:underline"
                  >
                    Services
                  </Link>
                  <span className="px-0.5 text-slate-400"> › </span>
                </span>
                <span className="flex items-center gap-0.5">
                  <span className="font-bold text-white">{service.name}</span>
                </span>
              </nav>

              

              <div className="">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 bg-[#005AA9] hover:bg-[#004b8d] text-white mt-2 px-8 py-3 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Book this Service
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Service Description & Details Section ─── */}
        <section className="relative py-16 md:py-24 bg-[#001e3d]/90 text-white border-b border-slate-900">
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column - Detailed Description */}
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00aaff] bg-[#00aaff]/10 px-3.5 py-1.5 rounded-full select-none">
                  Overview
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  About {service.name}
                </h2>
                <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed">
                  {service.description}
                </p>
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>
              </div>

              {/* Right Column - Service Details & Features Card */}
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <div className="backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-3xl p-8 shadow-xl shadow-blue-500/5 relative overflow-hidden group hover:border-[#00aaff]/30 transition-all duration-300">
                  {/* Decorative glowing gradient */}
                  <div className="absolute -right-24 -top-24 w-48 h-48 bg-[#00aaff]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00aaff]/15 transition-all duration-500" />
                  
                  <h3 className="font-extrabold text-lg text-white mb-6 border-b border-white/10 pb-4">
                    Service Summary
                  </h3>

                  <div className="space-y-6">
                    {/* Price Info */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-400">Pricing:</span>
                      <span className="text-lg font-bold text-[#00aaff] bg-blue-500/10 px-3 py-1 rounded-xl">
                        {service.price}
                      </span>
                    </div>

                    {/* Features List */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-300 mb-4">Key Benefits & Features:</h4>
                      <ul className="space-y-3">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-slate-200">
                            <CheckCircle2 className="w-5 h-5 text-[#00aaff] shrink-0 mt-0.5" />
                            <span className="leading-relaxed font-light">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      
      </main>
    </>
  );
}

// Generate static params for Next.js compile step
export async function generateStaticParams() {
  return ALLOWED_SLUGS.map((slug) => ({
    slug,
  }));
}
