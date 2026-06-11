"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, PawPrint, Award } from "lucide-react";
import dogsData from "@/data/dog-adoption.json";

export default function AdoptionHero() {
  const availableDogsCount = dogsData.filter(
    (dog) => dog.adoptionStatus === "available"
  ).length;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
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
      <div className="relative z-20 w-full pt-20 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00aaff]/30 bg-[#00aaff]/10 backdrop-blur-md text-[#00aaff] text-xs font-semibold mb-6 select-none w-fit">
              <Heart className="w-3.5 h-3.5 fill-[#00aaff]" />
              <span>Find Your Perfect Match</span>
            </div>

            {/* Sub-label */}
            <span className="block mb-3 text-[#00aaff] uppercase tracking-[0.3em] text-xs font-bold">
              Sierra Dog Adoption
            </span>

            {/* Main Title */}
            <h1 className="text-white font-extrabold leading-[1.05] text-5xl md:text-7xl xl:text-8xl mb-6 tracking-tight">
              Find Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#00aaff] drop-shadow-sm">
                Forever Friend
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-slate-200 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
              Give a loving dog a forever home and discover a loyal companion
              waiting to share life&apos;s adventures with you. Every adoption
              includes full vaccinations, health screening, and counselor support.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection("dogs")}
                className="group inline-flex items-center justify-center gap-2 bg-[#005AA9] hover:bg-[#004b8d] text-white px-8 py-4 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
              >
                <span>View Available Dogs</span>
                <PawPrint className="w-5 h-5 text-white transition-transform group-hover:rotate-12" />
              </button>

              <button
                onClick={() => scrollToSection("process")}
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 backdrop-blur-md bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl text-base font-bold hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
              >
                <span>Adoption Process</span>
              </button>
            </div>

            {/* Trust Badges / Dynamic Quick Stats */}
            <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00aaff]/10 border border-[#00aaff]/20 flex items-center justify-center text-[#00aaff]">
                  <PawPrint className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg md:text-xl font-bold text-white leading-tight">
                    {availableDogsCount} Dogs
                  </div>
                  <div className="text-xs text-slate-400">Available now</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00aaff]/10 border border-[#00aaff]/20 flex items-center justify-center text-[#00aaff]">
                  <Heart className="w-5 h-5 fill-[#00aaff]" />
                </div>
                <div>
                  <div className="text-lg md:text-xl font-bold text-white leading-tight">
                    100% Loved
                  </div>
                  <div className="text-xs text-slate-400">Vet-checked & spayed</div>
                </div>
              </div>

              <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                <div className="w-10 h-10 rounded-xl bg-[#00aaff]/10 border border-[#00aaff]/20 flex items-center justify-center text-[#00aaff]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg md:text-xl font-bold text-white leading-tight">
                    Full Support
                  </div>
                  <div className="text-xs text-slate-400">Care counseling</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
    </section>
  );
}