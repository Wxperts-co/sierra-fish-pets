"use client";

import Link from "next/link";
import { Phone, MapPin } from "lucide-react";

export default function BrandCTA() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#002244] via-[#003d73] to-[#005AA9]">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-cyan-300 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
        <span className="inline-block mb-4 text-xs uppercase tracking-[0.25em] font-bold text-cyan-400">
          Find Your Favourite Brand
        </span>

        <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
          Shop All Premium Brands <br className="hidden md:block" />
          In One Place
        </h2>

        <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Visit Sierra Fish &amp; Pets and explore our full range of trusted brands for dogs, cats, aquatics, reptiles, birds, and small animals — all under one roof.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-[#005AA9] font-bold text-sm hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Phone size={18} />
            Contact Us
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-transparent text-white font-bold text-sm border-2 border-white/40 hover:bg-white/10 hover:border-white transition-all duration-200"
          >
            <MapPin size={18} />
            Find Our Store
          </Link>
        </div>
      </div>
    </section>
  );
}
