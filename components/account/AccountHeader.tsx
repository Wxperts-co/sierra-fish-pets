"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AccountHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export default function AccountHeader({
  title,
  description,
  icon,
  children,
}: AccountHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Back to Dashboard Button (Mobile Only) */}
      <div className="block lg:hidden">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-xs font-black text-[#005AA9] hover:underline bg-[#f8fafd] border border-slate-100/80 shadow-sm px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </h2>
          <p className="text-slate-500 text-sm font-semibold mt-1">
            {description}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
