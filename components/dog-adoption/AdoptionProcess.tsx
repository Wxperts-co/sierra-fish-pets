"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AdoptionProcess() {
  const steps = [
    {
      step: 1,
      title: "Browse Dogs",
      description: "Explore our adorable dogs looking for loving homes.",
      image: "/images/logo/d1.png",
    },
    {
      step: 2,
      title: "Submit Application",
      description: "Fill out our easy adoption application form online.",
      image: "/images/logo/d4.png",
    },
    {
      step: 3,
      title: "Meet & Greet",
      description: "Meet your potential new family member and spend time together.",
      image: "/images/logo/d2.png",
    },
    {
      step: 4,
      title: "Take Home",
      description: "Complete the adoption and take your new best friend home!",
      image: "/images/logo/d3.png",
    },
  ];

  return (
    <section className="relative py-24 bg-white text-slate-800 overflow-hidden border-b border-slate-100">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* Title Block */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#003d73] mb-3"
          >
            The Adoption Process
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-500 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed"
          >
            We make it simple and stress-free to bring home your new best friend.
          </motion.p>
        </div>

        {/* Steps Container */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-2 max-w-5xl mx-auto">
          {steps.map((item, idx) => (
            <React.Fragment key={item.step}>
              {/* Step item */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="flex flex-col items-center text-center group flex-1 max-w-[220px]"
              >
                {/* Logo Wrapper */}
                <div className="relative mb-8">
                  {/* Circular White Container with Soft Premium Shadow */}
                  <div className="w-28 h-28 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:scale-105 group-hover:border-slate-200 group-hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="object-contain w-16 h-16"
                    />
                  </div>

                  {/* Overlapping Number Badge */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-7 h-7 bg-[#005AA9] rounded-full text-white text-xs font-extrabold flex items-center justify-center border-2 border-white shadow-md group-hover:bg-[#00aaff] transition-colors duration-300">
                    {item.step}
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="font-extrabold text-lg text-[#003d73] mb-3 mt-2">
                  {item.title}
                </h3>

                {/* Step Description */}
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[190px]">
                  {item.description}
                </p>
              </motion.div>

              {/* Arrow Connector between steps */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center text-[#005AA9]/40 h-28 self-start select-none pt-2">
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

