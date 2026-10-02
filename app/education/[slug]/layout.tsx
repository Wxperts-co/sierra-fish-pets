import React from "react";
import type { Metadata } from "next";
import eduData from "@/data/sierraedu.json";

interface EducationSlugLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

const EDUCATION_EXACT_META: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  "puppy-care-basics": {
    title: "Puppy Care Services Bellevue, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides expert puppy care services, premium growth diets, training essentials, and gentle grooming supplies for Bellevue area owners.",
    keywords: [
      "Puppy Care Services Bellevue, WA",
      "Best Puppy Care Services Bellevue, WA",
      "Bird shop Bellevue, WA",
      "pet food store Bellevue, WA",
      "pet food supplies Bellevue, WA",
    ],
  },
  "cat-care": {
    title: "Cat Care Services Bellevue, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides expert cat care services, premium feline diets, litter solutions, and wellness accessories for Bellevue area cat owners.",
    keywords: [
      "Cat Care Services Bellevue, WA",
      "Best Cat Care Services Bellevue, WA",
      "Bird shop Bellevue, WA",
      "pet food store Bellevue, WA",
      "pet food supplies Bellevue, WA",
    ],
  },
  "setting-up-a-fw-aquarium": {
    title: "Aquarium Services Newcastle WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides expert aquarium services, custom tank maintenance, precise water testing, and healthy livestock for Newcastle area fish hobbyists.",
    keywords: [
      "Aquarium Services Newcastle WA",
      "Best Aquarium Services Newcastle WA",
      "Bird shop Bellevue, WA",
      "pet food store Bellevue, WA",
      "pet food supplies Bellevue, WA",
    ],
  },
  "fw-aquarium-checklist": {
    title: "FW Aquarium Services Newcastle WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets in Renton, WA hosts community dog adoption and rescue events to help local shelter animals find loving homes.",
    keywords: [
      "FW Aquarium Services Newcastle WA",
      "Best FW Aquarium Services Newcastle WA",
      "Bird shop Bellevue, WA",
      "pet food store Bellevue, WA",
      "pet food supplies Bellevue, WA",
    ],
  },
  "fw-care": {
    title: "FW Care Services Newcastle WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets offers expert freshwater aquarium services, custom water maintenance, healthy tropical fish, and quality supplies for Newcastle fish keepers.",
    keywords: [
      "FW Care Services Newcastle WA",
      "Best FW Care Services Newcastle WA",
      "Bird shop Bellevue, WA",
      "pet food store Bellevue, WA",
      "pet food supplies Bellevue, WA",
    ],
  },
  "goldfish-in-a-fishbowl": {
    title: "Goldfish In A Fishbowl Newcastle WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets guides Newcastle owners toward proper goldfish care, recommending spacious, filtered aquariums rather than small traditional bowls.",
    keywords: [
      "Goldfish In A Fishbowl Newcastle WA",
      "Best Goldfish In A Fishbowl Newcastle WA",
      "Bird shop Bellevue, WA",
      "pet food store Bellevue, WA",
      "pet food supplies Bellevue, WA",
    ],
  },
  "betta-fish-care": {
    title: "Betta Fish Care Newcastle WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides expert Betta fish care guidance, compact aquariums, high-quality pellets, and water conditioners near Newcastle, Washington",
    keywords: [
      "Betta Fish Care Newcastle WA",
      "Best Betta Fish Care Newcastle WA",
      "Bird shop Bellevue, WA",
      "pet food store Bellevue, WA",
      "pet food supplies Bellevue, WA",
    ],
  },
  "aquarium-water-change": {
    title: "Aquarium Water Change Newcastle WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides professional aquarium water testing, maintenance tools, conditioners, and expert water change advice near Newcastle, Washington.",
    keywords: [
      "Aquarium Water Change Newcastle WA",
      "Best Aquarium Water Change Newcastle WA",
      "Bird shop Bellevue, WA",
      "pet food store Bellevue, WA",
      "pet food supplies Bellevue, WA",
    ],
  },
  "live-plant-care": {
    title: "Live Plant Care Newcastle WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets offers vibrant aquatic live plants, specialized fertilizers, substrate materials, and expert planted tank advice near Newcastle, Washington.",
    keywords: [
      "Live Plant Care Newcastle WA",
      "Best Live Plant Care Newcastle WA",
      "Bird shop Bellevue, WA",
      "pet food store Bellevue, WA",
      "pet food supplies Bellevue, WA",
    ],
  },
  "axolotl-care": {
    title: "Axolotl Care Newcastle WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets offers specialized axolotl care guidance, pristine water supplies, cold-water tanks, and proper nutrition near Newcastle, Washington.",
    keywords: [
      "Axolotl Care Newcastle WA",
      "Best Axolotl Care Newcastle WA",
      "Bird shop Bellevue, WA",
      "pet food store Bellevue, WA",
      "pet food supplies Bellevue, WA",
    ],
  },
  "purchasing-reptiles": {
    title: "Purchasing Reptiles Seattle WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides healthy captive-bred reptiles, full terrarium setups, feeder insects, and expert care advice for Seattle pet parents.",
    keywords: [
      "Axolotl Care Seattle WA",
      "Best Purchasing Reptiles Seattle WA",
      "Bird shop Seattle WA",
      "pet food store Seattle WA",
      "pet food supplies Seattle WA",
    ],
  },
  "basic-bird-care": {
    title: "Basic Bird Care Maple valley WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets serves Maple Valley, WA, offering nutritious food, spacious cages, interactive toys, and expert basic bird care advice.",
    keywords: [
      "Basic Bird Care Maple valley WA",
      "Best Bird Care Maple valley WA",
      "Bird shop SeaTac, WA",
      "pet food store SeaTac, WA",
      "pet food supplies SeaTac, WA",
    ],
  },
  "bird-foods-to-avoid": {
    title: "Bird Foods Maple valley WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets in Maple Valley, WA, offers premium bird foods, nutritious seeds, pellets, and expert dietary care advice.",
    keywords: [
      "Bird Foods Maple valley WA",
      "Best Bird Foods Maple valley WA",
      "Bird shop SeaTac, WA",
      "pet food store SeaTac, WA",
      "pet food supplies SeaTac, WA",
    ],
  },
  "bird-training": {
    title: "Bird Training Maple valley WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets in Maple Valley, WA, provides expert bird training tools, helpful techniques, and guidance for easy taming.",
    keywords: [
      "Bird Training Maple valley WA",
      "Best Bird Training Maple valley WA",
      "Bird shop SeaTac, WA",
      "pet food store SeaTac, WA",
      "pet food supplies SeaTac, WA",
    ],
  },
  "chinchilla-care": {
    title: "Chinchilla Care Maple valley WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets in Maple Valley, WA, offers essential chinchilla care supplies, dust baths, nutritious hay, and expert habitat advice.",
    keywords: [
      "Chinchilla Care Maple valley WA",
      "Best Chinchilla Care Maple valley WA",
      "Bird shop SeaTac, WA",
      "pet food store SeaTac, WA",
      "pet food supplies SeaTac, WA",
    ],
  },
  "gerbil-care": {
    title: "Gerbil Care Maple valley WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets in Maple Valley, WA, provides essential gerbil care supplies, nutritious food, deep bedding, and expert advice.",
    keywords: [
      "Gerbil Care Care Maple valley WA",
      "Best Gerbil Care Maple valley WA",
      "Bird shop SeaTac, WA",
      "pet food store SeaTac, WA",
      "pet food supplies SeaTac, WA",
    ],
  },
  "guinea-pig-care": {
    title: "Guinea Pig Care Maple valley WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets in Maple Valley, WA, offers premium guinea pig care supplies, vitamin C treats, spacious habitats, and expert guidance.",
    keywords: [
      "Guinea Pig Care Maple valley WA",
      "Best Guinea Pig Care Maple valley WA",
      "Bird shop SeaTac, WA",
      "pet food store SeaTac, WA",
      "pet food supplies SeaTac, WA",
    ],
  },
  "hamster-care": {
    title: "Hamster Care Maple valley WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets in Maple Valley, WA, delivers essential hamster care supplies, nutritious diets, cozy bedding, and expert habitat guidance.",
    keywords: [
      "Hamster Care Maple valley WA",
      "Best Hamster Care Maple valley WA",
      "Bird shop SeaTac, WA",
      "pet food store SeaTac, WA",
      "pet food supplies SeaTac, WA",
    ],
  },
  "rat-care": {
    title: "Rat Care Maple valley WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets in Maple Valley, WA, offers complete rat care supplies, nutritious food, spacious habitats, and expert pet advice.",
    keywords: [
      "Rat Care Maple valley WA",
      "Best Rat Care Maple valley WA",
      "Bird shop SeaTac, WA",
      "pet food store SeaTac, WA",
      "pet food supplies SeaTac, WA",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const canonicalUrl = `https://sierrafishandpets.com/education/${slug}`;

  const exactMeta = EDUCATION_EXACT_META[slug.toLowerCase()];
  if (exactMeta) {
    const item = (eduData as any[]).find((e) => e.slug === slug);
    const coverImage = item?.coverImage || "https://sierrafishandpets.com/images/banner/shophero3.png";
    return {
      title: exactMeta.title,
      description: exactMeta.description,
      keywords: exactMeta.keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: exactMeta.title,
        description: exactMeta.description,
        url: canonicalUrl,
        siteName: "Sierra Fish & Pets",
        images: [coverImage],
      },
      twitter: {
        card: "summary_large_image",
        title: exactMeta.title,
        description: exactMeta.description,
        images: [coverImage],
      },
    };
  }

  const item = (eduData as any[]).find((e) => e.slug === slug);

  if (!item) {
    return {
      title: "Education Article | Sierra Fish & Pets",
      description: "Learn about pet care, aquarium maintenance, and animal nutrition with Sierra Fish & Pets.",
    };
  }

  const rawTitle = item.title;
  const brandSuffix = " | Sierra Fish & Pets";
  let title = rawTitle.includes("Sierra Fish") ? rawTitle : `${rawTitle}${brandSuffix}`;
  if (title.length > 60) {
    title = rawTitle.length <= 60 ? rawTitle : `${rawTitle.slice(0, 57)}...`;
  }

  const rawDesc = item.excerpt || item.description || "";
  const description = rawDesc.length > 0
    ? (rawDesc.length <= 155 ? rawDesc : `${rawDesc.slice(0, 152)}...`)
    : `Learn expert ${item.title} tips, step-by-step care guidance, and pet nutrition essentials at Sierra Fish & Pets in Renton, WA.`;

  const keywords = [
    item.title,
    `${item.title} renton wa`,
    item.category || "Pet Care Guide",
    ...(item.tags || []),
    "sierra edu",
    "sierra fish and pets education",
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Sierra Fish & Pets",
      images: [
        item.coverImage || "https://sierrafishandpets.com/images/banner/shophero3.png",
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        item.coverImage || "https://sierrafishandpets.com/images/banner/shophero3.png",
      ],
    },
  };
}

export default function EducationSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
