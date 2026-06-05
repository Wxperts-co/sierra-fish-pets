
import CategoryCards from '@/components/Home/CategoryCard'
import FeaturedProducts from '@/components/Home/FeaturedProduct'
import BestSellers from '@/components/Home/BestSellers'
import NewArrivals from '@/components/Home/NewArrivals'
import HeroBanner from '@/components/Home/HeroBanner'
import PromoBlocksCarousel from '@/components/Home/PromoBlocksCarousel'
import AmazonCTA from '@/components/Home/AmazonCTA'
import FeaturesSection from '@/components/Home/FeaturesSection'
import React from 'react'
import PopularBrands from '@/components/Home/PopularBrand'

const page = () => {
  return (
    <>
      <HeroBanner/>
      <CategoryCards/>
      <NewArrivals/>
      <PromoBlocksCarousel/>
      <FeaturedProducts/>
      <AmazonCTA/>
      <BestSellers/>
      <FeaturesSection/>
      <PopularBrands/>
    </>
  )
}

export default page