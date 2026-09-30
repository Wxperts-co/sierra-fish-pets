import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pet & Aquarium Photo Gallery | Sierra Fish & Pets",
  description:
    "Explore our photo gallery featuring custom aquariums, tropical fish, reptiles, puppies, cats, and our Renton, WA store at Sierra Fish & Pets.",
  keywords: [
    "pet store gallery renton wa",
    "custom aquarium photos",
    "tropical fish photos",
    "reptiles and pets gallery",
    "sierra fish and pets photos",
  ],
  alternates: {
    canonical: "https://sierrafishandpets.com/gallery",
  },
  openGraph: {
    title: "Pet & Aquarium Photo Gallery | Sierra Fish & Pets",
    description:
      "Explore our photo gallery featuring custom aquariums, tropical fish, reptiles, puppies, cats, and our Renton, WA store at Sierra Fish & Pets.",
    url: "https://sierrafishandpets.com/gallery",
    siteName: "Sierra Fish & Pets",
    images: [
      {
        url: "https://sierrafishandpets.com/images/banner/shophero3.png",
        width: 1200,
        height: 630,
        alt: "Photo Gallery - Sierra Fish & Pets",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet & Aquarium Photo Gallery | Sierra Fish & Pets",
    description:
      "Explore our photo gallery featuring custom aquariums, tropical fish, reptiles, puppies, cats, and our Renton, WA store at Sierra Fish & Pets.",
    images: ["https://sierrafishandpets.com/images/banner/shophero3.png"],
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
