"use client";

import InstagramGallery from "@/components/Home/InstagramGallery";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative text-white">
      {/* HERO SECTION (FIXED BACKGROUND) */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* FIXED BACKGROUND */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/images/banner/about5.png"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          {/* <div className="absolute inset-0 bg-black/40" /> */}
        </div>

        {/* centered text */}
        <div className="text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-wide">
            OWN YOUR PETS
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Premium care for dogs, cats & exotic pets
          </p>

          <Link
            href="/shop"
            className="inline-block mt-6 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Explore Store
          </Link>
        </div>
      </section>

      {/* SECOND SECTION (PARALLAX BACKGROUND) */}
      <section
            className="relative h-[600px] flex items-center bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/images/banner/about4.png')",
            }}
            >
            {/* Optional overlay */}
            <div className="absolute inset-0 bg-black/10"></div>

            <div className="relative z-10 max-w-6xl mx-auto w-full px-6">
                <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-bold text-black">
                    We're always here for our customers
                </h2>

                <p className="mt-4 text-gray-700 text-lg">
                    We provide high-quality pet products and care solutions for every
                    type of pet — from daily essentials to premium lifestyle products.
                </p>

                <button className="mt-6 bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
                    Learn More
                </button>
                </div>
            </div>
            </section>

        <section className="bg-[#f8f8f8] py-24">
  <div className="max-w-6xl mx-auto px-6">
    <Swiper
      modules={[Navigation, Autoplay]}
      navigation
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop
      className="review-slider"
    >
      {reviews.map((item) => (
        <SwiperSlide key={item.id}>
          <div className="max-w-4xl mx-auto text-center">
            <FaQuoteLeft className="mx-auto text-6xl text-gray-300 mb-8" />

            <div className="flex justify-center gap-1 mb-8">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={
                    index < item.rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>

            <h3 className="text-3xl md:text-5xl font-semibold text-gray-500 leading-relaxed">
              {item.review}
            </h3>

            <div className="w-14 h-[2px] bg-gray-300 mx-auto my-10"></div>

            <div className="flex items-center justify-center gap-4">
              <Image
                src={item.image}
                alt={item.name}
                width={70}
                height={70}
                className="rounded-full object-cover"
              />

              <div className="text-left">
                <h4 className="text-xl font-semibold text-black">
                  {item.name}
                </h4>

                <p className="text-gray-500">
                  {item.designation}
                </p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</section>

      {/* NORMAL CONTENT SECTION */}
      <section className="bg-white text-gray-800 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-900">Our Mission</h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            We aim to make pet care simple, affordable, and accessible for every
            pet owner. Our focus is on health, happiness, and comfort.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-semibold">Quality Products</h3>
            <p className="text-gray-600 mt-2">Trusted items for pets</p>
          </div>

          <div>
            <h3 className="font-semibold">Fast Delivery</h3>
            <p className="text-gray-600 mt-2">Quick shipping nationwide</p>
          </div>

          <div>
            <h3 className="font-semibold">Pet First Approach</h3>
            <p className="text-gray-600 mt-2">Everything built for pets</p>
          </div>
        </div>
      </section>


       <InstagramGallery/>
     
    </main>
  );
}
