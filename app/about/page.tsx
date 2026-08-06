import type { Metadata } from "next";
import AboutPageClient from "@/components/about/AboutPageClient";

export const metadata: Metadata = {
  title: "About Sierra Fish & Pets | Renton’s Local Pet Store Since 1970 ",
  description:
    "Since 1970, trusted Sierra Fish and Pets in Renton, WA provides quality aquariums, reptiles, pet supplies, and expert aquarium maintenance services.",
  keywords:
    "Renton, WA Pet Care Experts, Aquariums, Reptiles & Pet Supplies in Renton, family-owned pet store, Renton pet store, pet store Renton WA, aquarium experts, local pet shop Renton, aquarium pet store, freshwater aquarium supplies, saltwater aquarium store, pet supplies Renton, fish store Seattle, local pet shop, aquarium services, fish and pet store, pet care experts, aquarium maintenance, trusted pet store",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
