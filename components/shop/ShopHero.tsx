"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Category } from "@/types";

type ShopCategory = {
  id: string;
  name: string;
  slug: string;
  subcategories: { id: string; name: string; slug: string }[];
  image?: string;
};

const categoryImages: Record<string, string> = {
  dog: "/images/categories/dog.jpeg",
  cat: "/images/categories/cat.jpeg",
  aquatic: "/images/categories/aquatic.jpeg",
  bird: "/images/categories/bird.jpeg",
  reptile: "/images/categories/reptile.jpeg",
  "small-animal": "/images/categories/smallanimal.jpeg",
};

// Sort by preferred display order; any new slugs appended after
const displayOrder = ["dog", "cat", "aquatic", "bird", "reptile", "small-animal"];

/** How many circles are visible at one time */
const VISIBLE_COUNT = 6;

interface ShopHeroProps {
  selectedCategory: string | null;
  setSelectedCategory: (slug: string) => void;
  breadcrumb?: { label: string; href?: string }[];
}

export default function ShopHero({
  selectedCategory,
  setSelectedCategory,
  breadcrumb,
}: ShopHeroProps) {
  const [allCategories, setAllCategories] = useState<ShopCategory[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const sorted = [...data.categories].sort((a: ShopCategory, b: ShopCategory) => {
            // "Other" category always goes last
            const aIsOther = a.slug.includes("other");
            const bIsOther = b.slug.includes("other");
            if (aIsOther && !bIsOther) return 1;
            if (!aIsOther && bIsOther) return -1;

            const ai = displayOrder.indexOf(a.slug);
            const bi = displayOrder.indexOf(b.slug);
            if (ai === -1 && bi === -1) return 0;
            if (ai === -1) return 1;
            if (bi === -1) return -1;
            return ai - bi;
          });
          setAllCategories(sorted);
        }
      })
      .catch(() => {});
  }, []);

  const orderedCategories = allCategories;
  const activeCategory = allCategories.find((c) => c.slug === selectedCategory);

  // Index of the first visible item
  const [startIndex, setStartIndex] = useState(0);

  // Refs to measure real item size & gap so the viewport clips perfectly
  const firstItemRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(146); // item-width + gap (fallback: 118 + 28)
  const [viewportW, setViewportW] = useState(848); // 6 * 118 + 5 * 28

  useLayoutEffect(() => {
    const measure = () => {
      const item = firstItemRef.current;
      const track = trackRef.current;
      if (!item || !track) return;

      const itemW = item.offsetWidth;
      const computedGap = parseFloat(getComputedStyle(track).gap) || 28;
      setStep(itemW + computedGap);
      setViewportW(VISIBLE_COUNT * itemW + (VISIBLE_COUNT - 1) * computedGap);
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (firstItemRef.current) ro.observe(firstItemRef.current);
    return () => ro.disconnect();
    // Re-run after categories load so firstItemRef is populated
  }, [allCategories.length]);

  const total = orderedCategories.length;
  const hasMore = total > VISIBLE_COUNT;
  const canGoLeft = startIndex > 0;
  const canGoRight = startIndex + VISIBLE_COUNT < total;

  const goLeft = () => setStartIndex((i) => Math.max(0, i - 1));
  const goRight = () =>
    setStartIndex((i) => Math.min(total - VISIBLE_COUNT, i + 1));

  // translateX slides the entire track
  const translateX = -(startIndex * step);

  const defaultBreadcrumb = [
    { label: "Home", href: "/" },
    activeCategory
      ? { label: "Shop", href: `/shop` }
      : { label: "Shop", href: "/shop" },
    activeCategory ? { label: activeCategory.name } : { label: "All Products" },
  ];

  const crumbs = breadcrumb ?? defaultBreadcrumb;
  const headingPrefix = activeCategory ? activeCategory.name : "Shop";

  return (
    <section className="relative overflow-visible">

      {/* ── Banner ── */}
      <div className="relative w-full h-[200px] sm:h-[260px] md:h-[420px]">

        {/* Background image — mobile: shophero5, desktop: shophero3 */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Mobile image */}
          <Image
            src="/images/banner/shophero5.png"
            alt="Shop hero – pets"
            fill
            priority
            className="object-cover object-[center_60%] block md:hidden"
            sizes="100vw"
          />
          {/* Desktop image */}
          <Image
            src="/images/banner/shophero3.png"
            alt="Shop hero – pets in outfits"
            fill
            priority
            className="object-cover object-[center_40%] hidden md:block"
            sizes="100vw"
          />
        </div>

        {/* Mobile overlay — darkens image so text is readable */}
        <div className="absolute inset-0 z-[2] block md:hidden bg-[linear-gradient(to_bottom,rgba(0,30,70,0.62)_0%,rgba(0,30,70,0.35)_60%,rgba(0,30,70,0.10)_100%)]" />

        {/* ── Heading + Breadcrumb ── */}
        <div className="absolute inset-x-0 top-0 z-[3] mt-6 flex h-[calc(100%-50px)] flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-[clamp(2rem,4.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em] bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] bg-clip-text text-transparent drop-shadow-sm">
            {headingPrefix} Products
          </h1>

          <nav
            aria-label="breadcrumb"
            className="flex flex-wrap items-center justify-center gap-0.5 text-sm font-medium text-slate-500 "
          >
            {crumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-0.5">
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-slate-500 transition-colors duration-150 hover:text-teal-600 hover:underline"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-bold text-[#0d1b2a]">{crumb.label}</span>
                )}
                {i < crumbs.length - 1 && (
                  <span className="px-0.5 text-slate-400"> › </span>
                )}
              </span>
            ))}
          </nav>
        </div>

        {/* ── Category Carousel — desktop only; mobile uses filter row in shop/page ── */}
        <div className="absolute top-full -translate-y-1/2 left-0 right-0 z-10 hidden md:flex items-center justify-center gap-x-2">

          {/* Left Arrow */}
          {hasMore && (
            <button
              onClick={goLeft}
              disabled={!canGoLeft}
              aria-label="Previous categories"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 transition-all text-slate-600 focus:outline-none ${
                canGoLeft
                  ? "hover:scale-105 active:scale-95 hover:text-[#005ca5] cursor-pointer"
                  : "opacity-30 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
            </button>
          )}

          {/* ── Viewport: clips to exactly VISIBLE_COUNT items ── */}
          <div
            style={{ width: viewportW, overflow: "hidden" }}
          >
            {/* ── Track: all categories, slides via transform ── */}
            <div
              ref={trackRef}
              className="flex gap-x-7 py-4"
              style={{
                transform: `translateX(${translateX}px)`,
                transition: "transform 380ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                willChange: "transform",
              }}
            >
              {orderedCategories.map((cat, idx) => {
                const isActive = selectedCategory === cat.slug;
                return (
                  <div
                    key={cat.id}
                    ref={idx === 0 ? firstItemRef : undefined}
                    className="flex flex-col items-center gap-3 shrink-0 select-none"
                  >
                    <button
                      onClick={() => setSelectedCategory(cat.slug)}
                      aria-pressed={isActive}
                      className="group flex cursor-pointer flex-col items-center border-none bg-transparent p-0 transition-transform duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 hover:scale-105"
                    >
                      {/* Outer ring */}
                      <span
                        className={`block rounded-full p-[3px] transition-all duration-[250ms] bg-white ${
                          isActive
                            ? "border-[3px] border-[#379ae5] ring-4 ring-[#379ae5]/25 shadow-lg"
                            : "border-[3px] border-white shadow-[0_4px_18px_rgba(0,0,0,0.13)]"
                        }`}
                      >
                        {/* Inner circle image */}
                        <span className="relative block h-[100px] w-[100px] overflow-hidden rounded-full bg-[#f0f9fa] md:h-[80px] md:w-[80px] sm:h-[64px] sm:w-[64px]">
                          <Image
                            src={categoryImages[cat.slug] ?? cat.image ?? "/placeholder-product.png"}
                            alt={cat.name}
                            fill
                            className="object-cover transition-transform duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110"
                            sizes="110px"
                          />
                        </span>
                      </span>
                    </button>

                    {/* Label */}
                    <span
                      className={`text-center text-[0.85rem] tracking-[0.01em] transition-colors duration-200 w-[118px] md:w-[96px] sm:w-[80px] ${
                        isActive
                          ? "font-bold text-[#005ca5]"
                          : "font-semibold text-slate-500"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Arrow */}
          {hasMore && (
            <button
              onClick={goRight}
              disabled={!canGoRight}
              aria-label="Next categories"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 transition-all text-slate-600 focus:outline-none ${
                canGoRight
                  ? "hover:scale-105 active:scale-95 hover:text-[#005ca5] cursor-pointer"
                  : "opacity-30 cursor-not-allowed"
              }`}
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5px]" />
            </button>
          )}
        </div>
      </div>

      {/* Spacer — desktop only; no space needed on mobile since no carousel */}
      <div className="hidden md:block h-28 md:h-24" />
    </section>
  );
}