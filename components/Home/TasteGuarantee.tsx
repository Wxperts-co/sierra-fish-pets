"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function TasteGuarantee() {
  return (
    <section className="relative w-full overflow-hidden bg-[#cfecf4]">
      {/* ── BACKGROUND IMAGE (Contains the wave background, grey top area, and the cat) ── */}
      <Image
        src="/images/banner/cta.png"
        alt="Taste Guarantee Banner Background"
        fill
        sizes="100vw"
        className="object-cover object-left-top pointer-events-none select-none z-0"
        priority
      />

      {/* ── CONTENT CONTAINER ── */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column (Desktop Spacer - reserved for the cat in the background image) */}
          <div className="lg:col-span-6 xl:col-span-5 md:block hidden" />

          {/* Right Column: Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={contentVariants}
            className="lg:col-span-6 xl:col-span-7 flex flex-col items-start text-left pt-6 lg:pt-0 bg-white/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl lg:bg-transparent lg:p-0 lg:backdrop-blur-none lg:rounded-none shadow-xl shadow-slate-900/5 lg:shadow-none max-w-xl lg:max-w-none mx-0"
          >
            {/* Taste Guarantee Badge */}
            <div className="flex items-center gap-3.5 mb-6 select-none text-slate-900">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-[3.5px] border-slate-900 text-slate-900 shrink-0">
                <svg
                  viewBox="0 0 64 64"
                  className="h-8 w-8 fill-none stroke-current"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 34 C 22 24, 42 24, 42 34 Z" fill="currentColor" />
                  <path d="M14 46 L50 46 L46 34 L18 34 Z" fill="currentColor" />
                  <ellipse cx="32" cy="40" rx="5" ry="1.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
                </svg>
              </div>
              <div className="flex flex-col justify-center text-left leading-[1.15]">
                <span className="text-lg font-bold tracking-tight text-slate-800">Taste</span>
                <span className="text-2xl font-black tracking-tight text-slate-900">Guarantee</span>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-6 tracking-tight text-slate-900 max-w-2xl">
              Taste it, love it or we&apos;ll replace it... Guaranteed!
            </h2>

            {/* Description */}
            <p className="text-slate-700 text-base sm:text-lg max-w-xl leading-relaxed mb-8 font-medium">
              At Petio, we believe your dog and cat will love their food so much that if they don&apos;t... we&apos;ll help you find a replacement. That&apos;s our taste guarantee.
            </p>

            {/* CTA Button */}
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 hover:bg-slate-50 font-semibold px-8 py-3.5 text-base tracking-wide border border-slate-200/50 shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
            >
              find out more
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
