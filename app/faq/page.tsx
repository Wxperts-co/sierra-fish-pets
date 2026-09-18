import React from "react";
import type { Metadata } from "next";
import FaqClient from "@/components/faq/FaqClient";
import faqData from "@/data/faq.json";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Sierra Fish & Pets Renton, WA",
  description:
    "Find answers to frequently asked questions about Sierra Fish & Pets in Renton, WA. Learn about our pet supplies, freshwater & saltwater fish arrivals, custom aquarium design, free water testing, pet grooming & nail trims, dog adoptions, and store hours.",
  keywords: [
    "sierra fish and pets faq",
    "frequently asked questions pet store renton",
    "pet store faq renton wa",
    "free aquarium water testing renton",
    "custom aquarium installation seattle",
    "freshwater and saltwater fish renton",
    "pet nail trimming renton wa",
    "dog adoption events renton wa",
    "fish of the month club sierra pets",
    "sierra fish and pets store hours",
    "pet supplies renton wa",
  ],
  alternates: {
    canonical: "https://sierrafishandpets.com/faq",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Frequently Asked Questions (FAQ) | Sierra Fish & Pets Renton, WA",
    description:
      "Find answers to frequently asked questions about Sierra Fish & Pets in Renton, WA. Learn about our pet supplies, aquatic livestock, custom aquariums, water testing, grooming, and store hours.",
    url: "https://sierrafishandpets.com/faq",
    siteName: "Sierra Fish & Pets",
    images: [
      {
        url: "https://sierrafishandpets.com/images/banner/shophero3.png",
        width: 1200,
        height: 630,
        alt: "Frequently Asked Questions - Sierra Fish & Pets Renton, WA",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions (FAQ) | Sierra Fish & Pets Renton, WA",
    description:
      "Find answers to frequently asked questions about Sierra Fish & Pets in Renton, WA. Pet supplies, fish, custom aquariums, grooming, and store hours.",
    images: ["https://sierrafishandpets.com/images/banner/shophero3.png"],
  },
};

export default function FaqPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["FAQPage", "WebPage"],
        "@id": "https://sierrafishandpets.com/faq#webpage",
        url: "https://sierrafishandpets.com/faq",
        name: "Frequently Asked Questions (FAQ) | Sierra Fish & Pets Renton, WA",
        description:
          "Find answers to frequently asked questions about Sierra Fish & Pets in Renton, WA. Learn about our pet supplies, freshwater & saltwater fish arrivals, custom aquarium design, free water testing, pet grooming & nail trims, dog adoptions, and store hours.",
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://sierrafishandpets.com/#website",
          url: "https://sierrafishandpets.com",
          name: "Sierra Fish & Pets",
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://sierrafishandpets.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "FAQs",
              item: "https://sierrafishandpets.com/faq",
            },
          ],
        },
        mainEntity: faqData.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      {
        "@type": ["PetStore", "LocalBusiness", "Store"],
        "@id": "https://sierrafishandpets.com/#store",
        name: "Sierra Fish & Pets",
        alternateName: "Sierra Fish and Pets",
        url: "https://sierrafishandpets.com",
        logo: "https://sierrafishandpets.com/images/logo/sierra-logo.png",
        image: [
          "https://sierrafishandpets.com/images/banner/shophero3.png",
          "https://sierrafishandpets.com/images/banner/shophero5.png",
        ],
        telephone: "+1-425-226-3215",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "601 S 3rd St",
          addressLocality: "Renton",
          addressRegion: "WA",
          postalCode: "98057",
          addressCountry: "US",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 47.4727,
          longitude: -122.2135,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "11:00",
            closes: "19:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Sunday"],
            opens: "11:00",
            closes: "17:00",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <FaqClient />
    </>
  );
}

