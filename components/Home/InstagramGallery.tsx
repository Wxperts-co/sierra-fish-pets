"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa6";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import instaGalleryData from "@/data/instagallery.json";

interface InstaPhoto {
  image: string;
  alt: string;
}

const photos = instaGalleryData as InstaPhoto[];

export default function InstagramGallery() {
  const [api, setApi] = useState<CarouselApi>();

  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: false })
  );

  return (
    <section className="w-full bg-slate-50 border-t border-slate-100">
      <div className="py-12 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#005AA9] mb-2 block">
          Follow Our Journey
        </span>
        <h2 className="text-3xl font-extrabold leading-tight text-[#002244] font-lato">
          Join Us on <span className="text-[#005AA9]">Instagram</span>
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
          Share your pet moments with us using #SierraPets Yuba City
        </p>
      </div>

      <div className="w-full relative overflow-hidden">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplay.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {photos.map((photo, i) => (
              <CarouselItem
                key={`${photo.image}-${i}`}
                className="pl-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
              >
                <div className="relative w-full overflow-hidden group">
                  <Image
                    src={photo.image}
                    alt={photo.alt || "Instagram Image"}
                    width={460}
                    height={600}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  />
                  <a
                    href="https://www.instagram.com/sierraspetswa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10"
                  >
                    <div className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-[#005AA9] hover:text-white">
                      <FaInstagram className="h-6 w-6" />
                    </div>
                  </a>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
