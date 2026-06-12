"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Calendar,
  Mars,
  Venus,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
} from "lucide-react";
import { ArrivalPet } from "./ArrivalCard";

interface ArrivalModalProps {
  pet: ArrivalPet | null;
  onClose: () => void;
}

export default function ArrivalModal({ pet, onClose }: ArrivalModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [inquired, setInquired] = useState(false);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");

  if (!pet) return null;

  const displayPrice = pet.discountPrice ?? pet.price;
  const hasDiscount = pet.discountPrice !== null && pet.discountPrice !== undefined;

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % pet.images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + pet.images.length) % pet.images.length);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail) return;
    setInquired(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6 sm:px-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl rounded-3xl border border-slate-100 bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 transition-colors shadow-md backdrop-blur active:scale-95"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left Column: Image Slideshow & Gallery */}
          <div className="w-full md:w-1/2 bg-slate-50 flex flex-col justify-between p-6 border-r border-slate-100 min-h-[320px] md:min-h-0">
            <div className="relative flex-1 flex items-center justify-center min-h-[240px] rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100">
              {pet.images && pet.images.length > 0 ? (
                <>
                  <Image
                    src={pet.images[activeImageIndex]}
                    alt={pet.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />

                  {/* Navigation arrows for images */}
                  {pet.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 shadow transition-all active:scale-90"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 shadow transition-all active:scale-90"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="text-slate-400 flex flex-col items-center">
                  <Info className="h-8 w-8 mb-2 text-slate-300" />
                  <span>No image available</span>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute left-4 top-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    pet.status === "available"
                      ? "bg-emerald-500 text-white shadow"
                      : pet.status === "reserved"
                      ? "bg-amber-500 text-white shadow"
                      : "bg-rose-500 text-white shadow"
                  }`}
                >
                  {pet.status}
                </span>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {pet.images && pet.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pt-4 pb-1 scrollbar-thin">
                {pet.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      idx === activeImageIndex
                        ? "border-[#005AA9] scale-105 shadow-md"
                        : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${pet.name} thumb ${idx + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details Content */}
          <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto max-h-[50vh] md:max-h-[90vh] flex flex-col justify-between">
            <div>
              {/* Category & Breed */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[#005AA9] uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-md">
                  {pet.category.replace("-", " ")}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-sm font-semibold text-slate-600">
                  {pet.breed}
                </span>
              </div>

              {/* Name */}
              <h2 className="text-3xl font-black text-[#002244] leading-tight tracking-tight mb-2">
                {pet.name}
              </h2>

              {/* Price Details */}
              <div className="flex items-baseline gap-2.5 mb-6">
                <span className="text-3xl font-extrabold text-[#005AA9]">
                  ${displayPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-slate-400 line-through font-medium">
                    ${pet.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-600 leading-relaxed font-medium mb-6 text-sm">
                {pet.description}
              </p>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100">
                    {pet.gender.toLowerCase() === "male" ? (
                      <Mars className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Venus className="h-5 w-5 text-pink-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender</p>
                    <p className="text-sm font-bold text-[#002244]">{pet.gender}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 text-slate-600">
                    <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age</p>
                    <p className="text-sm font-bold text-[#002244]">{pet.age}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 text-[#005AA9]">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                    <p className="text-sm font-bold text-[#002244]">{pet.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 text-slate-600">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Arrival Date</p>
                    <p className="text-sm font-bold text-[#002244]">
                      {new Date(pet.arrivalDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Health Checks & Highlights */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-[#002244] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" /> Health & Features
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {pet.vaccinated && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Vaccinated
                    </span>
                  )}
                  {pet.dewormed && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Dewormed
                    </span>
                  )}
                  {pet.microchipped && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Microchipped
                    </span>
                  )}
                  {pet.highlights &&
                    pet.highlights.map((hl, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full"
                      >
                        {hl}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* Inquiry Form / Contact Section */}
            <div className="border-t border-slate-100 pt-6 mt-4">
              <AnimatePresence mode="wait">
                {inquired ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100 text-center text-emerald-800"
                  >
                    <p className="font-bold text-base mb-1">Inquiry Sent Successfully!</p>
                    <p className="text-xs text-emerald-700 font-medium">
                      Thank you for your interest in {pet.name}. Our pet experts will get back to you shortly!
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSubmitInquiry}
                    className="space-y-3"
                  >
                    <h4 className="text-sm font-bold text-[#002244] mb-1">Inquire About {pet.name}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005AA9] focus:outline-none transition-all"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        required
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005AA9] focus:outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="tel"
                        placeholder="Phone Number (Optional)"
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005AA9] focus:outline-none transition-all"
                      />
                      <textarea
                        placeholder={`Ask about availability, character, temperament of this ${pet.breed}...`}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        className="w-full h-16 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#005AA9] focus:outline-none transition-all resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-[#005AA9] hover:bg-[#004a8d] text-white py-3 text-xs font-bold transition-all duration-300 shadow active:scale-95"
                    >
                      Submit Pet Inquiry
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
