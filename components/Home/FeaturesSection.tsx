"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
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
            <IconComponent className="h-24 w-24 text-[#F97316]" strokeWidth={1.5} />
          )}
        </div>
      </motion.div>

      {/* Title */}
      <h3 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-slate-50">
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-slate-600 leading-relaxed dark:text-slate-400">
        {feature.description}
      </p>
    </motion.div>
  );
}

// ─── Main FeaturesSection Component ───────────────────────────────────────────
export default function FeaturesSection() {
  const features = featuresData as Feature[];

  if (!features.length) {
    return null;
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
      className="relative bg-white py-12 overflow-hidden dark:bg-slate-950 md:py-16"
    >
      {/* ─── Decorative Background Elements ─── */}
      

      {/* ─── Content Container ─── */}
      <div className="container relative z-10 mx-auto px-4">
        {/* ─── Top Icon ─── */}
        <motion.div
          variants={iconVariants}
          className="mb-8 flex justify-center"
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
        <motion.div variants={headingVariants} className="text-center mb-12">
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            <span className="text-[#F97316]">What your pet needs</span>
            <span className="text-slate-900 dark:text-slate-50">,
              when they need it.</span>
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
  );
}

