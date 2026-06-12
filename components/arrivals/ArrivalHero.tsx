"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ArrivalHeroProps {
  title: string;
  subtitle: string;
  image?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export default function ArrivalHero({
  title,
  subtitle,
  image = "/images/banner/shophero3.png",
  breadcrumbs = [],
}: ArrivalHeroProps) {
  return (
    <section className="relative overflow-hidden w-full h-[380px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
      {/* Background Image */}
      <div className="fixed inset-x-0 top-0 w-full h-[380px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
        <Image
          src={image}
          alt={title}
          fill
          priority
          className="object-cover object-[center_40%]"
          sizes="100vw"
        />
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 top-0 z-[3] flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-black bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] bg-clip-text text-transparent leading-[1.05] tracking-[-0.03em] mb-4 drop-shadow-sm">
            {title}
          </h1>

          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            {subtitle}
          </p>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav
              aria-label="breadcrumb"
              className="flex flex-wrap items-center justify-center gap-0.5 text-sm font-medium text-slate-500 mt-5"
            >
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-0.5">
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="text-slate-500 transition-colors duration-150 hover:text-teal-600 hover:underline"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-bold text-[#0d1b2a]">
                      {crumb.label}
                    </span>
                  )}

                  {i < breadcrumbs.length - 1 && (
                    <span className="px-0.5 text-slate-400">›</span>
                  )}
                </span>
              ))}
            </nav>
          )}
        </motion.div>
      </div>
    </section>
  );
}