"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Grid3x3 } from "lucide-react";
import type { Category } from "@/types";

// Category emoji/icon map since icon images may not exist yet
const CATEGORY_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  aquatic: "🐠",
  reptile: "🦎",
  bird: "🦜",
  "small-animal": "🐹",
};

interface MegaMenuProps {
  textClass?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

export default function MegaMenu({
  textClass = "text-[#003DA5]",
  isOpen = false,
  onToggle,
  onClose,
}: MegaMenuProps) {
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => { if (data.success) setCats(data.categories as Category[]); })
      .catch(() => {});
  }, []);

  return (
    <div className="relative nav-dropdown-container">
      {/* Trigger */}
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3 py-2 text-[20px] font-semibold transition-colors hover:text-white/80 focus:outline-none ${textClass}`}
      >
        Shop All
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown panel */}
      <div
        onClick={onClose}
        suppressHydrationWarning
        className="absolute left-0 top-full z-50 mt-0 w-[760px] transition-all duration-200 origin-top-left"
        style={{
          paddingTop: "2px",
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          transform: isOpen ? "scale(1)" : "scale(0.95)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <div className="font-lato overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl ring-1 ring-black/5">

          {/* Header strip */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-[#005AA9] to-[#0077cc] px-6 py-3">
            <span className="text-sm font-bold text-white tracking-wide">
              Browse All Categories
            </span>
            <Link
              href="/shop"
              className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white hover:bg-white/30 transition-colors"
            >
              View All →
            </Link>
          </div>

          {/* Category grid — scrollable if content exceeds viewport */}
          <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
            <div className="grid grid-cols-3 gap-0 divide-x divide-slate-100 p-2">
              {cats.map((cat) => (
                <div key={cat.id} className="flex flex-col p-4">

                  {/* Category heading */}
                  <Link
                    href={`/shop/?category=${cat.slug}`}
                    className="group/cat mb-3 flex items-center gap-2.5"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#005AA9]/10 to-cyan-500/10 text-xl transition-transform duration-200 group-hover/cat:scale-110">
                      {CATEGORY_EMOJI[cat.slug] ?? "🐾"}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover/cat:text-[#005AA9] transition-colors">
                        {cat.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {cat.productCount}+ products
                      </p>
                    </div>
                  </Link>

                  {/* Subcategory list */}
                  <ul className="space-y-1">
                    {cat.subcategories.slice(0, 5).map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/shop/?category=${cat.slug}&subcategory=${sub.slug}`}
                          className="block truncate rounded-md px-2 py-1 text-xs text-slate-500 transition-colors hover:bg-slate-50 hover:text-[#005AA9]"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                    {cat.subcategories.length > 5 && (
                      <li>
                        <Link
                          href="#"
                          className="block px-2 py-1 text-xs font-medium text-cyan-600 hover:text-cyan-700"
                        >
                          +{cat.subcategories.length - 5} more →
                        </Link>
                      </li>
                    )}
                  </ul>

                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
