import React from "react";
import { ALL_ACCELERATOR_DATA } from "@/lib/aiAcceleratorData";
import othersAcc from "@/data/ai-accelerator/othersAcc.json";

export interface AeoDirectAnswerSnippetProps {
  pageKey?: string;
  className?: string;
}

export default function AeoDirectAnswerSnippet({
  pageKey = "home",
  className = "",
}: AeoDirectAnswerSnippetProps) {
  const pageData =
    ALL_ACCELERATOR_DATA[pageKey] ||
    ALL_ACCELERATOR_DATA[pageKey.startsWith("/") ? pageKey.slice(1) : `/${pageKey}`] ||
    (othersAcc as Record<string, any>)[pageKey];
  const snippet = pageData?.frontLoadedAeoDirectAnswerSnippet;

  if (!snippet?.title || !snippet?.content) return null;

  // Split title if it contains a separator to highlight the brand entity in theme primary blue
  const titleParts = snippet.title.split(/ - | – | \| /);
  const hasMultipleParts = titleParts.length > 1;

  return (
    <section className={`w-full bg-white pt-6 pb-4 sm:pt-10 sm:pb-6 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h2 className="text-lg sm:text-xl md:text-xl font-black text-[#002244] tracking-tight leading-snug sm:leading-tight mb-3.5 sm:mb-2 max-w-4xl mx-auto">
          {hasMultipleParts ? (
            <>
              <span className="text-[#005AA9]">{titleParts[0]}</span>
              <span className="text-slate-400 font-light mx-2">{"–"}</span>
              <span className="text-slate-900">{titleParts.slice(1).join(" – ")}</span>
            </>
          ) : (
            <span>{snippet.title}</span>
          )}
        </h2>
        <p className="text-slate-600 sm:text-slate-700 text-sm sm:text-base md:text-base italic leading-relaxed sm:leading-7 font-normal max-w-6xl mx-auto">
          {snippet.content}
        </p>
      </div>
    </section>
  );
}
