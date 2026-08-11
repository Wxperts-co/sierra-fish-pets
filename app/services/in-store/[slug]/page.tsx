import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServiceMetadata } from "@/lib/servicesMetadata";
import {
  CheckCircle2,
  ArrowRight,
  FlaskConical,
  Droplets,
  Award,
  Sparkles,
  Gift,
  Smile,
  HelpCircle,
  Scissors,
  CalendarDays,
  HeartHandshake,
  Compass,
  Users,
  Footprints,
} from "lucide-react";
import servicesData from "@/data/services.json";

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  price: string;
  features: string[];
}

const ALLOWED_SLUGS = [
  "aquarium-water-testing",
  "fish-of-month-club",
  "pet-nail-wing-trims",
  "store-tours",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getServiceMetadata(slug);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!ALLOWED_SLUGS.includes(slug)) {
    notFound();
  }

  const service = (servicesData as ServiceItem[]).find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const isWaterTesting = slug === "aquarium-water-testing";
  const isFishOfMonth = slug === "fish-of-month-club";
  const isNailWingTrim = slug === "pet-nail-wing-trims";
  const isStoreTours = slug === "store-tours";

  return (
    <>
      <main className="min-h-screen bg-slate-50 text-slate-800">
        {/* ─── Hero Banner Section ─── */}
        <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[380px] [clip-path:inset(0)]">
          {/* Background Image with Light Premium Overlay */}
          <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[380px] pointer-events-none overflow-hidden z-0">
            {/* Mobile image */}
            <Image
              src="/images/banner/shophero5.png"
              alt={service.name}
              fill
              priority
              className="object-cover object-[center_60%] block md:hidden filter brightness-[0.95]"
              sizes="100vw"
            />
            {/* Desktop image */}
            <Image
              src={service.image}
              alt={service.name}
              fill
              priority
              className="object-cover object-center hidden md:block filter brightness-[0.95]"
              sizes="100vw"
            />
          </div>

          {/* Light backdrop overlay */}

          {/* Centered text block */}
          <div className="absolute inset-x-0 top-0 z-[3] flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="flex flex-col items-center justify-center max-w-4xl">
              <h1 className="text-3xl md:text-4xl lg:text-4xl font-black bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] bg-clip-text text-transparent drop-shadow-sm tracking-tight leading-tight mb-4">
                {service.name}
              </h1>
              {/* Breadcrumb */}
              <nav
                aria-label="breadcrumb"
                className="flex flex-wrap items-center justify-center gap-1 text-sm font-medium text-slate-200 drop-shadow mb-6"
              >
                <span className="flex items-center gap-1">
                  <Link
                    href="/"
                    className="text-slate-200 transition-colors duration-150 hover:text-white hover:underline"
                  >
                    Home
                  </Link>
                  <span className="px-1 text-slate-300"> › </span>
                </span>
                <span className="flex items-center gap-1">
                  <Link
                    href="/services"
                    className="text-slate-200 transition-colors duration-150 hover:text-white hover:underline"
                  >
                    Services
                  </Link>
                  <span className="px-1 text-slate-300"> › </span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-bold bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] bg-clip-text text-transparent drop-shadow-sm">{service.name}</span>
                </span>
              </nav>

              <div>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 bg-[#005AA9] hover:bg-[#004b8d] text-white px-8 py-3 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
                >
                  Book a Group Tour
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Service Description & Details Section ─── */}
        <section className="relative py-12 md:py-20 bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Main Content Area */}
              <div className="lg:col-span-7 space-y-10">
                {isWaterTesting ? (
                  <>
                    {/* Overview Header */}
                    <div className="space-y-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#005AA9] bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full select-none">
                        Professional In-Store Care
                      </span>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-[#002244] tracking-tight">
                        Expert Aquarium Water Testing & Analysis Services
                      </h2>
                      <p className="text-base md:text-lg text-slate-600 font-normal leading-relaxed">
                        Maintaining crystal-clear, balanced water is the foundation of a healthy aquatic environment. Whether you are cycling a brand-new setup, troubleshooting cloudy water, or keeping a mature reef or planted tank in peak condition, Sierra Fish & Pets provides fast, precise, and professional water testing to ensure your aquatic pets stay vibrant and healthy.
                      </p>
                    </div>

                    {/* What We Test & Analyze */}
                    <div className="space-y-6 pt-2">
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                        <FlaskConical className="w-6 h-6 text-[#005AA9]" />
                        <h3 className="text-xl font-bold text-[#002244] tracking-tight">
                          What We Test & Analyze
                        </h3>
                      </div>
                      <p className="text-sm text-slate-600 font-normal leading-relaxed">
                        Our aquatics team tests key water parameters using lab-grade liquid testing methods to give you a complete picture of your tank&apos;s ecosystem:
                      </p>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-1 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-base text-[#005AA9]">
                            Ammonia (NH₃/NH₄⁺)
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Detects harmful waste spikes from fish waste or unconsumed food.
                          </p>
                        </div>

                        <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-1 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-base text-[#005AA9]">
                            Nitrite (NO₂⁻)
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Monitors the crucial second stage of your nitrogen cycle to prevent fish stress.
                          </p>
                        </div>

                        <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-1 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-base text-[#005AA9]">
                            Nitrate (NO₃⁻)
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Keeps organic buildup in check to control algae growth and protect long-term livestock health.
                          </p>
                        </div>

                        <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-1 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-base text-[#005AA9]">
                            pH Levels
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Measures acidity or alkalinity suited to your specific species (from South American cichlids to African rift lake dwellers).
                          </p>
                        </div>

                        <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-1 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-base text-[#005AA9]">
                            General & Carbonate Hardness (GH & KH)
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Tracks buffer capacity and essential minerals required for healthy shrimp, snails, and plant growth.
                          </p>
                        </div>

                        <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-1 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-base text-[#005AA9]">
                            Salinity & Specific Gravity
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Ensures precise salt concentrations for marine and reef tanks.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* How to Bring in Your Sample */}
                    <div className="space-y-6 pt-2">
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                        <Droplets className="w-6 h-6 text-[#005AA9]" />
                        <h3 className="text-xl font-bold text-[#002244] tracking-tight">
                          How to Bring in Your Sample
                        </h3>
                      </div>
                      <p className="text-sm text-slate-600 font-normal leading-relaxed">
                        To get the most accurate results, follow these quick steps when collecting your water:
                      </p>

                      <div className="space-y-3.5">
                        <div className="flex items-start gap-4 p-5 bg-white border border-slate-200 shadow-sm rounded-2xl">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 border border-blue-100 text-[#005AA9] font-bold text-sm shrink-0">
                            1
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 text-sm">Collect Clean: </span>
                            <span className="text-sm text-slate-600 font-normal leading-relaxed">
                              Fill a small, clean glass or plastic container (at least 4–8 oz) with aquarium water directly from your tank.
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-5 bg-white border border-slate-200 shadow-sm rounded-2xl">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 border border-blue-100 text-[#005AA9] font-bold text-sm shrink-0">
                            2
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 text-sm">Avoid Contamination: </span>
                            <span className="text-sm text-slate-600 font-normal leading-relaxed">
                              Do not use containers that previously held soap, chemicals, or food.
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-5 bg-white border border-slate-200 shadow-sm rounded-2xl">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 border border-blue-100 text-[#005AA9] font-bold text-sm shrink-0">
                            3
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 text-sm">Seal & Transport: </span>
                            <span className="text-sm text-slate-600 font-normal leading-relaxed">
                              Cap the container tightly and bring it to Sierra Fish & Pets as soon as possible after collecting.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Why Choose Sierra Fish & Pets? */}
                    <div className="p-6 md:p-8 bg-gradient-to-r from-blue-50 via-cyan-50/70 to-blue-50 border border-blue-200/80 rounded-3xl space-y-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Award className="w-6 h-6 text-[#005AA9]" />
                        <h3 className="text-xl font-bold text-[#002244] tracking-tight">
                          Why Choose Sierra Fish & Pets?
                        </h3>
                      </div>
                      <p className="text-sm text-slate-700 font-normal leading-relaxed">
                        We don&apos;t just hand you a strip of color-matching paper and send you on your way. Our experienced aquarists analyze your exact numbers, explain what they mean for your specific livestock, and recommend targeted solutions if adjustments are needed.
                      </p>
                      <p className="text-sm font-bold text-[#005AA9] pt-3 border-t border-blue-200/60">
                        Visit us in-store today to test your water, stock up on supplies, or speak directly with our aquatic specialists!
                      </p>
                    </div>
                  </>
                ) : isFishOfMonth ? (
                  <>
                    {/* Overview Header */}
                    <div className="space-y-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#005AA9] bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full select-none">
                        Kids & Young Hobbyists Club
                      </span>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-[#002244] tracking-tight">
                        Discover the O&apos;Fishal Fish of the Month Club!
                      </h2>
                      <p className="text-base md:text-lg text-slate-600 font-normal leading-relaxed">
                        At Sierra Fish & Pets, we love inspiring the next generation of aquatic hobbyists! Our O&apos;Fishal Fish of the Month Club is designed to encourage young fish keepers to learn, grow, and enjoy the wonderful world of aquarium keeping.
                      </p>
                    </div>

                    {/* How It Works */}
                    <div className="space-y-6 pt-2">
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                        <Sparkles className="w-6 h-6 text-[#005AA9]" />
                        <h3 className="text-xl font-bold text-[#002244] tracking-tight">
                          How It Works
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-start gap-4 p-5 bg-white border border-slate-200 shadow-sm rounded-2xl">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 border border-blue-100 text-[#005AA9] font-bold text-sm shrink-0">
                            1
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 text-sm">Who Can Join: </span>
                            <span className="text-sm text-slate-600 font-normal leading-relaxed">
                              Open to all young hobbyists aged 10 and under.
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-5 bg-white border border-slate-200 shadow-sm rounded-2xl">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 border border-blue-100 text-[#005AA9] font-bold text-sm shrink-0">
                            2
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 text-sm">Get Your Punchcard: </span>
                            <span className="text-sm text-slate-600 font-normal leading-relaxed">
                              Stop by Sierra Fish & Pets to pick up your official club punchcard.
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-5 bg-white border border-slate-200 shadow-sm rounded-2xl">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 border border-blue-100 text-[#005AA9] font-bold text-sm shrink-0">
                            3
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 text-sm">Monthly Free Fish: </span>
                            <span className="text-sm text-slate-600 font-normal leading-relaxed">
                              Bring your punchcard into the store each month to receive one FREE select featured fish to add to your home aquarium!
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-5 bg-white border border-slate-200 shadow-sm rounded-2xl">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 border border-blue-100 text-[#005AA9] font-bold text-sm shrink-0">
                            4
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 text-sm">Watch Your Tank Grow: </span>
                            <span className="text-sm text-slate-600 font-normal leading-relaxed">
                              Collect monthly punches while building a healthy, vibrant aquatic environment.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Why Join? */}
                    <div className="space-y-6 pt-2">
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                        <Gift className="w-6 h-6 text-[#005AA9]" />
                        <h3 className="text-xl font-bold text-[#002244] tracking-tight">
                          Why Join?
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-1 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-base text-[#005AA9]">
                            Fun Learning Experience
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Teaches kids the joy and responsibility of pet care.
                          </p>
                        </div>

                        <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-1 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-base text-[#005AA9]">
                            Exclusive Monthly Selections
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Explore exciting new fish species picked specifically for young fish keepers.
                          </p>
                        </div>

                        <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-1 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-base text-[#005AA9]">
                            100% Free to Join
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            No signup fees—just drop in, grab your punchcard, and start collecting!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Visit Us to Get Started Today! */}
                    <div className="p-6 md:p-8 bg-gradient-to-r from-blue-50 via-cyan-50/70 to-blue-50 border border-blue-200/80 rounded-3xl space-y-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Smile className="w-6 h-6 text-[#005AA9]" />
                        <h3 className="text-xl font-bold text-[#002244] tracking-tight">
                          Visit Us to Get Started Today!
                        </h3>
                      </div>
                      <p className="text-sm text-slate-700 font-normal leading-relaxed">
                        Ready to jump in? Visit Sierra Fish & Pets, ask our team for your O&apos;Fishal Fish of the Month Club punchcard, and take home your first free fish today!
                      </p>
                      <p className="text-sm font-semibold text-slate-600 pt-3 border-t border-blue-200/60 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-[#005AA9] shrink-0" />
                        Have questions about tank setup or eligible monthly fish? Stop by the store or speak with one of our aquarium specialists!
                      </p>
                    </div>
                  </>
                ) : isNailWingTrim ? (
                  <>
                    {/* Overview Header */}
                    <div className="space-y-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#005AA9] bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full select-none">
                        Gentle Pet Care Services
                      </span>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-[#002244] tracking-tight">
                        Pet Nail & Wing Trimming Services at Sierra Fish & Pets
                      </h2>
                      <p className="text-base md:text-lg text-slate-600 font-normal leading-relaxed">
                        Keep your feathered and four-legged companions comfortable, healthy, and safe with professional nail and wing trims at Sierra Fish & Pets.
                      </p>
                    </div>

                    {/* Why Regular Trimming Matters */}
                    <div className="space-y-6 pt-2">
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                        <Scissors className="w-6 h-6 text-[#005AA9]" />
                        <h3 className="text-xl font-bold text-[#002244] tracking-tight">
                          Why Regular Trimming Matters
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-1 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-base text-[#005AA9]">
                            Nail Trims for Dogs & Cats
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Overgrown nails can cause pain, change a pet&apos;s natural gait, and lead to joint strain or ingrown nails over time. Regular trims keep paws healthy, protect your floors, and prevent accidental scratches.
                          </p>
                        </div>

                        <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-1 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-base text-[#005AA9]">
                            Nail Trims for Birds & Small Animals
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Long claws can catch on cage wire, toys, or carpet, risking painful tears. Proper length ensures a firm, comfortable grip on perches and surfaces.
                          </p>
                        </div>

                        <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-1 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-base text-[#005AA9]">
                            Wing Trims for Birds
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Gentle wing trims help prevent accidental escapes, high-velocity collisions with windows or walls, and dangerous falls inside the home, while still allowing birds to land safely.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Service Schedule & Pricing Table/Card */}
                    <div className="space-y-6 pt-2">
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                        <CalendarDays className="w-6 h-6 text-[#005AA9]" />
                        <h3 className="text-xl font-bold text-[#002244] tracking-tight">
                          Service Schedule & Pricing
                        </h3>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="divide-y divide-slate-100">
                          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="font-bold text-slate-900 text-sm block">Scheduled Days</span>
                              <span className="text-xs text-slate-500">Regular walk-in hours</span>
                            </div>
                            <span className="font-bold text-[#005AA9] text-sm bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-100 w-fit">
                              Every Monday & Tuesday
                            </span>
                          </div>

                          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="font-bold text-slate-900 text-sm block">Other Days</span>
                              <span className="text-xs text-slate-500">By request</span>
                            </div>
                            <span className="text-sm text-slate-700 font-medium w-fit">
                              Call-in requests accepted based on technician availability
                            </span>
                          </div>

                          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="font-bold text-slate-900 text-sm block">Pricing</span>
                              <span className="text-xs text-slate-500">Customized by species</span>
                            </div>
                            <span className="text-sm text-slate-700 font-medium w-fit">
                              Costs vary depending on the animal type and specific services provided
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Plan Your Visit Today */}
                    <div className="p-6 md:p-8 bg-gradient-to-r from-blue-50 via-cyan-50/70 to-blue-50 border border-blue-200/80 rounded-3xl space-y-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <HeartHandshake className="w-6 h-6 text-[#005AA9]" />
                        <h3 className="text-xl font-bold text-[#002244] tracking-tight">
                          Plan Your Visit Today
                        </h3>
                      </div>
                      <p className="text-sm text-slate-700 font-normal leading-relaxed">
                        Stop by on Mondays or Tuesdays, or call Sierra Fish & Pets in advance to check availability and get pricing details for your specific pet. Our friendly team is here to make the experience stress-free for both you and your pet!
                      </p>
                    </div>
                  </>
                ) : isStoreTours ? (
                  <>
                    {/* Overview Header */}
                    <div className="space-y-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#005AA9] bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full select-none">
                        Hands-On Learning & Workshops
                      </span>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-[#002244] tracking-tight">
                        Behind-the-Scenes Store Tours & Animal Care Workshops
                      </h2>
                      <p className="text-base md:text-lg text-slate-600 font-normal leading-relaxed">
                        Bring your class, party, or community group to Sierra Fish & Pets for an engaging, hands-on learning experience! Our guided store tours give children and adults an up-close look at a wide variety of animals while discovering what it truly takes to care for them.
                      </p>
                    </div>

                    {/* Great For */}
                    <div className="space-y-6 pt-2">
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                        <Users className="w-6 h-6 text-[#005AA9]" />
                        <h3 className="text-xl font-bold text-[#002244] tracking-tight">
                          Great For
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#005AA9] shrink-0" />
                          <span className="font-bold text-slate-800 text-sm">School & Preschool Field Trips</span>
                        </div>
                        <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#005AA9] shrink-0" />
                          <span className="font-bold text-slate-800 text-sm">Birthday Parties</span>
                        </div>
                        <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#005AA9] shrink-0" />
                          <span className="font-bold text-slate-800 text-sm">Scout Troops & Youth Clubs</span>
                        </div>
                        <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#005AA9] shrink-0" />
                          <span className="font-bold text-slate-800 text-sm">Church & Community Groups</span>
                        </div>
                        <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center gap-3 sm:col-span-2">
                          <CheckCircle2 className="w-5 h-5 text-[#005AA9] shrink-0" />
                          <span className="font-bold text-slate-800 text-sm">Homeschool Co-ops</span>
                        </div>
                      </div>
                    </div>

                    {/* What's Included in the Tour */}
                    <div className="space-y-6 pt-2">
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                        <Compass className="w-6 h-6 text-[#005AA9]" />
                        <h3 className="text-xl font-bold text-[#002244] tracking-tight">
                          What&apos;s Included in the Tour
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-1 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-base text-[#005AA9]">
                            Meet & Interact with Animals
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Get up close with mammals, reptiles, birds, and aquatic life in a safe, structured environment.
                          </p>
                        </div>

                        <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-1 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-base text-[#005AA9]">
                            Learn Responsible Pet Ownership
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Our knowledgeable team covers diet, habitat setup, daily routines, and proper handling techniques for different species.
                          </p>
                        </div>

                        <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-1 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-base text-[#005AA9]">
                            Interactive Q&A
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Visitors get to ask our pet care specialists all their burning questions about exotic pets, fishkeeping, and furry friends.
                          </p>
                        </div>

                        <div className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl space-y-1 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-base text-[#005AA9]">
                            Behind-the-Scenes Access
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Discover how a full-service pet and aquatic center operates day-to-day.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tour Details & Pricing Table/Card */}
                    <div className="space-y-6 pt-2">
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                        <CalendarDays className="w-6 h-6 text-[#005AA9]" />
                        <h3 className="text-xl font-bold text-[#002244] tracking-tight">
                          Tour Details & Pricing
                        </h3>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="divide-y divide-slate-100">
                          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="font-bold text-slate-900 text-sm block">Group Sizes</span>
                              <span className="text-xs text-slate-500">Flexible accommodation</span>
                            </div>
                            <span className="text-sm text-slate-700 font-medium w-fit">
                              Accommodates small groups, full classrooms, and party gatherings
                            </span>
                          </div>

                          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="font-bold text-slate-900 text-sm block">Scheduling</span>
                              <span className="text-xs text-slate-500">Advance booking required</span>
                            </div>
                            <span className="text-sm text-slate-700 font-medium w-fit">
                              Scheduled in advance to ensure dedicated staff guide your group
                            </span>
                          </div>

                          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="font-bold text-slate-900 text-sm block">Pricing</span>
                              <span className="text-xs text-slate-500">Standard tours</span>
                            </div>
                            <span className="font-bold text-[#005AA9] text-sm bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-100 w-fit">
                              FREE! (May vary based on group size, duration, or special activities)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Book Your Group Tour Today */}
                    <div className="p-6 md:p-8 bg-gradient-to-r from-blue-50 via-cyan-50/70 to-blue-50 border border-blue-200/80 rounded-3xl space-y-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Footprints className="w-6 h-6 text-[#005AA9]" />
                        <h3 className="text-xl font-bold text-[#002244] tracking-tight">
                          Book Your Group Tour Today
                        </h3>
                      </div>
                      <p className="text-sm text-slate-700 font-normal leading-relaxed">
                        Ready to plan a fun and educational outing? Contact Sierra Fish & Pets today to reserve a date, discuss custom tour details, and schedule your group&apos;s free visit!
                      </p>
                    </div>

                    {/* ─── Loyalty & Rewards Program Explained Section ─── */}
                    <div className="space-y-6 pt-8 border-t border-slate-200">
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#005AA9] bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full select-none">
                          In-Store Perks &amp; Rewards
                        </span>
                        <h3 className="text-2xl md:text-3xl font-extrabold text-[#002244] tracking-tight">
                          In-Store Loyalty &amp; Astro Loyalty Program Explained
                        </h3>
                        <p className="text-sm text-slate-600 font-normal leading-relaxed">
                          We believe in rewarding our community of pet parents! Learn how our two complementary customer reward programs help you save on every purchase.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* In-Store Loyalty */}
                        <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-3xl space-y-3 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-lg text-[#005AA9]">
                            1. In-Store Loyalty Program
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Earn 1 point for every $1 spent in-store across all departments. Give your phone number at checkout—no card needed. Redeem points for instant store credits on pet food, live fish, and supplies.
                          </p>
                        </div>

                        {/* Astro Loyalty */}
                        <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-3xl space-y-3 hover:border-blue-300 transition-all">
                          <h4 className="font-bold text-lg text-[#005AA9]">
                            2. Astro Loyalty Program
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            Buy 10 or 12 bags of participating premium pet food or treats and get 1 Bag FREE! Purchases are tracked 100% digitally in-store via Astro Loyalty. Track progress on the free Astro mobile app.
                          </p>
                        </div>
                      </div>

                      {/* Link to Single Reward Page */}
                      <div className="p-6 md:p-8 bg-[#005AA9] text-white rounded-3xl space-y-4 shadow-lg shadow-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1 text-center md:text-left">
                          <h4 className="text-xl font-bold tracking-tight">
                            Explore Complete Rewards Details
                          </h4>
                          <p className="text-xs sm:text-sm text-blue-100 font-normal leading-relaxed">
                            View participating frequent buyer brands, points redemption tiers, and double-stacking perks on our dedicated Rewards page.
                          </p>
                        </div>
                        <Link
                          href="/rewards"
                          className="inline-flex items-center gap-2 bg-white text-[#005AA9] hover:bg-slate-100 px-6 py-3 rounded-2xl font-bold text-sm shrink-0 shadow transition-all hover:scale-105"
                        >
                          View Rewards Page
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#005AA9] bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full select-none">
                      Overview
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#002244] tracking-tight">
                      About {service.name}
                    </h2>
                    <p className="text-base md:text-lg text-slate-600 font-normal leading-relaxed whitespace-pre-line">
                      {service.description}
                    </p>
                    <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        {service.shortDescription}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Sidebar Summary Card */}
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <div className="bg-[#e0f2fe]/70 backdrop-blur-md border border-sky-200/90 rounded-3xl p-8 shadow-xl shadow-blue-500/10 relative overflow-hidden group hover:border-[#005AA9]/40 transition-all duration-300">
                  <div className="absolute -right-24 -top-24 w-48 h-48 bg-[#00aaff]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00aaff]/25 transition-all duration-500" />
                  
                  <h3 className="font-extrabold text-lg text-[#002244] mb-6 border-b border-sky-200/60 pb-4">
                    Service Summary
                  </h3>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">Pricing:</span>
                      <span className="text-lg font-bold text-[#005AA9] bg-white/80 backdrop-blur-sm px-3.5 py-1 rounded-xl border border-sky-200/80 shadow-sm">
                        {service.price}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-4">Key Benefits & Features:</h4>
                      <ul className="space-y-3">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
                            <CheckCircle2 className="w-5 h-5 text-[#005AA9] shrink-0 mt-0.5" />
                            <span className="leading-relaxed font-normal">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-sky-200/60">
                      <Link
                        href="/contact-us"
                        className="w-full flex items-center justify-center gap-2 bg-[#005AA9] hover:bg-[#004b8d] text-white py-3.5 rounded-2xl font-bold transition-all shadow-md shadow-blue-500/20"
                      >
                        Book a Tour
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// Generate static params for Next.js compile step
export async function generateStaticParams() {
  return ALLOWED_SLUGS.map((slug) => ({
    slug,
  }));
}
