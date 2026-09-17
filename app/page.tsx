import type { Metadata } from 'next'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import CategoryCards from '@/components/Home/CategoryCard'
import HeroBanner from '@/components/Home/HeroBanner'
import React from 'react'
import { connectDB } from '@/lib/mongodb'
import CategoryModel from '@/models/Category'

// Dynamically import below-the-fold sections for code splitting & faster initial page load
const PromoBlocksCarousel = dynamic(() => import('@/components/Home/PromoBlocksCarousel'))
const NewArrivals = dynamic(() => import('@/components/Home/NewArrivals'))
const FeaturesSection = dynamic(() => import('@/components/Home/FeaturesSection'))
const TasteGuarantee = dynamic(() => import('@/components/Home/TasteGuarantee'))
const BestSellers = dynamic(() => import('@/components/Home/BestSellers'))
const PopularBrands = dynamic(() => import('@/components/Home/PopularBrand'))
const YoutubeSection = dynamic(() => import('@/components/Home/YoutubeSection'))
const HomeStorySection = dynamic(() => import('@/components/Home/HomeStorySection'))
const InstagramGallery = dynamic(() => import('@/components/Home/InstagramGallery'))

export const metadata: Metadata = {
  title: "Sierra Fish and Pets| Buy Aquarium Fish Online| Pet Store near me",
  description: "Sierra Fish and Pets are a leading online pet store in Renton, WA 98057 with a full line of pet food and supplies for dogs, cats, birds, fish, Reptile, and more. Our home aquarium services can help you get everything you need for all of your pets.",
  keywords: "sierra fish and pets renton wa, custom aquarium installation and maintenance renton, local pet store near uwajimaya renton, exotic freshwater and saltwater fish shop renton wa, cichlids and rare fish store northern wa, full line dog cat reptile supplies renton, aquarium relocation and tank design services renton, online pet store, online pet shop, pet supplies, fish aquarium, dog food, pet shop, tropical fish, pet fish, pet food, freshwater fish, saltwater fish, aquarium supplies",
  verification: {
    google: "U957d8dOOMO1NW4G3BK4Ldw89GLbpaHpTxW94QDoDPY",
    other: {
      "msvalidate.01": "1BB129FEAAF6199B1343CAA6C26A920F",
    },
  },
}

const page = async () => {
  let categories = [];
  try {
    await connectDB();
    const rawCategories = await CategoryModel.find({}).sort({ name: 1 }).lean();
    categories = JSON.parse(JSON.stringify(rawCategories));
  } catch (error) {
    console.error("Failed to pre-fetch categories on server:", error);
  }

  const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["WebSite"],
        "@id": "https://sierrafishandpets.com/#website",
        "url": "https://sierrafishandpets.com",
        "name": "Sierra Fish & Pets",
        "description": "Renton's Premier Local Pet Store & Custom Aquarium Specialists Since 1972",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://sierrafishandpets.com/shop?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": ["PetStore", "LocalBusiness", "Store"],
        "@id": "https://sierrafishandpets.com/#store",
        "name": "Sierra Fish & Pets",
        "alternateName": "Sierra Fish and Pets",
        "url": "https://sierrafishandpets.com",
        "logo": "https://sierrafishandpets.com/images/logo/sierra-logo.png",
        "image": [
          "https://sierrafishandpets.com/images/banner/shophero3.png",
          "https://sierrafishandpets.com/images/banner/about2.png"
        ],
        "telephone": "+1-425-226-3215",
        "priceRange": "$$",
        "founder": {
          "@type": "Person",
          "name": "Mr. JONAS STERNBERG"
        },
        "foundingDate": "1972",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "601 S Grady Way",
          "addressLocality": "Renton",
          "addressRegion": "WA",
          "postalCode": "98057",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 47.4727,
          "longitude": -122.2135
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ],
            "opens": "11:00",
            "closes": "19:00"
          }
        ],
        "hasMap": "https://maps.app.goo.gl/48Q7dQBbespuFhX27",
        "about": [
          {
            "@type": "Thing",
            "name": "Custom Aquarium Design, Installation & Maintenance",
            "description": "Professional residential and commercial custom aquariums, live fish, and maintenance services in Renton, WA."
          },
          {
            "@type": "Thing",
            "name": "Full-Line Pet Supplies",
            "description": "Premium foods and care supplies for dogs, cats, birds, reptiles, and small animals."
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-HRPVY4BRXE"
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-HRPVY4BRXE');
        `}
      </Script>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />
      <HeroBanner/>
      <CategoryCards initialCategories={categories}/>
      <PromoBlocksCarousel/>
      <NewArrivals/>
      <FeaturesSection/>
      <TasteGuarantee/>
      <BestSellers/>
      <PopularBrands/>
      <YoutubeSection/>
      <HomeStorySection/>
      <InstagramGallery/>
    </>
  )
}

export default page