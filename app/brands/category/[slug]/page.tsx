import { Suspense } from "react";
import BrandGrid from "@/components/brands/BrandGrid";
import BrandHero from "@/components/brands/BrandsHero";
import BrandCTA from "@/components/brands/BrandCTA";
import { connectDB } from "@/lib/mongodb";
import BrandModel from "@/models/Brand";
import defaultBrands from "@/data/brands.json";

import type { Metadata } from "next";

const CATEGORY_METADATA: Record<
  string,
  { title: string; description: string; keywords?: string }
> = {
  dog: {
    title: "Dog Brands Services Renton, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets in Renton, WA offers expert services and top dog brands like Acana, Blue Buffalo, and Nulo.",
    keywords:
      "Dog Brands Services Renton, WA , Acana, AvoDerm, ,Blue Buffalo, Canine Caviar, Earthborn, Evanger's, KOHA,Natural Balance,Northwest Naturals,Nulo, KOHA",
  },
  cat: {
    title: "Cat Brands Services Renton, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets in Renton, WA carries top cat food brands like Acana, Blue Buffalo, and Nulo alongside expert services",
    keywords:
      "Dog Brands Services Renton, WA , Acana, AvoDerm, ,Blue Buffalo, Canine Caviar, Earthborn, Evanger's, KOHA,Natural Balance,Northwest Naturals,Nulo, KOHA",
  },
  aquatic: {
    title: "Aquatic Brands Service Renton, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets in Renton, WA provides expert aquarium services alongside top aquatic brands like Fluval, Aqueon, and Red Sea",
    keywords:
      "Aquatic Brands Services Renton, WA . API Freshwater & Saltwater Master Test Kits ,AquaTop, Aqueon,CaribSea, Fluval Aquatics, Fritz, Hikari, Hygger, Red Sea",
  },
  reptile: {
    title: "Reptile Brands Service Renton, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets in Renton, WA provides top reptile brands like ExoTerra, Zoo Med, and Repashy alongside expert setup services.",
    keywords:
      "Aquatic Brands Services Renton, WA , ExoTerra ,Galapagos, Komodo Reptile , OutRider Reptile,Repashy Super Foods,Zilla,Zoo Med",
  },
  "small-animal": {
    title: "Small-animal Brands Service Renton, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets in Renton, WA offers top small-animal brands like Oxbow, Kaytee, and Higgins alongside expert pet care services.",
    keywords:
      "Small-animal Brands Services Renton, WA . A&E, Higgins, Kaytee, Oxbow, Round Lake Farms",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const canonicalUrl = `https://www.sierrafishandpets.com/brands/category/${slug}`;

  const customMeta = CATEGORY_METADATA[slug];
  if (customMeta) {
    return {
      title: customMeta.title,
      description: customMeta.description,
      keywords: customMeta.keywords,
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }

  const formatted = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${formatted} Brands | Sierra Fish & Pets`,
    description: `Explore trusted ${slug} pet food and care brands available at Sierra Fish & Pets.`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  dog: "Dog",
  cat: "Cat",
  aquatic: "Aquatic",
  reptile: "Reptile",
  bird: "Bird",
  "small-animal": "Small Animal",
};

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

export default async function BrandCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brands = await getBrands();

  const breadcrumbs: { label: string; href?: string }[] = [
    { label: "Home", href: "/" },
    { label: "Brands", href: "/brands" },
    { label: CATEGORY_LABELS[slug] ?? slug },
  ];

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
          <div className="flex justify-center items-center py-20 bg-[#f8fafc]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#005AA9]" />
          </div>
        }
      >
        <BrandGrid brands={brands} initialCategory={slug} />
      </Suspense>

      <BrandCTA />
    </main>
  );
}
