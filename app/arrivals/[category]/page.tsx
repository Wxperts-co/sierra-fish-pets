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
    title: "New Bird Services Kent, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides expert new bird services, nutritional food, spacious cages, and gentle wing trimming for Kent area bird owners.",
    keywords: [
      "New Freshwater Services Kent, WA",
      "Freshwater Services Kent, WA",
      "Bird shop Kent, WA",
      "pet food store Kent WA",
      "pet food supplies Kent WA",
    ],
  },
  saltwater: {
    title: "Saltwater Services Kent, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides expert saltwater maintenance, reef aquariums, high-grade marine salt, and healthy sea livestock for Kent area hobbyists.",
    keywords: [
      "Saltwater Services Kent, WA",
      "Best Saltwater Services Kent, WA",
      "Bird shop Kent, WA",
      "pet food store Kent WA",
      "pet food supplies Kent WA",
    ],
  },
  reptiles: {
    title: "New Reptile Services Kent, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides expert new reptile services, habitat design, specialized lighting, and feeder insects for Kent area reptile enthusiasts.",
    keywords: [
      "New Reptile Services Kent, WA",
      "Best Reptile Services Kent, WA",
      "Bird shop Kent, WA",
      "pet food store Kent WA",
      "pet food supplies Kent WA",
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
    title: "New Bird Services Kent, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides expert new bird services, healthy diets, spacious cages, and wing trimming for pet owners around Kent.",
    keywords: [
      "New Bird Services Kent, WA",
      "Bird Services Kent, WA",
      "Bird shop Kent, WA",
      "pet food store Kent WA",
      "pet food supplies Kent WA",
    ],
  },
  "small-animals": {
    title: "New Small Animal Services Kent, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides expert small animal services, nutritious food, comfortable cages, and health care advice for Kent area pet owners..",
    keywords: [
      "New Small Animal Services Kent, WA",
      "Best Reptile Services Kent, WA",
      "Bird shop Kent, WA",
      "pet food store Kent WA",
      "pet food supplies Kent WA",
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
    title: "New Cat Services Kent, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides expert new cat services, premium feline nutrition, litter essentials,",
    keywords: [
      "New Cat Services Kent, WA",
      "Best Cat Services Kent, WA",
      "Bird shop Kent, WA",
      "pet food store Kent WA",
      "pet food supplies Kent WA",
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
