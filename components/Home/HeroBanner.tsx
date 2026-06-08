"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import banners from "@/data/banners.json";
import mobBanners from "@/data/mobcarousal.json";
import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import RunningDog from "../ui/RunningDog";
import {
  Bot,
  Heart,
  PawPrint,
  Award,
  Truck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function HeroBanner() {
  const [api, setApi] = useState<CarouselApi>();
  const [mobApi, setMobApi] = useState<CarouselApi>();
  const [currentMobIndex, setCurrentMobIndex] = useState(0);

  // Implement smooth autoplay for desktop hero
  useEffect(() => {
    if (!api) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 6000); // 6 seconds auto-advance

    return () => clearInterval(intervalId);
  }, [api]);

  // Implement autoplay and slide tracking for mobile hero
  useEffect(() => {
    if (!mobApi) return;

    setCurrentMobIndex(mobApi.selectedScrollSnap());

    mobApi.on("select", () => {
      setCurrentMobIndex(mobApi.selectedScrollSnap());
    });

    const intervalId = setInterval(() => {
      mobApi.scrollNext();
    }, 3000); // 3 seconds auto-advance

    return () => clearInterval(intervalId);
  }, [mobApi]);

  return (
    <>
      {/* Desktop Hero Section */}
      <section className="relative w-full overflow-hidden group hidden lg:block">
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                {/* Full screen viewport height */}
                <div className="relative w-full h-[100vh]">
                  {/* Banner Image */}
                  <Image
                    src={banner.image}
                    alt={banner.title ?? "Banner"}
                    fill
                    priority
                    className="object-cover select-none"
                  />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4 md:px-6">
                      <div className="max-w-2xl">
                        {/* Pill Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#007CFF]/30 bg-[#E8F3FF] text-[#007CFF] text-sm font-bold mb-6 select-none">
                          <Bot className="w-4 h-4 text-[#007CFF]" />
                          <span>Everything Your Pet Deserves</span>
                          <Heart className="w-3.5 h-3.5 text-[#007CFF]" />
                        </div>

                        {/* Main Heading */}
                        <h1 className="mb-6 text-5xl sm:text-6xl md:text-[68px] lg:text-[76px] font-extrabold tracking-tight text-[#032B53] leading-[1.05]">
                          Happy Pets, <br />
                          <span className="inline-flex items-center gap-2">
                            Happy Life
                            <PawPrint className="w-10 h-10 md:w-14 md:h-14 text-[#007CFF] fill-[#007CFF] shrink-0" />
                          </span>
                        </h1>

                        {/* Subheading */}
                        <p className="mb-8 text-base sm:text-lg font-medium text-slate-500 max-w-lg leading-relaxed">
                          Premium food, toys, and supplies{" "}
                          <br className="hidden sm:inline" />
                          for fish, cats, dogs, birds & more.
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap items-center gap-6 sm:gap-8 mb-10">
                          {/* Premium Quality */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#007CFF] text-white shrink-0 shadow-sm">
                              <Award className="w-6 h-6" />
                            </div>
                            <div className="text-[#032B53] font-bold text-sm md:text-base leading-tight">
                              Premium <br /> Quality
                            </div>
                          </div>

                          {/* Fast Delivery */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#007CFF] text-white shrink-0 shadow-sm">
                              <Truck className="w-6 h-6" />
                            </div>
                            <div className="text-[#032B53] font-bold text-sm md:text-base leading-tight">
                              Fast <br /> Delivery
                            </div>
                          </div>

                          {/* Secure Payments */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#007CFF] text-white shrink-0 shadow-sm">
                              <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div className="text-[#032B53] font-bold text-sm md:text-base leading-tight">
                              Secure <br /> Payments
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                          <Link
                            href="/shop"
                            className="inline-flex items-center justify-center rounded-2xl bg-[#007CFF] hover:bg-[#0066CC] text-white px-8 py-4 text-base font-bold shadow-lg transition-all duration-200 hover:scale-[1.03] active:scale-95 gap-2"
                          >
                            Shop Now
                            <ArrowRight className="w-5 h-5 text-white" />
                          </Link>
                          <Link
                            href="/shop"
                            className="inline-flex items-center justify-center text-[#007CFF] hover:text-[#0066CC] text-base font-bold transition-all duration-200 gap-2 hover:translate-x-1"
                          >
                            Explore Categories
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Translucent premium navigation controls with brand hover theme */}
          <CarouselPrevious className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-[#005AA9] border-none text-white hover:text-white backdrop-blur-sm h-11 w-11 rounded-full transition-all focus:ring-0 active:scale-95" />
          <CarouselNext className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-[#005AA9] border-none text-white hover:text-white backdrop-blur-sm h-11 w-11 rounded-full transition-all focus:ring-0 active:scale-95" />
        </Carousel>

        {/* Wave shape divider */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none w-full overflow-hidden select-none translate-y-[1px]">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[50px] sm:h-[80px] md:h-[100px] lg:h-[120px] fill-white text-white"
          >
            <path d="M0,80 C150,80 350,20 500,40 C650,60 850,120 1000,110 C1150,100 1300,70 1440,60 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* Mobile Hero Carousel */}
      {/* Mobile Hero Carousel */}
          <section className="w-full lg:hidden px-4 pt-4 pb-2 bg-[#fafbfd]/50">
            <Carousel
              setApi={setMobApi}
              opts={{
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {banners.map((banner, index) => (
                  <CarouselItem key={banner.id}>
                    <div className="relative w-full h-[260px] overflow-hidden rounded-2xl shadow-sm border border-slate-100">

                      {/* Banner Image */}
                      <Image
                        src={banner.image}
                        alt={banner.title}
                        fill
                        priority={index === 0}
                        className="object-cover select-none"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/25 to-transparent" />

                      {/* Content */}
                      <div className="absolute inset-0 z-10 flex items-center">
                        <div className="max-w-[65%] px-5">
                          <h2 className="text-white text-lg font-bold leading-tight mb-2">
                            {banner.title}
                          </h2>

                          <p className="text-white/90 text-xs leading-relaxed mb-3">
                            {banner.subtitle}
                          </p>

                          <Link
                            href={banner.ctaLink}
                            className="inline-flex items-center rounded-full bg-white text-slate-900 px-4 py-2 text-xs font-semibold shadow-md transition-all hover:scale-105"
                          >
                            {banner.ctaLabel}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Indicators */}
            <div className="flex justify-center gap-1.5 mt-3">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => mobApi?.scrollTo(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    currentMobIndex === index
                      ? "w-5 bg-slate-900"
                      : "w-2.5 bg-slate-300"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </section>
    </>
  );
}
