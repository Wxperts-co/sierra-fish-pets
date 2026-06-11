import { Suspense } from "react";
import BrandGrid from "@/components/brands/BrandGrid";
import BrandHero from "@/components/brands/BrandsHero";
import BrandCTA from "@/components/brands/BrandCTA";
import brands from "@/data/brands.json";

export const metadata = {
  title: "Brands | Sierra Fish & Pets",
  description:
    "Explore trusted pet food, aquatic, and pet care brands available at Sierra Fish & Pets.",
};

export default function BrandsPage() {
  return (
    <main>
      <BrandHero
        title="Brands We Trust"
        subtitle="Explore premium pet nutrition, aquatic supplies, and trusted pet care brands carefully selected by Sierra Fish & Pets."
        image="/images/banner/contact.png"
      />

      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20 bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#005AA9]" />
          </div>
        }
      >
        <BrandGrid brands={brands} />
      </Suspense>

      <BrandCTA />
    </main>
  );
}