import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gift Cards: Digital & Physical | Sierra Fish & Pets Renton",
  description:
    "Buy digital e-gift cards and traditional mail gift cards for pet lovers, fish hobbyists, and aquarium setups at Sierra Fish & Pets in Renton, WA.",
  keywords: [
    "pet gift cards renton wa",
    "aquarium gift card",
    "e gift card pet store",
    "traditional physical gift card",
    "sierra fish and pets gift cards",
    "pet supply gift voucher",
  ],
  alternates: {
    canonical: "https://sierrafishandpets.com/gift-cards",
  },
  openGraph: {
    title: "Gift Cards: Digital & Physical | Sierra Fish & Pets Renton",
    description:
      "Buy digital e-gift cards and traditional mail gift cards for pet lovers, fish hobbyists, and aquarium setups at Sierra Fish & Pets in Renton, WA.",
    url: "https://sierrafishandpets.com/gift-cards",
    siteName: "Sierra Fish & Pets",
    images: [
      {
        url: "https://sierrafishandpets.com/images/banner/shophero3.png",
        width: 1200,
        height: 630,
        alt: "Gift Cards - Sierra Fish & Pets",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gift Cards: Digital & Physical | Sierra Fish & Pets Renton",
    description:
      "Buy digital e-gift cards and traditional mail gift cards for pet lovers, fish hobbyists, and aquarium setups at Sierra Fish & Pets in Renton, WA.",
    images: ["https://sierrafishandpets.com/images/banner/shophero3.png"],
  },
};

export default function GiftCardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
