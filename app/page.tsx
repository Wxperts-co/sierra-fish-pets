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
import { connectDB } from '@/lib/mongodb'
import CategoryModel from '@/models/Category'

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
      <HeroBanner/>
      <CategoryCards initialCategories={categories}/>
      <PromoBlocksCarousel/>
      <NewArrivals/>
      {/* <FeaturedProducts/> */}
      <AmazonCTA/>
      <FeaturesSection/>
      <TasteGuarantee/>
      <BestSellers/>
      <PopularBrands/>
      <InstagramGallery/>
    </>
  )
}

export default page