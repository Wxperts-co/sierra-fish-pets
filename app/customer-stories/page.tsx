import React from "react";
import type { Metadata } from "next";
import CustomerStoriesClient from "@/components/customer-stories/CustomerStoriesClient";
import reviewsData from "@/data/reviews.json";

export const metadata: Metadata = {
  title: "Customer Stories & Community Reviews | Sierra Fish & Pets",
  description:
    "Explore heartfelt customer stories, real aquarium setups, and verified Google reviews from our Sierra Fish & Pets family in Renton, WA.",
  keywords: [
    "sierra fish and pets customer stories",
    "pet store reviews renton wa",
    "aquarium customer reviews",
    "sierra pets testimonials",
    "fish keeping stories",
    "google reviews sierra fish and pets",
    "renton local pet store reviews",
  ],
  alternates: {
    canonical: "https://sierrafishandpets.com/customer-stories",
  },
  openGraph: {
    title: "Customer Stories & Community Reviews | Sierra Fish & Pets",
    description:
      "Explore heartfelt customer stories, real aquarium setups, and verified Google reviews from our Sierra Fish & Pets family in Renton, WA.",
    url: "https://sierrafishandpets.com/customer-stories",
    siteName: "Sierra Fish & Pets",
    images: [
      {
        url: "https://sierrafishandpets.com/images/banner/shophero3.png",
        width: 1200,
        height: 630,
        alt: "Sierra Fish & Pets Customer Stories",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Customer Stories & Community Reviews | Sierra Fish & Pets",
    description:
      "Explore heartfelt customer stories, real aquarium setups, and verified Google reviews from our Sierra Fish & Pets family in Renton, WA.",
    images: ["https://sierrafishandpets.com/images/banner/shophero3.png"],
  },
};

export default function CustomerStoriesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "PetStore",
        "@id": "https://sierrafishandpets.com/#store",
        "name": "Sierra Fish & Pets",
        "url": "https://sierrafishandpets.com",
        "image": "https://sierrafishandpets.com/images/logo/logo.png",
        "telephone": "+1-425-226-3215",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "305 Burnett Ave S",
          "addressLocality": "Renton",
          "addressRegion": "WA",
          "postalCode": "98057",
          "addressCountry": "US",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 47.4789,
          "longitude": -122.2064,
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "bestRating": "5",
          "worstRating": "1",
          "reviewCount": reviewsData.length.toString(),
        },
        "review": reviewsData.map((rev) => ({
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": rev.name,
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1",
          },
          "reviewBody": rev.review,
          "publisher": {
            "@type": "Organization",
            "name": "Google",
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://sierrafishandpets.com",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Customer Stories",
            "item": "https://sierrafishandpets.com/customer-stories",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CustomerStoriesClient />
    </>
  );
}
