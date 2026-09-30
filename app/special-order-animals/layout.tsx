import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Special Order Pets & Rare Fish | Sierra Fish & Pets",
  description:
    "Special order rare freshwater & saltwater fish, exotic reptiles, and birds in Renton, WA with custom sourcing and healthy arrivals at Sierra Fish & Pets.",
  keywords: [
    "special order pets renton wa",
    "rare fish special order",
    "exotic reptiles renton",
    "custom pet sourcing",
    "sierra fish and pets special orders",
    "special order tropical fish",
  ],
  alternates: {
    canonical: "https://sierrafishandpets.com/special-order-animals",
  },
  openGraph: {
    title: "Special Order Pets & Rare Fish | Sierra Fish & Pets",
    description:
      "Special order rare freshwater & saltwater fish, exotic reptiles, and birds in Renton, WA with custom sourcing and healthy arrivals at Sierra Fish & Pets.",
    url: "https://sierrafishandpets.com/special-order-animals",
    siteName: "Sierra Fish & Pets",
    images: [
      {
        url: "https://sierrafishandpets.com/images/services/s1.png",
        width: 1200,
        height: 630,
        alt: "Special Order Pets & Rare Fish - Sierra Fish & Pets",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Special Order Pets & Rare Fish | Sierra Fish & Pets",
    description:
      "Special order rare freshwater & saltwater fish, exotic reptiles, and birds in Renton, WA with custom sourcing and healthy arrivals at Sierra Fish & Pets.",
    images: ["https://sierrafishandpets.com/images/services/s1.png"],
  },
};

export default function SpecialOrderAnimalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://sierrafishandpets.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Services",
            "item": "https://sierrafishandpets.com/services"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Special Order Pets",
            "item": "https://sierrafishandpets.com/special-order-animals"
          }
        ]
      },
      {
        "@type": "Service",
        "serviceType": "Special Order Pets & Rare Fish Sourcing",
        "provider": {
          "@type": "PetStore",
          "name": "Sierra Fish & Pets",
          "url": "https://sierrafishandpets.com",
          "telephone": "+1-425-226-3215",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "601 S Grady Way",
            "addressLocality": "Renton",
            "addressRegion": "WA",
            "postalCode": "98057",
            "addressCountry": "US"
          }
        },
        "description": "Custom sourcing service for rare freshwater and saltwater fish, exotic reptiles, and specialty birds from certified ethical breeders and importers."
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
