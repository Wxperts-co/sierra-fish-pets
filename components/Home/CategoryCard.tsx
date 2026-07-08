"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useState, useCallback, useEffect, useRef } from "react";
import type { Category } from "@/types";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const CATEGORY_BACKGROUNDS: Record<string, string> = {
  dog: "bg-[#FFF0ED]",
  cat: "bg-[#F6EFFF]",
  aquatic: "bg-[#EBF7FF]",
  reptile: "bg-[#EEFBF0]",
  bird: "bg-[#FFFBE5]",
  "small-animal": "bg-[#F5F5F7]",
};

// Each card flies in from a unique direction
const CARD_DIRECTIONS: { x: number; y: number }[] = [
  { x: 0,   y: 60  },  // 0 — from bottom
  { x: 0,   y: -60 },  // 1 — from top
  { x: -60, y: 0   },  // 2 — from left
  { x: 60,  y: 0   },  // 3 — from right
  { x: 50,  y: 50  },  // 4 — from bottom-right
  { x: -50, y: 50  },  // 5 — from bottom-left
];

export default function CategoryCards({ initialCategories = [] }: { initialCategories?: Category[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [current, setCurrent] = useState(0);

  const getSortedCategories = (cats: Category[]) => {
    return [...cats].sort((a: Category, b: Category) => {
      const aIsOther = a.slug.includes("other");
      const bIsOther = b.slug.includes("other");
      if (aIsOther && !bIsOther) return 1;
      if (!aIsOther && bIsOther) return -1;
      return 0;
    });
  };

  const [categories, setCategories] = useState<Category[]>(() => getSortedCategories(initialCategories));

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(getSortedCategories(initialCategories));
    } else {
      fetch("/api/categories")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.categories)) {
            setCategories(getSortedCategories(data.categories));
          }
        })
        .catch(() => {});
    }
  }, [initialCategories]);

  // Trigger card animations when the carousel scrolls into view
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  const [animKey, setAnimKey] = useState(0);

  // Increment key each time section enters view → remounts cards → replays animation
  useEffect(() => {
    if (isInView) setAnimKey((k) => k + 1);
  }, [isInView]);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
      setCurrent(api.selectedScrollSnap());
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <section ref={sectionRef} className="pt-8 pb-16 bg-white overflow-hidden">
      <div className="container  px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-10 flex items-center justify-between"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            <span className="text-[#005AA9]">Top</span> categories
          </h2>

          {/* Nav Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              disabled={!canPrev}
              suppressHydrationWarning
              aria-label="Previous category"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:bg-[#005AA9] hover:border-[#005AA9] hover:text-white hover:shadow-md hover:scale-110 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canNext}
              suppressHydrationWarning
              aria-label="Next category"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:bg-[#005AA9] hover:border-[#005AA9] hover:text-white hover:shadow-md hover:scale-110 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: false }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {categories.map((category, index) => (
              <CarouselItem
                key={category.id}
                className="pl-4 basis-1/3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
              >
                <Link
                  href={`/shop/?category=${category.slug}`}
                  className="group flex flex-col items-center w-full"
                >
                  {/* Card — remounts on each viewport entry, replaying directional fly-in */}
                  <motion.div
                    key={`card-${index}-${animKey}`}
                    initial={{
                      opacity: 0,
                      scale: 0.88,
                      x: CARD_DIRECTIONS[index % CARD_DIRECTIONS.length].x,
                      y: CARD_DIRECTIONS[index % CARD_DIRECTIONS.length].y,
                    }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: index * 0.06,
                    }}
                    className={`aspect-square w-[90%] mx-auto rounded-[1.2rem] sm:w-full sm:rounded-[2rem] relative overflow-hidden transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-xl ${
                      CATEGORY_BACKGROUNDS[category.slug] || "bg-slate-100"
                    }`}
                  >
                    <Image
                      src={category.image || "/images/categories/default.png"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 33vw, (max-width: 1024px) 33vw, 16vw"
                    />

                    {/* Plus icon overlay on hover */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                      <div className="w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300">
                        <Plus className="w-5 h-5 stroke-[3] text-slate-800" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Label */}
                  <motion.div
                    key={`label-${index}-${animKey}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: index * 0.06 + 0.15,
                    }}
                    className="mt-3 text-center"
                  >
                    <h3 className="text-[13px] sm:text-[17px] font-black tracking-tight text-slate-800 group-hover:text-[#005AA9] transition-colors">
                      {category.name}
                    </h3>
                  </motion.div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dot indicators */}
        <div className="mt-6 flex justify-center gap-2">
          {categories.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to category ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? "w-6 bg-[#005AA9]"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
