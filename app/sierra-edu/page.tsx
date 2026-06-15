"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Fish,
  Sparkles,
  Activity,
  ChevronRight,
  ArrowLeft,
  Tag,
  GraduationCap,
} from "lucide-react";
import eduData from "@/data/sierraedu.json";
import navbarData from "@/data/navbar.json";
import categoriesData from "@/data/categories.json";

// ─── Types ────────────────────────────────────────────────────────────────────
interface EduItem {
  id: string;
  title: string;
  slug: string;
  category?: string;
  categorySlug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  featured?: boolean;
  readingTime?: number;
  publishedAt?: string;
  tags?: string[];
}

const allItems = eduData as EduItem[];

// Map the categoryParam from navbar.json to the slug in categories.json
const categoryParamToSlug: Record<string, string> = {
  dogs: "dog",
  cats: "cat",
  aquariums: "aquatic",
  reptiles: "reptile",
  birds: "bird",
  "small-animals": "small-animal",
};

// ─── Build categoryConfig from navbar.json + sierraedu.json ───────────────────
// Step 1 — pull the Sierra Edu submenu out of navbar.json
const moreMenu = (navbarData as any[]).find((n) => n.label === "More");
const sierraEduMenu = (moreMenu?.menuItems ?? []).find(
  (m: { label: string }) => m.label === "Sierra Edu",
);
const navSierraCategories: Array<{ label: string; href: string }> =
  sierraEduMenu?.submenuItems ?? [];

// Step 2 — for each nav category derive everything from the two JSON files
const categoryConfig = navSierraCategories
  .map((navCat) => {
    // "/sierra-edu?category=dogs" → "dogs"
    const categoryParam = navCat.href.split("category=")[1] ?? "";
    if (!categoryParam) return null;

    // Collect unique tags from sierraedu.json items that belong to this category
    const matchTags = Array.from(
      new Set(
        allItems
          .filter(
            (i) =>
              i.categorySlug === categoryParam ||
              (i.tags ?? []).includes(categoryParam),
          )
          .flatMap((i) => i.tags ?? []),
      ),
    );

    const catSlug = categoryParamToSlug[categoryParam] ?? categoryParam;
    const catJson = (categoriesData as any[]).find((c) => c.slug === catSlug);

    const assets = catJson
      ? {
          image: catJson.image || "",
          description: catJson.description || navCat.label,
          tag: catJson.name || navCat.label,
        }
      : {
          image: "",
          description: navCat.label,
          tag: navCat.label,
        };

    return {
      id: `cat-${categoryParam}`,
      title: navCat.label,             // ← navbar.json
      image: assets.image,             // ← categories.json
      description: assets.description, // ← categories.json
      tag: assets.tag,                 // ← categories.json (name)
      matchSlugs: [categoryParam],     // ← derived
      matchTags,                       // ← derived from sierraedu.json
      categoryParam,                   // ← derived from navbar.json href
    };
  })
  .filter(Boolean) as Array<{
  id: string;
  title: string;
  image: string;
  description: string;
  tag: string;
  matchSlugs: string[];
  matchTags: string[];
  categoryParam: string;
}>;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getItemsForCategory(catParam: string) {
  const cat = categoryConfig.find((c) => c.categoryParam === catParam);
  if (!cat) return [];
  return allItems.filter(
    (i) =>
      cat.matchSlugs.includes(i.categorySlug ?? "") ||
      (i.tags ?? []).some((t) => cat.matchTags.includes(t)),
  );
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/** Naive markdown renderer — headings, bold, paragraphs */
function renderContent(raw: string) {
  const lines = raw.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;
  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      key++;
      continue;
    }
    if (t.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-xl font-bold text-[#002244] mt-8 mb-3">
          {t.slice(4)}
        </h3>,
      );
    } else if (t.startsWith("## ")) {
      elements.push(
        <h2
          key={key++}
          className="text-2xl font-extrabold text-[#002244] mt-10 mb-4"
        >
          {t.slice(3)}
        </h2>,
      );
    } else if (t.startsWith("# ")) {
      elements.push(
        <h1
          key={key++}
          className="text-3xl sm:text-4xl font-black text-[#002244] mt-4 mb-6 leading-tight"
        >
          {t.slice(2)}
        </h1>,
      );
    } else {
      const parts = t.split(/(\*\*[^*]+\*\*)/g);
      const inline = parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="font-bold text-[#002244]">
            {p.slice(2, -2)}
          </strong>
        ) : (
          p
        ),
      );
      elements.push(
        <p
          key={key++}
          className="text-slate-600 leading-[1.85] text-base sm:text-[1.05rem] mb-5 font-medium"
        >
          {inline}
        </p>,
      );
    }
  }
  return elements;
}

