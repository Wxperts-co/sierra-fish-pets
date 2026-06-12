"use client";

import Image from "next/image";
import Link from "next/link";
import categories from "@/data/categories.json";

const categoryImages: Record<string, string> = {
  dog: "/images/categories/dog.jpeg",
  cat: "/images/categories/cat.jpeg",
  aquatic: "/images/categories/aquatic.jpeg",
  bird: "/images/categories/bird.jpeg",
  reptile: "/images/categories/reptile.jpeg",
  "small-animal": "/images/categories/smallanimal.jpeg",
};

// Display order: Dog, Cat, Aquatic, Bird, Reptile, Small Animal
const displayOrder = ["dog", "cat", "aquatic", "bird", "reptile", "small-animal"];
const orderedCategories = [...categories].sort(
  (a, b) => displayOrder.indexOf(a.slug) - displayOrder.indexOf(b.slug)
);

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
  const activeCategory = categories.find((c) => c.slug === selectedCategory);

  const defaultBreadcrumb = [
    { label: "Home", href: "/" },
    activeCategory
      ? { label: "Shop", href: `/shop?category=${activeCategory.slug}` }
      : { label: "Shop", href: "/shop" },
    activeCategory
      ? { label: activeCategory.name }
      : { label: "All Products" },
  ];

  const crumbs = breadcrumb ?? defaultBreadcrumb;

  const headingPrefix = activeCategory ? activeCategory.name : "Shop";

  // Half the circle height so circles sit half-in / half-out of the banner
  const CIRCLE_PX = 100; // desktop circle diameter
  const halfCircle = CIRCLE_PX / 2; // 50px

  return (
    // overflow-visible so circles can poke below the banner
    <section className="relative overflow-visible">

      {/* ── Banner ── */}
      {/*
        pb-[50px] reserves space at the bottom so the bottom-0 circles
        don't cover the text. The actual image clips to overflow-hidden
        on the inner div.
      */}
      <div className="relative w-full h-[380px] sm:h-[260px] md:h-[420px] ">

        {/* Image — clipped to banner bounds */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/banner/shophero3.png"
            alt="Shop hero – pets in outfits"
            fill
            priority
            className="object-cover object-[center_40%]"
            sizes="100vw"
          />
        </div>

        {/* ── Centered text block — occupies upper 2/3 of banner ── */}
        <div className="absolute inset-x-0 top-0 z-[3] mt-6 flex h-[calc(100%-50px)] flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-[clamp(2rem,4.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em] bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] bg-clip-text text-transparent drop-shadow-sm">
            {headingPrefix} Products
          </h1>

          {/* Breadcrumb */}
          <nav
            aria-label="breadcrumb"
            className="flex flex-wrap items-center justify-center gap-0.5 text-sm font-medium text-slate-500"
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

        {/* ── Category circles — sit at banner bottom, half outside ── */}
        {/*
          absolute bottom-0 translate-y-1/2 → top half inside banner, bottom half outside.
          z-10 so circles appear above the banner edge.
          overflow-visible on the banner allows them to overflow downward.
        */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex translate-y-1/2 flex-wrap justify-center gap-x-7 gap-y-3 px-4">
          {orderedCategories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                aria-pressed={isActive}
                className="group flex cursor-pointer flex-col items-center gap-0 border-none bg-transparent p-0 transition-transform duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.5 hover:scale-105"
              >
                {/* Outer ring — teal glow when active */}
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
                      src={categoryImages[cat.slug] ?? cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110"
                      sizes="110px"
                    />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Labels row — directly below banner, no background ── */}
      {/*
        pt matches half the circle: 50px (desktop) so labels sit right below the circles.
        pb gives breathing room before product content.
      */}
      <div className="flex flex-wrap justify-center gap-x-7 gap-y-1 pt-[62px] pb-6 px-4 md:pt-[52px] sm:pt-[42px]">
        {orderedCategories.map((cat) => {
          const isActive = selectedCategory === cat.slug;
          return (
            <span
              key={cat.id}
              className={`w-[118px] text-center text-[0.85rem] tracking-[0.01em] transition-colors duration-200 md:w-[96px] sm:w-[80px] ${
                isActive ? "font-bold text-[#005ca5]" : "font-semibold text-slate-500"
              }`}
            >
              {cat.name}
            </span>
          );
        })}
      </div>
    </section>
  );
}