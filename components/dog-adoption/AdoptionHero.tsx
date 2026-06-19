"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, PawPrint, Award } from "lucide-react";

export default function AdoptionHero() {
  const [availableDogsCount, setAvailableDogsCount] = useState(0);

  useEffect(() => {
    fetch("/api/dogs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.dogs)) {
          setAvailableDogsCount(
            data.dogs.filter((d: any) => d.adoptionStatus === "available").length
          );
        }
      })
      .catch((err) => console.error("Failed to load dog count:", err));
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-[55vh] min-h-[480px] flex items-center overflow-hidden [clip-path:inset(0)]">
      {/* Background Image with Ken Burns effect and fixed position */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8 }}
        className="fixed inset-0 -z-20"
      >
        <Image
          src="/images/banner/dog-adoption.png"
          alt="Dog Adoption"
          fill
          priority
          className="object-cover object-center"
        />
      </motion.div>

      {/* Gradient Overlay matching Sierra brand theme - also fixed to match background */}
      <div className="fixed inset-0 bg-gradient-to-r from-[#002244]/95 via-[#002244]/80 to-[#003d73]/30 -z-10" />

      {/* Content */}
      <div className="relative z-20 w-full pt-28 pb-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
           

            {/* Sub-label */}
            <span className="block mb-2 text-[#00aaff] uppercase tracking-[0.3em] text-xs font-bold">
              Sierra Dog Adoption
            </span>

            {/* Main Title */}
            <h1 className="text-white font-extrabold leading-[1.05] text-4xl md:text-6xl mb-4 tracking-tight">
              Find Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#00aaff] drop-shadow-sm">
                Forever Friend
              </span>
            </h1>

          
            {/* CTA Buttons */}
         
            {/* Trust Badges / Dynamic Quick Stats */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00aaff]/10 border border-[#00aaff]/20 flex items-center justify-center text-[#00aaff] shrink-0">
                  <PawPrint className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base font-bold text-white leading-tight">
                    {availableDogsCount} Dogs
                  </div>
                  <div className="text-[10px] text-slate-400">Available now</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00aaff]/10 border border-[#00aaff]/20 flex items-center justify-center text-[#00aaff] shrink-0">
                  <Heart className="w-4 h-4 fill-[#00aaff]" />
                </div>
                <div>
                  <div className="text-base font-bold text-white leading-tight">
                    100% Loved
                  </div>
                  <div className="text-[10px] text-slate-400">Vet-checked & spayed</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 col-span-2 md:col-span-1">
                <div className="w-9 h-9 rounded-xl bg-[#00aaff]/10 border border-[#00aaff]/20 flex items-center justify-center text-[#00aaff] shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base font-bold text-white leading-tight">
                    Full Support
                  </div>
                  <div className="text-[10px] text-slate-400">Care counseling</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      {/* <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" /> */}
    </section>
  );
}