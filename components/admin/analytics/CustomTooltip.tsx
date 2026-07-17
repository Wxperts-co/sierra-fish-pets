"use client";

import React from "react";

export default function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 rounded-2xl shadow-lg text-slate-700 min-w-[120px]">
        {label && <p className="text-xs text-slate-400 font-bold mb-1.5">{String(label)}</p>}
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => {
            const name = entry.name ?? entry.payload?.name ?? "Value";
            const value = entry.value ?? entry.payload?.value;
            
            // Prioritize payload color/fill, then standard entry color, then stroke
            const color = entry.payload?.color ?? entry.payload?.fill ?? entry.color ?? entry.stroke ?? "#3b82f6";
            
            let displayVal = "";
            if (typeof value === "number") {
              const nameLower = String(name).toLowerCase();
              const labelLower = String(label || "").toLowerCase();
              
              // Check if it's a percentage
              const isPercentage = 
                nameLower.includes("percentage") || 
                nameLower.includes("share") || 
                nameLower.includes("split") || 
                nameLower.includes("distribution") || 
                nameLower.includes("ratio") ||
                labelLower.includes("split") || 
                labelLower.includes("distribution") ||
                labelLower.includes("demographics") ||
                entry.payload?.percent !== undefined ||
                nameLower.includes("direct") ||
                nameLower.includes("organic") ||
                nameLower.includes("social") ||
                nameLower.includes("referral") ||
                nameLower.includes("email") ||
                nameLower.includes("female") ||
                nameLower.includes("male") ||
                nameLower.includes("non-binary") ||
                nameLower.includes("aquariums") ||
                nameLower.includes("supplies") ||
                nameLower.includes("food") ||
                nameLower.includes("accessories") ||
                nameLower.includes("animals");

              const isCurrency = 
                !isPercentage && (
                  nameLower.includes("$") || 
                  nameLower.includes("spend") || 
                  nameLower.includes("revenue") ||
                  nameLower.includes("roi") ||
                  nameLower.includes("monetization") ||
                  nameLower.includes("sales") ||
                  labelLower.includes("roi") ||
                  labelLower.includes("monetization") ||
                  labelLower.includes("sales")
                );
              
              if (isPercentage) {
                displayVal = `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}%`;
              } else if (isCurrency) {
                displayVal = `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              } else {
                displayVal = value.toLocaleString();
              }
            } else if (value !== null && value !== undefined) {
              displayVal = String(value);
            }

            // Filter out white color for the bullet if it's a pie slice border stroke
            const bulletColor = color === "#fff" || color === "#ffffff" ? "#3b82f6" : color;

            return (
              <div key={index} className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: bulletColor }} />
                  <span>{name}:</span>
                </div>
                <span className="font-extrabold text-slate-900">{displayVal}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
}
