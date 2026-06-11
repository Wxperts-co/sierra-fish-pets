"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface BrandHeroProps {
  title: string;
  subtitle: string;
  image?: string;
}

export default function BrandHero({
  title,
  subtitle,
  image = "/images/banner/contact.png",
}: BrandHeroProps) {
  return (
    <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">

      <Image
        src={image}
        alt={title}
        fill
        priority
        className=" object-cover object-center"
      />
      </div>

      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-[#002244]/20 via-[#003d73]/75 to-[#005AA9]/50" /> */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-28 h-full flex items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
      

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-5">
            {title}
          </h1>

          <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}