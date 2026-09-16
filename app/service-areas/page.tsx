import React from "react";
import type { Metadata } from "next";
import ServiceAreasHubClient from "@/components/service-areas/ServiceAreasHubClient";

export const metadata: Metadata = {
  title: "Service Areas & Pet Supply Locations | Sierra Fish & Pets",
  description:
    "Explore communities served by Sierra Fish & Pets across King County, WA including Kent, Tukwila, SeaTac, Covington, Newcastle, Bellevue, Seattle, Des Moines, and Maple Valley.",
  keywords:
    "service areas Sierra Fish and Pets, King County pet shop, Kent WA pet supplies, Bellevue WA aquarium accessories, Seattle WA fish store, Tukwila WA pet food, SeaTac WA puppy supplies, Covington WA pet store, Newcastle WA dog supplies, Des Moines WA aquariums, Maple Valley WA pet food",
  alternates: {
    canonical: "https://sierrafishandpets.com/service-areas",
  },
  openGraph: {
    title: "Service Areas & Pet Supply Locations | Sierra Fish & Pets",
    description:
      "Explore communities served by Sierra Fish & Pets across King County, WA including Kent, Tukwila, SeaTac, Covington, Newcastle, Bellevue, Seattle, Des Moines, and Maple Valley.",
    url: "https://sierrafishandpets.com/service-areas",
    siteName: "Sierra Fish & Pets",
    locale: "en_US",
    type: "website",
  },
};

export default function ServiceAreasPage() {
  return <ServiceAreasHubClient />;
}
