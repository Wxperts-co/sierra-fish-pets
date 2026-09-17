import React from "react";
import type { Metadata } from "next";
import AboutPageClient from "@/components/about/AboutPageClient";

export const metadata: Metadata = {
  title: "About Sierra Fish & Pets | Renton's Trusted Family-Owned Pet Store Since 1972",
  description:
    "Since 1972, trusted Sierra Fish and Pets in Renton, WA provides quality aquariums, reptiles, pet supplies, and expert aquarium maintenance services.",
  keywords: [
    "sierra fish and pets renton wa",
    "family owned pet store renton",
    "local aquarium and pet care experts renton",
    "trusted pet store since 1972 renton wa",
    "honest pet supply store near cedar river trail",
    "ethical fish and pet supply shop renton",
    "local dog and aquatic specialists renton wa",
    "Renton WA Pet Care Experts",
    "Aquariums Reptiles & Pet Supplies in Renton",
  ],
  alternates: {
    canonical: "https://sierrafishandpets.com/about",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  openGraph: {
    title: "About Sierra Fish & Pets | Renton's Trusted Family-Owned Pet Store Since 1972",
    description:
      "Family-owned local pet store in Renton, WA since 1972. Explore premium freshwater & saltwater aquariums, reptiles, quality pet foods, and expert pet care.",
    url: "https://sierrafishandpets.com/about",
    siteName: "Sierra Fish & Pets",
    images: [
      {
        url: "https://sierrafishandpets.com/images/banner/about2.png",
        width: 1200,
        height: 630,
        alt: "About Sierra Fish & Pets - Renton, WA",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Sierra Fish & Pets | Renton's Trusted Family-Owned Pet Store Since 1972",
    description:
      "Since 1972, Sierra Fish & Pets has served Renton, WA with expert aquarium services, healthy pets, and high-quality pet supplies.",
    images: ["https://sierrafishandpets.com/images/banner/about2.png"],
  },
};

export default function AboutPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["AboutPage", "WebPage"],
        "@id": "https://sierrafishandpets.com/about#webpage",
        url: "https://sierrafishandpets.com/about",
        name: "About Sierra Fish & Pets | Renton's Trusted Family-Owned Pet Store Since 1972",
        description:
          "Since 1972, trusted Sierra Fish and Pets in Renton, WA provides quality aquariums, reptiles, pet supplies, and expert aquarium maintenance services.",
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
              name: "About Us",
              item: "https://sierrafishandpets.com/about",
            },
          ],
        },
        about: [
          {
            "@type": "Thing",
            name: "Decades-Long Family Heritage & Community Trust",
            description:
              "Sierra Fish & Pets' 50+ year legacy as a family-owned Renton institution since 1972.",
          },
          {
            "@type": "Thing",
            name: "Aquarium & Pet Care Expertise",
            description:
              "Specialized animal husbandry, water chemistry guidance, and aquarium maintenance services.",
          },
        ],
      },
      {
        "@type": ["PetStore", "LocalBusiness", "Store"],
        "@id": "https://sierrafishandpets.com/#store",
        name: "Sierra Fish & Pets",
        alternateName: "Sierra Fish and Pets",
        url: "https://sierrafishandpets.com",
        logo: "https://sierrafishandpets.com/images/logo/sierra-logo.png",
        image: [
          "https://sierrafishandpets.com/images/banner/about2.png",
          "https://sierrafishandpets.com/images/banner/about4.png",
          "https://sierrafishandpets.com/images/banner/shophero3.png",
        ],
        telephone: "+1-425-226-3215",
        priceRange: "$$",
        founder: {
          "@type": "Person",
          name: "Mr. JONAS STERNBERG",
        },
        foundingDate: "1972",
        address: {
          "@type": "PostalAddress",
          streetAddress: "601 S Grady Way",
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
        ],
        hasMap: "https://maps.app.goo.gl/48Q7dQBbespuFhX27",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AboutPageClient />
    </>
  );
}
