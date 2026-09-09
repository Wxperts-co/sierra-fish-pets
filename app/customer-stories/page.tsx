import React from "react";
import type { Metadata } from "next";
import CustomerStoriesClient from "@/components/customer-stories/CustomerStoriesClient";

export const metadata: Metadata = {
  title: "Customer Stories & Community Reviews | Sierra Fish & Pets",
  description:
    "Explore heartfelt customer stories, real aquarium setups, and verified pet reviews from our Sierra Fish & Pets family in Renton, WA.",
  keywords: [
    "sierra fish and pets customer stories",
    "pet store reviews renton wa",
    "aquarium customer reviews",
    "sierra pets testimonials",
    "fish keeping stories",
  ],
  openGraph: {
    title: "Customer Stories & Community Reviews | Sierra Fish & Pets",
    description:
      "Explore heartfelt customer stories, real aquarium setups, and verified pet reviews from our Sierra Fish & Pets family in Renton, WA.",
    url: "https://sierrafishandpets.com/customer-stories",
    siteName: "Sierra Fish & Pets",
    type: "website",
  },
};

export default function CustomerStoriesPage() {
  return <CustomerStoriesClient />;
}
