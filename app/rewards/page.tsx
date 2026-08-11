import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import {
  Coins,
  Award,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Gift,
  Smartphone,
  Tag,
  HelpCircle,
  Star,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pet Rewards & Loyalty Programs | Sierra Fish & Pets",
  description:
    "Learn about Sierra Fish & Pets In-Store Loyalty Program and Astro Loyalty Frequent Buyer Program. Earn points and get free pet food with every visit!",
  keywords: [
    "sierra pets rewards",
    "pet store loyalty program",
    "astro loyalty program",
    "frequent buyer pet food",
    "free pet food rewards",
    "in-store rewards renton",
  ],
};

const PARTICIPATING_BRANDS = [
  "Taste of the Wild",
  "Fromm Family Pet Food",
  "Acana & Orijen",
  "Zignature",
  "NutriSource",
  "Primal Pet Foods",
  "Stella & Chewy's",
  "Open Farm",
  "Nulo Pet Food",
  "Lotus Pet Food",
  "Earthborn Holistic",
  "Fussie Cat",
];

export default function RewardsHubPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 text-slate-800">

      {/* ─── Hero Banner Section ─── */}
      <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
        {/* Image — clipped to banner bounds */}
        <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
          {/* Mobile image */}
          <Image
            src="/images/banner/shophero5.png"
            alt="Rewards & Loyalty Programs"
            fill
            priority
            className="object-cover object-[center_60%] block md:hidden"
            sizes="100vw"
          />
          {/* Desktop image */}
          <Image
            src="/images/banner/shophero3.png"
            alt="Rewards & Loyalty Programs"
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
          <div className="flex flex-col items-center justify-center">
            <h1 className="mb-4 text-[clamp(2rem,4.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em] bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] bg-clip-text text-transparent drop-shadow-sm">
              Rewards &amp; Loyalty Programs
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
                <span className="font-bold text-[#0d1b2a] md:text-[#0d1b2a] text-white">Rewards</span>
              </span>
            </nav>
          </div>
        </div>
      </section>

      {/* ─── Quick Stats Strip ─── */}
      <section className="bg-[#005AA9] text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-3 divide-x divide-blue-400/30">
            <div className="flex flex-col items-center py-5 px-4 text-center">
              <span className="text-2xl md:text-3xl font-black text-cyan-300">1pt</span>
              <span className="text-xs font-semibold text-blue-100 mt-0.5">per $1 spent in-store</span>
            </div>
            <div className="flex flex-col items-center py-5 px-4 text-center">
              <span className="text-2xl md:text-3xl font-black text-cyan-300">10–12</span>
              <span className="text-xs font-semibold text-blue-100 mt-0.5">bags to earn 1 FREE</span>
            </div>
            <div className="flex flex-col items-center py-5 px-4 text-center">
              <span className="text-2xl md:text-3xl font-black text-cyan-300">2x</span>
              <span className="text-xs font-semibold text-blue-100 mt-0.5">savings when stacked</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <section className="py-14 md:py-24">
        <div className="container mx-auto px-6 max-w-5xl space-y-24">

          {/* ─── SECTION 1: IN-STORE LOYALTY PROGRAM ─── */}
          <div id="in-store-loyalty" className="scroll-mt-24 space-y-10">

            {/* Section header */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 pb-5 border-b-2 border-[#005AA9]/20">
              <div className="w-14 h-14 rounded-2xl bg-[#005AA9] flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
                <Coins className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#005AA9]">Program 1</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#002244] tracking-tight mt-0.5">
                  In-Store Loyalty Program
                </h2>
              </div>
            </div>

            <p className="text-base md:text-lg text-slate-600 font-normal leading-relaxed -mt-2">
              Earn 1 point for every dollar spent at Sierra Fish &amp; Pets. Points accumulate automatically under your phone number and can be redeemed for instant store credits on pet supplies, live fish, and accessories.
            </p>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Sign Up in Seconds",
                  desc: "Give your phone number to any cashier during checkout. No forms or membership fees required!",
                },
                {
                  step: "2",
                  title: "Earn Points Instantly",
                  desc: "Receive 1 point for every $1 spent across all departments — food, supplies, and live animals.",
                },
                {
                  step: "3",
                  title: "Redeem & Save",
                  desc: "Apply accumulated reward points at checkout for instant dollars off your next transaction.",
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="relative p-6 bg-white rounded-3xl border border-slate-200 shadow-md shadow-slate-200/50 hover:shadow-blue-100/60 hover:border-blue-200 transition-all group overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-blue-50 group-hover:bg-blue-100/60 transition-all" />
                  <span className="relative z-10 flex items-center justify-center w-10 h-10 rounded-2xl bg-[#005AA9] text-white font-black text-base shadow mb-4">
                    {step}
                  </span>
                  <h4 className="font-bold text-base text-[#002244] mb-2">{title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">{desc}</p>
                </div>
              ))}
            </div>

            {/* Benefits badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <ShieldCheck className="w-5 h-5 text-[#005AA9]" />, title: "Points Never Expire", desc: "Your balance stays active — use them whenever you're ready." },
                { icon: <Zap className="w-5 h-5 text-[#005AA9]" />, title: "No Physical Card Needed", desc: "Just give your phone number — we do the rest." },
                { icon: <Star className="w-5 h-5 text-[#005AA9]" />, title: "All Departments Included", desc: "Food, live fish, birds, reptiles, supplies — all earn points." },
                { icon: <Gift className="w-5 h-5 text-[#005AA9]" />, title: "Combine with Astro Loyalty", desc: "Stack both programs on the same purchase for maximum savings." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">{icon}</div>
                  <div>
                    <h4 className="font-bold text-sm text-[#002244]">{title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── SECTION 2: ASTRO LOYALTY PROGRAM ─── */}
          <div id="astro-loyalty" className="scroll-mt-24 space-y-10">

            {/* Section header */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 pb-5 border-b-2 border-cyan-500/20">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#005AA9] to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 shrink-0">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">Program 2</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#002244] tracking-tight mt-0.5">
                  Astro Loyalty Program
                </h2>
              </div>
            </div>

            <p className="text-base md:text-lg text-slate-600 font-normal leading-relaxed -mt-2">
              Buy your favorite premium pet food or treats and get 1 FREE bag! We partner with Astro Loyalty to digitally track your frequent buyer cards — no receipt clipping or UPC cutouts ever needed.
            </p>

            {/* How Astro Works Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Buy Qualifying Brands",
                  desc: "Purchase participating kibble, raw food, or cat litter at Sierra Fish & Pets.",
                  color: "from-cyan-500 to-[#005AA9]",
                },
                {
                  step: "2",
                  title: "Digital Punchcard",
                  desc: "Our cashier logs your purchase in your Astro account digitally — 100% paperless.",
                  color: "from-cyan-500 to-[#005AA9]",
                },
                {
                  step: "3",
                  title: "Get 1 Bag FREE!",
                  desc: "Reach 10 or 12 bags (per brand card) and your next bag is completely FREE!",
                  color: "from-cyan-500 to-[#005AA9]",
                },
              ].map(({ step, title, desc, color }) => (
                <div key={step} className="relative p-6 bg-white rounded-3xl border border-slate-200 shadow-md shadow-slate-200/50 hover:shadow-cyan-100/60 hover:border-cyan-200 transition-all group overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-cyan-50 group-hover:bg-cyan-100/60 transition-all" />
                  <span className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br ${color} text-white font-black text-base shadow mb-4`}>
                    {step}
                  </span>
                  <h4 className="font-bold text-base text-[#002244] mb-2">{title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">{desc}</p>
                </div>
              ))}
            </div>

            {/* Astro App Banner */}
            <div className="p-6 md:p-8 bg-gradient-to-r from-[#002244] to-[#005AA9] rounded-3xl flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-blue-500/20">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <Smartphone className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-lg font-bold text-white">Track Your Progress with the Free Astro App</h4>
                <p className="text-blue-200 text-sm font-normal mt-1 leading-relaxed">
                  Download the <span className="font-semibold text-white">Astro Loyalty App</span> for iOS or Android. Log in with your store phone number to check active punchcard progress, brand promos, and more — anytime!
                </p>
              </div>
            </div>

            {/* Participating Brands */}
            <div className="space-y-5">
              <h4 className="text-lg font-bold text-[#002244] flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#005AA9]" />
                Popular Participating Frequent Buyer Brands
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {PARTICIPATING_BRANDS.map((brand) => (
                  <div
                    key={brand}
                    className="p-3.5 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center gap-2 hover:border-[#005AA9]/40 hover:shadow-md transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#005AA9] shrink-0" />
                    <span className="font-semibold text-slate-800 text-xs leading-snug">{brand}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── COMBINATION CALLOUT ─── */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002244] via-[#005AA9] to-cyan-700 p-8 md:p-12 text-center shadow-2xl shadow-blue-900/30">
            <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
            <div className="absolute right-0 bottom-0 w-72 h-36 rounded-full bg-blue-800/30 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-px w-12 bg-cyan-400/50" />
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <div className="h-px w-12 bg-cyan-400/50" />
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Pro Tip: Stack Both &amp; Double Your Savings!
              </h3>
              <p className="text-blue-100/90 text-sm md:text-base font-normal leading-relaxed">
                When you buy participating pet food at Sierra Fish &amp; Pets, you earn <span className="font-bold text-cyan-300">In-Store Loyalty Points</span> AND clock a punch on your <span className="font-bold text-cyan-300">Astro Frequent Buyer Card</span> — at exactly the same time. No extra steps required!
              </p>
            </div>
          </div>

          {/* ─── FAQ SECTION ─── */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <HelpCircle className="w-6 h-6 text-[#005AA9]" />
              <h3 className="text-xl font-bold text-[#002244]">Frequently Asked Questions</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  q: "How do I check my current points or punch progress?",
                  a: "Your updated in-store points balance is printed on every register receipt. For Astro punch progress, download the free Astro app or ask any team member at checkout.",
                },
                {
                  q: "Do I need to save physical receipts or UPC cutouts?",
                  a: "No! Both programs are 100% digitally tracked. No paper receipts or barcode cutouts — ever.",
                },
                {
                  q: "Can I redeem points on live animals or aquarium setups?",
                  a: "Yes! In-store loyalty points can be redeemed across all inventory including live fish, aquatic plants, reptiles, birds, and custom tank supplies.",
                },
                {
                  q: "Can I mix flavors on my Astro frequent buyer card?",
                  a: "Yes! Most manufacturers allow mixing flavors within the same brand and bag size class. Your free bag will typically equal the value of the smallest size purchased.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl hover:border-blue-200 hover:shadow-md transition-all space-y-2">
                  <h4 className="font-bold text-sm text-[#002244] leading-snug">{q}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ─── FINAL CTA BANNER ─── */}
          <div className="text-center space-y-5">
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#002244]">
              Start Earning Rewards on Your Next Visit!
            </h3>
            <p className="text-slate-600 text-sm md:text-base font-normal max-w-lg mx-auto leading-relaxed">
              Just give your phone number at checkout in Renton and start earning points and free pet food today.
            </p>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2.5 bg-[#005AA9] hover:bg-[#004b8d] text-white px-10 py-4 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              Visit Our Store
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
