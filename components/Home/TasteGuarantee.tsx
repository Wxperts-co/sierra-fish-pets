"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";

const bounceVariants = {
  hidden: {
    opacity: 0,
    y: 120,
    scale: 0.92,
    transition: {
      type: "spring" as const,
      bounce: 0,
      duration: 0.5,
    },
  },
  visible: (isScrollingUp: boolean) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: isScrollingUp
      ? { duration: 0 }
      : {
          type: "spring" as const,
          bounce: 0.45,
          duration: 0.8,
        },
  }),
};

export default function TasteGuarantee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Independent state triggers for sequential bounce animation
  const [showBadge, setShowBadge] = useState(false);
  const [showHeading, setShowHeading] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  // Tracks entry direction to prevent animation when scrolling up
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const enteredFrom = useRef<"bottom" | "top">("bottom");

  // Monitor scroll progress to trigger elements one by one with hysteresis
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Detect entry boundary from top of screen (user scrolling back up)
    if (latest > 0.95) {
      enteredFrom.current = "top";
      setIsScrollingUp(true);
    }
    // Detect reset boundary below bottom of screen (user scrolled completely past/back to top)
    if (latest < 0.05) {
      enteredFrom.current = "bottom";
      setIsScrollingUp(false);
      setShowBadge(false);
      setShowHeading(false);
      setShowDesc(false);
      setShowBtn(false);
      return;
    }

    // Behavior when entering from bottom of the screen (scrolling down the page)
    if (enteredFrom.current === "bottom") {
      // Badge active range
      if (latest > 0.12 && latest < 0.80) {
        setShowBadge(true);
      } else if (latest < 0.08 || latest > 0.84) {
        setShowBadge(false);
      }

      // Heading active range
      if (latest > 0.20 && latest < 0.83) {
        setShowHeading(true);
      } else if (latest < 0.16 || latest > 0.87) {
        setShowHeading(false);
      }

      // Description active range
      if (latest > 0.28 && latest < 0.86) {
        setShowDesc(true);
      } else if (latest < 0.24 || latest > 0.90) {
        setShowDesc(false);
      }

      // Button active range
      if (latest > 0.36 && latest < 0.89) {
        setShowBtn(true);
      } else if (latest < 0.32 || latest > 0.93) {
        setShowBtn(false);
      }
    } else {
      // Behavior when entering from top of the screen (scrolling back up the page):
      // We want all elements to be visible instantly without showing a bounce animation.
      if (latest < 0.95) {
        setShowBadge(true);
        setShowHeading(true);
        setShowDesc(true);
        setShowBtn(true);
      }
    }
  });

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden">
      {/* ── BACKGROUND IMAGE (Mobile / desktop swap) ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none z-0 bg-cover bg-left-top bg-[url('/images/banner/cta-mobile.png')] sm:bg-[url('/images/banner/cta.png')]"
      />

      {/* ── CONTENT CONTAINER ── */}
      <div className=" relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column (Desktop Spacer - reserved for the cat in the background image) */}
          <div className="lg:col-span-6 xl:col-span-5 md:block hidden" />

          {/* Right Column: Content */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center text-center lg:pt-0 bg-white/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl lg:bg-transparent lg:p-0 lg:backdrop-blur-none lg:rounded-none shadow-xl shadow-slate-900/5 lg:shadow-none max-w-xl lg:max-w-none">
            {/* Taste Guarantee Badge */}
            <motion.div
              initial="hidden"
              animate={showBadge ? "visible" : "hidden"}
              custom={isScrollingUp}
              variants={bounceVariants}
              className="flex items-center gap-3 select-none text-slate-900"
            >
              <div className="relative w-36 shrink-0">
                <Image
                  src="/images/logo/tastelogo.png"
                  alt="Taste Guarantee"
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col justify-center text-center leading-[1.15]">
                <span className="text-2xl font-bold tracking-tight text-slate-800">
                  Taste
                </span>
                <span className="text-3xl font-black tracking-tight text-slate-900">
                  Guarantee
                </span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial="hidden"
              animate={showHeading ? "visible" : "hidden"}
              custom={isScrollingUp}
              variants={bounceVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-6 tracking-tight text-slate-900 max-w-2xl"
            >
              Taste it, love it or we&apos;ll replace it... Guaranteed!
            </motion.h2>

            {/* Description */}
            <motion.p
              initial="hidden"
              animate={showDesc ? "visible" : "hidden"}
              custom={isScrollingUp}
              variants={bounceVariants}
              className="text-slate-700 text-base sm:text-lg max-w-xl leading-relaxed mb-8 font-medium"
            >
              At Petio, we believe your dog and cat will love their food so much
              that if they don&apos;t... we&apos;ll help you find a replacement.
              That&apos;s our taste guarantee.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial="hidden"
              animate={showBtn ? "visible" : "hidden"}
              custom={isScrollingUp}
              variants={bounceVariants}
              className="w-full flex justify-center lg:justify-center"
            >
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 hover:bg-slate-50 font-semibold px-8 py-3.5 text-base tracking-wide border border-slate-200/50 shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Find out more
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
