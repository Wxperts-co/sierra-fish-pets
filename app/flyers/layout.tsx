import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weekly Pet Store Flyers & Deals | Sierra Fish & Pets",
  description:
    "View weekly flyers, discounts, and sales on pet supplies, fish food, aquariums, and accessories at Sierra Fish & Pets in Renton, WA.",
  keywords: [
    "weekly pet store flyers renton",
    "pet supplies weekly sales",
    "aquarium discounts renton wa",
    "fish store flyer specials",
    "sierra fish and pets flyer",
    "pet deals renton",
  ],
  alternates: {
    canonical: "https://sierrafishandpets.com/flyers",
  },
  openGraph: {
    title: "Weekly Pet Store Flyers & Deals | Sierra Fish & Pets",
    description:
      "View weekly flyers, discounts, and sales on pet supplies, fish food, aquariums, and accessories at Sierra Fish & Pets in Renton, WA.",
    url: "https://sierrafishandpets.com/flyers",
    siteName: "Sierra Fish & Pets",
    images: [
      {
        url: "https://sierrafishandpets.com/images/banner/shophero3.png",
        width: 1200,
        height: 630,
        alt: "Weekly Flyers & Specials - Sierra Fish & Pets",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weekly Pet Store Flyers & Deals | Sierra Fish & Pets",
    description:
      "View weekly flyers, discounts, and sales on pet supplies, fish food, aquariums, and accessories at Sierra Fish & Pets in Renton, WA.",
    images: ["https://sierrafishandpets.com/images/banner/shophero3.png"],
  },
};

export default function FlyersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
