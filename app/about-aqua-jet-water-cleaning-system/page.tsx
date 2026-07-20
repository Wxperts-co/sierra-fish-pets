"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Droplets,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Info,
} from "lucide-react";

export default function AquaJetSystemPage() {
  const features = [
    {
      title: "Effortless Water Changes",
      desc: "Connects directly to your faucet to drain dirty aquarium water and refill with clean water in minutes without heavy buckets.",
    },
    {
      title: "Powerful Multi-Stage Filtration",
      desc: "Cleans debris, fish waste, and un-eaten food trapped in gravel while protecting your fish and live plants.",
    },
    {
      title: "Universal Faucet Adapter Included",
      desc: "Includes heavy-duty brass adapters that fit 99% of standard household faucets for instant plug-and-play operation.",
    },
    {
      title: "Flow-Control Valve & Switch",
      desc: "Adjust water pressure and suction speed instantly to safely clean nano tanks or large multi-hundred-gallon aquariums.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero Banner Section */}
      <section className="relative min-h-[480px] md:min-h-[450px] flex items-center  justify-center overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/services/s1.png"
            alt="Aqua Jet Water Cleaning System"
            fill
            priority
            className="object-cover object-center filter brightness-[0.7]"
            sizes="100vw"
          />
        </div>
        <div className="container mx-auto px-6 max-w-4xl relative z-20 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-white text-center">
            Aqua Jet Water <br />
            <span className="bg-gradient-to-r from-[#00aaff] via-cyan-300 to-sky-400 bg-clip-text text-transparent">
              Cleaning System
            </span>
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop?category=aquatic&subcategory=fish-tank-systems"
              className="inline-flex items-center gap-2.5 bg-[#005AA9] hover:bg-[#00407a] text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide shadow-lg shadow-[#005AA9]/30 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span>Shop Aqua Jet Systems &amp; Parts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-full font-bold text-sm border border-white/20 transition-all duration-300"
            >
              <span>Ask An Expert</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4">
              Why Choose The Aqua Jet System?
            </h2>
            <p className="text-slate-400 text-sm md:text-base font-light">
              Designed specifically for home aquarists and professional tank maintenance, the Aqua Jet system streamlines routine tank care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-[#00aaff]/40 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#00aaff]/10 border border-[#00aaff]/20 flex items-center justify-center text-[#00aaff] mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-300 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="py-16 bg-gradient-to-r from-[#002244] via-[#003d73] to-[#005AA9] text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready To Upgrade Your Aquarium Maintenance?
          </h2>
          <p className="text-blue-100/90 text-sm md:text-base font-light mb-8 max-w-xl mx-auto">
            Visit Sierra Fish &amp; Pets in Renton, WA or browse our online shop for Aqua Jet cleaning systems, extension hoses, and replacement parts.
          </p>
          <Link
            href="/shop?category=aquatic&subcategory=fish-tank-systems"
            className="inline-flex items-center gap-2 bg-white text-[#005AA9] hover:bg-blue-50 px-8 py-4 rounded-full font-bold text-sm shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <span>Browse Fish Tank Systems In Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
