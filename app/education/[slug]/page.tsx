"use client";

import React, { Suspense, useState, useEffect, useMemo, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Fish,
  Sparkles,
  Activity,
  ArrowLeft,
  Tag,
  ChevronRight,
} from "lucide-react";
import eduData from "@/data/sierraedu.json";
import navbarData from "@/data/navbar.json";

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

const categoryParamToSlug: Record<string, string> = {
  dogs: "dog",
  cats: "cat",
  aquariums: "aquatic",
  reptiles: "reptile",
  birds: "bird",
  "small-animals": "small-animal",
};

const moreMenu = (navbarData as any[]).find((n) => n.label === "More");
const sierraEduMenu = (moreMenu?.menuItems ?? []).find(
  (m: { label: string }) => m.label === "Sierra Edu",
);
const navSierraCategories: Array<{ label: string; href: string }> =
  sierraEduMenu?.submenuItems ?? [];

function buildCategoryConfig(fetchedCategories: any[]) {
  return navSierraCategories
    .map((navCat) => {
      const categoryParam = navCat.href.split("category=")[1] ?? "";
      if (!categoryParam) return null;

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
      const catJson = fetchedCategories.find((c: any) => c.slug === catSlug);

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
        title: navCat.label,
        image: assets.image,
        description: assets.description,
        tag: assets.tag,
        matchSlugs: [categoryParam],
        matchTags,
        categoryParam,
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
}

type CategoryConfig = {
  id: string;
  title: string;
  image: string;
  description: string;
  tag: string;
  matchSlugs: string[];
  matchTags: string[];
  categoryParam: string;
};

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
        <Image
          src="/images/banner/shophero5.png"
          alt="Sierra Edu banner"
          fill
          priority
          className="object-cover object-[center_60%] block md:hidden"
          sizes="100vw"
        />
        <Image
          src="/images/banner/shophero3.png"
          alt="Sierra Edu banner"
          fill
          priority
          className="object-cover object-[center_40%] hidden md:block"
          sizes="100vw"
        />
      </div>

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

function ArticleDetailContent({ slug }: { slug: string }) {
  const router = useRouter();
  const [fetchedCategories, setFetchedCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => { if (data.success) setFetchedCategories(data.categories); })
      .catch(() => {});
  }, []);

  const categoryConfig = useMemo(
    () => buildCategoryConfig(fetchedCategories),
    [fetchedCategories]
  );

  const item = allItems.find((i) => i.slug === slug);

  if (!item) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <p className="text-lg font-semibold">Article not found.</p>
        <button
          onClick={() => router.push("/education")}
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
                onClick={() => router.push("/education")}
                className="text-white md:text-slate-500 transition-colors duration-150 hover:text-teal-600 hover:underline"
              >
                Sierra Edu
              </button>
              <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
            </span>
            {catConfig && (
              <span className="flex items-center gap-0.5">
                <button
                  onClick={() => router.push(`/education?category=${catConfig.categoryParam}`)}
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
        <div className="bg-white border border-slate-100 rounded-2xl shadow-lg px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-2 mb-8">
          <button
            onClick={() => router.push("/education")}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#005AA9] hover:text-[#003d73] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Sierra Edu
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#002244] leading-tight mb-6">
          {item.title}
        </h2>

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

        {item.excerpt && (
          <div className="mb-8 p-5 bg-[#EBF7FF] border-l-4 border-[#005AA9] rounded-xl">
            <p className="text-[#003d73] font-semibold text-base leading-relaxed">
              {item.excerpt}
            </p>
          </div>
        )}

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
              onClick={() => router.push("/education")}
              className="inline-flex items-center gap-2 bg-[#005AA9] hover:bg-[#003d73] text-white px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse All Guides
            </button>
          </div>
        )}

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

export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  return (
    <main className="relative text-slate-800 min-h-screen bg-slate-50/50 overflow-x-hidden pb-12">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-slate-400 text-sm font-medium">Loading…</div>
          </div>
        }
      >
        <ArticleDetailContent slug={slug} />
      </Suspense>
    </main>
  );
}
