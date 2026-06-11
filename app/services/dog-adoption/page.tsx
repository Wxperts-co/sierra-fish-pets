

import AdoptionHero from "@/components/dog-adoption/AdoptionHero";
import AdoptionProcess from "@/components/dog-adoption/AdoptionProcess";
import AdoptionGrid from "@/components/dog-adoption/AdoptionGrid";

export default function DogAdoptionPage() {
  return (
    <main className="flex flex-col w-full">
      {/* Hero Section */}
      <AdoptionHero />

      {/* Process Section */}
      <section id="process">
        <AdoptionProcess />
      </section>

      {/* Available Dogs Grid */}
      <section id="dogs">
        <AdoptionGrid />
      </section>

      {/* FAQ Section */}
      {/* <section id="faq">
        <AdoptionFAQ />
      </section> */}

      {/* Call to Action */}
      {/* <section id="cta">
        <AdoptionCTA />
      </section> */}
    </main>
  );
}