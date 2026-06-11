import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Search,
  PenTool,
  Settings,
  LifeBuoy,
  ArrowRight,
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
  "aquarium-consulting-design",
  "custom-aquariums",
  "aquarium-installation",
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
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banner/service.png"
              alt={service.name}
              fill
              priority
              className="object-cover object-center filter brightness-[0.7]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#002244]/70 via-[#003d73]/30 to-[#005AA9]/20 z-10" />
          </div>

          <div className="container mx-auto px-6 max-w-6xl relative z-20">
            <div className="max-w-2xl text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#00aaff] bg-[#00aaff]/10 px-4 py-1.5 rounded-full select-none mb-6">
                🐠 {service.category} Services
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                {service.name}
              </h1>
              <p className="text-base md:text-lg text-blue-100/90 font-light leading-relaxed mb-8 max-w-xl">
                {service.description}
              </p>
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
          </div>

          {/* Wave transition to Our Process */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20 translate-y-[1px]">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px]">
              {/* Dark/Medium blue wave layer */}
              <path d="M0,50 C 250,110 500,20 750,80 C 950,120 1100,50 1200,40 L 1200,120 L 0,120 Z" fill="#005AA9" />
              {/* Light blue/white foreground wave layer */}
              <path d="M0,60 C 250,120 500,30 750,90 C 950,130 1100,60 1200,50 L 1200,120 L 0,120 Z" fill="#eaf5ff" />
            </svg>
          </div>
        </section>

        {/* ─── Our Process Section ─── */}
        <section className="relative py-20 bg-gradient-to-b from-[#eaf5ff] to-[#f4faff] text-slate-800 overflow-hidden border-b border-blue-100/50">
          
          {/* Seaweed & Bubbles SVG - Bottom-Left */}
          <div className="absolute bottom-0 left-0 z-0 pointer-events-none select-none w-48 h-64 opacity-60">
            <svg
              viewBox="0 0 200 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                d="M30 300 C50 220 20 150 40 80 C45 60 55 40 50 10 C45 40 35 60 30 80 C10 150 40 220 20 300 Z"
                fill="#b3dbff"
              />
              <path
                d="M70 300 C90 240 60 180 80 120 C85 100 95 80 90 40 C85 80 75 100 70 120 C50 180 80 240 60 300 Z"
                fill="#cce6ff"
              />
              <circle cx="50" cy="120" r="8" stroke="#99ccff" strokeWidth="1.5" />
              <circle cx="35" cy="180" r="5" stroke="#99ccff" strokeWidth="1.5" />
              <circle cx="85" cy="90" r="6" stroke="#99ccff" strokeWidth="1.5" />
              <circle cx="70" cy="210" r="10" stroke="#99ccff" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Seaweed & Bubbles SVG - Bottom-Right */}
          <div className="absolute bottom-0 right-0 z-0 pointer-events-none select-none w-48 h-64 opacity-60">
            <svg
              viewBox="0 0 200 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                d="M170 300 C150 220 180 150 160 80 C155 60 145 40 150 10 C155 40 165 60 170 80 C190 150 160 220 180 300 Z"
                fill="#b3dbff"
              />
              <path
                d="M130 300 C110 240 140 180 120 120 C115 100 105 80 110 40 C115 80 125 100 130 120 C150 180 120 240 140 300 Z"
                fill="#cce6ff"
              />
              <circle cx="150" cy="120" r="8" stroke="#99ccff" strokeWidth="1.5" />
              <circle cx="165" cy="180" r="5" stroke="#99ccff" strokeWidth="1.5" />
              <circle cx="115" cy="90" r="6" stroke="#99ccff" strokeWidth="1.5" />
              <circle cx="130" cy="210" r="10" stroke="#99ccff" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            {/* Title block with Swimming Fish Emojis */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#003d73] flex items-center justify-center gap-4">
                {/* Left Fish SVG */}
                <svg
                  width="36"
                  height="20"
                  viewBox="0 0 36 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#0073cc] fill-current"
                >
                  <path d="M0 10C3 6 8 2 15 2C24 2 28 8 32 10C28 12 24 18 15 18C8 18 3 14 0 10Z" />
                  <path d="M30 10L36 15V5L30 10Z" />
                  <circle cx="10" cy="8" r="1.5" fill="white" />
                </svg>

                Our Process

                {/* Right Fish SVG */}
                <svg
                  width="36"
                  height="20"
                  viewBox="0 0 36 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#0073cc] fill-current scale-x-[-1]"
                >
                  <path d="M0 10C3 6 8 2 15 2C24 2 28 8 32 10C28 12 24 18 15 18C8 18 3 14 0 10Z" />
                  <path d="M30 10L36 15V5L30 10Z" />
                  <circle cx="10" cy="8" r="1.5" fill="white" />
                </svg>
              </h2>
              <div className="w-16 h-1 bg-[#00aaff] mx-auto mt-4 rounded-full" />
            </div>

            {/* Steps Container */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-2">
              
              {/* Step 1: Consultation */}
              <div className="flex flex-col items-center text-center group max-w-[200px] flex-1">
                <div className="w-24 h-24 rounded-full bg-white shadow-lg shadow-blue-500/5 border border-blue-50/70 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-[#00aaff]/40 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#f4faff] flex items-center justify-center text-[#005AA9]">
                    <Calendar className="w-7 h-7" />
                  </div>
                </div>
                <h3 className="font-extrabold text-base text-[#003d73] mb-2">1. Consultation</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  We understand your vision, needs, and budget.
                </p>
              </div>

              {/* Connector 1 */}
              <div className="hidden lg:flex items-center justify-center text-[#0073cc]/30 h-24 self-start">
                <svg
                  width="48"
                  height="12"
                  viewBox="0 0 48 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current"
                >
                  <path d="M0 6H40" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4" />
                  <path d="M36 2L42 6L36 10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Step 2: Assessment */}
              <div className="flex flex-col items-center text-center group max-w-[200px] flex-1">
                <div className="w-24 h-24 rounded-full bg-white shadow-lg shadow-blue-500/5 border border-blue-50/70 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-[#00aaff]/40 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#f4faff] flex items-center justify-center text-[#005AA9]">
                    <Search className="w-7 h-7" />
                  </div>
                </div>
                <h3 className="font-extrabold text-base text-[#003d73] mb-2">2. Assessment</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  We evaluate the space and share expert recommendations.
                </p>
              </div>

              {/* Connector 2 */}
              <div className="hidden lg:flex items-center justify-center text-[#0073cc]/30 h-24 self-start">
                <svg
                  width="48"
                  height="12"
                  viewBox="0 0 48 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current"
                >
                  <path d="M0 6H40" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4" />
                  <path d="M36 2L42 6L36 10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Step 3: Design & Plan */}
              <div className="flex flex-col items-center text-center group max-w-[200px] flex-1">
                <div className="w-24 h-24 rounded-full bg-white shadow-lg shadow-blue-500/5 border border-blue-50/70 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-[#00aaff]/40 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#f4faff] flex items-center justify-center text-[#005AA9]">
                    <PenTool className="w-7 h-7" />
                  </div>
                </div>
                <h3 className="font-extrabold text-base text-[#003d73] mb-2">3. Design & Plan</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  We create a custom plan tailored just for you.
                </p>
              </div>

              {/* Connector 3 */}
              <div className="hidden lg:flex items-center justify-center text-[#0073cc]/30 h-24 self-start">
                <svg
                  width="48"
                  height="12"
                  viewBox="0 0 48 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current"
                >
                  <path d="M0 6H40" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4" />
                  <path d="M36 2L42 6L36 10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Step 4: Implementation */}
              <div className="flex flex-col items-center text-center group max-w-[200px] flex-1">
                <div className="w-24 h-24 rounded-full bg-white shadow-lg shadow-blue-500/5 border border-blue-50/70 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-[#00aaff]/40 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#f4faff] flex items-center justify-center text-[#005AA9]">
                    <Settings className="w-7 h-7" />
                  </div>
                </div>
                <h3 className="font-extrabold text-base text-[#003d73] mb-2">4. Implementation</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  We help with setup, installation, and fine-tuning.
                </p>
              </div>

              {/* Connector 4 */}
              <div className="hidden lg:flex items-center justify-center text-[#0073cc]/30 h-24 self-start">
                <svg
                  width="48"
                  height="12"
                  viewBox="0 0 48 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current"
                >
                  <path d="M0 6H40" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4" />
                  <path d="M36 2L42 6L36 10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Step 5: Ongoing Support */}
              <div className="flex flex-col items-center text-center group max-w-[200px] flex-1">
                <div className="w-24 h-24 rounded-full bg-white shadow-lg shadow-blue-500/5 border border-blue-50/70 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-[#00aaff]/40 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#f4faff] flex items-center justify-center text-[#005AA9]">
                    <LifeBuoy className="w-7 h-7" />
                  </div>
                </div>
                <h3 className="font-extrabold text-base text-[#003d73] mb-2">5. Ongoing Support</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  We're here to keep your aquarium thriving.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ─── Why Choose SierraFishPets Section ─── */}
        <section className="relative pt-28 pb-20 bg-[#001e3d] text-white overflow-hidden border-b border-[#002d5a]">
          
          {/* Wave transition from Our Process */}
          <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-20">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px]">
              {/* Blue wave layer */}
              <path d="M0,0 L0,60 C 200,120 450,40 700,90 C 950,140 1100,70 1200,60 L1200,0 Z" fill="#005AA9" />
              {/* Light blue foreground wave layer */}
              <path d="M0,0 L0,50 C 200,110 450,30 700,80 C 950,130 1100,60 1200,50 L1200,0 Z" fill="#f4faff" />
            </svg>
          </div>

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
