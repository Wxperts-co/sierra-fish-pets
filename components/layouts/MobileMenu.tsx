"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import categories from "@/data/categories.json";

const CATEGORY_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  aquatic: "🐠",
  reptile: "🦎",
  bird: "🦜",
  "small-animal": "🐹",
};

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "Services", href: "/services" },
  { label: "New Arrivals", href: "/arrivals" },
  { label: "Brands", href: "/brands" },
  { label: "Learn", href: "/edu" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 focus:outline-none"
            aria-label="Open menu"
          />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="flex w-[300px] flex-col overflow-y-auto p-0 sm:w-[340px]"
      >
        {/* ── Header ── */}
        <SheetHeader className="border-b border-slate-100 bg-gradient-to-r from-[#004d8f] to-[#005AA9] px-5 py-4 dark:border-slate-800">
          <SheetTitle className="flex items-center gap-3">
            <Image
              src="/images/logo/logo.png"
              alt="Sierra Fish & Pets"
              width={130}
              height={42}
              className="h-auto w-auto max-h-9 rounded-lg bg-white object-contain px-1.5 py-1"
            />
          </SheetTitle>
        </SheetHeader>

        {/* ── Main nav links ── */}
        <nav className="flex flex-col border-b border-slate-100 dark:border-slate-800">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between border-b border-slate-50 px-5 py-3.5 text-[13px] font-semibold tracking-wide text-slate-700 transition-colors last:border-0 hover:bg-slate-50 hover:text-[#005AA9] dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-cyan-400"
            >
              {link.label}
              <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
            </Link>
          ))}
        </nav>

        {/* ── Shop by category accordion ── */}
        <div className="px-5 py-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Shop by Category
          </p>

          <Accordion type="single" collapsible className="w-full">
            {categories.map((category) => (
              <AccordionItem
                key={category.id}
                value={category.id}
                className="border-b border-slate-100 dark:border-slate-800"
              >
                <AccordionTrigger className="py-3 text-[13px] font-semibold tracking-wide text-slate-700 hover:text-[#005AA9] hover:no-underline dark:text-slate-200 dark:hover:text-cyan-400">
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">
                      {CATEGORY_EMOJI[category.slug] ?? "🐾"}
                    </span>
                    {category.name}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="pb-2 pl-2">
                  <div className="flex flex-col gap-0.5">
                    <Link
                      href={`/shop/${category.slug}`}
                      className="rounded-md px-3 py-2 text-[12px] font-semibold text-[#005AA9] transition-colors hover:bg-[#005AA9]/5 dark:text-cyan-400"
                    >
                      View All {category.name} →
                    </Link>
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/shop/${category.slug}/${sub.slug}`}
                        className="rounded-md px-3 py-2 text-[12px] font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#005AA9] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-cyan-400"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </SheetContent>
    </Sheet>
  );
}