import { Suspense } from "react";
import { GalleryContent } from "../../page";

import type { Metadata } from "next";

const GALLERY_CATEGORY_META: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  store: {
    title: "Store Photos & Tour Gallery | Sierra Fish & Pets Renton",
    description:
      "Take a visual tour of our Renton, WA pet store, custom aquarium showrooms, and live animal habitats at Sierra Fish & Pets.",
    keywords: [
      "pet store photos renton wa",
      "sierra fish and pets store tour",
      "aquarium showroom photos",
      "local pet shop gallery",
    ],
  },
  fish: {
    title: "Aquarium & Tropical Fish Gallery | Sierra Fish & Pets",
    description:
      "Explore photos of freshwater and marine fish, custom aquascapes, reef tanks, and live corals at Sierra Fish & Pets in Renton, WA.",
    keywords: [
      "tropical fish gallery",
      "aquascape photos",
      "reef tank gallery",
      "saltwater fish photos renton",
    ],
  },
  reptile: {
    title: "Reptiles & Amphibians Gallery | Sierra Fish & Pets",
    description:
      "Browse photos of geckos, bearded dragons, snakes, and custom terrarium setups at Sierra Fish & Pets in Renton, WA.",
    keywords: [
      "reptile photo gallery",
      "bearded dragons photos",
      "terrarium photos renton",
      "exotic pet gallery",
    ],
  },
  bird: {
    title: "Pet Bird Photo Gallery | Sierra Fish & Pets Renton",
    description:
      "Check out photos of parrots, parakeets, finches, and avian habitats at Sierra Fish & Pets in Renton, WA.",
    keywords: [
      "pet bird gallery",
      "parrot photos renton",
      "finches and canaries gallery",
      "avian pet photos",
    ],
  },
  "dog-cat": {
    title: "Dog & Cat Photo Gallery | Sierra Fish & Pets Renton",
    description:
      "Browse photos of happy dogs, cats, puppies, and pet supply arrivals at Sierra Fish & Pets in Renton, WA.",
    keywords: [
      "dog photo gallery",
      "cat photos renton",
      "puppy gallery",
      "pet supply photos",
    ],
  },
  "small-pet": {
    title: "Small Animals Photo Gallery | Sierra Fish & Pets",
    description:
      "Discover adorable photos of rabbits, guinea pigs, hamsters, and small pets at Sierra Fish & Pets in Renton, WA.",
    keywords: [
      "small animal photo gallery",
      "rabbit photos renton",
      "guinea pig gallery",
      "hamster photos",
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