// ─── Hero (shared across all views) ───────────────────────────────────────────
function Hero({
  subtitle,
  breadcrumb,
}: {
  subtitle: string;
  breadcrumb: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[360px] [clip-path:inset(0)]">
      <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[360px] pointer-events-none overflow-hidden z-0">
        {/* Mobile image */}
        <Image
          src="/images/banner/shophero5.png"
          alt="Sierra Edu banner"
          fill
          priority
          className="object-cover object-[center_60%] block md:hidden"
          sizes="100vw"
        />
        {/* Desktop image */}
        <Image
          src="/images/banner/shophero3.png"
          alt="Sierra Edu banner"
          fill
          priority
          className="object-cover object-[center_40%] hidden md:block"
          sizes="100vw"
        />
      </div>

      {/* Mobile overlay — darkens image so text is readable */}
      <div className="absolute inset-0 z-[2] block md:hidden bg-[linear-gradient(to_bottom,rgba(0,30,70,0.62)_0%,rgba(0,30,70,0.35)_60%,rgba(0,30,70,0.10)_100%)]" />

      <div className="absolute inset-x-0 top-0 z-[3] flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-2 mb-3 text-[#005AA9] font-bold text-xs uppercase tracking-widest bg-[#eef6ff] px-4 py-1.5 rounded-full select-none border border-[#005AA9]/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pet Knowledge Hub</span>
          </div>
          <h1 className="mb-4 text-[clamp(2rem,4.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em] bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] bg-clip-text text-transparent drop-shadow-sm">
            Sierra Edu
          </h1>
       
          <nav
            aria-label="breadcrumb"
            className="flex flex-wrap items-center justify-center gap-0.5 text-sm font-medium text-white drop-shadow-md md:text-slate-500 md:drop-shadow-none"
          >
            {breadcrumb}
          </nav>
        </motion.div>
      </div>
    </section>
  );
}

