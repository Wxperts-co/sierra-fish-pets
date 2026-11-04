import type { Metadata } from 'next'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import CategoryCards from '@/components/Home/CategoryCard'
import HeroBanner from '@/components/Home/HeroBanner'
import AeoDirectAnswerSnippet from '@/components/common/AeoDirectAnswerSnippet'
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
const DynamicSemanticAccordion = dynamic(() => import('@/components/common/DynamicSemanticAccordion'))

export const metadata: Metadata = {
  title: "Sierra Fish & Pets | Renton Pet Store & Aquariums WA",
  description: "Shop premium pet supplies, tropical fish, dog & cat food, reptiles, and custom aquarium design & maintenance at Sierra Fish & Pets in Renton, WA.",
  keywords: "sierra fish and pets, pet store renton wa, aquariums renton wa, tropical fish, pet supplies, dog food, cat food, aquarium maintenance, custom aquariums renton, freshwater fish, saltwater fish, reptile supplies, online pet store",
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
      <HeroBanner/>
      <AeoDirectAnswerSnippet pageKey="home" />
      <CategoryCards initialCategories={categories}/>
      <PromoBlocksCarousel/>
      <NewArrivals/>
      <FeaturesSection/>
      <TasteGuarantee/>
      <BestSellers/>
      <PopularBrands/>
      <YoutubeSection/>
      <HomeStorySection/>
      <DynamicSemanticAccordion pageKey="home" />
      <InstagramGallery/>
    </>
  )
}

export default page