"use client";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";
import { getFeaturedProducts } from "@/data/products";

export default function HeroProductCarousel() {
  const products = getFeaturedProducts().slice(0, 5);

  return (
    <div className="relative mt-8 w-[340px]">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id}>
              <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-xl">
                <div className="relative h-[220px] w-full">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>

                <div className="pb-5 text-center">
                  <Button
                    size="sm"
                    className="rounded-full px-8"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Left Arrow */}
        <CarouselPrevious
          className="
            absolute
            left-0
            top-1/2
            -translate-y-1/2
            -translate-x-1/2
            h-10
            w-10
            rounded-full
            bg-white
            shadow-lg
            border
          "
        >
          <ChevronLeft className="h-4 w-4" />
        </CarouselPrevious>

        {/* Right Arrow */}
        <CarouselNext
          className="
            absolute
            right-0
            top-1/2
            -translate-y-1/2
            translate-x-1/2
            h-10
            w-10
            rounded-full
            bg-white
            shadow-lg
            border
          "
        >
          <ChevronRight className="h-4 w-4" />
        </CarouselNext>
      </Carousel>
    </div>
  );
}