// ─── VIEW 1: Landing — category grid ──────────────────────────────────────────
function LandingView({ onCategory }: { onCategory: (cat: string) => void }) {
  return (
    <>
      <Hero
        subtitle="Learn, Explore, and Care for Your Pets with Confidence"
        breadcrumb={
          <>
            <span className="flex items-center gap-0.5">
              <Link
                href="/"
                className="text-white md:text-slate-500 transition-colors duration-150 hover:text-teal-600 hover:underline"
              >
                Home
              </Link>
              <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
            </span>
            <span className="flex items-center gap-0.5">
              <span className="font-bold text-white md:text-[#0d1b2a]">Sierra Edu</span>
            </span>
          </>
        }
      />

      {/* About */}
      <section className="relative bg-white py-16 z-10 border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5"
            >
              <div className="relative h-[320px] sm:h-[380px] w-full rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/80 group">
                <Image
                  src="/images/sierra-edu/about_edu.png"
                  alt="Sierra Edu"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <span className="text-xs font-black uppercase tracking-widest text-[#005AA9] mb-3 block">
                Welcome to Sierra Edu
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002244] leading-tight mb-5">
                Your Trusted Pet Education Center
              </h2>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg mb-7 font-medium">
                Sierra Edu is designed to help pet owners make informed
                decisions through expert guides, care tips, nutrition advice,
                aquarium education, training resources, and species-specific
                care information.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: <BookOpen className="w-5 h-5" />,
                    bg: "bg-[#EBF7FF] text-[#005AA9]",
                    title: "Expert Care Guides",
                    desc: "Husbandry guides vetted by certified experts.",
                  },
                  {
                    icon: <Fish className="w-5 h-5" />,
                    bg: "bg-sky-50 text-cyan-600",
                    title: "Aquarium Education",
                    desc: "Cycling, water balance, and species compatibility.",
                  },
                  {
                    icon: <Sparkles className="w-5 h-5" />,
                    bg: "bg-amber-50 text-amber-600",
                    title: "Pet Nutrition Tips",
                    desc: "Tailored feeding guides and raw food tips.",
                  },
                  {
                    icon: <Activity className="w-5 h-5" />,
                    bg: "bg-rose-50 text-rose-600",
                    title: "Training & Wellness",
                    desc: "Behavior tips, enrichment training, and healthcare.",
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-sky-100 transition-colors"
                  >
                    <div className={`p-2.5 ${f.bg} rounded-xl shrink-0`}>
                      {f.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#002244] text-sm mb-0.5">
                        {f.title}
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="relative py-16 z-10 bg-slate-50/50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-[#005AA9] mb-3 block">
              Categories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#002244] tracking-tight">
              Explore Our Education Categories
            </h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-base font-medium">
              Click a category below to browse all guides within it.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {categoryConfig.map((cat) => {
              const count = getItemsForCategory(cat.categoryParam).length;
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  onClick={() => onCategory(cat.categoryParam)}
                  className="text-left bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-100/30 flex flex-col hover:shadow-2xl hover:border-sky-100/50 transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 30vw"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-1 text-slate-700 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm border border-slate-100">
                      {cat.tag}
                    </div>
                    {count > 0 && (
                      <div className="absolute top-4 right-4 bg-[#005AA9]/90 backdrop-blur-sm px-2.5 py-1 text-white rounded-full font-bold text-xs shadow-sm">
                        {count} {count === 1 ? "guide" : "guides"}
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-[#002244] mb-3 group-hover:text-[#005AA9] transition-colors leading-snug">
                      {cat.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-5 flex-1 font-medium">
                      {cat.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#005AA9] group-hover:text-[#003d73] transition-colors border-t border-slate-50 pt-4">
                      Explore Guides
                      <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

// ─── VIEW 2: Category articles list ───────────────────────────────────────────
function CategoryView({
  categoryParam,
  onBack,
  onArticle,
}: {
  categoryParam: string;
  onBack: () => void;
  onArticle: (slug: string) => void;
}) {
  const cat = categoryConfig.find((c) => c.categoryParam === categoryParam);
  const items = getItemsForCategory(categoryParam);

  if (!cat) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400">
        Category not found.
      </div>
    );
  }

  return (
    <>
      <Hero
        subtitle={cat.description}
        breadcrumb={
          <>
            <span className="flex items-center gap-0.5">
              <Link
                href="/"
                className="text-white md:text-slate-500 transition-colors duration-150 hover:text-teal-600 hover:underline"
              >
                Home
              </Link>
              <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
            </span>
            <span className="flex items-center gap-0.5">
              <button
                onClick={onBack}
                className="text-white md:text-slate-500 transition-colors duration-150 hover:text-teal-600 hover:underline"
              >
                Sierra Edu
              </button>
              <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
            </span>
            <span className="flex items-center gap-0.5">
              <span className="font-bold text-white md:text-[#0d1b2a]">{cat.title}</span>
            </span>
          </>
        }
      />

      <div className="container mx-auto px-6 max-w-5xl py-12 relative z-10">
        {/* Back */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#005AA9] hover:text-[#003d73] transition-colors group mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          All Categories
        </button>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#002244] mb-2">
          {cat.title}
        </h2>
        <p className="text-slate-500 text-base font-medium mb-10">
          {items.length} {items.length === 1 ? "guide" : "guides"} available
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item) => (
            <motion.button
              key={item.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => onArticle(item.slug)}
              className="text-left bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl hover:border-sky-100 transition-all duration-200 group overflow-hidden flex  cursor-pointer"
            >
              {item.coverImage && (
                <div className="relative w-[250px] h-44 bg-slate-100 overflow-hidden">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-400"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-[#002244] text-base mb-2 group-hover:text-[#005AA9] transition-colors leading-snug">
                  {item.title}
                </h3>
                {item.excerpt && (
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2 font-medium flex-1">
                    {item.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#005AA9]">
                    {item.content ? "Read Guide" : "Coming Soon"}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── VIEW 3: Article detail ────────────────────────────────────────────────────
function ArticleView({
  slug,
  onBack,
  onCategory,
  onArticle,
}: {
  slug: string;
  onBack: () => void;
  onCategory: (cat: string) => void;
  onArticle: (slug: string) => void;
}) {
  const item = allItems.find((i) => i.slug === slug);

  if (!item) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <p className="text-lg font-semibold">Article not found.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#005AA9] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sierra Edu
        </button>
      </div>
    );
  }

  const catConfig = categoryConfig.find(
    (c) =>
      c.matchSlugs.includes(item.categorySlug ?? "") ||
      (item.tags ?? []).some((t) => c.matchTags.includes(t)),
  );

  return (
    <>
      <Hero
        subtitle={catConfig?.title ?? "Sierra Edu"}
        breadcrumb={
          <>
            <span className="flex items-center gap-0.5">
              <Link
                href="/"
                className="text-white md:text-slate-500 transition-colors duration-150 hover:text-teal-600 hover:underline"
              >
                Home
              </Link>
              <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
            </span>
            <span className="flex items-center gap-0.5">
              <button
                onClick={onBack}
                className="text-white md:text-slate-500 transition-colors duration-150 hover:text-teal-600 hover:underline"
              >
                Sierra Edu
              </button>
              <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
            </span>
            {catConfig && (
              <span className="flex items-center gap-0.5">
                <button
                  onClick={() => onCategory(catConfig.categoryParam)}
                  className="text-white md:text-slate-500 transition-colors duration-150 hover:text-teal-600 hover:underline"
                >
                  {catConfig.title}
                </button>
                <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
              </span>
            )}
            <span className="flex items-center gap-0.5">
              <span className="font-bold text-white md:text-[#0d1b2a] truncate max-w-[160px]">
                {item.title}
              </span>
            </span>
          </>
        }
      />

      <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-10 relative z-10">
        {/* Meta bar */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-lg px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-2 mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#005AA9] hover:text-[#003d73] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Sierra Edu
          </button>
        </div>

        {/* Article title */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#002244] leading-tight mb-6">
          {item.title}
        </h2>

        {/* Cover image */}
        {item.coverImage && (
          <div className="relative w-full aspect-[16/7] rounded-3xl overflow-hidden mb-8 shadow-2xl shadow-slate-200/60 bg-slate-100">
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          </div>
        )}

        {/* Excerpt callout */}
        {item.excerpt && (
          <div className="mb-8 p-5 bg-[#EBF7FF] border-l-4 border-[#005AA9] rounded-xl">
            <p className="text-[#003d73] font-semibold text-base leading-relaxed">
              {item.excerpt}
            </p>
          </div>
        )}

        {/* Content */}
        {item.content ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl shadow-slate-100/30 mb-8">
            {renderContent(item.content)}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-xl flex flex-col items-center text-center mb-8">
            <div className="p-5 bg-sky-50 rounded-2xl mb-6">
              <BookOpen className="w-10 h-10 text-[#005AA9]" />
            </div>
            <h3 className="text-2xl font-bold text-[#002244] mb-3">
              Article Coming Soon
            </h3>
            <p className="text-slate-500 text-base leading-relaxed max-w-md mb-8">
              We&apos;re working on a detailed guide for{" "}
              <strong className="text-[#002244]">{item.title}</strong>. Check
              back soon!
            </p>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 bg-[#005AA9] hover:bg-[#003d73] text-white px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse All Guides
            </button>
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-10">
            <Tag className="w-4 h-4 text-slate-400 shrink-0" />
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main Page — reads search params, renders the correct view ─────────────────
function SierraEduContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const slugParam = searchParams.get("slug");
  const categoryParam = searchParams.get("category");

  const navigate = (params: Record<string, string> | null) => {
    if (!params) {
      router.push("/sierra-edu");
    } else {
      const qs = new URLSearchParams(params).toString();
      router.push(`/sierra-edu?${qs}`);
    }
  };

  if (slugParam) {
    return (
      <ArticleView
        slug={slugParam}
        onBack={() => navigate(null)}
        onCategory={(cat) => navigate({ category: cat })}
        onArticle={(s) => navigate({ slug: s })}
      />
    );
  }

  if (categoryParam) {
    return (
      <CategoryView
        categoryParam={categoryParam}
        onBack={() => navigate(null)}
        onArticle={(s) => navigate({ slug: s })}
      />
    );
  }

  return <LandingView onCategory={(cat) => navigate({ category: cat })} />;
}

// ─── Page export — wraps in Suspense (required for useSearchParams) ────────────
export default function SierraEduPage() {
  return (
    <main className="relative text-slate-800 min-h-screen bg-slate-50/50 overflow-x-hidden pb-12">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-slate-400 text-sm font-medium">Loading…</div>
          </div>
        }
      >
        <SierraEduContent />
      </Suspense>
    </main>
  );
}
