"use client";

import React from "react";
import { Filter, Layers, Tag } from "lucide-react";

interface Category {
  id: string;
  label: string;
}

interface ArrivalCategoryNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  activeSubcategory: string;
  onSubcategoryChange: (sub: string) => void;
  activeType: string;
  onTypeChange: (type: string) => void;
}

const categories: Category[] = [
  { id: "all",           label: "All Pets" },
  { id: "dogs",          label: "Dog Arrivals" },
  { id: "cats",          label: "Cat Arrivals" },
  { id: "birds",         label: "Bird Arrivals" },
  { id: "freshwater",    label: "Freshwater Arrivals" },
  { id: "saltwater",     label: "Saltwater Arrivals" },
  { id: "reptiles",      label: "Reptile Arrivals" },
  { id: "small-animals", label: "Small Animal Arrivals" },
];

const FRESHWATER_SUBS: Category[] = [
  { id: "all",     label: "All Freshwater" },
  { id: "fish",    label: "Fish" },
  { id: "inverts", label: "Inverts" },
  { id: "plants",  label: "Live Plants" },
];

const SALTWATER_SUBS: Category[] = [
  { id: "all",     label: "All Saltwater" },
  { id: "fish",    label: "Fish" },
  { id: "corals",  label: "Corals" },
  { id: "inverts", label: "Inverts" },
];

// Detailed Species / Types from Client Documents
export const FW_SPECIES_TYPES: Record<string, string[]> = {
  fish: [
    "Algae Eaters",
    "Angels",
    "Barbs",
    "Bettas",
    "Catfish",
    "Cichlids-Central American",
    "Cichlids-Dwarf",
    "Cichlids-Malawi",
    "Cichlids-Other",
    "Cichlids-South American",
    "Cichlids-Tanganykin",
    "Corydoras",
    "Danios",
    "Discus",
    "Feeders",
    "Freshwater Eels",
    "GloFish",
    "Gobies",
    "Goldfish Fancy",
    "Mollies",
    "Oddballs/Misc Fish",
    "Platies",
    "Plecos",
    "Rainbows",
    "Rasboras",
    "Rice fish",
    "Sharks",
    "Swordtails",
    "Tetras/Hatchets/Pencils",
  ],
  inverts: [
    "Amphibians",
    "Crabs",
    "Shrimps",
    "Shrimps-Cardinia",
    "Shrimps-Neocardinia",
    "Snails",
  ],
  plants: [
    "Bunched",
    "Potted",
    "Loose",
    "T/C (Tissue Culture)",
  ],
};

export const SW_SPECIES_TYPES: Record<string, string[]> = {
  fish: [
    "Angelfish",
    "Anglers",
    "Anthias",
    "Basslets",
    "Blennies",
    "Boxfish",
    "Butterfly",
    "Captive Bred",
    "Cardinalfish",
    "Clownfish",
    "Damsels",
    "Eels",
    "Filefish",
    "Goatfish",
    "Gobies",
    "Groupers",
    "Hamlets",
    "Hawkfish",
    "Hogfish",
    "Jawfish",
    "Lionfish",
    "Misc Fish",
    "Parrotfish",
    "Pipefish",
    "Pseudochromis",
    "Puffers",
    "Rabbitfish",
    "Scorpion Fish",
    "Seahorses",
    "Sharks",
    "Snappers",
    "Squirrelfish",
    "Sweetlips",
    "Tangs (Surgeonfish)",
    "Tilefish",
    "Triggers",
    "Wrasses",
  ],
  corals: [
    "Cultured LPS (Large Polyp Stony)",
    "Cultured SPS (Small Polyp Stony)",
    "Cultured Soft Corals",
    "Brains",
    "Gorgonians/Sea Fans",
    "Polyps/Mushrooms",
    "Leathers",
    "LPS Corals",
    "SPS Corals",
    "Soft Corals",
  ],
  inverts: [
    "Anemones",
    "Clams",
    "Crabs",
    "Cucumbers",
    "Nudibranchs",
    "Plants/Algae",
    "Shrimps",
    "Snails",
    "Starfish",
    "Urchins",
    "Worms/Feather Dusters",
    "Misc Inverts",
  ],
};

