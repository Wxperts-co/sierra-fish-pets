"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fish,
  Bird,
  ShieldCheck,
  CheckCircle2,
  X,
  Send,
  Sparkles,
  HelpCircle,
  Check,
  Search,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

interface SpecialOrderPet {
  id: string;
  name: string;
  category: "fish" | "reptile" | "bird";
  type: string;
  leadTime: string;
  image: string;
  description: string;
  careDetails?: string;
  status?: string;
}

export default function SpecialOrderAnimalsPage() {
  const [pets, setPets] = useState<SpecialOrderPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<SpecialOrderPet | null>(null);
  const [isCustomRequest, setIsCustomRequest] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"all" | "fish" | "reptile" | "bird">("all");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    customSpecies: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/special-order-pets")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.pets)) {
          setPets(data.pets);
        }
      })
      .catch((err) => console.error("Failed to load special order pets:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredPets = pets.filter((pet) =>
    activeCategory === "all" ? true : pet.category === activeCategory
  );

  const handleOpenModal = (pet: SpecialOrderPet | null) => {
    if (pet) {
      setSelectedPet(pet);
      setIsCustomRequest(false);
      setFormData((prev) => ({ ...prev, customSpecies: pet.name }));
    } else {
      setSelectedPet(null);
      setIsCustomRequest(true);
      setFormData((prev) => ({ ...prev, customSpecies: "" }));
    }
    setIsModalOpen(true);
    setSubmitted(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedPet(null);
      setIsCustomRequest(false);
    }, 300);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Dispatch email notification to customer & admin in background
    fetch("/api/special-order-inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        customSpecies: formData.customSpecies || selectedPet?.name || "Special Order Request",
        notes: formData.notes,
      }),
    }).catch((err) => console.error("Inquiry email API error:", err));

    setTimeout(() => {
      setSubmitted(false);
      handleCloseModal();
    }, 4000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-24">
      {/* ─── Hero Banner Section (Matching In-Store Services Style) ─── */}
      <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
        {/* Background Image with Premium Overlay (Fixed Parallax) */}
        <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
          {/* Mobile image */}
          <Image
            src="/images/banner/shophero5.png"
            alt="Special Order Animals & Fish"
            fill
            priority
            className="object-cover object-[center_60%] block md:hidden filter brightness-[0.9]"
            sizes="100vw"
          />
          {/* Desktop image */}
          <Image
            src="/images/services/s1.png"
            alt="Special Order Animals & Fish"
            fill
            priority
            className="object-cover object-center hidden md:block filter brightness-[0.9]"
            sizes="100vw"
          />
        </div>

        {/* Mobile overlay — darkens image so text is readable */}
        <div className="absolute inset-0 z-[2] block md:hidden bg-[linear-gradient(to_bottom,rgba(0,30,70,0.62)_0%,rgba(0,30,70,0.35)_60%,rgba(0,30,70,0.10)_100%)]" />

        {/* Centered text block */}
        <div className="absolute inset-x-0 top-0 z-[3] flex h-full flex-col items-center justify-center px-4 text-center">
          <div className="flex flex-col items-center justify-center max-w-4xl">
            <h1 className="text-3xl md:text-3xl lg:text-4xl font-black bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] bg-clip-text text-transparent tracking-tight leading-tight mb-6">
              Special Order Pets &amp; Live Fish
            </h1>
            {/* Breadcrumb */}
            <nav
              aria-label="breadcrumb"
              className="flex flex-wrap items-center justify-center gap-0.5 text-sm font-medium text-white drop-shadow-md md:text-slate-300 md:drop-shadow-none mb-4"
            >
              <span className="flex items-center gap-0.5">
                <Link
                  href="/"
                  className="text-white md:text-slate-300 transition-colors duration-150 hover:text-[#00aaff] hover:underline"
                >
                  Home
                </Link>
                <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
              </span>
              <span className="flex items-center gap-0.5">
                <Link
                  href="/services"
                  className="text-white md:text-slate-300 transition-colors duration-150 hover:text-[#00aaff] hover:underline"
                >
                  Services
                </Link>
                <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
              </span>
              <span className="flex items-center gap-0.5">
                <span className="font-bold text-white md:text-white">Special Order Animals</span>
              </span>
            </nav>

            <div>
              <button
                onClick={() => handleOpenModal(null)}
                className="inline-flex items-center justify-center gap-2 bg-[#005AA9] hover:bg-[#004b8d] text-white mt-2 px-8 py-3 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Request Unlisted Species / Custom Order</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Unlisted Species Request Banner Card */}
      <section className="pt-8">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="bg-gradient-to-r from-[#003d73] to-[#005AA9] text-white rounded-3xl p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
             
              <h3 className="text-2xl font-black mb-2">
                Looking For A Specific Fish or Pet Not Listed?
              </h3>
              <p className="text-xs md:text-sm text-blue-100/90 font-light max-w-xl">
                We work directly with certified fish importers and ethical breeders nationwide. Tell us what species, size, or morph you need and we will fetch pricing for you!
              </p>
            </div>
            <button
              onClick={() => handleOpenModal(null)}
              className="bg-white text-[#003d73] hover:bg-blue-50 px-6 py-3.5 rounded-full text-xs font-extrabold tracking-wide shrink-0 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              Request Custom Order
            </button>
          </div>
        </div>
      </section>

      {/* Grid of Special Order Pets */}
      <section className="pt-10">
        <div className="container mx-auto px-6 max-w-6xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mb-3 text-[#005AA9]" />
              <p className="text-sm font-medium">Loading special order pets &amp; fish...</p>
            </div>
          ) : filteredPets.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-slate-200 shadow-sm">
             
              <h3 className="text-2xl font-extrabold text-slate-800 mb-2">No Special Order Pets Listed Currently</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                There are currently no listed pets in this category. You can submit a custom order request for any species you need!
              </p>
              <button
                onClick={() => handleOpenModal(null)}
                className="bg-[#005AA9] hover:bg-[#00407a] text-white px-6 py-3 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Submit Custom Species Request
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredPets.map((pet) => (
                <div
                  key={pet.id}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={pet.image || "/placeholder-product.png"}
                        alt={pet.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover"
                      />
                      <span className="absolute top-4 left-4 bg-[#005AA9] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm">
                        Special Order
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#005AA9] uppercase tracking-wider">
                          {pet.type}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          Est. Arrival : {pet.leadTime}
                        </span>
                      </div>

                      <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                        {pet.name}
                      </h3>
                     
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                    <button
                      onClick={() => handleOpenModal(pet)}
                      className="w-full bg-[#005AA9] hover:bg-[#00407a] text-white py-3 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Inquire For Pricing</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Inquiry & Custom Order Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl z-10 border border-slate-100"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
               
                <h3 className="text-2xl font-black text-slate-900">
                  {isCustomRequest ? "Request Any Fish or Animal" : selectedPet?.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Submit your details below and our team will check breeder stock and contact you with a price quote.
                </p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  {isCustomRequest && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Requested Animal / Fish Species Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Discus Wild Blue, Peacock Cichlid, Green Tree Python..."
                        value={formData.customSpecies}
                        onChange={(e) => setFormData({ ...formData, customSpecies: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="425-xxx-xxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Specific Size / Quantity / Color Preference
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mention preferred size, pair vs single, or timeline..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#005AA9]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#005AA9] hover:bg-[#00407a] text-white py-3.5 rounded-2xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Special Order Request</span>
                  </button>
                </form>
              ) : (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl p-6 text-center">
                  <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h4 className="text-lg font-extrabold mb-1">Request Submitted!</h4>
                  <p className="text-xs font-medium text-emerald-700">
                    Our team will check current supplier availability for {formData.customSpecies || selectedPet?.name} and contact you at {formData.phone || formData.email} with pricing options.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
