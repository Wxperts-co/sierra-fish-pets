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
        <section className="relative py-32 md:py-40 text-white overflow-hidden">
          {/* Background Image with Premium Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banner/service.png"
              alt={service.name}
              fill
              priority
              className="object-cover object-center filter brightness-[0.8]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#002244]/95 via-[#003d73]/90 to-[#005AA9]/75 z-10" />
          </div>

          {/* Content Container */}
          <div className="container mx-auto px-6 max-w-6xl relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column - Main Details */}
              <div className="lg:col-span-7 text-white">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#00aaff] bg-[#00aaff]/10 px-4 py-1.5 rounded-full select-none mb-6">
                  <span>🐠</span>
                  <span>{service.category} Services</span>
                </span>

                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                  {service.name}
                </h1>

                <p className="text-base md:text-lg text-blue-100/90 font-light leading-relaxed mb-8 max-w-xl">
                  {service.description}
                </p>

                {/* Price block */}
                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4.5 rounded-2xl mb-8">
                  <div className="p-2.5 bg-[#00aaff]/20 rounded-xl">
                    <DollarSign className="w-5 h-5 text-[#00aaff]" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-blue-200 uppercase tracking-widest leading-none">
                      Investment
                    </span>
                    <span className="text-xl font-black text-white leading-none mt-1.5 block">
                      {service.price}
                    </span>
                  </div>
                </div>

                <div>
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center gap-2 bg-[#005AA9] hover:bg-[#004b8d] text-white px-8 py-4 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Book this Service
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Right Column - Features list inside Glassmorphic card */}
              <div className="lg:col-span-5">
                <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 text-white">
                  <h3 className="font-extrabold text-lg text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                    <span>✨</span> Key Features
                  </h3>

                  <ul className="flex flex-col gap-4.5">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3.5">
                        <CheckCircle2 className="w-5 h-5 text-[#00aaff] shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-100 leading-normal">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Wave transition to Why Choose */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20 translate-y-[1px]">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px] text-[#001e3d] fill-current">
              <path d="M0,60 C 200,100 400,20 600,60 C 800,100 1000,20 1200,60 L 1200,120 L 0,120 Z" className="opacity-20" />
              <path d="M0,80 C 150,40 350,120 600,80 C 850,40 1050,120 1200,80 L 1200,120 L 0,120 Z" className="opacity-40" />
              <path d="M0,90 C 300,130 600,70 900,110 C 1050,130 1150,100 1200,90 L 1200,120 L 0,120 Z" />
            </svg>
          </div>
        </section>

        {/* ─── Why Choose SierraFishPets Section ─── */}
        <section className="relative pt-20 pb-20 bg-[#001e3d] text-white overflow-hidden border-b border-[#002d5a]">
          
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            
            {/* Ornament Above Title */}
            <div className="flex items-center justify-center gap-3 mb-4 opacity-50">
              <div className="w-8 h-[1px] bg-blue-300" />
              <span className="text-blue-300 text-xs">✨</span>
              <div className="w-8 h-[1px] bg-blue-300" />
            </div>

            {/* Title block */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-4">
                Why Choose SierraFishPets?
              </h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center justify-center">
              
              {/* Card 1: Expert Team */}
              <div className="flex flex-col items-center p-4 lg:border-r lg:border-white/10 last:border-0">
                <div className="mb-5 text-[#00aaff] hover:scale-110 transition-transform duration-300">
                  <UserCheck className="w-10 h-10" strokeWidth={1.5} />
                </div>
                <h3 className="font-extrabold text-base mb-2">Expert Team</h3>
                <p className="text-xs text-blue-100/70 font-light leading-relaxed">
                  Experienced aquarists and designers you can trust.
                </p>
              </div>

              {/* Card 2: Tailored Solutions */}
              <div className="flex flex-col items-center p-4 lg:border-r lg:border-white/10 last:border-0">
                <div className="mb-5 text-[#00aaff] hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-10 h-10" strokeWidth={1.5} />
                </div>
                <h3 className="font-extrabold text-base mb-2">Tailored Solutions</h3>
                <p className="text-xs text-blue-100/70 font-light leading-relaxed">
                  Every aquarium is unique. We customize for your needs.
                </p>
              </div>

              {/* Card 3: Healthy & Sustainable */}
              <div className="flex flex-col items-center p-4 lg:border-r lg:border-white/10 last:border-0">
                <div className="mb-5 text-[#00aaff] hover:scale-110 transition-transform duration-300">
                  <Leaf className="w-10 h-10" strokeWidth={1.5} />
                </div>
                <h3 className="font-extrabold text-base mb-2">Healthy & Sustainable</h3>
                <p className="text-xs text-blue-100/70 font-light leading-relaxed">
                  We focus on long-term health for your aquatic life.
                </p>
              </div>

              {/* Card 4: Quality Assurance */}
              <div className="flex flex-col items-center p-4 lg:border-r lg:border-white/10 last:border-0">
                <div className="mb-5 text-[#00aaff] hover:scale-110 transition-transform duration-300">
                  <Award className="w-10 h-10" strokeWidth={1.5} />
                </div>
                <h3 className="font-extrabold text-base mb-2">Quality Assurance</h3>
                <p className="text-xs text-blue-100/70 font-light leading-relaxed">
                  Premium products and proven best practices.
                </p>
              </div>

              {/* Card 5: End-to-End Support */}
              <div className="flex flex-col items-center p-4">
                <div className="mb-5 text-[#00aaff] hover:scale-110 transition-transform duration-300">
                  <Handshake className="w-10 h-10" strokeWidth={1.5} />
                </div>
                <h3 className="font-extrabold text-base mb-2">End-to-End Support</h3>
                <p className="text-xs text-blue-100/70 font-light leading-relaxed">
                  From planning to maintenance, we've got you covered.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ─── Ready to Bring Your Aquarium Vision to Life? CTA Section ─── */}
        <section className="relative py-20 bg-[#001830] overflow-hidden">
          
          <div className="container mx-auto px-6 max-w-5xl relative z-10">
            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-[#eaf5ff] to-[#f4faff] border border-blue-100 p-10 md:p-16 text-slate-800 shadow-2xl">
              
              {/* Seaweed & Rocks - Bottom-Left of the Card */}
              <div className="absolute bottom-0 left-0 z-0 pointer-events-none select-none w-36 h-36 md:w-44 md:h-44 opacity-80">
                <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M0 150 L30 110 C45 115 55 125 65 120 L95 130 L120 150 Z" fill="#2d3748" />
                  <path d="M40 150 L65 122 C75 125 80 135 85 132 L105 150 Z" fill="#4a5568" />
                  <path d="M15 150 C25 100 5 60 18 25 C20 15 25 5 22 0 C24 15 28 25 28 35 C38 65 22 100 15 150 Z" fill="#10b981" />
                  <path d="M45 150 C55 115 38 80 48 50 C50 40 56 35 53 25 C55 35 58 40 58 45 C65 75 55 110 45 150 Z" fill="#059669" />
                  <path d="M30 150 C38 125 25 100 32 75 C34 68 38 65 36 58 C38 65 40 68 40 72 C45 92 38 120 30 150 Z" fill="#34d399" opacity="0.8" />
                </svg>
              </div>

              {/* Seaweed & Rocks - Bottom-Right of the Card */}
              <div className="absolute bottom-0 right-0 z-0 pointer-events-none select-none w-36 h-36 md:w-44 md:h-44 opacity-80">
                <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full scale-x-[-1]">
                  <path d="M0 150 L30 110 C45 115 55 125 65 120 L95 130 L120 150 Z" fill="#2d3748" />
                  <path d="M40 150 L65 122 C75 125 80 135 85 132 L105 150 Z" fill="#4a5568" />
                  <path d="M15 150 C25 100 5 60 18 25 C20 15 25 5 22 0 C24 15 28 25 28 35 C38 65 22 100 15 150 Z" fill="#10b981" />
                  <path d="M45 150 C55 115 38 80 48 50 C50 40 56 35 53 25 C55 35 58 40 58 45 C65 75 55 110 45 150 Z" fill="#059669" />
                </svg>
              </div>

              {/* Betta Fish SVG - Right of the Card (Hidden on mobile/tablet) */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none w-48 h-36 md:w-64 md:h-48 opacity-90 hidden lg:block">
                <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M120,85 C160,30 220,20 230,60 C240,100 210,130 225,165 C190,175 150,150 120,95 Z" fill="url(#betta-tail-grad-1)" opacity="0.85" />
                  <path d="M125,90 C170,50 205,40 215,75 C225,110 195,125 205,150 C180,158 150,138 125,98 Z" fill="url(#betta-tail-grad-2)" opacity="0.95" />
                  <path d="M75,65 C100,20 140,25 125,80 C95,60 85,65 75,65 Z" fill="url(#betta-dorsal-grad)" />
                  <path d="M85,95 C115,145 150,135 125,90 C95,95 85,95 85,95 Z" fill="url(#betta-ventral-grad)" />
                  <path d="M40,85 C55,65 95,60 125,85 C135,90 140,100 130,105 C110,115 80,110 50,95 C40,91 35,88 40,85 Z" fill="url(#betta-body-grad)" />
                  <path d="M65,92 C75,92 82,102 78,110 C74,118 66,102 65,92 Z" fill="#ff4d4d" opacity="0.9" />
                  <circle cx="55" cy="78" r="3.5" fill="white" />
                  <circle cx="55" cy="78" r="1.5" fill="#0c1a30" />
                  <defs>
                    <linearGradient id="betta-body-grad" x1="40" y1="85" x2="130" y2="105" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#00ccff" />
                      <stop offset="50%" stopColor="#005AA9" />
                      <stop offset="100%" stopColor="#001830" />
                    </linearGradient>
                    <linearGradient id="betta-tail-grad-1" x1="120" y1="30" x2="225" y2="165" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ff4d4d" />
                      <stop offset="50%" stopColor="#e53e3e" />
                      <stop offset="100%" stopColor="#9b2c2c" />
                    </linearGradient>
                    <linearGradient id="betta-tail-grad-2" x1="125" y1="40" x2="205" y2="150" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ff7a00" />
                      <stop offset="50%" stopColor="#ff3b30" />
                      <stop offset="100%" stopColor="#7f1d1d" />
                    </linearGradient>
                    <linearGradient id="betta-dorsal-grad" x1="75" y1="30" x2="125" y2="80" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ff4d4d" />
                      <stop offset="100%" stopColor="#005AA9" />
                    </linearGradient>
                    <linearGradient id="betta-ventral-grad" x1="85" y1="90" x2="150" y2="140" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#00ccff" />
                      <stop offset="100%" stopColor="#e53e3e" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Card Content */}
              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#003d73] mb-4">
                  Ready to Bring Your Aquarium Vision to Life?
                </h2>
                
                {/* Wavy lines subtitle */}
                <div className="flex items-center justify-center gap-3 mb-8">
                  <span className="text-[#00aaff] text-xs select-none">〰〰</span>
                  <p className="text-sm md:text-base text-slate-600 font-light">
                    Let's create something amazing together.
                  </p>
                  <span className="text-[#00aaff] text-xs select-none">〰〰</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/contact-us"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#005AA9] hover:bg-[#004b8d] text-white px-8 py-4 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/15 hover:scale-105 transition-all"
                  >
                    <Calendar className="w-5 h-5" />
                    Book a Consultation
                  </Link>
                  <Link
                    href="/contact-us"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-slate-100 text-[#005AA9] border-2 border-[#005AA9]/40 hover:border-[#005AA9] px-8 py-3.5 rounded-2xl text-base font-bold transition-all"
                  >
                    View Our Portfolio
                    <ArrowRight className="w-5 h-5" />
                  </Link>
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
