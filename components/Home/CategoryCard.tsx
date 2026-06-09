"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

import categories from "@/data/categories.json";

const CATEGORY_BACKGROUNDS: Record<string, string> = {
  dog: "bg-[#FFF0ED]",
  cat: "bg-[#F6EFFF]",
  aquatic: "bg-[#EBF7FF]",
  reptile: "bg-[#EEFBF0]",
  bird: "bg-[#FFFBE5]",
  "small-animal": "bg-[#F5F5F7]",
};

const getInitialDirection = (index: number) => {
  const directions = [
    { x: 0, y: 150, opacity: 0, scale: 0.85 }, // Dog: bottom
    { x: 0, y: -150, opacity: 0, scale: 0.85 }, // Cat: top
    { x: -150, y: 0, opacity: 0, scale: 0.85 }, // Aquatic: left
    { x: 150, y: 0, opacity: 0, scale: 0.85 }, // Reptile: right
    { x: 120, y: 120, opacity: 0, scale: 0.85 }, // Bird: bottom-right
    { x: -120, y: 120, opacity: 0, scale: 0.85 }, // Small Animal: bottom-left
  ];
  return directions[index % directions.length];
};

const containerVariants = {
  hidden: {},
  visible: {},
};

const imageVariants = {
  hidden: (custom: { direction: any; index: number }) => ({
    x: custom.direction.x,
    y: custom.direction.y,
    opacity: 0,
    scale: 0.85,
  }),
  visible: (custom: { direction: any; index: number }) => ({
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.0,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: 0.15 + custom.index * 0.08,
    },
  }),
};

export default function CategoryCards() {
  return (
    <section className="pt-8 pb-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            <span className="text-[#005AA9]">Top</span> categories
          </h2>
        </motion.div>

        {/* Categories Grid (Two rows of three on mobile) */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const direction = getInitialDirection(index);
            return (
              <motion.div
                key={category.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={containerVariants}
                className="w-full"
              >
                <Link
                  href={`/shop/?category=${category.slug}`}
                  className="group flex flex-col items-center w-full"
                >
                  {/* Rounded Card with pastel BG — image fills the entire card */}
                  <div
                    className={`aspect-square w-full rounded-[2rem] relative overflow-hidden transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg ${
                      CATEGORY_BACKGROUNDS[category.slug] || "bg-slate-100"
                    }`}
                  >
                    {/* Animal Image — animates into view from a dynamic direction */}
                    <motion.div
                      custom={{ direction, index }}
                      variants={imageVariants}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />
                    </motion.div>

                    {/* Plus icon overlay on Hover */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                      <div className="w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300">
                        <Plus className="w-5 h-5 stroke-[3] text-slate-800" />
                      </div>
                    </div>
                  </div>

                  {/* Label Text below Card */}
                  <div className="mt-4 text-center">
                    <h3 className="text-[17px] font-bold text-slate-800 group-hover:text-[#005AA9] transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
