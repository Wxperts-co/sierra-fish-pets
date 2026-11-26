import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sierra Edu: Pet Care Guides & Tips | Sierra Fish & Pets",
  description:
    "Learn pet care, aquarium setup, nutrition tips, and reptile habitat management with Sierra Edu educational guides from Sierra Fish & Pets in Renton, WA.",
  keywords: [
    "sierra edu",
    "pet education guides",
    "aquarium care tutorials",
    "pet care tips renton wa",
    "reptile habitat guide",
    "sierra fish and pets education",
  ],
  alternates: {
    canonical: "https://www.sierrafishandpets.com/education",
  },
  openGraph: {
    title: "Sierra Edu: Pet Care Guides & Tips | Sierra Fish & Pets",
    description:
      "Learn pet care, aquarium setup, nutrition tips, and reptile habitat management with Sierra Edu educational guides from Sierra Fish & Pets in Renton, WA.",
    url: "https://www.sierrafishandpets.com/education",
    siteName: "Sierra Fish & Pets",
    images: [
      {
        url: "https://www.sierrafishandpets.com/images/banner/shophero3.png",
        width: 1200,
        height: 630,
        alt: "Sierra Edu - Sierra Fish & Pets",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sierra Edu: Pet Care Guides & Tips | Sierra Fish & Pets",
    description:
      "Learn pet care, aquarium setup, nutrition tips, and reptile habitat management with Sierra Edu educational guides from Sierra Fish & Pets in Renton, WA.",
    images: ["https://www.sierrafishandpets.com/images/banner/shophero3.png"],
  },
};

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
