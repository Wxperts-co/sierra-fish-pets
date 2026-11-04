import type { Metadata } from "next";
import AdoptionHero from "@/components/dog-adoption/AdoptionHero";
import AdoptionProcess from "@/components/dog-adoption/AdoptionProcess";
import AdoptionGrid from "@/components/dog-adoption/AdoptionGrid";
import RescuePartnerSection from "@/components/dog-adoption/RescuePartnerSection";
import AeoDirectAnswerSnippet from "@/components/common/AeoDirectAnswerSnippet";
import DynamicSemanticAccordion from "@/components/common/DynamicSemanticAccordion";

export const metadata: Metadata = {
  title: "Dog Adoption Events Renton WA | Sierra Fish & Pets",
  description:
    "Meet adoptable rescue dogs and puppies from local partner shelters at Sierra Fish & Pets adoption events in Renton, WA. Find your new family member!",
  keywords: [
    "Dog Adoption Events Renton WA",
    "rescue dog adoption",
    "puppy adoption pet store renton",
    "pet adoption day renton",
  ],
  alternates: {
    canonical: "https://sierrafishandpets.com/services/dog-adoption",
  },
};

export default function DogAdoptionPage() {
  return (
    <main className="flex flex-col w-full">
      {/* Hero Section */}
      <AdoptionHero />

      <AeoDirectAnswerSnippet pageKey="/services/dog-adoption" />

      {/* Primary Rescue Partner: Ginger's Pet Rescue */}
      <section id="partner">
        <RescuePartnerSection />
      </section>

      {/* Process Section */}
      <section id="process">
        <AdoptionProcess />
      </section>

      {/* Available Dogs Grid */}
      <section id="dogs">
        <AdoptionGrid />
      </section>

      <DynamicSemanticAccordion pageKey="/services/dog-adoption" />
    </main>
  );
}