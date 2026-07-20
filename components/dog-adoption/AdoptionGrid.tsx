"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PawPrint, ExternalLink } from "lucide-react";
import AdoptionCard, { Dog } from "./AdoptionCard";
import AdoptionModal from "./AdoptionModal";

export default function AdoptionGrid() {
  const [allDogs, setAllDogs] = useState<Dog[]>([]);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("/api/dogs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.dogs)) {
          setAllDogs(data.dogs);
        }
      })
      .catch((err) => console.error("Failed to load dogs:", err));
  }, []);

  // Filter available dogs and toggle view all
  const availableDogs = allDogs.filter((dog) => dog.adoptionStatus === "available");
  const displayedDogs = showAll ? availableDogs : availableDogs.slice(0, 4);

  const handleOpenProfile = (dog: Dog) => {
    setSelectedDog(dog);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedDog(null), 300); // clear after exit animation
  };

  return (
    <section className="relative py-20 bg-slate-50 text-slate-800 border-b border-slate-100 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[#005AA9] text-xs font-black uppercase tracking-[0.2em] block mb-2">
              Rescue Partner Gallery
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#003d73] mb-3">
              Available Foster Dogs
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
              These dogs are rescued from kill shelters around the world and cared for by foster families. Sierra Fish &amp; Pets hosts in-store events to help them find forever homes!
            </p>
          </div>

          <Link
            href="/services/dog-adoption/dogs"
            className="inline-flex items-center gap-2 border border-[#005AA9] hover:bg-[#005AA9] text-[#005AA9] hover:text-white px-6 py-3 rounded-full text-xs font-bold tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-98 shrink-0 w-fit self-start md:self-auto shadow-sm"
          >
            <PawPrint className="w-4 h-4" />
            <span>View All Available Dogs ({availableDogs.length})</span>
          </Link>
        </div>

        {/* Dog Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedDogs.map((dog, idx) => (
            <AdoptionCard
              key={dog.id}
              dog={dog as Dog}
              badge={idx === 0 ? "NEW" : idx === 2 ? "POPULAR" : null}
              onOpenProfile={handleOpenProfile}
            />
          ))}
        </div>

       
      </div>

      {/* Dog Detail Profile Modal */}
      <AdoptionModal
        dog={selectedDog}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}
