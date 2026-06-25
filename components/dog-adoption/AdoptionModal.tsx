import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShieldCheck, Check, Info } from "lucide-react";
import { Dog } from "./AdoptionCard";

interface AdoptionModalProps {
  dog: Dog | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdoptionModal({ dog, isOpen, onClose }: AdoptionModalProps) {
  const [inquired, setInquired] = useState(false);

  if (!dog) return null;

  const handleInquiry = () => {
    setInquired(true);
    setTimeout(() => {
      setInquired(false);
      onClose();
    }, 4000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl z-10 border border-slate-100 flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 bg-slate-900/5 hover:bg-slate-900/10 text-slate-700 p-2 rounded-full transition-all focus:outline-none cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Image */}
            <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[500px]">
              <Image
                src={dog.image || "/placeholder-product.png"}
                alt={dog.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent md:hidden" />
            </div>

            {/* Right Column: Dog details */}
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[600px]">
              <div>
                {/* Header */}
                <div className="mb-6">
                  <span className="text-[#005AA9] text-xs font-black uppercase tracking-widest block mb-1">
                    Meet Your Companion
                  </span>
                  <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                    {dog.name}
                    <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                  </h2>
                  <p className="text-slate-500 text-sm font-semibold mt-1">
                    {dog.breed} • {dog.age}
                  </p>
                </div>

                {/* Key Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gender</p>
                    <p className="text-sm text-slate-700 font-extrabold">{dog.gender}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Size</p>
                    <p className="text-sm text-slate-700 font-extrabold">{dog.size}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Color</p>
                    <p className="text-sm text-slate-700 font-extrabold">{dog.color}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Adoption Fee</p>
                    <p className="text-sm text-[#005AA9] font-extrabold">{dog.adoptionFee}</p>
                  </div>
                </div>

                {/* Health & Compatibility Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {dog.vaccinated && (
                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Vaccinated
                    </span>
                  )}
                  {dog.neutered && (
                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Neutered
                    </span>
                  )}
                  {dog.goodWithKids && (
                    <span className="flex items-center gap-1 bg-sky-50 text-sky-700 border border-sky-100 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                      <Heart className="w-3 h-3 fill-sky-700" />
                      Kid Friendly
                    </span>
                  )}
                </div>

                {/* Personality Tags */}
                <div className="mb-6">
                  <h4 className="text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">Personality</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {dog.personality.map((tag) => (
                      <span key={tag} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h4 className="text-slate-800 text-xs font-bold uppercase tracking-wider mb-2">About</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {dog.description}
                  </p>
                </div>
              </div>

              {/* Inquiry Action Area */}
              <div>
                {!inquired ? (
                  <button
                    onClick={handleInquiry}
                    className="w-full bg-[#005AA9] hover:bg-[#004b8d] text-white py-4 rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/10 hover:scale-[1.01] active:scale-99 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Start Adoption Inquiry</span>
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full bg-emerald-500 text-white py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5 text-white" />
                    <span>Inquiry Submitted Successfully!</span>
                  </motion.div>
                )}
                <div className="flex items-start gap-1.5 mt-3 text-slate-400 text-[10px] leading-relaxed">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Submitting an inquiry notifies our adoption counselor who will contact you within 24 hours to schedule a meet & greet.</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
