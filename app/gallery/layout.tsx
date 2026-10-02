import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery Pet Shop Seattle WA | Sierra Fish & Pets",
  description:
    "Sierra Fish and Pets invites Seattle families to explore their vibrant store gallery displaying healthy animals, custom aquariums, and quality supplies.",
  keywords: [
    "Pet Shop Seattle WA",
    "Best Pet Shop Seattle WA",
    "Bird shop Seattle WA",
    "pet food store Seattle WA",
    "pet food supplies Seattle WA",
  ],
  alternates: {
    canonical: "https://sierrafishandpets.com/gallery",
  },
  openGraph: {
    title: "Gallery Pet Shop Seattle WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets invites Seattle families to explore their vibrant store gallery displaying healthy animals, custom aquariums, and quality supplies.",
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
    title: "Gallery Pet Shop Seattle WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets invites Seattle families to explore their vibrant store gallery displaying healthy animals, custom aquariums, and quality supplies.",
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
