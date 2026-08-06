import type { Metadata } from "next";
import ContactUsPageClient from "@/components/contact-us/ContactUsPageClient";

export const metadata: Metadata = {
  title: "About Sierra Fish & Pets | Pet Supplies Renton, WA ",
  description:
    "Sierra Fish and Pets in Renton, WA offers premium pet supplies, quality food, and expert care for all your pets.",
  keywords:
    "Pet Supplies Renton, WA, Renton, WA Pet Care Experts, Aquariums, Reptiles & Pet Supplies in Renton, family-owned pet store, Renton pet store, pet store Renton WA, aquarium experts, local pet shop Renton, aquarium pet store, freshwater aquarium supplies, saltwater aquarium store, pet supplies Renton, fish store Seattle, local pet shop, aquarium services, fish and pet store, pet care experts, aquarium maintenance, trusted pet store",
};

export default function ContactUsPage() {
  return <ContactUsPageClient />;
}