export default function ArrivalCategoryNav({
  activeCategory,
  onCategoryChange,
  activeSubcategory,
  onSubcategoryChange,
  activeType,
  onTypeChange,
}: ArrivalCategoryNavProps) {
  const subCategories =
    activeCategory === "freshwater"
      ? FRESHWATER_SUBS
      : activeCategory === "saltwater"
      ? SALTWATER_SUBS
      : null;

  const speciesList =
    activeCategory === "freshwater" && activeSubcategory !== "all"
      ? FW_SPECIES_TYPES[activeSubcategory] || []
      : activeCategory === "saltwater" && activeSubcategory !== "all"
      ? SW_SPECIES_TYPES[activeSubcategory] || []
      : [];

  return (
    <section className="bg-white border-b border-slate-200/80 shadow-sm">
      <div className="container mx-auto px-4 py-5 space-y-3.5">
        {/* Row 1: Top Category Pills */}
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((category) => {
            const active = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => {
                  onCategoryChange(category.id);
                  onSubcategoryChange("all");
                  onTypeChange("all");
                }}
                className={`
                  flex items-center gap-2 whitespace-nowrap rounded-full
                  px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer
                  ${
                    active
                      ? "bg-[#005AA9] text-white shadow-md shadow-blue-500/20 ring-2 ring-[#005AA9]/20"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-[#005AA9] hover:text-[#005AA9] hover:bg-blue-50/50"
                  }
                `}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Row 2: Subcategory Pills (Fish / Inverts / Plants / Corals) */}
        {subCategories && (
          <div className="pt-2.5 border-t border-slate-100 flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-extrabold uppercase tracking-wider shrink-0 select-none">
              <Layers className="w-3.5 h-3.5 text-[#005AA9]" />
              <span>Category</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {subCategories.map((sub) => {
                const active = activeSubcategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      onSubcategoryChange(sub.id);
                      onTypeChange("all");
                    }}
                    className={`
                      whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer
                      ${
                        active
                          ? "bg-[#005AA9] text-white shadow-sm font-black"
                          : "border border-slate-200 bg-slate-50/80 text-slate-600 hover:bg-blue-50 hover:text-[#005AA9] hover:border-blue-200"
                      }
                    `}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Row 3: Species / Type Specific Pills (e.g. Bettas, Angels, Clownfish, Corals types) */}
        {speciesList.length > 0 && (
          <div className="pt-2 border-t border-dashed border-slate-200 flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#005AA9] text-xs font-extrabold uppercase tracking-wider shrink-0 select-none border border-blue-100">
              <Tag className="w-3.5 h-3.5 text-[#005AA9]" />
              <span>Species Type</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
              <button
                onClick={() => onTypeChange("all")}
                className={`
                  whitespace-nowrap rounded-full px-3.5 py-1 text-xs font-bold transition-all duration-200 cursor-pointer
                  ${
                    activeType === "all"
                      ? "bg-slate-800 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }
                `}
              >
                All Species
              </button>

              {speciesList.map((typeStr) => {
                const active = activeType.toLowerCase() === typeStr.toLowerCase();
                return (
                  <button
                    key={typeStr}
                    onClick={() => onTypeChange(typeStr)}
                    className={`
                      whitespace-nowrap rounded-full px-3.5 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer
                      ${
                        active
                          ? "bg-[#005AA9] text-white shadow-sm font-bold"
                          : "border border-slate-200/90 bg-white text-slate-600 hover:border-[#005AA9] hover:text-[#005AA9] hover:bg-blue-50/40"
                      }
                    `}
                  >
                    {typeStr}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
