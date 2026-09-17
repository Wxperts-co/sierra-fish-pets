"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface SemanticKeynoteItem {
  title: string;
  description: string;
}

export interface NerTagsData {
  organization?: string | string[];
  person?: string | string[];
  author?: string | string[];
  location?: string | string[];
  productOrService?: string | string[];
  conceptOrTheme?: string | string[];
}

export interface SemanticAccordionProps {
  buttonTitle?: string;
  semanticKeynotes?: SemanticKeynoteItem[];
  nerTags?: NerTagsData;
  seoKeywords?: string[];
  defaultOpen?: boolean;
  className?: string;
}

export default function SemanticAccordion({
  buttonTitle = "Semantic Keynotes & Named Entity Recognition (NER) Tags",
  semanticKeynotes = [],
  nerTags,
  seoKeywords = [],
  defaultOpen = false,
  className = "",
}: SemanticAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const formatList = (val?: string | string[]) => {
    if (!val) return "";
    return Array.isArray(val) ? val.join(", ") : val;
  };

  return (
    <div className={`w-full max-w-5xl mx-auto my-6 sm:my-10 px-4 sm:px-6 ${className}`}>
      {/* Unified Accordion / Dropdown Container matching Website Theme */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition-all duration-300 hover:border-[#005AA9]/40 hover:shadow-md">
        {/* Dropdown Header Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center justify-between gap-4 px-5 sm:px-7 py-4 sm:py-5 bg-white text-left font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50/80 transition-colors cursor-pointer select-none"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="p-1 rounded-full bg-slate-100 text-[#005AA9] shrink-0"
            >
              <ChevronDown className="w-4 h-4 stroke-[2.5]" />
            </motion.div>
            <span className="tracking-tight text-slate-900 md:text-base text-sm font-extrabold">
              {buttonTitle}
            </span>
          </div>
        </button>

        {/* Unified Expandable Content Panel */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-slate-100 bg-[#f8fbff]/60 px-5 sm:px-8 py-6 sm:py-8 space-y-7 text-slate-800">
                {/* 1. Semantic Keynotes */}
                {semanticKeynotes.length > 0 && (
                  <div className="space-y-3.5">
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#002244] tracking-tight">
                      Semantic Keynotes
                    </h3>
                    <ul className="space-y-3 pl-1 sm:pl-3">
                      {semanticKeynotes.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-slate-600 text-xs sm:text-sm leading-relaxed"
                        >
                          <span className="text-[#005AA9] font-bold leading-none mt-1 shrink-0">•</span>
                          <div>
                            <strong className="font-bold text-slate-900">{item.title}:</strong>{" "}
                            <span>{item.description}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 2. NER Tags */}
                {nerTags && (
                  <div className="space-y-3.5 pt-3 border-t border-slate-200/60">
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#002244] tracking-tight">
                      NER Tags
                    </h3>
                    <ul className="space-y-3 pl-1 sm:pl-3 text-xs sm:text-sm leading-relaxed">
                      {nerTags.organization && (
                        <li className="flex items-start gap-2.5 text-slate-600">
                          <span className="text-[#005AA9] font-bold leading-none mt-1 shrink-0">•</span>
                          <div>
                            <strong className="font-bold text-slate-900">ORGANIZATION (ORG):</strong>{" "}
                            <span>{formatList(nerTags.organization)}</span>
                          </div>
                        </li>
                      )}
                      {(nerTags.person || nerTags.author) && (
                        <li className="flex items-start gap-2.5 text-slate-600">
                          <span className="text-[#005AA9] font-bold leading-none mt-1 shrink-0">•</span>
                          <div>
                            <strong className="font-bold text-slate-900">PERSON (PER):</strong>{" "}
                            <span>{formatList(nerTags.person || nerTags.author)}</span>
                          </div>
                        </li>
                      )}
                      {nerTags.location && (
                        <li className="flex items-start gap-2.5 text-slate-600">
                          <span className="text-[#005AA9] font-bold leading-none mt-1 shrink-0">•</span>
                          <div>
                            <strong className="font-bold text-slate-900">LOCATION (LOC):</strong>{" "}
                            <span>{formatList(nerTags.location)}</span>
                          </div>
                        </li>
                      )}
                      {nerTags.productOrService && (
                        <li className="flex items-start gap-2.5 text-slate-600">
                          <span className="text-[#005AA9] font-bold leading-none mt-1 shrink-0">•</span>
                          <div>
                            <strong className="font-bold text-slate-900">PRODUCT / SERVICE (PRODUCT):</strong>{" "}
                            <span>{formatList(nerTags.productOrService)}</span>
                          </div>
                        </li>
                      )}
                      {nerTags.conceptOrTheme && (
                        <li className="flex items-start gap-2.5 text-slate-600">
                          <span className="text-[#005AA9] font-bold leading-none mt-1 shrink-0">•</span>
                          <div>
                            <strong className="font-bold text-slate-900">CONCEPT / THEME (MISC):</strong>{" "}
                            <span>{formatList(nerTags.conceptOrTheme)}</span>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* 3. SEO Keywords & Search Terms */}
                {seoKeywords.length > 0 && (
                  <div className="space-y-3.5 pt-3 border-t border-slate-200/60">
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#002244] tracking-tight">
                      SEO Keywords &amp; Search Terms
                    </h3>
                    <ul className="space-y-2 pl-1 sm:pl-3 text-xs sm:text-sm leading-relaxed">
                      {seoKeywords.map((kw, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-slate-600">
                          <span className="text-[#005AA9] font-bold leading-none mt-1 shrink-0">•</span>
                          <span>{kw}</span>
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
    </div>
  );
}
