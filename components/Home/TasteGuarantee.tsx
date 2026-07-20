"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { ShieldCheck, RefreshCw, Heart, Sparkles, ArrowRight } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
    },
  },
};

export default function TasteGuarantee() {
  return (
    <section className="relative w-full overflow-hidden min-h-[540px] lg:min-h-[600px] flex items-center py-16 lg:py-24">
      {/* ── BACKGROUND IMAGE LAYER ── */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        {/* Mobile Background Image */}
        <div className="block lg:hidden absolute inset-0">
          <Image
            src="/images/banner/catdog2.png"
            alt="Sierra Fish & Pets Taste Guarantee Mobile Background"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Desktop Background Image */}
        <div className="hidden lg:block absolute inset-0">
          <Image
            src="/images/banner/catdog.png"
            alt="Sierra Fish & Pets Taste Guarantee Desktop Background"
            fill
            sizes="100vw"
            className="object-cover object-left md:object-left-center"
            priority
          />
        </div>
      </div>

      {/* ── CONTENT CONTAINER ── */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column Spacer (Reserved for Golden Retriever & Cat in background on desktop) */}
          <div className="lg:col-span-5 xl:col-span-6 hidden lg:block" />

          {/* Right Column: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-7 xl:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left bg-white/65 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none p-6 sm:p-8 lg:p-0 rounded-3xl border border-white/50 lg:border-none shadow-xl shadow-slate-900/5 lg:shadow-none"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-4">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#005AA9] text-white shadow-md shadow-[#005AA9]/20">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">
                  100% Taste Guarantee
                </span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4 tracking-tight"
            >
              Taste It, Love It, Or We&apos;ll Replace It... <span className="text-[#005AA9]">Guaranteed!</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 font-medium max-w-xl"
            >
              At <strong className="text-slate-900 font-bold">Sierra Fish &amp; Pets</strong>, we believe your dogs and cats should love every single meal. If your pet isn&apos;t 100% delighted with their food, bring it back and our team will help you exchange it for a formula they&apos;ll adore.
            </motion.p>

            {/* Feature Highlights */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl mb-8"
            >
              <div className="flex items-center justify-center lg:justify-start gap-2 bg-white/90 lg:bg-white/80 px-3.5 py-2.5 rounded-xl border border-slate-200/60 shadow-sm text-slate-800 text-xs sm:text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-[#005AA9] shrink-0" />
                <span>100% Risk-Free</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 bg-white/90 lg:bg-white/80 px-3.5 py-2.5 rounded-xl border border-slate-200/60 shadow-sm text-slate-800 text-xs sm:text-sm font-semibold">
                <RefreshCw className="w-4 h-4 text-[#005AA9] shrink-0" />
                <span>Easy Exchanges</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 bg-white/90 lg:bg-white/80 px-3.5 py-2.5 rounded-xl border border-slate-200/60 shadow-sm text-slate-800 text-xs sm:text-sm font-semibold">
                <Heart className="w-4 h-4 text-[#005AA9] shrink-0" />
                <span>Happy Pets</span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants} className="w-full sm:w-auto">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center md:gap-2.5 rounded-full bg-[#005AA9] text-white hover:bg-[#00407a] md:font-bold px-8 py-2 md:py-3.5 text-base tracking-wide shadow-lg shadow-[#005AA9]/25 transition-all duration-300 hover:scale-105 active:scale-95 group"
              >
                <span>Find Out More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


