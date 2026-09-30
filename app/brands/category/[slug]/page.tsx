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
  { title: string; description: string; keywords?: string[] }
> = {
  dog: {
    title: "Top Dog Food & Supplies Brands | Sierra Fish & Pets",
    description:
      "Explore premium dog food, treats, and healthcare brands including Acana, Nulo, and Blue Buffalo in Renton, WA at Sierra Fish & Pets.",
    keywords: [
      "dog food brands renton wa",
      "premium dog food brands",
      "Acana dog food",
      "Nulo pet food",
      "healthy dog treats renton",
    ],
  },
  cat: {
    title: "Premium Cat Food & Care Brands | Sierra Fish & Pets",
    description:
      "Shop trusted cat food, nutrition, and wellness brands including Acana, Nulo, and Earthborn in Renton, WA at Sierra Fish & Pets.",
    keywords: [
      "cat food brands renton wa",
      "premium cat nutrition",
      "Acana cat food",
      "Nulo cat food",
      "feline care supplies",
    ],
  },
  aquatic: {
    title: "Top Aquarium & Fish Care Brands | Sierra Fish & Pets",
    description:
      "Discover industry-leading aquatic brands like Seachem, Fluval, API, and Red Sea for thriving aquariums in Renton, WA at Sierra Fish & Pets.",
    keywords: [
      "aquarium brands renton wa",
      "Seachem supplies",
      "Fluval aquatics",
      "API test kits",
      "Red Sea reef care",
    ],
  },
  reptile: {
    title: "Reptile Habitats & Food Brands | Sierra Fish & Pets",
    description:
      "Browse trusted reptile brands including Zoo Med, Exo Terra, and Repashy for healthy habitats and nutrition in Renton, WA at Sierra Fish & Pets.",
    keywords: [
      "reptile supplies brands renton",
      "Zoo Med habitats",
      "Exo Terra terrariums",
      "Repashy superfoods",
    ],
  },
  "small-animal": {
    title: "Small Animal Food & Bedding Brands | Sierra Fish & Pets",
    description:
      "Find top small animal brands including Oxbow, Kaytee, and Higgins for rabbits, guinea pigs, and birds in Renton, WA at Sierra Fish & Pets.",
    keywords: [
      "small animal brands renton",
      "Oxbow timothy hay",
      "Kaytee pet supplies",
      "Higgins small pet food",
    ],
  },
  bird: {
    title: "Bird Food & Cage Accessory Brands | Sierra Fish & Pets",
    description:
      "Explore trusted bird food, seed blends, and cage accessories for parakeets, parrots, and canaries at Sierra Fish & Pets in Renton, WA.",
    keywords: [
      "bird food brands renton wa",
      "pet bird supplies",
      "Higgins bird food",
      "avian care renton",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const canonicalUrl = `https://sierrafishandpets.com/brands/category/${slug}`;

  const customMeta = CATEGORY_METADATA[slug];
  if (customMeta) {
    return {
      title: customMeta.title,
      description: customMeta.description,
      keywords: customMeta.keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: customMeta.title,
        description: customMeta.description,
        url: canonicalUrl,
        siteName: "Sierra Fish & Pets",
        images: ["https://sierrafishandpets.com/images/banner/shophero3.png"],
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
