import React from "react";
import type { Metadata } from "next";
import eduData from "@/data/sierraedu.json";

interface EducationSlugLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
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

  const canonicalUrl = `https://sierrafishandpets.com/education/${slug}`;

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
