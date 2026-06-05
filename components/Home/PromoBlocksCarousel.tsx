"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import promoBlocksData from "@/data/promoblocks.json";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PromoBlock {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

const promoBlocks = promoBlocksData as PromoBlock[];

// Per-card config: solid background color + text color + CTA color
const CARD_CONFIG: Record<string, { bg: string; textColor: string; subtitleColor: string; btnBg: string; btnText: string }> = {
  "1": { bg: "#FF6B35", textColor: "#1a0a00", subtitleColor: "#7a2e00", btnBg: "#fff", btnText: "#FF6B35" }, // DoorDash – warm orange
  "2": { bg: "#EBF7FF", textColor: "#002244", subtitleColor: "#005AA9", btnBg: "#005AA9", btnText: "#fff" }, // Monthly Offers – light blue
  "3": { bg: "#F5A623", textColor: "#1a0a00", subtitleColor: "#7a3e00", btnBg: "#E85D2A", btnText: "#fff" }, // Dog Adoptions – amber
  "4": { bg: "#E8F5E9", textColor: "#1b3a2a", subtitleColor: "#2e7d52", btnBg: "#2e7d52", btnText: "#fff" }, // Our Mission – soft green
  "5": { bg: "#E0F7FA", textColor: "#003540", subtitleColor: "#006070", btnBg: "#006070", btnText: "#fff" }, // Aquarium Services – teal
  "6": { bg: "#E8EAF6", textColor: "#1a1e5a", subtitleColor: "#3040AA", btnBg: "#3040AA", btnText: "#fff" }, // Aquarium Philosophy – indigo
};

// ─── PromoCard ────────────────────────────────────────────────────────────────

function PromoCard({ block }: { block: PromoBlock }) {
  const cfg = CARD_CONFIG[block.id] ?? {
    bg: "#EBF7FF", textColor: "#002244", subtitleColor: "#005AA9",
    btnBg: "#005AA9", btnText: "#fff",
  };

  return (
    <Link
      href={block.link}
      className="group relative flex h-[320px] w-full overflow-hidden rounded-3xl shadow-md sm:h-[340px] lg:h-[340px]"
      aria-label={`${block.title} — ${block.subtitle}`}
      style={{ backgroundColor: cfg.bg }}
    >
      {/* z-0 ── Full-card background image — zooms on hover ── */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-[filter] duration-[800ms] delay-[300ms] ease-in-out group-hover:grayscale"
        style={{ backgroundImage: `url('${block.image}')` }}
        role="img"
        aria-hidden="true"
      />

      {/* z-10 ── Gray overlay — invisible at rest, fades in on hover ── */}
      <div className="absolute inset-0 z-10 bg-black/0 transition-colors duration-[800ms] delay-[300ms] ease-in-out group-hover:bg-black/25" />

      {/* z-20 ── Text content — always above overlay, never affected by hover ── */}
      <div className="relative z-20 flex h-full w-[52%] flex-col justify-center gap-3 py-8 pl-8 pr-2">
        {/* Subtitle */}
        <p
          className="text-[10px] font-extrabold uppercase tracking-[0.18em]"
          style={{ color: cfg.subtitleColor }}
        >
          {block.subtitle}
        </p>

        {/* Title */}
        <h3
          className="text-xl font-extrabold leading-snug sm:text-2xl"
          style={{ color: cfg.textColor }}
        >
          {block.title}
        </h3>

        {/* CTA — pill style */}
        <span
          className="mt-1 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2 text-sm font-bold shadow transition-all duration-300 group-hover:gap-3 group-hover:shadow-md"
          style={{ backgroundColor: cfg.btnBg, color: cfg.btnText }}
        >
          Shop Now
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}


// ─── Dot Indicators ───────────────────────────────────────────────────────────

function DotIndicators({
  api,
  total,
}: {
  api: CarouselApi | undefined;
  total: number;
}) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    update();
    api.on("select", update);
    return () => { api.off("select", update); };
  }, [api]);

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          id={`promo-dot-${i}`}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => api?.scrollTo(i)}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            i === selected
              ? "w-8 bg-[#005AA9]"
              : "w-2 bg-slate-300 hover:bg-[#00AEEF]"
          )}
        />
      ))}
    </div>
  );
}

// ─── PromoBlocksCarousel (main export) ───────────────────────────────────────

export default function PromoBlocksCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Embla autoplay — 4 s, pauses on hover/touch
  const autoplay = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
    autoplay.current.reset();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
    autoplay.current.reset();
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
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
    <section className="py-0">
      <div className="container mx-auto px-4">

        {/* ── Carousel — buttons float absolutely over left/right edges ── */}
        <div className="relative">

          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            plugins={[autoplay.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-5">
              {promoBlocks.map((block) => (
                <CarouselItem
                  key={block.id}
                  className="pl-5 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <PromoCard block={block} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Left nav — sits exactly on the left card border */}
          <button
            id="promo-carousel-prev"
            onClick={scrollPrev}
            disabled={!canPrev}
            aria-label="Previous promotion"
            className={cn(
              "absolute left-0 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2",
              "flex h-10 w-10 items-center justify-center rounded-full",
              "bg-white/60 backdrop-blur-sm transition-all duration-300",
              canPrev
                ? "opacity-30 shadow hover:opacity-90 hover:shadow-md hover:scale-110"
                : "pointer-events-none opacity-0"
            )}
          >
            <ArrowLeft className="h-4 w-4 text-slate-700" strokeWidth={1.8} />
          </button>

          {/* Right nav — sits exactly on the right card border */}
          <button
            id="promo-carousel-next"
            onClick={scrollNext}
            disabled={!canNext}
            aria-label="Next promotion"
            className={cn(
              "absolute right-0 top-1/2 z-20 translate-x-1/2 -translate-y-1/2",
              "flex h-10 w-10 items-center justify-center rounded-full",
              "bg-white/60 backdrop-blur-sm transition-all duration-300",
              canNext
                ? "opacity-30 shadow hover:opacity-90 hover:shadow-md hover:scale-110"
                : "pointer-events-none opacity-0"
            )}
          >
            <ArrowRight className="h-4 w-4 text-slate-700" strokeWidth={1.8} />
          </button>

        </div>

        {/* ── Dot indicators ── */}
        <DotIndicators api={api} total={promoBlocks.length} />
      </div>
    </section>
  );
}
