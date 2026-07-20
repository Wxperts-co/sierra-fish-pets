"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PawPrint, ArrowLeft, Search, Filter, RefreshCw } from "lucide-react";
import AdoptionCard, { Dog } from "@/components/dog-adoption/AdoptionCard";
import AdoptionModal from "@/components/dog-adoption/AdoptionModal";

export default function AvailableDogsPage() {
  const [allDogs, setAllDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/dogs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.dogs)) {
          setAllDogs(data.dogs);
        }
      })
      .catch((err) => console.error("Failed to load dogs:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filter available dogs
  const availableDogs = allDogs.filter((dog) => dog.adoptionStatus === "available");

  // Apply search & gender filters
  const filteredDogs = availableDogs.filter((dog) => {
    const matchesSearch =
      dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender =
      genderFilter === "all" ||
      dog.gender.toLowerCase() === genderFilter.toLowerCase();
    return matchesSearch && matchesGender;
  });

  const handleOpenProfile = (dog: Dog) => {
    setSelectedDog(dog);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedDog(null), 300);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* ── HEADER BANNER ── */}
      <section className="relative bg-[#002244] text-white pt-28 pb-16 h-[400px] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <Image
            src="/images/banner/dog-adoption.png"
            alt="Available Dogs Banner"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="relative z-10 container mx-auto px-6 py-8 max-w-6xl">
          <Link
            href="/services/dog-adoption"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00aaff] hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dog Adoption Overview
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
             
              <h1 className="text-2xl md:text-5xl font-black tracking-tight text-white mb-3">
                All Available Rescued Dogs
              </h1>
             
            </div>

            {/* Total Count Badge */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl flex items-center gap-3 shrink-0">
              <PawPrint className="w-5 h-5 text-[#00aaff]" />
              <div>
                <span className="block text-xl font-extrabold text-white leading-none">
                  {availableDogs.length}
                </span>
                <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">
                  {availableDogs.length === 1 ? "Dog Available" : "Dogs Available"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

    

      {/* ── DOG GRID / EMPTY STATE ── */}
      <section className="pt-12">
        <div className="container mx-auto px-6 max-w-6xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mb-3 text-[#005AA9]" />
              <p className="text-sm font-medium">Loading available dogs...</p>
            </div>
          ) : availableDogs.length === 0 ? (
            /* 0 Dogs Available Empty State */
            <div className="bg-white rounded-3xl p-12 md:p-16 border border-slate-200/80 text-center max-w-xl mx-auto shadow-sm my-12">
              <div className="w-20 h-20 bg-blue-50 text-[#005AA9] rounded-full flex items-center justify-center mx-auto mb-6">
                <PawPrint className="w-10 h-10" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3">
                0 Dogs Available Currently
              </h2>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8">
                There are currently 0 dogs available for adoption. New rescued foster dogs are added regularly ahead of our weekend adoption events!
              </p>
              <Link
                href="/services/dog-adoption"
                className="inline-flex items-center gap-2 bg-[#005AA9] hover:bg-[#00407a] text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-98"
              >
                <span>Learn About Adoption Events</span>
              </Link>
            </div>
          ) : filteredDogs.length === 0 ? (
            /* Filter mismatch empty state */
            <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center max-w-lg mx-auto my-12">
              <p className="text-base font-bold text-slate-800 mb-2">
                No dogs match your search or filter
              </p>
              <p className="text-xs text-slate-500 mb-6">
                Try searching with a different term or resetting your filter options.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setGenderFilter("all");
                }}
                className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            /* Dogs Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredDogs.map((dog, idx) => (
                <AdoptionCard
                  key={dog.id}
                  dog={dog}
                  badge={idx === 0 ? "NEW" : idx === 2 ? "POPULAR" : null}
                  onOpenProfile={handleOpenProfile}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Dog Detail Profile Modal */}
      <AdoptionModal
        dog={selectedDog}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
}
