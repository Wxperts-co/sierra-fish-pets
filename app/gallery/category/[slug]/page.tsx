import { Suspense } from "react";
import { GalleryContent } from "../../page";

import type { Metadata } from "next";

const GALLERY_CATEGORY_META: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  store: {
    title: "Gallery Pet Store Seattle WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets features an extensive store gallery showing high-quality pet products, thriving aquatic habitats, and healthy exotic animals.",
    keywords: [
      "Pet Store Seattle WA",
      "Best Pet Store Seattle WA",
      "Bird shop Seattle WA",
      "pet food store Seattle WA",
      "pet food supplies Seattle WA",
    ],
  },
  "dog-cat": {
    title: "Dog and Cat Supplies Seattle WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides premium dog and cat food, durable toys, grooming essentials, and nutrition advice for Seattle pet parents..",
    keywords: [
      "Dog and Cat Supplies Seattle WA",
      "Best Cat Supplies Seattle WA",
      "Bird shop Seattle WA",
      "pet food store Seattle WA",
      "pet food supplies Seattle WA",
    ],
  },
  fish: {
    title: "Fish Aquarium Seattle WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides custom aquariums, healthy livestock, water testing, and premium fishkeeping supplies for Seattle area aquatic enthusiasts.",
    keywords: [
      "fish Aquarium Seattle WA",
      "Best fish Aquarium Seattle WA",
      "Bird shop Seattle WA",
      "pet food store Seattle WA",
      "pet food supplies Seattle WA",
    ],
  },
  reptile: {
    title: "Reptile Services Seattle WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides high-quality reptile habitats, nutritional feeders, specialized lighting, and expert guidance for Seattle exotic pet owners.",
    keywords: [
      "Reptile Services Seattle WA",
      "Best Reptile Services Seattle WA",
      "Bird shop Seattle WA",
      "pet food store Seattle WA",
      "pet food supplies Seattle WA",
    ],
  },
  bird: {
    title: "Bird Services Seattle WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides top-quality bird supplies, expert care guidance, cages, and professional wing trimming for Seattle area pet owners",
    keywords: [
      "Bird Services Seattle WA",
      "Best Bird Services Seattle WA",
      "Bird shop Seattle WA",
      "pet food store Seattle WA",
      "pet food supplies Seattle WA",
    ],
  },
  "small-pet": {
    title: "Small Pet Food Supplies Seattle WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides high-quality food, nutritious diets, and essential care supplies for small pets throughout the Seattle area.",
    keywords: [
      "Small Pet Food Supplies Seattle WA",
      "Best Small Pet Food Supplies Seattle WA",
      "Bird shop Seattle WA",
      "pet food store Seattle WA",
      "pet food supplies Seattle WA",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const canonicalUrl = `https://sierrafishandpets.com/gallery/category/${slug}`;
  const config = GALLERY_CATEGORY_META[slug.toLowerCase()];

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
      twitter: {
        card: "summary_large_image",
        title: config.title,
        description: config.description,
        images: ["https://sierrafishandpets.com/images/banner/shophero3.png"],
      },
    };
  }

  const formatted = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
  const fallbackTitle = `${formatted} Gallery | Sierra Fish & Pets`.length <= 60
    ? `${formatted} Gallery | Sierra Fish & Pets`
    : `${formatted} Photos | Sierra Fish & Pets`;

  const fallbackDesc = `Browse ${formatted} photos, animal habitats, and pet supplies in Renton, WA at Sierra Fish & Pets.`;

  return {
    title: fallbackTitle,
    description: fallbackDesc,
    keywords: [`${slug} gallery`, `${slug} photos renton`, "sierra fish and pets gallery"],
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
    twitter: {
      card: "summary_large_image",
      title: fallbackTitle,
      description: fallbackDesc,
      images: ["https://sierrafishandpets.com/images/banner/shophero3.png"],
    },
  };
}

export default async function GalleryCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 pt-24 text-center">
          Loading Gallery...
        </div>
      }
    >
      <GalleryContent initialCat={slug} />
    </Suspense>
  );
}
