
import CategoryCards from '@/components/Home/CategoryCard'
import FeaturedProducts from '@/components/Home/FeaturedProduct'
import HeroBanner from '@/components/Home/HeroBanner'
import PromoBlocksCarousel from '@/components/Home/PromoBlocksCarousel'
import React from 'react'

const page = () => {
  return (
    <>
      <HeroBanner/>
      <CategoryCards/>
      <PromoBlocksCarousel/>
      <FeaturedProducts/>
    </>
  )
}

export default page