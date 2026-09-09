import React from "react";
import type { Metadata } from "next";
import CustomerStoriesClient from "@/components/customer-stories/CustomerStoriesClient";
import reviewsData from "@/data/reviews.json";

export const metadata: Metadata = {
  title: "Customer Stories & Community Reviews | Sierra Fish & Pets Renton, WA",
  description:
    "Explore heartfelt customer stories, real aquarium setups, and verified Google reviews from our Sierra Fish & Pets family in Renton, WA.",
  keywords: [
    "sierra fish and pets customer stories",
    "pet store reviews renton wa",
    "aquarium customer reviews seattle",
    "sierra pets testimonials",
    "fish keeping stories renton",
    "google reviews sierra fish and pets",
    "renton local pet store reviews",
    "planted tank setup stories",
    "small animal rabbit care renton",
    "saltwater coral reviews wa",
    "king county pet store testimonials",
  ],
  alternates: {
    canonical: "https://sierrafishandpets.com/customer-stories",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Customer Stories & Community Reviews | Sierra Fish & Pets Renton, WA",
    description:
      "Explore heartfelt customer stories, real aquarium setups, and verified Google reviews from our Sierra Fish & Pets family in Renton, WA.",
    url: "https://sierrafishandpets.com/customer-stories",
    siteName: "Sierra Fish & Pets",
    images: [
      {
        url: "https://sierrafishandpets.com/images/banner/shophero3.png",
        width: 1200,
        height: 630,
        alt: "Sierra Fish & Pets Customer Stories and Community Reviews",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Customer Stories & Community Reviews | Sierra Fish & Pets Renton, WA",
    description:
      "Explore heartfelt customer stories, real aquarium setups, and verified Google reviews from our Sierra Fish & Pets family in Renton, WA.",
    images: ["https://sierrafishandpets.com/images/banner/shophero3.png"],
  },
};

export default function CustomerStoriesPage() {
  const semanticKeynotes = [
    {
      title: "Beginner Aquarium Mentorship & Holiday Wishes",
      description:
        "Highlights how first-time fish owners receive step-by-step guidance on tank sizing, substrate, filtration, and species care, turning holiday surprise nervousness into thriving family aquariums.",
    },
    {
      title: "Comprehensive Multi-Store Regional Comparison",
      description:
        "Explores how dedicated hobbyists compared six independent and retail pet stores across the I-405 corridor in King County, discovering unmatched livestock health, cleanliness, and authentic passion at Sierra Fish & Pets.",
    },
    {
      title: "Overcoming Nitrogen Cycle & Water Chemistry Anxiety",
      description:
        "Details expert aquatic consultations that guide beginners through tank cycling, water parameters, live plant selection, and compatibility to establish thriving planted freshwater ecosystems.",
    },
    {
      title: "First-Time Small Animal & Rabbit Parenting Care",
      description:
        "Emphasizes specialized, patient staff guidance for new pet owners covering baby rabbit nutrition, safe habitat setups, and gentle handling practices.",
    },
    {
      title: "Integrated All-in-One Multi-Pet Sanctuary Supply",
      description:
        "Focuses on the convenience of a deeply stocked, organized store catering simultaneously to custom aquariums, exotic birds, and small mammals under one roof.",
    },
    {
      title: "Specialty Saltwater Corals, Rare Macroalgae & Exotic Livestock",
      description:
        "Showcases specialized livestock curation, from rare macroalgae varieties and coral frags to uncommon freshwater and marine fish not typically found in standard big-box stores.",
    },
    {
      title: "Authentic Community Trust & Verified Social Proof",
      description:
        "Demonstrates genuine 5-star Google review ratings and verified photographic evidence from real local pet parents in Renton, Washington.",
    },
  ];

  const nerEntities = [
    { type: "Organization", name: "Sierra Fish & Pets" },
    { type: "Organization", name: "Google" },
    { type: "Person", name: "Alyssa (Aquatics Specialist)" },
    { type: "Person", name: "Sarah Proctor (Customer)" },
    { type: "Person", name: "Derek Marks (Customer)" },
    { type: "Person", name: "Joe Tobin (Customer)" },
    { type: "Person", name: "Q Z (Customer)" },
    { type: "Person", name: "Nathan Drysdale (Customer)" },
    { type: "Person", name: "Schuyler Summers (Customer)" },
    { type: "Person", name: "Shawnee Knight (Customer)" },
    { type: "Place", name: "Renton, Washington" },
    { type: "Place", name: "King County, Washington" },
    { type: "Place", name: "I-405 Corridor" },
    { type: "Product", name: "Freshwater Aquariums & Livestock" },
    { type: "Product", name: "Saltwater Fish & Corals" },
    { type: "Product", name: "Rare Macroalgae" },
    { type: "Product", name: "Live Planted Tanks" },
    { type: "Product", name: "Small Mammal & Rabbit Care Supplies" },
    { type: "Product", name: "Bird Nutrition & Habitats" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["WebPage", "CollectionPage"],
        "@id": "https://sierrafishandpets.com/customer-stories#webpage",
        "url": "https://sierrafishandpets.com/customer-stories",
        "name": "Customer Stories & Community Reviews | Sierra Fish & Pets",
        "description":
          "Explore heartfelt customer stories, real aquarium setups, and verified Google reviews from our Sierra Fish & Pets family in Renton, WA.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://sierrafishandpets.com/#website",
          "name": "Sierra Fish & Pets",
          "url": "https://sierrafishandpets.com",
        },
        "about": semanticKeynotes.map((kn) => ({
          "@type": "Thing",
          "name": kn.title,
          "description": kn.description,
        })),
        "mentions": nerEntities.map((entity) => ({
          "@type": entity.type === "Place" ? "Place" : entity.type === "Person" ? "Person" : entity.type === "Organization" ? "Organization" : "Thing",
          "name": entity.name,
        })),
      },
      {
        "@type": "PetStore",
        "@id": "https://sierrafishandpets.com/#store",
        "name": "Sierra Fish & Pets",
        "url": "https://sierrafishandpets.com",
        "image": "https://sierrafishandpets.com/images/banner/shophero3.png",
        "logo": "https://sierrafishandpets.com/images/logo/logo.png",
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
          "itemReviewed": {
            "@type": "PetStore",
            "name": "Sierra Fish & Pets",
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://sierrafishandpets.com/customer-stories#breadcrumbs",
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

