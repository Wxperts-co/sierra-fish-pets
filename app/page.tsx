import type { Metadata } from 'next'
import Script from 'next/script'
import CategoryCards from '@/components/Home/CategoryCard'
import FeaturedProducts from '@/components/Home/FeaturedProduct'
import BestSellers from '@/components/Home/BestSellers'
import NewArrivals from '@/components/Home/NewArrivals'
import HeroBanner from '@/components/Home/HeroBanner'
import PromoBlocksCarousel from '@/components/Home/PromoBlocksCarousel'
import AmazonCTA from '@/components/Home/AmazonCTA'
import FeaturesSection from '@/components/Home/FeaturesSection'
import React from 'react'
import TasteGuarantee from '@/components/Home/TasteGuarantee'
import PopularBrands from '@/components/Home/PopularBrand'
import InstagramGallery from '@/components/Home/InstagramGallery'
import YoutubeSection from '@/components/Home/YoutubeSection'
import { connectDB } from '@/lib/mongodb'
import CategoryModel from '@/models/Category'

export const metadata: Metadata = {
  title: "Sierra Fish and Pets| Buy Aquarium Fish Online| Pet Store near me",
  description: "Sierra Fish and Pets are a leading online pet store in Renton, WA 98057 with a full line of pet food and supplies for dogs, cats, birds, fish,Reptile, and more. Our home aquarium services can help you get everything you need for all of your pets.",
  keywords: "online pet store,online pet shop,online pet supplies,pet supplies,fish aquarium,dog food,pet shop,tropical fish,pet fish,pet food,tropical fish tanks,dog supplies,aquarium for sale,cheap fish tanks,freshwater fish,cat beds,aquarium supplies,fish for sale,aquarium online,saltwater aquarium, fish tank online,cat supplies,puppy supplies,tropical fish for sale,dog accessories,aquarium accessories,pet beds,freshwater aquarium fish,pet accessories,saltwater fish,pet store near me,fish tank price,freshwater fish for sale,aquarium filter,saltwater fish tank,pet products,dog carriers, buy fish online, freshwater fish tank,discount pet supplies,fish supplies,fish aquarium online,pets at home fish tanks,live fish for sale,aquarium fish tank,online fish store,dog store,cheap pet supplies,aquarium fish for sale,pet carriers,fish aquarium for sale,cat accessories,exotic fish for sale,cheap fish tanks for sale,buy aquarium online, saltwater fish for sale,marine aquarium,marine fish tanks,buy aquarium,buy fish tank,small aquarium fish,live fish,fish store,aquarium tanks for sale,fish tank supplies,buy aquarium fish online,saltwater tank,exotic freshwater fish for sale,aquarium fish price,online aquarium store,pet supply stores,fish aquarium shop,fish for sale online,aquarium store,reef aquarium,saltwater fish tanks for sale,buy fish tank online,puppy accessories,pet food suppliers,pet food store,fish aquarium store,pet collars,tropical freshwater fish,tropical fish store,online fish,aquarium shop online,buy fish,saltwater aquarium fish,fish tank for sale online,tropical fish online,tropical fish aquarium,dog shop,fish aquarium store near me,aquarium tank online,discount dog supplies,freshwater aquarium,tank fish,pet shops near me,fish aquarium accessoriesmarine tank,aquarium supplies online,fish stores near me,local pet stores, dog products,fish tanks for sale near me,fish aquarium near me,buy tropical fish online,tropical fish tanks for sale,aquarium accessories online,live aquarium,fish tank store,aquarium supplies near me,pet fish for sale,fish aquarium home,fish aquarium supplies,aquarium store near me,pet fish shop,puppy store, live freshwater fish,live aquarium fish,buy saltwater fish,exotic fish tanks,buy freshwater fish online,cheap aquariums for sale,home fish tanks,fish tank shop,fish tank online store,fish pet store,buy freshwater fish,freshwater fish pets,online fish shopping,fish tank cabinets,best fish pet store,cat supplies store,cheapest pet fish to buy,pet shop aquarium fish,reef aquarium fish,buy pet store,pet food pet supplies,best site for dog supplies,cat accessories for home,stores for dogs,all pet supplies,marine fish suppliers,natural pet supplies,aquarium pet fish,online aquatic store,aquatic fish store near me,buy fish supplies, order pet supplies,pretty fish for sale,cheap fish aquarium supplies,cheapest pet products,pet warehouse,colorful fish for sale,pet fish for sale near me,order pet fish online,dog food shop,shop fish aquarium,fish aquarium home online,best online fish store,fish tank supplies near me,fish aquarium online purchase\nonline shopping aquarium,",
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
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-HRPVY4BRXE');
        `}
      </Script>
      <HeroBanner/>
      <CategoryCards initialCategories={categories}/>
      <PromoBlocksCarousel/>
      <NewArrivals/>
      {/* <FeaturedProducts/> */}
      {/* <AmazonCTA/> */}
      <FeaturesSection/>
      <TasteGuarantee/>
      <BestSellers/>
      <PopularBrands/>
      <YoutubeSection/>
      <InstagramGallery/>
    </>
  )
}

export default page