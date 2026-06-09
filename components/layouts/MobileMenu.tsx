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
import { usePathname } from "next/navigation";
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

  {
    label: "Services",
    href: "/services",
    children: [
      {
        label: "Aquarium Consulting & Design",
        href: "/services#aquarium-design",
      },
      { label: "Custom Aquariums", href: "/services#custom-aquariums" },
      { label: "Aquarium Installation", href: "/services#installation" },
      { label: "Water Testing", href: "/services#water-testing" },
      { label: "Fish of the Month Club", href: "/services#fish-club" },
      { label: "Pet Nail & Wing Trims", href: "/services#pet-care" },
      { label: "Dog adoption events", href: "#" },
    ],
  },

  {
    label: "New Arrivals",
    href: "/arrivals",
    children: [
      { label: "New Fish", href: "/arrivals/fish" },
      { label: "New Reptiles", href: "/arrivals/reptiles" },
      { label: "New Birds", href: "/arrivals/birds" },
      { label: "New Small Animals", href: "#" },
      { label: "Fresh water arrival", href: "#" },
      { label: "Salt water arrival", href: "#" },
    ],
  },

  {
    label: "Brands",
    href: "/brands",
    children: [
      { label: "All Brands", href: "#" },
      { label: "Dog Brands", href: "/brands?category=dog" },
      { label: "Cat Brands", href: "/brands?category=cat" },
      { label: "Aquatic Brands", href: "/brands?category=aquatic" },
      { label: "Reptile Brands", href: "/brands?category=reptile" },
    ],
  },

  {
    label: "Learn",
    href: "/edu",
    children: [
      { label: "Dog Care Guides", href: "/edu/dogs" },
      { label: "Cat Care Guides", href: "/edu/cats" },
      { label: "Aquarium Education", href: "/edu/aquariums" },
      { label: "Reptile Care", href: "/edu/reptiles" },
      { label: "Bird Cares Guides", href: "/edu/reptiles" },
      { label: "Small Animal Care", href: "/edu/reptiles" },
    ],
  },

  {
    label: "Blog",
    href: "/blog",
    children: [
      { label: "All Pets", href: "/blog" },
      { label: "Dogs", href: "/blog/category/dogs" },
      { label: "Cats", href: "/blog/category/cats" },
      { label: "Birds", href: "/blog/category/birds" },
      { label: "Aquatic", href: "/blog/category/aquatic" },
      { label: "Small Animals", href: "/blog/category/small-animals" },
      { label: "Reptiles", href: "/blog/category/reptiles" },
    ],
  },

  { label: "Gallery", href: "/gallery" },
  { label: "Gift Cards", href: "/gift-cards" },
  { label: "Contact", href: "/contact" },
];

export default function MobileMenu() {
  const pathname = usePathname();

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
        <SheetHeader className="border-b border-slate-100 bg-gradient-to-r from-[#004d8f] to-[#005AA9] px-5 py-4">
          <SheetTitle className="flex items-center gap-3">
            <Image
              src="/images/logo/white-logo.png"
              alt="Sierra Fish & Pets"
              width={130}
              height={42}
              className="h-auto w-auto max-h-9 rounded-lg object-contain px-1.5 py-1"
            />
          </SheetTitle>
        </SheetHeader>

        {/* ── Main nav links ── */}
        <nav className="border-b border-slate-100">
          <Accordion multiple className="w-full">
            {NAV_LINKS.map((link) => {
              if (link.children) {
                return (
                  <AccordionItem
                    key={link.label}
                    value={link.label}
                    className="border-b border-slate-50"
                  >
                    <AccordionTrigger className="px-5 py-2.5 text-[13px] font-semibold tracking-wide text-slate-700 hover:text-[#005AA9] hover:no-underline">
                      {link.label}
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="flex flex-col pb-2">
                        {link.children.map((child) => {
                          const isActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`mx-2 pl-8 pr-5 py-2 text-[12px] font-medium rounded-md transition-all duration-200 ${
                                isActive
                                  ? "bg-blue-50/60 text-[#005AA9] font-semibold"
                                  : "text-slate-600 hover:bg-blue-50/50 hover:text-[#005AA9]"
                              }`}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between border-b border-slate-50 px-5 py-2.5 text-[13px] font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50/60 text-[#005AA9] font-semibold"
                      : "text-slate-700 hover:bg-blue-50/50 hover:text-[#005AA9]"
                  }`}
                >
                  {link.label}
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                </Link>
              );
            })}
          </Accordion>
        </nav>

        {/* ── Shop by category accordion ── */}
        <div className="px-5 py-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Shop by Category
          </p>

          <Accordion className="w-full">
            {categories.map((category) => (
              <AccordionItem
                key={category.id}
                value={category.id}
                className="border-b border-slate-100"
              >
                <AccordionTrigger className="py-2.5 text-[13px] font-semibold tracking-wide text-slate-700 hover:text-[#005AA9] hover:no-underline">
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">
                      {CATEGORY_EMOJI[category.slug] ?? "🐾"}
                    </span>
                    {category.name}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="pb-2 pl-2">
                  <div className="flex flex-col gap-0.5 pr-2">
                    {category.subcategories.map((sub) => {
                      const href = `/shop/${category.slug}/${sub.slug}`;
                      const isActive = pathname === href;
                      return (
                        <Link
                          key={sub.id}
                          href={href}
                          className={`rounded-md px-3 py-2 text-[12px] font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-blue-50/60 text-[#005AA9] font-semibold"
                              : "text-slate-600 hover:bg-blue-50/50 hover:text-[#005AA9]"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
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
