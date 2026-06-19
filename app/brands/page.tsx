import { Suspense } from "react";
import BrandGrid from "@/components/brands/BrandGrid";
import BrandHero from "@/components/brands/BrandsHero";
import BrandCTA from "@/components/brands/BrandCTA";
import { connectDB } from "@/lib/mongodb";
import BrandModel from "@/models/Brand";
import defaultBrands from "@/data/brands.json";

export const metadata = {
  title: "Brands | Sierra Fish & Pets",
  description:
    "Explore trusted pet food, aquatic, and pet care brands available at Sierra Fish & Pets.",
};

const CATEGORY_LABELS: Record<string, string> = {
  dog: "Dog",
  cat: "Cat",
  aquatic: "Aquatic",
  reptile: "Reptile",
  bird: "Bird",
  "small-animal": "Small Animal",
};

interface BrandsPageProps {
  searchParams: Promise<{ category?: string }>;
}

async function getBrands() {
  try {
    await connectDB();
    let brands = await BrandModel.find().sort({ name: 1 }).lean();
    if (brands.length === 0) {
      await BrandModel.insertMany(defaultBrands);
      brands = await BrandModel.find().sort({ name: 1 }).lean();
    }
    return JSON.parse(JSON.stringify(brands));
  } catch {
    return defaultBrands;
  }
}

export default async function BrandsPage({ searchParams }: BrandsPageProps) {
  const { category } = await searchParams;
  const activeCategory = category ?? "all";

  const brands = await getBrands();

  const breadcrumbs: { label: string; href?: string }[] = [
    { label: "Home", href: "/" },
  ];

  if (activeCategory === "all") {
    breadcrumbs.push({ label: "Brands" });
  } else {
    breadcrumbs.push({ label: "Brands", href: "/brands" });
    breadcrumbs.push({ label: CATEGORY_LABELS[activeCategory] ?? activeCategory });
  }

  return (
    <main>
      <BrandHero
        title="Brands We Trust"
        subtitle="Explore premium pet nutrition, aquatic supplies, and trusted pet care brands carefully selected by Sierra Fish & Pets."
        image="/images/banner/shophero3.png"
        breadcrumbs={breadcrumbs}
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