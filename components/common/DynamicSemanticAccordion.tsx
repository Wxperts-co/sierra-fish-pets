"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  ALL_ACCELERATOR_DATA,
  AcceleratorPageData,
} from "@/lib/aiAcceleratorData";

export { ALL_ACCELERATOR_DATA };
export type { AcceleratorPageData };

export interface DynamicSemanticAccordionProps {
  pageKey?: string;
  data?: AcceleratorPageData;
  title?: string;
  defaultOpen?: boolean;
  className?: string;
}

export default function DynamicSemanticAccordion({
  pageKey,
  data,
  title = "Semantic Keynotes & Named Entity Recognition (NER) Tags",
  defaultOpen = false,
  className = "",
}: DynamicSemanticAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const pathname = usePathname();

  // Determine which data to render
  const resolvedData: AcceleratorPageData | undefined = React.useMemo(() => {
    if (data) return data;
    if (pageKey && ALL_ACCELERATOR_DATA[pageKey]) {
      return ALL_ACCELERATOR_DATA[pageKey];
    }
    if (pageKey) {
      const withSlash = pageKey.startsWith("/") ? pageKey : `/${pageKey}`;
      const withoutSlash = pageKey.replace(/^\//, "");
      if (ALL_ACCELERATOR_DATA[withSlash]) return ALL_ACCELERATOR_DATA[withSlash];
      if (ALL_ACCELERATOR_DATA[withoutSlash]) return ALL_ACCELERATOR_DATA[withoutSlash];
    }
    // Pathname fallback if no explicit pageKey
    if (pathname) {
      if (pathname === "/" && ALL_ACCELERATOR_DATA["home"]) {
        return ALL_ACCELERATOR_DATA["home"];
      }
      if (ALL_ACCELERATOR_DATA[pathname]) {
        return ALL_ACCELERATOR_DATA[pathname];
      }
      const stripped = pathname.replace(/^\//, "");
      if (ALL_ACCELERATOR_DATA[stripped]) {
        return ALL_ACCELERATOR_DATA[stripped];
      }
    }
    // Default to home
    return ALL_ACCELERATOR_DATA["home"];
  }, [data, pageKey, pathname]);

  if (!resolvedData) return null;

  const keynotes = resolvedData.semanticKeynotes || {};
  const nerTags = resolvedData.nerTags || {};

  const keynoteEntries = Object.entries(keynotes);
  // Filter NER tags to only include entries that have values
  const nerEntries = Object.entries(nerTags).filter(([_, val]) => {
    if (!val) return false;
    if (Array.isArray(val) && val.length === 0) return false;
    if (typeof val === "string" && val.trim() === "") return false;
    return true;
  });

  if (keynoteEntries.length === 0 && nerEntries.length === 0) {
    return null;
  }

  const formatNerValue = (val: string[] | string) => {
    if (Array.isArray(val)) {
      return val.join(", ");
    }
    return val;
  };

  return (
    <section className={`w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-6 sm:my-8 ${className}`}>
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all duration-300 hover:border-[#005AA9]/30 hover:shadow-md">
        {/* Accordion Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center gap-3 px-5 sm:px-7 py-4 sm:py-5 bg-white text-left font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50/80 transition-colors cursor-pointer select-none"
          aria-expanded={isOpen}
        >
          <span className="text-slate-800 shrink-0">
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-slate-700 stroke-[2.5]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-700 stroke-[2.5]" />
            )}
          </span>
          <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-serif">
            {title}
          </span>
        </button>

        {/* Accordion Content */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-slate-200 bg-[#fdfdfd] px-6 sm:px-9 py-6 sm:py-8 space-y-8 text-slate-800">
                {/* 1. Semantic Keynotes */}
                {keynoteEntries.length > 0 && (
                  <div className="space-y-4">
                    <div className="border-b border-amber-200/60 pb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#005AA9] font-serif tracking-tight">
                        Semantic Keynotes
                      </h3>
                    </div>
                    <ul className="space-y-3.5 pl-1 sm:pl-2">
                      {keynoteEntries.map(([label, text], idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-slate-700 text-xs sm:text-sm leading-relaxed"
                        >
                          <span className="text-[#96691E] font-bold shrink-0 mt-0.5">•</span>
                          <div>
                            <span className="font-bold text-slate-800">{label}:</span>{" "}
                            <span className="text-slate-600">{text}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 2. NER Tags */}
                {nerEntries.length > 0 && (
                  <div className="space-y-4">
                    <div className="border-b border-amber-200/60 pb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#005AA9] font-serif tracking-tight">
                        NER Tags
                      </h3>
                    </div>
                    <ul className="space-y-3 pl-1 sm:pl-2">
                      {nerEntries.map(([tagCategory, tagVal], idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-slate-700 text-xs sm:text-sm leading-relaxed"
                        >
                          <span className="text-[#96691E] font-bold shrink-0 mt-0.5">•</span>
                          <div>
                            <span className="font-bold text-slate-800">{tagCategory}:</span>{" "}
                            <span className="text-slate-600">{formatNerValue(tagVal)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

