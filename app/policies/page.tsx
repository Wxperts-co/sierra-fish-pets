"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  RefreshCw,
  Utensils,
  Fish,
  ShoppingBag,
  Truck,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HelpCircle,
} from "lucide-react";

export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* ─── HERO HEADER SECTION (SAME AS COUPONS PAGE) ─── */}
      <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
        {/* Image — clipped to banner bounds */}
        <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
          {/* Mobile image */}
          <Image
            src="/images/banner/shophero5.png"
            alt="Store Policies & Return Guarantee"
            fill
            priority
            className="object-cover object-[center_60%] block md:hidden"
            sizes="100vw"
          />
          {/* Desktop image */}
          <Image
            src="/images/banner/shophero3.png"
            alt="Store Policies & Return Guarantee"
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
              Store &amp; Return Policies
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
                <span className="font-bold text-[#0d1b2a] md:text-[#0d1b2a] text-white">
                  Policies &amp; Returns
                </span>
              </span>
            </nav>
          </motion.div>
        </div>
      </section>

      {/* ─── POLICY SUMMARY CARDS ─── */}
      <section className="pt-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Pet Food Policy */}
            <a
              href="#food-policy"
              className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#005AA9] transition-colors">
                Pet Food Return Guarantee
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                100% Taste &amp; Palatability Guarantee. Exchange or refund if your pet doesn&apos;t love their food.
              </p>
            </a>

            {/* Card 2: Return Freight Responsibility */}
            <a
              href="#freight-policy"
              className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#005AA9] mb-4 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#005AA9] transition-colors">
                Return Shipping &amp; Freight
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Return freight and carrier shipping costs are the customer&apos;s responsibility for all mailed returns.
              </p>
            </a>

            {/* Card 3: Live Fish Guarantee */}
            <a
              href="#livestock-policy"
              className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                <Fish className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-[#005AA9] transition-colors">
                Live Fish Health Guarantee
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                48-hour live guarantee on freshwater and saltwater livestock with water sample verification.
              </p>
            </a>

          </div>
        </div>
      </section>

      {/* ─── DETAILED POLICY SECTIONS ─── */}
      <section className="pt-12">
        <div className="container mx-auto px-6 max-w-5xl space-y-10">

          {/* CRITICAL RETURN FREIGHT NOTICE BANNER */}
          <div id="freight-policy" className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 md:p-8 shadow-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500 text-white shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                  Important Notice
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-amber-950">
                  Return Shipping &amp; Freight Responsibility
                </h2>
              </div>
            </div>

            <p className="text-sm text-amber-900 leading-relaxed font-medium">
              Please note that <strong className="font-bold underline">return freight and carrier shipping costs are the sole responsibility of the customer</strong> for all returned items sent by mail, carrier, or freight. 
            </p>
            
            <ul className="space-y-2 text-xs md:text-sm text-amber-900 list-disc list-inside leading-relaxed pl-1">
              <li>Customers must cover outbound and return shipping charges unless the return is due to an error on our part (e.g., incorrect item shipped or item damaged in transit).</li>
              <li>For items shipped under promotional &ldquo;Free Shipping&rdquo; offers, the actual outbound freight shipping cost incurred by Sierra Fish &amp; Pets may be deducted from the final refund amount.</li>
              <li>We recommend using a trackable shipping service or purchasing shipping insurance for return shipments, as we cannot guarantee receipt of un-tracked returned items.</li>
            </ul>
          </div>

          {/* PET FOOD RETURN GUARANTEE */}
          <div id="food-policy" className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 rounded-2xl bg-[#005AA9]/10 text-[#005AA9]">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Pet Food &amp; Treat Return Policy
                </h2>
                <p className="text-xs font-bold text-[#005AA9] uppercase tracking-wider">
                  100% Taste &amp; Palatability Guarantee
                </p>
              </div>
            </div>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
              We stand behind every bag and can of pet food we sell. If your dog, cat, bird, reptile, or small animal refuses to eat a food formula or treat purchased from Sierra Fish &amp; Pets, you can return it for an exchange or full refund.
            </p>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Food Return Guidelines:
              </h4>
              <ul className="space-y-2 text-xs md:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#005AA9] font-bold">•</span>
                  <span>Must be returned in the <strong>original packaging/bag</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#005AA9] font-bold">•</span>
                  <span>Must contain at least <strong>50% or more</strong> of the original food remaining in the container.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#005AA9] font-bold">•</span>
                  <span>Returned within <strong>30 days</strong> of purchase date with store receipt or Sierra Rewards account lookup.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#005AA9] font-bold">•</span>
                  <span>In-store returns are free of charge; mailed food returns are subject to customer return freight responsibility.</span>
                </li>
              </ul>
            </div>
          </div>

          

          {/* LIVE FISH & LIVESTOCK HEALTH GUARANTEE */}
          <div id="livestock-policy" className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 rounded-2xl bg-[#005AA9]/10 text-[#005AA9]">
                <Fish className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Live Fish &amp; Livestock Guarantee
                </h2>
                <p className="text-xs font-bold text-[#005AA9] uppercase tracking-wider">
                  48-Hour Live Health Guarantee
                </p>
              </div>
            </div>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
              We stand behind the health of our live freshwater fish, saltwater fish, and invertebrates. We offer a <strong>48-Hour Live Health Guarantee</strong>.
            </p>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#005AA9]" />
                Requirements for Livestock Guarantee:
              </h4>
              <ol className="space-y-2 text-xs md:text-sm text-slate-600 list-decimal list-inside leading-relaxed">
                <li>Bring the deceased specimen to our store within 48 hours of purchase.</li>
                <li>Bring a separate sample of your aquarium water (at least 1 cup) for free testing.</li>
                <li>Bring your store receipt or rewards phone number lookup.</li>
                <li>Upon water quality parameter verification, we will issue a replacement or store credit.</li>
              </ol>
            </div>
          </div>

          {/* CONTACT & RETURN ASSISTANCE BANNER */}
          <div className="bg-[#003d73] text-white rounded-3xl p-8 md:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-extrabold">Need Help With a Return?</h3>
              <p className="text-xs md:text-sm text-blue-100 font-light">
                Our team is ready to assist you with in-store or online return instructions.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 bg-[#00aaff] hover:bg-[#0099e6] text-slate-900 font-extrabold px-6 py-3 rounded-2xl text-xs transition-all shadow"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Customer Service</span>
              </Link>
              <a
                href="tel:4252263270"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-6 py-3 rounded-2xl text-xs transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>(425) 226-3270</span>
              </a>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
