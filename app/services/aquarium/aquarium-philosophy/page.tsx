import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  UserCheck,
  ShieldCheck,
  Leaf,
  Award,
  Handshake,
  HeartHandshake,
  Calendar,
} from "lucide-react";

export const metadata = {
  title: "Aquarium Philosophy | Sierra Fish & Pets",
  description: "Learn about our aquatic philosophy and mission at Sierra Fish & Pets.",
};

export default function AquariumPhilosophyPage() {
  return (
    <>
      <main className="min-h-screen bg-slate-950">
        
        {/* ─── Hero Banner Section ─── */}
        <section className="relative py-28 md:py-36 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banner/service.png"
              alt="Aquarium Philosophy"
              fill
              priority
              className="object-cover object-center filter brightness-[0.7]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#002244]/70 via-[#003d73]/30 to-[#005AA9]/20 z-10" />
          </div>

          <div className="container mx-auto px-6 max-w-6xl relative z-20">
            <div className="max-w-3xl text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#00aaff] bg-[#00aaff]/10 px-4 py-1.5 rounded-full select-none mb-6">
                🐠 Aquarium Services
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-8">
                Aquarium Philosophy
              </h1>
              <div>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 bg-[#005AA9] hover:bg-[#004b8d] text-white px-8 py-4 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Contact Our Experts
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Wave transition to Content Section */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20 translate-y-[1px]">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px] md:h-[60px]">
              {/* Dark/Medium blue wave layer */}
              <path d="M0,50 C 250,110 500,20 750,80 C 950,120 1100,50 1200,40 L 1200,120 L 0,120 Z" fill="#005AA9" />
              {/* Light blue/white foreground wave layer */}
              <path d="M0,60 C 250,120 500,30 750,90 C 950,130 1100,60 1200,50 L 1200,120 L 0,120 Z" fill="#eaf5ff" />
            </svg>
          </div>
        </section>

        {/* ─── Content Section (Philosophy Description & Mission) ─── */}
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

          <div className="container mx-auto px-6 max-w-4xl relative z-10">
            
            {/* Description Card (Placed After Hero Section) */}
            <div className="relative p-8 md:p-10 rounded-3xl bg-white shadow-xl shadow-blue-900/5 border border-blue-100/80 mb-16 text-slate-700 leading-relaxed text-base md:text-lg">
              <p>
                We are dedicated to provide you with the expert advice, quality service, and best selection of aquatic supplies and livestock at everyday low prices. We have all the fish tanks, lighting, aquascape, filtration, foods and aquatic supplies you need to create a thriving salt water or fresh water aquarium in your home or office. If you want to maintain your own aquarium or would like the one of our aquarium experts help design, install, and service it for you, SF&P is your full aquarium service store. Serving Renton, Kent, Newcastle, Covington, Tukwila, SeaTac, Faiwwood, Maple Valley, Bellevue, and the Seattle metro area come in today to see what expertise and passion can do for your aquascape.
              </p>
            </div>

            {/* Title block with Swimming Fish Emojis */}
            <div className="text-center mb-12">
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

                Our Aquatic Mission

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

            {/* Mission Box */}
            <div className="relative p-8 md:p-12 rounded-3xl bg-white shadow-xl shadow-blue-900/5 border border-blue-100/80 text-center max-w-3xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#f4faff] border border-blue-100 flex items-center justify-center text-[#005AA9] mx-auto mb-6">
                <HeartHandshake className="w-7 h-7" />
              </div>
              
              <blockquote className="text-base md:text-xl text-[#003d73] font-medium leading-relaxed italic">
                &ldquo;Make it easier and more enjoyable for our clientele to create a thriving aquatic environment while being respectful and conscious of the need to protect and conserve our natural resources. To always support and contribute in successful propagation and breeding efforts to better sustain our hobby. Sierra Fish & Pets goal is to not only allow your livestock to survive in captivity, but to thrive in captivity.&rdquo;
              </blockquote>
            </div>

          </div>
        </section>

        {/* ─── Why Choose SierraFishPets Section ─── */}
        <section className="relative pt-28 pb-20 bg-[#001e3d] text-white overflow-hidden border-b border-[#002d5a]">
          
          {/* Wave transition from Our Aquatic Mission */}
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

     

      </main>
    </>
  );
}
