import AdoptionHero from "@/components/dog-adoption/AdoptionHero";
import AdoptionProcess from "@/components/dog-adoption/AdoptionProcess";
import AdoptionGrid from "@/components/dog-adoption/AdoptionGrid";
import RescuePartnerSection from "@/components/dog-adoption/RescuePartnerSection";

export default function DogAdoptionPage() {
  return (
    <main className="flex flex-col w-full">
      {/* Hero Section */}
      <AdoptionHero />

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
    </main>
  );
}