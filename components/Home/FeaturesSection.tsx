"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Fish,
  Truck,
  Heart,
  Wrench,
  Lightbulb,
  Star,
  Shield,
  Zap,
  Award,
  Smile,
  Leaf,
  Clock,
  LucideIcon,
} from "lucide-react";
import featuresData from "@/data/features.json";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// ─── Icon Mapping ─────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  Fish,
  Truck,
  Heart,
  Wrench,
  Lightbulb,
  Star,
  Shield,
  Zap,
  Award,
  Smile,
  Leaf,
  Clock,
};

// ─── Animation Variants ───────────────────────────────────────────────────────
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const iconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const featuresContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const featureCardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// ─── Feature Card Component ───────────────────────────────────────────────────
function FeatureCard({ feature }: { feature: Feature }) {
  const IconComponent = ICON_MAP[feature.icon] || Heart;
  const isImageIcon = /\.(png|jpe?g|webp|avif|svg)$/i.test(feature.icon);

  return (
    <motion.div
      variants={featureCardVariants}
      className="flex flex-col items-center text-center"
    >
      {/* Icon */}
      <motion.div
        variants={iconVariants}
        whileHover={{
          x: [0, -10, 10, -8, 8, 0],
          transition: { duration: 0.7, ease: "easeInOut" },
        }}
        className="mb-4"
      >
        <div className="flex items-center justify-center">
          {isImageIcon ? (
            <Image
              src={feature.icon}
              alt={`${feature.title} icon`}
              width={128}
              height={128}
              className="h-28 w-28 object-contain"
            />
          ) : (
            <IconComponent
              className="h-24 w-24 text-[#005AA9]"
              strokeWidth={1.5}
            />
          )}
        </div>
      </motion.div>

      {/* Title */}
      <h3 className="mb-3 text-2xl font-semibold text-slate-900">
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-slate-600 leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}

const SPOTLIGHT_ITEMS = [
  {
    image: "/images/categories/bird-toy.avif",
    label: "Popular",
    title: "Special offer",
    href: "/shop/bird/toys",
  },
  {
    image: "/images/categories/catfood.avif",
    label: "Don't Miss",
    title: "Top Rated",
    href: "/shop/cat/cat-food",
  },
  {
    image: "/images/categories/aquaticcategory.avif",
    label: "Trending",
    title: "Min. 30% Off",
    href: "/shop/aquatic",
  },
  {
    image: "/images/categories/reptilecategory.avif",
    label: "Popular",
    title: "Special offer",
    href: "/shop/reptile",
  },
];

// ─── Main FeaturesSection Component ───────────────────────────────────────────
export default function FeaturesSection() {
  const features = featuresData as Feature[];
  const sectionRef = useRef<HTMLElement>(null);

  // Track scroll position of the features section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Map the scroll progress to a 360-degree rotation
  const rotateValue = useTransform(scrollYProgress, [0, 1], [0, 360]);
  
  // Apply physics-based spring smoothing to make the rotation feel premium and fluid
  const smoothRotate = useSpring(rotateValue, {
    stiffness: 90,
    damping: 30,
    mass: 0.2,
    restDelta: 0.001,
  });

  if (!features.length) {
    return null;
  }

  return (
    <>
      {/* Desktop view — original layout */}
      <motion.section
        ref={sectionRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="relative bg-white py-12 overflow-hidden md:py-16 hidden md:block"
      >
        {/* ─── Content Container ─── */}
        <div className="container relative z-10 mx-auto px-4">
          {/* ─── Top Icon ─── */}
          <motion.div
            variants={iconVariants}
            style={{ rotate: smoothRotate }}
            className="mb-4 flex justify-center"
          >
            <Image
              src="/images/logo/dogicon.png"
              alt="Dog icon"
              width={130}
              height={130}
              className="h-28 w-28 object-contain md:h-32 md:w-32"
            />
          </motion.div>

          {/* ─── Main Heading ─── */}
          <motion.div variants={headingVariants} className="text-center">
            <h2 className="text-4xl font-bold leading-tight md:text-5xl">
              <span className="text-[#005AA9]">What your pet needs</span>
              <span className="text-slate-900">, when they need it.</span>
            </h2>
          </motion.div>

          {/* ─── Features Grid ─── */}
          <motion.div
            variants={featuresContainerVariants}
            className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Mobile view — "Spotlight's on" layout */}
      <div className="block md:hidden px-4 py-8 bg-white">
        <div className="bg-[#a7d7f8] rounded-[28px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
          {/* Section Header */}
          <h2 className="text-xl font-black text-slate-900 mb-4 tracking-tight">
            Spotlight's on
          </h2>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {SPOTLIGHT_ITEMS.map((item, idx) => (
              <Link key={idx} href={item.href} className="flex flex-col group">
                {/* Image Card */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#f8f9fa] flex items-center justify-center p-3 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-slate-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain  group-hover:scale-105 transition-transform duration-300"
                    sizes="50vw"
                  />
                </div>

                {/* Info */}
                <span className="text-[11px] font-bold text-slate-500 mt-2">
                  {item.label}
                </span>
                <span className="text-sm font-black text-slate-900 leading-snug mt-0.5">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
