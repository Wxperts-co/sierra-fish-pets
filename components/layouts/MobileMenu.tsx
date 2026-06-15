"use client";

import { useState } from "react";
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
import navbarData from "@/data/navbar.json";

const CATEGORY_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  aquatic: "🐠",
  reptile: "🦎",
  bird: "🦜",
  "small-animal": "🐹",
};

export default function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
              src="/images/logo/logo.png"
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
            {navbarData.map((item: any) => {
              if (item.type === "megamenu") return null;

              if (item.type === "dropdown") {
                return (
                  <AccordionItem
                    key={item.label}
                    value={item.label}
                    className="border-b border-slate-50"
                  >
                    <AccordionTrigger className="px-5 py-2.5 text-[13px] font-semibold tracking-wide text-slate-700 hover:text-[#005AA9] hover:no-underline">
                      {item.label}
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="flex flex-col pb-2">
                        {item.menuItems?.map((menuItem: any, idx: number) => {
                          if (menuItem.type === "submenu") {
                            const isSierraEdu = menuItem.label === "Sierra Edu";
                            return (
                              <div key={idx} className="py-1">
                                <Accordion className="w-full">
                                  <AccordionItem value={menuItem.label} className="border-b-0">
                                    <AccordionTrigger className="px-8 pr-5 py-1.5 text-[10px] font-extrabold uppercase text-slate-400 hover:text-[#005AA9] tracking-wider hover:no-underline border-b-0 focus:outline-none">
                                      {menuItem.label}
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-1">
                                      {isSierraEdu ? (
                                        <Accordion className="w-full">
                                          {menuItem.submenuItems?.map((subItem: any, sIdx: number) => {
                                            return (
                                              <AccordionItem
                                                key={sIdx}
                                                value={subItem.label}
                                                className="border-b-0"
                                              >
                                                <AccordionTrigger className="mx-2 pl-12 pr-5 py-2 text-[12px] font-medium text-slate-600 hover:text-[#005AA9] hover:no-underline border-b-0 focus:outline-none">
                                                  {subItem.label}
                                                </AccordionTrigger>
                                                <AccordionContent className="pb-1">
                                                  <div className="flex flex-col gap-0.5">
                                                    {subItem.items?.map((nestedItem: any, nIdx: number) => {
                                                      const isNestedActive = pathname === nestedItem.href;
                                                      return (
                                                        <Link
                                                          key={nIdx}
                                                          href={nestedItem.href}
                                                          onClick={() => setOpen(false)}
                                                          className={`mx-2 pl-16 pr-5 py-1.5 text-[11px] font-medium rounded-md transition-all duration-200 block ${
                                                            isNestedActive
                                                              ? "bg-blue-50/60 text-[#005AA9] font-semibold"
                                                              : "text-slate-500 hover:bg-blue-50/50 hover:text-[#005AA9]"
                                                          }`}
                                                        >
                                                          {nestedItem.label}
                                                        </Link>
                                                      );
                                                    })}
                                                  </div>
                                                </AccordionContent>
                                              </AccordionItem>
                                            );
                                          })}
                                        </Accordion>
                                      ) : (
                                        <div className="flex flex-col gap-0.5">
                                          {menuItem.submenuItems?.map((subItem: any, sIdx: number) => {
                                            const isActive = pathname === subItem.href;
                                            return (
                                              <Link
                                                key={sIdx}
                                                href={subItem.href}
                                                onClick={() => setOpen(false)}
                                                className={`mx-2 pl-12 pr-5 py-2 text-[12px] font-medium rounded-md transition-all duration-200 block ${
                                                  isActive
                                                    ? "bg-blue-50/60 text-[#005AA9] font-semibold"
                                                    : "text-slate-600 hover:bg-blue-50/50 hover:text-[#005AA9]"
                                                }`}
                                              >
                                                {subItem.label}
                                              </Link>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              </div>
                            );
                          }

                          // Standard dropdown item
                          const isActive = pathname === menuItem.href;
                          return (
                            <Link
                              key={idx}
                              href={menuItem.href}
                              onClick={() => setOpen(false)}
                              className={`mx-2 pl-8 pr-5 py-2 text-[12px] font-medium rounded-md transition-all duration-200 block ${
                                isActive
                                  ? "bg-blue-50/60 text-[#005AA9] font-semibold"
                                  : "text-slate-600 hover:bg-blue-50/50 hover:text-[#005AA9]"
                              }`}
                            >
                              {menuItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              // Simple Link type
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between border-b border-slate-50 px-5 py-2.5 text-[13px] font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50/60 text-[#005AA9] font-semibold"
                      : "text-slate-700 hover:bg-blue-50/50 hover:text-[#005AA9]"
                  }`}
                >
                  {item.label}
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
                      const href = `/shop?category=${category.slug}&subcategory=${sub.slug}`;
                      const isActive = pathname.startsWith("/shop") && pathname.includes(sub.slug);
                      return (
                        <Link
                          key={sub.id}
                          href={href}
                          onClick={() => setOpen(false)}
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
