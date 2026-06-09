"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
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

// Helper to duplicate items to ensure Embla loop works on all screen sizes
const getLoopedItems = (items: PromoBlock[]) => {
  if (items.length === 0) return [];
  let looped = [...items];
  while (looped.length < 8) {
    looped = [...looped, ...items];
  }
  return looped;
};

const loopedPromoBlocks = getLoopedItems(promoBlocks);

// Per-card config: solid background color + text color + CTA color
const CARD_CONFIG: Record<
  string,
  {
    bg: string;
    textColor: string;
    subtitleColor: string;
    btnBg: string;
    btnText: string;
  }
> = {
  "1": {
    bg: "#FF6B35",
    textColor: "#1a0a00",
    subtitleColor: "#7a2e00",
    btnBg: "#fff",
    btnText: "#FF6B35",
  },
  "2": {
    bg: "#EBF7FF",
    textColor: "#002244",
    subtitleColor: "#005AA9",
    btnBg: "#005AA9",
    btnText: "#fff",
  },
  "3": {
    bg: "#F5A623",
    textColor: "#1a0a00",
    subtitleColor: "#7a3e00",
    btnBg: "#E85D2A",
    btnText: "#fff",
  },
  "4": {
    bg: "#E8F5E9",
    textColor: "#1b3a2a",
    subtitleColor: "#2e7d52",
    btnBg: "#2e7d52",
    btnText: "#fff",
  },
  "5": {
    bg: "#E0F7FA",
    textColor: "#003540",
    subtitleColor: "#006070",
    btnBg: "#006070",
    btnText: "#fff",
  },
  "6": {
    bg: "#E8EAF6",
    textColor: "#1a1e5a",
    subtitleColor: "#3040AA",
    btnBg: "#3040AA",
    btnText: "#fff",
  },
};

// ─── PromoCard ────────────────────────────────────────────────────────────────

