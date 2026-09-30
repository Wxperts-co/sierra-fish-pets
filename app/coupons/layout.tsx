import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pet Coupons & Special Deals | Sierra Fish & Pets Renton",
  description:
    "Save on pet supplies, dog & cat food, aquarium tanks, and reptile care with exclusive online and in-store coupons from Sierra Fish & Pets in Renton, WA.",
  keywords: [
    "pet coupons renton wa",
    "aquarium discount codes",
    "dog food coupons",
    "pet supply promo codes",
    "sierra fish and pets deals",
    "pet store discounts renton",
  ],
  alternates: {
    canonical: "https://sierrafishandpets.com/coupons",
  },
  openGraph: {
    title: "Pet Coupons & Special Deals | Sierra Fish & Pets Renton",
    description:
      "Save on pet supplies, dog & cat food, aquarium tanks, and reptile care with exclusive online and in-store coupons from Sierra Fish & Pets in Renton, WA.",
    url: "https://sierrafishandpets.com/coupons",
    siteName: "Sierra Fish & Pets",
    images: [
      {
        url: "https://sierrafishandpets.com/images/banner/shophero3.png",
        width: 1200,
        height: 630,
        alt: "Coupons & Deals - Sierra Fish & Pets",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet Coupons & Special Deals | Sierra Fish & Pets Renton",
    description:
      "Save on pet supplies, dog & cat food, aquarium tanks, and reptile care with exclusive online and in-store coupons from Sierra Fish & Pets in Renton, WA.",
    images: ["https://sierrafishandpets.com/images/banner/shophero3.png"],
  },
};

export default function CouponsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
