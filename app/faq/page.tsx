import React from "react";
import type { Metadata } from "next";
import FaqClient from "@/components/faq/FaqClient";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Sierra Fish & Pets Renton, WA",
  description:
    "Find answers to common questions about Sierra Fish & Pets in Renton, WA. Learn about our store hours, live fish guarantee, free water testing, pet nail trims, aquarium installations, and loyalty rewards.",
  keywords: [
    "sierra fish and pets faq",
    "frequently asked questions pet store renton",
    "free aquarium water testing renton",
    "pet nail trim renton wa",
    "custom aquarium installation seattle",
    "live fish guarantee renton",
    "astro loyalty program sierra pets",
    "special order pets renton wa",
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
      "Have questions about our fish, pets, aquarium services, or store policies? Browse our comprehensive FAQ or contact our passionate team in Renton, WA.",
    url: "https://sierrafishandpets.com/faq",
    siteName: "Sierra Fish & Pets",
    images: [
      {
        url: "https://sierrafishandpets.com/images/banner/shophero3.png",
        width: 1200,
        height: 630,
        alt: "Sierra Fish & Pets FAQ",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions (FAQ) | Sierra Fish & Pets",
    description:
      "Find answers to all your pet care, aquarium, and shopping questions at Sierra Fish & Pets.",
    images: ["https://sierrafishandpets.com/images/banner/shophero3.png"],
  },
};

export default function FaqPage() {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Where is Sierra Fish & Pets located and what are your store hours?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sierra Fish & Pets is conveniently located at 601 S 3rd St, Renton, WA 98057. We are open Monday through Saturday from 10:00 AM to 7:00 PM, and Sunday from 11:00 AM to 6:00 PM.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer free aquarium water testing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Bring a clean, uncontaminated sample of your aquarium or pond water (at least 1 cup) to our store, and our aquatic specialists will test it for pH, ammonia, nitrite, nitrate, salinity, and alkalinity for free while providing actionable advice.",
        },
      },
      {
        "@type": "Question",
        name: "What is your live fish and animal guarantee policy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We take immense pride in our livestock health. We provide a 48-hour livestock guarantee on most freshwater and saltwater fish when accompanied by a separate water sample from your tank and original register receipt.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer pet nail trimming and wing clipping services?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! We provide walk-in nail trims for dogs, cats, rabbits, guinea pigs, and gentle wing and beak trims for birds. Please call ahead or visit during service hours to ensure staff availability.",
        },
      },
      {
        "@type": "Question",
        name: "Can I special order specific animals, fish, or aquarium supplies?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. If you're looking for a specific fish species, rare coral, exotic reptile, or specialized piece of equipment, talk to our team or submit a request via our Special Order Animals page and we will source it through our verified ethical distributors.",
        },
      },
      {
        "@type": "Question",
        name: "How do your customer loyalty and rewards programs work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer two great rewards programs: our In-Store Loyalty Program (earn 1 point per $1 spent, redeemable for instant store discounts) and the Astro Frequent Buyer Program (buy 10-12 bags of participating pet food brands and get 1 bag free). You can stack both programs simultaneously!",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <FaqClient />
    </>
  );
}
