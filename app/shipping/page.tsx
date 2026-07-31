"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Truck,
  PackageCheck,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Store,
  MapPin,
  Phone,
  Mail,
  HelpCircle,
} from "lucide-react";

export default function ShippingInfoPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* ─── HERO HEADER SECTION (SAME AS COUPONS & POLICIES) ─── */}
      <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
        {/* Image — clipped to banner bounds */}
        <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
          <Image
            src="/images/banner/shophero5.png"
            alt="Shipping & Delivery Information"
            fill
            priority
            className="object-cover object-[center_60%] block md:hidden"
            sizes="100vw"
          />
          <Image
            src="/images/banner/shophero3.png"
            alt="Shipping & Delivery Information"
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
              Shipping &amp; Delivery Info
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
                  Shipping Info
                </span>
              </span>
            </nav>
          </motion.div>
        </div>
      </section>

      {/* ─── SUMMARY CARDS ─── */}
      <section className="pt-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#005AA9] mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Standard &amp; Freight Shipping</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Calculated freight rates at checkout based on package weight and destination zone.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">In-Store Pickup Available</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Free local store pickup at our Renton, WA store for eligible items.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Customer Return Freight</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Return shipping freight costs are the responsibility of the customer for all mailed returns.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── DETAILED SHIPPING CONTENT ─── */}
      <section className="pt-12">
        <div className="container mx-auto px-6 max-w-5xl space-y-10">

          {/* RETURN FREIGHT NOTICE */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 md:p-8 shadow-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500 text-white shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                  Return Policy Notice
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-amber-950">
                  Return Shipping &amp; Freight Responsibility
                </h2>
              </div>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed font-medium">
              Customers are responsible for all return shipping costs and freight fees for items returned by mail or carrier. Outbound freight costs incurred by Sierra Fish &amp; Pets on free shipping items may be deducted from final refunds.
            </p>
            <div className="pt-2">
              <Link
                href="/policies"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-900 hover:text-amber-950 underline"
              >
                Read Full Store Return Policies &rarr;
              </Link>
            </div>
          </div>

          {/* SHIPPING METHODS & TIMEFRAMES */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 rounded-2xl bg-[#005AA9]/10 text-[#005AA9]">
                <PackageCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Shipping Methods &amp; Delivery</h2>
                <p className="text-xs font-bold text-[#005AA9] uppercase tracking-wider">Fast &amp; Reliable Dispatch</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                Sierra Fish &amp; Pets ships orders promptly across the United States. Standard orders are typically processed and dispatched within <strong>1–2 business days</strong>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">Standard Ground Shipping</h4>
                  <p className="text-xs text-slate-500">Delivered within 3–7 business days via UPS, FedEx, or USPS depending on location.</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">Direct Drop-Ship</h4>
                  <p className="text-xs text-slate-500">Certain heavy or specialty items ship directly from the manufacturer with free freight.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT BOX */}
          <div className="bg-[#003d73] text-white rounded-3xl p-8 md:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-extrabold">Questions About Your Shipment?</h3>
              <p className="text-xs md:text-sm text-blue-100 font-light">
                Reach out to our Renton team for order tracking, shipping quotes, or assistance.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 bg-[#00aaff] hover:bg-[#0099e6] text-slate-900 font-extrabold px-6 py-3 rounded-2xl text-xs transition-all shadow"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Us</span>
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