function PromoCard({ block, index }: { block: PromoBlock; index: number }) {
  const cfg = CARD_CONFIG[block.id] ?? {
    bg: "#EBF7FF",
    textColor: "#002244",
    subtitleColor: "#005AA9",
    btnBg: "#005AA9",
    btnText: "#fff",
  };

  return (
    /*
      Each card has its OWN whileInView — this bypasses the Embla wrapper
      elements (plain divs, NOT motion elements) that silently block Framer
      Motion's variant-inheritance / stagger propagation through the tree.
      Index-based delay recreates the cascade stagger manually.
    */
    <motion.div
      initial={{ opacity: 0, y: 52, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{
        delay: (index % 3) * 0.12, // 0 / 0.12 / 0.24 s — stagger by column
        type: "spring",
        stiffness: 80,
        damping: 15,
        mass: 0.9,
      }}
      className="w-full"
    >
      <Link
        href={block.link}
        className="group relative flex h-[320px] w-full overflow-hidden rounded-3xl shadow-md sm:h-[340px] lg:h-[340px]"
        aria-label={`${block.title} — ${block.subtitle}`}
        style={{ backgroundColor: cfg.bg }}
      >
        {/* z-0 ── background image — grayscale on hover ── */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-[filter] duration-[800ms] delay-[300ms] ease-in-out group-hover:grayscale"
          style={{ backgroundImage: `url('${block.image}')` }}
          role="img"
          aria-hidden="true"
        />

        {/* z-10 ── dark overlay on hover ── */}
        <div className="absolute inset-0 z-10 bg-black/0 transition-colors duration-[800ms] delay-[300ms] ease-in-out group-hover:bg-black/25" />

        {/* z-20 ── text content ── */}
        <div className="relative z-20 flex h-full w-[52%] flex-col justify-center gap-3 py-8 pl-8 pr-2">
          <p
            className="text-[10px] font-extrabold uppercase tracking-[0.18em]"
            style={{ color: cfg.subtitleColor }}
          >
            {block.subtitle}
          </p>

          <h3
            className="text-xl font-extrabold leading-snug sm:text-2xl"
            style={{ color: cfg.textColor }}
          >
            {block.title}
          </h3>

          <span
            className="mt-1 inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm font-bold shadow transition-all duration-300 group-hover:gap-3 group-hover:shadow-md"
            style={{ backgroundColor: cfg.btnBg, color: cfg.btnText }}
          >
            Shop Now
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Progress Dot Indicators ─────────────────────────────────────────────────
// Each dot is a pill-shaped track; the active one fills left→right over 3 s
// using Embla's autoplay plugin's timeUntilNext() read inside rAF.

function ProgressDots({
  api,
  total,
  delay,
}: {
  api: CarouselApi | undefined;
  total: number;
  delay: number; // autoplay delay in ms
}) {
  const [selected, setSelected] = useState(0);
  const [progress, setProgress] = useState(0); // 0‥100
  const rafRef = useRef<number>(0);

  // Track active slide
  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setSelected(api.selectedScrollSnap() % total);
      setProgress(0); // reset bar on every slide change
    };
    onSelect();
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api, total]);

  // Drive the progress bar via requestAnimationFrame + Embla's timeUntilNext()
  useEffect(() => {
    if (!api) return;

    const tick = () => {
      const plugin = (api.plugins() as any).autoplay;
      if (!plugin) return;
      const left = plugin.timeUntilNext() as number;
      if (left == null || left < 0) { rafRef.current = requestAnimationFrame(tick); return; }
      const pct = Math.min(100, Math.max(0, (1 - left / delay) * 100));
      setProgress(pct);
      rafRef.current = requestAnimationFrame(tick);
    };

    const start = () => { rafRef.current = requestAnimationFrame(tick); };
    const stop  = () => { cancelAnimationFrame(rafRef.current); };

    api.on("autoplay:play" as any, start);
    api.on("autoplay:stop" as any, stop);

    // kick-off if already playing
    const plugin = (api.plugins() as any).autoplay;
    if (plugin?.isPlaying?.()) start();

    return () => {
      api.off("autoplay:play" as any, start);
      api.off("autoplay:stop" as any, stop);
      cancelAnimationFrame(rafRef.current);
    };
  }, [api, delay]);

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          id={`promo-dot-${i}`}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => {
            if (!api) return;
            const current = api.selectedScrollSnap();
            const totalSnaps = api.scrollSnapList().length;
            let bestTarget = i;
            let minDistance = Infinity;
            for (let target = i; target < totalSnaps; target += total) {
              const dist = Math.abs(target - current);
              const wrapDist = totalSnaps - dist;
              const effectiveDist = Math.min(dist, wrapDist);
              if (effectiveDist < minDistance) {
                minDistance = effectiveDist;
                bestTarget = target;
              }
            }
            api.scrollTo(bestTarget);
          }}
          className="h-2 w-10 overflow-hidden rounded-full bg-slate-200 transition-colors hover:bg-slate-300"
        >
          <div
            className="h-full rounded-full bg-[#005AA9] transition-none"
            style={{
              width:
                i < selected
                  ? "100%"            // already-played dots stay full
                  : i === selected
                  ? `${progress}%`    // active dot animates
                  : "0%",            // future dots are empty
            }}
          />
        </button>
      ))}
    </div>
  );
}

// ─── PromoBlocksCarousel (main export) ───────────────────────────────────────

export default function PromoBlocksCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const AUTOPLAY_DELAY = 3000;

  const autoplay = useRef(
    Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false, stopOnMouseEnter: true }),
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
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            plugins={[autoplay.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-5">
              {loopedPromoBlocks.map((block, index) => (
                <CarouselItem
                  key={`${block.id}-${index}`}
                  className="pl-5 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <PromoCard block={block} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Left nav */}
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
                : "pointer-events-none opacity-0",
            )}
          >
            <ArrowLeft className="h-4 w-4 text-slate-700" strokeWidth={1.8} />
          </button>

          {/* Right nav */}
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
                : "pointer-events-none opacity-0",
            )}
          >
            <ArrowRight className="h-4 w-4 text-slate-700" strokeWidth={1.8} />
          </button>
        </div>

        {/* ── Progress dot indicators ── */}
        <ProgressDots api={api} total={promoBlocks.length} delay={AUTOPLAY_DELAY} />
      </div>
    </section>
  );
}
