"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Copy, Check, Clock, Gift, ChevronRight } from "lucide-react";

interface Coupon {
  _id: string;
  code: string;
  title: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumPurchase: number;
  maximumDiscount?: number;
  endDate: string;
  applicableCategories: string[];
  image?: string;
  terms?: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/coupons")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCoupons(data.coupons || []);
      })
      .catch((err) => console.error("Failed to fetch coupons:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    });
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountType === "percentage") return `${coupon.discountValue}% OFF`;
    return `$${coupon.discountValue} OFF`;
  };

  const daysLeft = (endDate: string) => {
    const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return "Expired";
    if (diff === 1) return "Expires Today";
    return `${diff} days left`;
  };

  const isExpiringSoon = (endDate: string) => {
    const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff <= 3 && diff > 0;
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* ─── HERO HEADER SECTION ─── */}
      <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
        {/* Image — clipped to banner bounds */}
        <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
          {/* Mobile image */}
          <Image
            src="/images/banner/shophero5.png"
            alt="Coupons & Special Offers"
            fill
            priority
            className="object-cover object-[center_60%] block md:hidden"
            sizes="100vw"
          />
          {/* Desktop image */}
          <Image
            src="/images/banner/shophero3.png"
            alt="Coupons & Special Offers"
            fill
            priority
            className="object-cover object-[center_40%] hidden md:block"
            sizes="100vw"
          />
        </div>

        {/* Mobile overlay */}
        <div className="absolute inset-0 z-[2] block md:hidden bg-[linear-gradient(to_bottom,rgba(0,30,70,0.62)_0%,rgba(0,30,70,0.35)_60%,rgba(0,30,70,0.10)_100%)]" />

        {/* Centered text block */}
        <div className="absolute inset-x-0 top-0 z-[3] flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="mb-4 text-[clamp(2rem,4.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em] bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] bg-clip-text text-transparent drop-shadow-sm">
              Coupons &amp; Special Offers
            </h1>

            {/* Breadcrumb */}
            <nav
              aria-label="breadcrumb"
              className="flex flex-wrap items-center justify-center gap-0.5 text-sm font-medium text-white drop-shadow-md md:text-slate-500 md:drop-shadow-none"
            >
              <span className="flex items-center gap-0.5">
                <Link
                  href="/"
                  className="text-white md:text-slate-500 transition-colors duration-150 hover:text-[#00aaff] hover:underline"
                >
                  Home
                </Link>
                <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
              </span>
              <span className="flex items-center gap-0.5">
                <span className="font-bold text-[#0d1b2a] md:text-[#0d1b2a] text-white">Coupons</span>
              </span>
            </nav>
          </motion.div>
        </div>
      </section>

      {/* Coupon Grid */}
      <section className="pt-12">
        <div className="container mx-auto px-6 max-w-6xl">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse">
                  <div className="h-32 bg-slate-200 rounded-2xl mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
              <Gift className="w-14 h-14 text-[#005AA9] mb-4" />
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2">No Active Coupons Right Now</h2>
              <p className="text-sm text-slate-500 mb-6">Check back soon! We regularly post exclusive deals and discounts for our customers.</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#005AA9] hover:bg-[#00407a] text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-md"
              >
                Browse Shop
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {coupons.map((coupon, i) => (
                  <motion.div
                    key={coupon._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    {/* Color band */}
                    <div className="relative h-2 w-full bg-gradient-to-r from-[#003d73] to-[#00aaff]" />

                    {/* Card Body */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Discount Badge */}
                      <div className="flex items-start justify-between mb-4">
                        <span className="inline-flex items-center gap-1.5 bg-[#003d73] text-white text-sm font-extrabold px-4 py-1.5 rounded-full shadow-sm">
                          <Tag className="w-3.5 h-3.5" />
                          {formatDiscount(coupon)}
                        </span>
                        {isExpiringSoon(coupon.endDate) && (
                          <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Ending Soon!
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-extrabold text-slate-900 mb-1">{coupon.title}</h3>
                      {coupon.description && (
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">{coupon.description}</p>
                      )}

                      {/* Meta info */}
                      <div className="space-y-1.5 mb-5 text-xs text-slate-500">
                        {coupon.minimumPurchase > 0 && (
                          <p>Min. purchase: <strong className="text-slate-700">${coupon.minimumPurchase}</strong></p>
                        )}
                        {coupon.maximumDiscount && (
                          <p>Max. discount: <strong className="text-slate-700">${coupon.maximumDiscount}</strong></p>
                        )}
                        {coupon.applicableCategories.length > 0 && (
                          <p>Applies to: <strong className="text-slate-700 capitalize">{coupon.applicableCategories.join(", ")}</strong></p>
                        )}
                      </div>

                      {/* Expiry */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-5">
                        <Clock className="w-3.5 h-3.5" />
                        <span className={isExpiringSoon(coupon.endDate) ? "text-rose-500 font-bold" : ""}>
                          {daysLeft(coupon.endDate)}
                        </span>
                        <span>· Expires {new Date(coupon.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>

                      {/* Code Copy Box */}
                      <div className="mt-auto">
                        <div className="flex items-center justify-between bg-slate-50 border border-dashed border-slate-300 rounded-2xl px-4 py-3">
                          <span className="text-base font-black text-[#003d73] tracking-widest font-mono">{coupon.code}</span>
                          <button
                            onClick={() => handleCopy(coupon.code)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#005AA9] hover:bg-[#00407a] text-white px-3.5 py-2 rounded-xl transition-all active:scale-95 cursor-pointer"
                          >
                            {copiedCode === coupon.code ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>

                        {coupon.terms && (
                          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed px-1">{coupon.terms}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
