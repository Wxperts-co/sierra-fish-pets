"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import banners from "@/data/banners.json";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";

export default function HeroBanner() {
  const [api, setApi] = useState<CarouselApi>();

  // Implement smooth autoplay
  useEffect(() => {
    if (!api) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 6000); // 6 seconds auto-advance

    return () => clearInterval(intervalId);
  }, [api]);

  return (
    <section className="relative w-full overflow-hidden group">
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

                      {banner.title && (
                        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl lg:text-6xl text-slate-900">
                          {banner.title}
                        </h1>
                      )}

                      {banner.subtitle && (
                        <p className="mb-8 text-lg font-medium text-slate-600 sm:text-xl max-w-lg leading-relaxed">
                          {banner.subtitle}
                        </p>
                      )}

                      {banner.ctaLabel && (
                        <Button
                          asChild
                          size="lg"
                          className="rounded-full bg-[#005AA9] hover:bg-[#004b8d] text-white px-8 py-6 text-base font-bold shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
                        >
                          <Link href={banner.ctaLink ?? "/"}>
                            {banner.ctaLabel}
                          </Link>
                        </Button>
                      )}
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
    </section>
  );
}
