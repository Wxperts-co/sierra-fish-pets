"use client";

import React, { useState, useEffect } from "react";
import { PawPrint } from "lucide-react";
import AdoptionCard, { Dog } from "./AdoptionCard";
import AdoptionModal from "./AdoptionModal";

export default function AdoptionGrid() {
  const [allDogs, setAllDogs] = useState<Dog[]>([]);
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
      .catch((err) => console.error("Failed to load dogs:", err));
  }, []);

  // Filter available dogs and take the first 4 for the featured row
  const featuredDogs = allDogs
    .filter((dog) => dog.adoptionStatus === "available")
    .slice(0, 4);

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
              Adoption Gallery
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#003d73] mb-3">
              Available Dogs
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium max-w-xl">
              Meet some of our amazing dogs looking for their forever homes.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 border border-[#005AA9] hover:bg-[#005AA9] text-[#005AA9] hover:text-white px-6 py-3 rounded-full text-xs font-bold tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-98 cursor-pointer shrink-0 w-fit self-start md:self-auto shadow-sm">
            <PawPrint className="w-4 h-4" />
            <span>View All Dogs</span>
          </button>
        </div>

        {/* Dog Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredDogs.map((dog, idx) => (
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
