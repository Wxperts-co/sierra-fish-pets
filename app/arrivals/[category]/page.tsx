import type { Metadata } from "next";
import ArrivalsContainer from "@/components/arrivals/ArrivalsContainer";
import NewArrivalModel from "@/models/NewArrival";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

const CATEGORY_META_CONFIG: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  fish: {
    title: "New Aquarium Fish Arrivals | Sierra Fish & Pets Renton",
    description:
      "Explore new weekly arrivals of freshwater and marine fish, live plants, corals, and aquatic invertebrates at Sierra Fish & Pets in Renton, WA.",
    keywords: [
      "new aquarium fish arrivals",
      "freshwater fish stock renton",
      "marine fish arrivals",
      "live aquarium plants renton",
    ],
  },
  freshwater: {
    title: "New Freshwater Fish Arrivals | Sierra Fish & Pets",
    description:
      "Discover newly arrived tropical freshwater fish, cichlids, tetras, bettas, and live aquarium plants in Renton, WA at Sierra Fish & Pets.",
    keywords: [
      "new freshwater fish arrivals",
      "tropical fish stock renton",
      "cichlids renton wa",
      "planted tank fish",
    ],
  },
  saltwater: {
    title: "New Saltwater Fish & Corals | Sierra Fish & Pets",
    description:
      "Browse new marine fish, saltwater invertebrates, and live coral arrivals in Renton, WA with expert care at Sierra Fish & Pets.",
    keywords: [
      "new saltwater fish arrivals",
      "marine fish renton",
      "live coral arrivals",
      "reef tank invertebrates",
    ],
  },
  reptiles: {
    title: "New Reptile & Amphibian Arrivals | Sierra Fish & Pets",
    description:
      "Meet new captive-bred reptiles, geckos, bearded dragons, and habitat supplies arriving weekly in Renton, WA at Sierra Fish & Pets.",
    keywords: [
      "new reptile arrivals renton",
      "bearded dragon stock",
      "geckos renton wa",
      "exotic pet arrivals",
    ],
  },
  "exotic-pets": {
    title: "New Exotic Pets & Reptiles | Sierra Fish & Pets Renton",
    description:
      "Discover new exotic reptiles, amphibians, and specialty pet arrivals with expert habitat care at Sierra Fish & Pets in Renton, WA.",
    keywords: [
      "exotic pets renton wa",
      "reptiles and amphibians",
      "specialty pets renton",
    ],
  },
  birds: {
    title: "New Pet Bird Arrivals Renton | Sierra Fish & Pets",
    description:
      "Discover healthy pet birds, parrots, finches, and specialty avian supplies arriving at Sierra Fish & Pets in Renton, WA.",
    keywords: [
      "new pet bird arrivals",
      "parrots renton wa",
      "finches and canaries",
      "avian pet care",
    ],
  },
  "small-animals": {
    title: "New Small Animal Arrivals | Sierra Fish & Pets Renton",
    description:
      "Meet newly arrived rabbits, guinea pigs, hamsters, and small pet care supplies in Renton, WA at Sierra Fish & Pets.",
    keywords: [
      "new small animal arrivals",
      "guinea pigs renton",
      "pet rabbits renton",
      "hamsters and small pets",
    ],
  },
  "small-pets": {
    title: "New Small Pet Arrivals | Sierra Fish & Pets Renton",
    description:
      "Explore newly arrived small companion pets, rabbits, guinea pigs, and nutrition essentials in Renton, WA at Sierra Fish & Pets.",
    keywords: [
      "small pets renton wa",
      "small animal arrivals",
      "pocket pets renton",
    ],
  },
  dogs: {
    title: "New Dog Supplies & Accessories | Sierra Fish & Pets",
    description:
      "Check out newly arrived premium dog food, treats, toys, and grooming gear in Renton, WA at Sierra Fish & Pets.",
    keywords: [
      "new dog supplies renton",
      "premium dog food arrivals",
      "dog toys and treats",
    ],
  },
  cats: {
    title: "New Cat Supplies & Toys | Sierra Fish & Pets Renton",
    description:
      "Explore new arrivals of healthy cat food, treats, scratching posts, and feline supplies in Renton, WA at Sierra Fish & Pets.",
    keywords: [
      "new cat supplies renton",
      "cat food arrivals",
      "cat toys and scratchers",
    ],
  },
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const canonicalUrl = `https://sierrafishandpets.com/arrivals/${category}`;
  const config = CATEGORY_META_CONFIG[category.toLowerCase()];

  if (config) {
    return {
      title: config.title,
      description: config.description,
      keywords: config.keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: config.title,
        description: config.description,
        url: canonicalUrl,
        siteName: "Sierra Fish & Pets",
        images: ["https://sierrafishandpets.com/images/banner/shophero3.png"],
      },
    };
  }

  const formatted = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ");
  const fallbackTitle = `New ${formatted} Arrivals | Sierra Fish & Pets`.length <= 60
    ? `New ${formatted} Arrivals | Sierra Fish & Pets`
    : `${formatted} Arrivals | Sierra Fish & Pets`;

  const fallbackDesc = `Explore new ${formatted} arrivals, pet care essentials, and livestock in Renton, WA at Sierra Fish & Pets.`;

  return {
    title: fallbackTitle,
    description: fallbackDesc,
    keywords: [`new ${category} arrivals`, `${category} renton wa`, "sierra fish and pets arrivals"],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fallbackTitle,
      description: fallbackDesc,
      url: canonicalUrl,
      siteName: "Sierra Fish & Pets",
      images: ["https://sierrafishandpets.com/images/banner/shophero3.png"],
    },
  };
}

export default async function ArrivalsCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  await connectDB();

  const rawArrivals = await NewArrivalModel.find().sort({ createdAt: -1 }).lean();
  const arrivals = JSON.parse(JSON.stringify(rawArrivals));

  return <ArrivalsContainer initialCategory={category} initialArrivals={arrivals} />;
}

// Generate static params to enable static generation for all expected route categories
export async function generateStaticParams() {
  return [
    { category: "dogs" },
    { category: "cats" },
    { category: "birds" },
    { category: "fish" },
    { category: "small-pets" },
    { category: "exotic-pets" },
    { category: "reptiles" },
    { category: "small-animals" },
    { category: "freshwater" },
    { category: "saltwater" },
  ];
}
