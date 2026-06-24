"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ArrivalHero from "./ArrivalHero";
import ArrivalCategoryNav from "./ArrivalCategoryNav";
import ArrivalGrid from "./ArrivalGrid";
import ArrivalModal from "./ArrivalModal";
import { ArrivalPet } from "./ArrivalCard";

interface ArrivalsContainerProps {
  initialCategory?: string;
  initialArrivals?: ArrivalPet[];
}

const mapCategoryParam = (param: string): string => {
  const normalized = param.toLowerCase();
  if (normalized === "reptiles" || normalized === "reptile" || normalized === "exotic" || normalized === "exotic-pets") {
    return "reptiles";
  }
  if (normalized === "small-animals" || normalized === "small-animal" || normalized === "small-pets" || normalized === "small-pet") {
    return "small-animals";
  }
  if (normalized === "dog" || normalized === "dogs") {
    return "dogs";
  }
  if (normalized === "cat" || normalized === "cats") {
    return "cats";
  }
  if (normalized === "bird" || normalized === "birds") {
    return "birds";
  }
  if (normalized === "freshwater" || normalized === "freshwater-fish" || normalized === "fish" || normalized === "fishes") {
    return "freshwater";
  }
  if (normalized === "saltwater" || normalized === "saltwater-fish") {
    return "saltwater";
  }
  return "all";
};

export default function ArrivalsContainer({ initialCategory, initialArrivals }: ArrivalsContainerProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    return initialCategory ? mapCategoryParam(initialCategory) : "all";
  });
  const [selectedPet, setSelectedPet] = useState<ArrivalPet | null>(null);
  const [arrivals, setArrivals] = useState<ArrivalPet[]>(initialArrivals || []);
  const [loading, setLoading] = useState(!initialArrivals);

  // Sync category changes to browser URL path
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const path = category === "all" ? "/arrivals" : `/arrivals/${category}`;
    window.history.pushState(null, "", path);
  };

  // Initialize category filter based on prop
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(mapCategoryParam(initialCategory));
    } else {
      setActiveCategory("all");
    }
  }, [initialCategory]);

  // Listen to browser back/forward navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      const parts = pathname.split("/");
      const catParam = parts[2] || "all";
      setActiveCategory(mapCategoryParam(catParam));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Fetch arrivals from public DB API if not provided as prop
  useEffect(() => {
    if (!initialArrivals || initialArrivals.length === 0) {
      const loadArrivals = async () => {
        try {
          setLoading(true);
          const res = await fetch("/api/new-arrivals");
          const data = await res.json();
          if (data.success && data.arrivals) {
            setArrivals(data.arrivals);
          }
        } catch (err) {
          console.error("Failed to load arrivals dynamically from DB:", err);
        } finally {
          setLoading(false);
        }
      };
      loadArrivals();
    } else {
      setArrivals(initialArrivals);
      setLoading(false);
    }
  }, [initialArrivals]);

  // Get active breadcrumb label based on active category
  const getCategoryLabel = (catId: string) => {
    switch (catId) {
      case "dogs": return "Dog";
      case "cats": return "Cat";
      case "birds": return "Bird";
      case "freshwater": return "Freshwater";
      case "saltwater": return "Saltwater";
      case "small-animals": return "Small Animal";
      case "reptiles": return "Reptile";
      default: return "All Pets";
    }
  };

  const currentCategoryLabel = getCategoryLabel(activeCategory);

  return (
    <main className="relative text-slate-800 min-h-screen overflow-x-hidden pb-24 bg-slate-50">
      {/* Hero Banner Section */}
      <ArrivalHero
        title={activeCategory === "all" ? "New Pet Arrivals" : `New ${currentCategoryLabel} Arrivals`}
        subtitle="Explore our newest arrivals. Healthy, well-cared-for pets are added regularly, so check back often to find your perfect match."
        image="/images/banner/shophero3.png"
        breadcrumbs={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Arrival Pets",
            href: activeCategory !== "all" ? "/arrivals" : undefined,
          },
          ...(activeCategory !== "all"
            ? [
                {
                  label: currentCategoryLabel,
                },
              ]
            : []),
        ]}
      />

      {/* Category Selection Filter */}
      <ArrivalCategoryNav
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Product/Pet Grid */}
      <ArrivalGrid
        pets={arrivals}
        activeCategory={activeCategory}
        onViewDetails={setSelectedPet}
      />

      {/* Pet Details Modal */}
      <ArrivalModal
        pet={selectedPet}
        onClose={() => setSelectedPet(null)}
      />
    </main>
  );
}
