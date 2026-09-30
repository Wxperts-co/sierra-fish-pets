import type { Metadata } from "next";
import ArrivalsContainer from "@/components/arrivals/ArrivalsContainer";
import NewArrivalModel from "@/models/NewArrival";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Pet & Live Fish Arrivals | Sierra Fish & Pets WA",
  description:
    "Check new weekly arrivals of freshwater & saltwater fish, exotic reptiles, birds, small pets, and quality supplies at Sierra Fish & Pets in Renton, WA.",
  keywords: [
    "new pet arrivals renton wa",
    "new aquarium fish arrivals",
    "new reptile arrivals renton",
    "freshwater fish stock renton",
    "saltwater fish renton",
    "sierra fish and pets new arrivals",
  ],
  alternates: {
    canonical: "https://sierrafishandpets.com/arrivals",
  },
  openGraph: {
    title: "New Pet & Live Fish Arrivals | Sierra Fish & Pets WA",
    description:
      "Check new weekly arrivals of freshwater & saltwater fish, exotic reptiles, birds, small pets, and quality supplies at Sierra Fish & Pets in Renton, WA.",
    url: "https://sierrafishandpets.com/arrivals",
    siteName: "Sierra Fish & Pets",
    images: [
      {
        url: "https://sierrafishandpets.com/images/banner/shophero3.png",
        width: 1200,
        height: 630,
        alt: "New Arrivals - Sierra Fish & Pets",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Pet & Live Fish Arrivals | Sierra Fish & Pets WA",
    description:
      "Check new weekly arrivals of freshwater & saltwater fish, exotic reptiles, birds, small pets, and quality supplies at Sierra Fish & Pets in Renton, WA.",
    images: ["https://sierrafishandpets.com/images/banner/shophero3.png"],
  },
};

export default async function ArrivalsPage() {
  await connectDB();

  const rawArrivals = await NewArrivalModel.find().sort({ createdAt: -1 }).lean();
  const arrivals = JSON.parse(JSON.stringify(rawArrivals));

  return <ArrivalsContainer initialArrivals={arrivals} />;
}