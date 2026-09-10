"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Droplets,
  Scissors,
  Award,
  PackageCheck,
  ArrowRight,
  Fish,
  HeartHandshake,
  CheckCircle2,
  X,
} from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "aquarium" | "animals" | "services" | "rewards";
  badge?: string;
}

const FAQ_DATA: FaqItem[] = [
  // ── General & Store ──
  {
    id: "gen-1",
    category: "general",
    badge: "Store Info",
    question: "Where is Sierra Fish & Pets located and what are your hours?",
    answer:
      "Sierra Fish & Pets is located at 601 S 3rd St, Renton, WA 98057 (conveniently accessible from I-405). We are open Monday through Saturday from 10:00 AM – 7:00 PM, and Sunday from 11:00 AM – 6:00 PM. Ample free parking is available right in front of the store.",
  },
  {
    id: "gen-2",
    category: "general",
    badge: "Policies",
    question: "What is your return and exchange policy?",
    answer:
      "Dry goods, hardware, equipment, unopened food, and unused supplies in original packaging can be returned or exchanged within 30 days of purchase with a valid receipt. Livestock and live plants are covered under our dedicated 48-hour livestock guarantee.",
  },
  {
    id: "gen-3",
    category: "general",
    badge: "Delivery & Pickup",
    question: "Do you offer in-store pickup or local delivery?",
    answer:
      "Yes! You can order online through our website and select In-Store Pickup at checkout for fast, curbside or counter collection. We also offer local delivery options for select regional zip codes in Renton, Tukwila, Kent, and the greater Seattle area.",
  },
  {
    id: "gen-4",
    category: "general",
    badge: "Gift Cards",
    question: "Can I purchase physical and digital gift cards?",
    answer:
      "Yes! We offer both physical gift cards in-store and instant digital e-gift cards through our website. Gift cards never expire and can be used on all products, livestock, and pet grooming services.",
  },

  // ── Aquariums & Fish ──
  {
    id: "aq-1",
    category: "aquarium",
    badge: "Free Service",
    question: "Do you offer free aquarium water testing?",
    answer:
      "Yes, completely free! Bring at least 1 cup (8 oz) of your aquarium or pond water in a clean container. Our aquatics specialists test for Ammonia, Nitrite, Nitrate, pH, GH, KH, and salinity (for reef tanks). We will analyze the results with you and suggest exact balancing steps.",
  },
  {
    id: "aq-2",
    category: "aquarium",
    badge: "Guarantee",
    question: "What is your live fish guarantee?",
    answer:
      "We offer a 48-Hour Livestock Guarantee on our freshwater and saltwater fish. If a fish passes away within 48 hours of purchase, please bring the deceased fish in a bag along with a separate 1-cup sample of your tank water and your receipt for a store credit or replacement.",
  },
  {
    id: "aq-3",
    category: "aquarium",
    badge: "Custom Tanks",
    question: "Do you offer custom aquarium design, setup, and maintenance?",
    answer:
      "Yes! Our professional aquatic team handles custom tank consulting, plumbing design, aquascaping, delivery, professional installation, and ongoing residential and commercial maintenance. Contact us or visit our Aquarium Services page to schedule a consultation.",
  },
  {
    id: "aq-4",
    category: "aquarium",
    badge: "Filtration",
    question: "What is the Aqua Jet Water Cleaning System you use?",
    answer:
      "Our facility utilizes a state-of-the-art Aqua Jet centralized automated water-exchange and filtration system. It continuously purifies and cycles water through multi-stage UV sterilization and biological beds, ensuring pristine, pathogen-free environments for all holding tanks.",
  },
  {
    id: "aq-5",
    category: "aquarium",
    badge: "Special Orders",
    question: "Can I special order rare fish, corals, or aquatic plants?",
    answer:
      "Yes! If a particular cichlid, discus, schooling fish, marine angel, coral frag, or rare plant is not currently in stock, our buyers can source it from our trusted network of sustainable and certified breeders. Submit a request through our Special Order page.",
  },

  // ── Small Animals, Reptiles & Birds ──
  {
    id: "anim-1",
    category: "animals",
    badge: "Livestock",
    question: "What types of small animals, birds, and reptiles do you carry?",
    answer:
      "We regularly feature hand-fed birds (parakeets, cockatiels, conures, canaries, finches), small animals (bunnies, guinea pigs, hamsters, gerbils, chinchillas, fancy rats), and captive-bred reptiles (bearded dragons, geckos, tortoises, docile snakes, and live feeders like crickets, dubia roaches, and mealworms).",
  },
  {
    id: "anim-2",
    category: "animals",
    badge: "Care Guidance",
    question: "Do you provide setup guides for new pet parents?",
    answer:
      "Absolutely. Our experienced staff takes time to walk every customer through cage sizing, thermal gradients, UVB lighting, dietary requirements, and socialization techniques. You can also explore our Sierra Edu knowledge base anytime online for free care sheets.",
  },
  {
    id: "anim-3",
    category: "animals",
    badge: "Adoptions",
    question: "Can I hold or interact with an animal before taking it home?",
    answer:
      "Yes! We encourage gentle, supervised interaction in our store so you can bond with your prospective companion and verify temperament before completing your adoption.",
  },

  // ── In-Store Services ──
  {
    id: "serv-1",
    category: "services",
    badge: "Grooming",
    question: "Do you offer walk-in pet nail trims and wing clipping?",
    answer:
      "Yes! We perform gentle, stress-free nail trims for dogs, cats, rabbits, guinea pigs, as well as wing and beak care for companion birds. No appointment is usually required, but we recommend a quick phone call before visiting to confirm our service technician is on duty.",
  },
  {
    id: "serv-2",
    category: "services",
    badge: "Club",
    question: "What is the Fish of the Month Club?",
    answer:
      "Our Fish of the Month Club highlights unique, hand-picked aquatic species each month at exclusive member savings, complete with detailed care guides and compatibility tips for both novice and advanced aquarists.",
  },
  {
    id: "serv-3",
    category: "services",
    badge: "Community",
    question: "Do you host dog adoption events and community workshops?",
    answer:
      "Yes! We regularly partner with local rescue organizations and shelters to host weekend dog adoption events in Renton. Check our Event Calendar page for upcoming dates, adoption fairs, and educational seminars.",
  },

  // ── Rewards & Loyalty ──
  {
    id: "rew-1",
    category: "rewards",
    badge: "Loyalty Points",
    question: "How does the In-Store Loyalty Rewards Program work?",
    answer:
      "Every time you shop at Sierra Fish & Pets, give your phone number to the cashier. You earn 1 point per $1 spent on all merchandise and livestock. Points turn into instant cash discounts applied directly at checkout.",
  },
  {
    id: "rew-2",
    category: "rewards",
    badge: "Astro Program",
    question: "What is the Astro Frequent Buyer Program?",
    answer:
      "Astro is a digital pet food loyalty program supported by top premium brands (Fromm, Orijen, Acana, Stella & Chewy's, Oxbow, and more). Buy 10 to 12 qualifying bags (or cans/treats) and receive 1 bag completely FREE! It tracks automatically with your phone number—no coupons to cut.",
  },
  {
    id: "rew-3",
    category: "rewards",
    badge: "Stack Savings",
    question: "Can I stack both loyalty programs together?",
    answer:
      "Yes! You will earn in-store points on every dollar spent while simultaneously collecting frequent-buyer punches on your Astro pet food card. You can also combine these with our monthly store coupons!",
  },
];

const CATEGORIES = [
  { key: "all", label: "All Questions", icon: HelpCircle },
  { key: "general", label: "General & Store", icon: MapPin },
  { key: "aquarium", label: "Aquariums & Fish", icon: Droplets },
  { key: "animals", label: "Small Animals & Birds", icon: Sparkles },
  { key: "services", label: "In-Store Services", icon: Scissors },
  { key: "rewards", label: "Rewards & Orders", icon: Award },
];

export default function FaqClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    "gen-1": true,
    "aq-1": true,
  });

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    FAQ_DATA.forEach((item) => {
      all[item.id] = true;
    });
    setOpenIds(all);
  };

  const collapseAll = () => {
    setOpenIds({});
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-lato">
      {/* ─── HERO HEADER SECTION ─── */}
      <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
        {/* Parallax / Fixed Image Background */}
        <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
          {/* Mobile Image */}
          <Image
            src="/images/banner/shophero5.png"
            alt="Sierra Fish & Pets FAQs"
            fill
            priority
            className="object-cover object-[center_60%] block md:hidden"
            sizes="100vw"
          />
          {/* Desktop Image */}
          <Image
            src="/images/banner/shophero3.png"
            alt="Sierra Fish & Pets FAQs"
            fill
            priority
            className="object-cover object-[center_40%] hidden md:block"
            sizes="100vw"
          />
        </div>

        {/* Mobile Gradient Overlay */}
        <div className="absolute inset-0 z-[2] block md:hidden bg-[linear-gradient(to_bottom,rgba(0,30,70,0.65)_0%,rgba(0,30,70,0.40)_60%,rgba(0,30,70,0.15)_100%)]" />

        {/* Hero Content */}
        <div className="absolute inset-x-0 top-0 z-[3] flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center max-w-3xl"
          >
            <h1 className="mb-4 text-[clamp(2rem,4.5vw,3.2rem)] font-black leading-[1.05] tracking-[-0.03em] text-white drop-shadow-md md:bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] md:bg-clip-text md:text-transparent md:drop-shadow-none">
              Frequently Asked Questions
            </h1>

            {/* Breadcrumb Navigation */}
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
                <span className="px-1 text-white/90 md:text-slate-400">›</span>
              </span>
              <span className="flex items-center gap-0.5">
                <span className="font-bold text-white md:text-[#0d1b2a]">
                  FAQ&apos;s
                </span>
              </span>
            </nav>
          </motion.div>
        </div>
      </section>

      {/* ─── HIGHLIGHT STATS STRIP ─── */}
      <section className="bg-[#005AA9] text-white shadow-inner">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-blue-400/25">
            <div className="flex flex-col items-center py-4 md:py-5 px-3 text-center">
              <span className="text-xl md:text-2xl font-black text-cyan-300">
                100% FREE
              </span>
              <span className="text-xs font-semibold text-blue-100 mt-0.5">
                Water Testing
              </span>
            </div>
            <div className="flex flex-col items-center py-4 md:py-5 px-3 text-center">
              <span className="text-xl md:text-2xl font-black text-cyan-300">
                48 Hours
              </span>
              <span className="text-xs font-semibold text-blue-100 mt-0.5">
                Fish Guarantee
              </span>
            </div>
            <div className="flex flex-col items-center py-4 md:py-5 px-3 text-center">
              <span className="text-xl md:text-2xl font-black text-cyan-300">
                Walk-In
              </span>
              <span className="text-xs font-semibold text-blue-100 mt-0.5">
                Pet Nail Trims
              </span>
            </div>
            <div className="flex flex-col items-center py-4 md:py-5 px-3 text-center">
              <span className="text-xl md:text-2xl font-black text-cyan-300">
                7 Days/Wk
              </span>
              <span className="text-xs font-semibold text-blue-100 mt-0.5">
                Open in Renton
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl space-y-10">
         

          {/* ─── FAQ ACCORDIONS LIST ─── */}
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-[#005AA9]">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                No matching questions found
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try searching with different keywords, select &ldquo;All Questions&rdquo;, or reach out to our team directly.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="inline-flex items-center gap-2 bg-[#005AA9] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow hover:bg-[#004b8d] transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq) => {
                const isOpen = !!openIds[faq.id];
                return (
                  <motion.div
                    key={faq.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-[#005AA9]/40 shadow-md ring-1 ring-[#005AA9]/10"
                        : "border-slate-200/80 hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    {/* Accordion Question Header */}
                    <button
                      onClick={() => toggleAccordion(faq.id)}
                      className="w-full px-5 md:px-6 py-4 md:py-5 flex items-start md:items-center justify-between gap-4 text-left cursor-pointer focus:outline-none"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3.5 flex-1">
                        {faq.badge && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase bg-blue-50 text-[#005AA9] border border-blue-100 shrink-0 self-start">
                            {faq.badge}
                          </span>
                        )}
                        <h3
                          className={`text-base md:text-lg font-bold transition-colors leading-snug ${
                            isOpen ? "text-[#005AA9]" : "text-[#002244]"
                          }`}
                        >
                          {faq.question}
                        </h3>
                      </div>
                      <div
                        className={`p-1.5 rounded-full transition-transform duration-200 shrink-0 ${
                          isOpen
                            ? "bg-blue-50 text-[#005AA9] rotate-180"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </button>

                    {/* Accordion Answer Body */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="px-5 md:px-6 pb-5 md:pb-6 pt-1 text-sm md:text-base text-slate-600 font-normal leading-relaxed border-t border-slate-100/80">
                            <p>{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ─── QUICK HELP CONTACT CARDS ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {/* Card 1: Visit Store */}
            <div className="group relative bg-gradient-to-br from-[#004b8d] via-[#005AA9] to-[#0066b8] text-white p-5 rounded-2xl border border-white/15 shadow-md shadow-blue-900/10 hover:shadow-xl hover:shadow-blue-500/25 hover:border-cyan-300/40 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-white/15 to-transparent rounded-bl-full pointer-events-none -z-0 opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 text-cyan-300 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:bg-white/25 transition-transform duration-200">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/15 text-cyan-200 border border-white/20">
                    Renton, WA
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-base text-white group-hover:text-cyan-200 transition-colors">
                    Visit Our Store
                  </h4>
                  <p className="text-xs text-blue-100/90 mt-1 leading-relaxed font-normal">
                    601 S 3rd St, Renton, WA 98057<br />
                    <span className="text-cyan-200/80 font-medium">Mon–Sat 10–7 · Sun 11–6</span>
                  </p>
                </div>
              </div>
              <div className="relative z-10 pt-3 mt-3 border-t border-white/15">
                <Link
                  href="/contact-us"
                  className="text-xs font-bold text-cyan-300 group-hover:text-white inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Directions &amp; Map</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>

            {/* Card 2: Call Us */}
            <div className="group relative bg-gradient-to-br from-[#004b8d] via-[#005AA9] to-[#0066b8] text-white p-5 rounded-2xl border border-white/15 shadow-md shadow-blue-900/10 hover:shadow-xl hover:shadow-blue-500/25 hover:border-cyan-300/40 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-white/15 to-transparent rounded-bl-full pointer-events-none -z-0 opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 text-cyan-300 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:bg-white/25 transition-transform duration-200">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/15 text-cyan-200 border border-white/20">
                    Live Support
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-base text-white group-hover:text-cyan-200 transition-colors">
                    Call Our Specialists
                  </h4>
                  <p className="text-xs text-blue-100/90 mt-1 leading-relaxed font-normal">
                    Direct guidance from experienced pet &amp; aquatic care specialists.
                  </p>
                </div>
              </div>
              <div className="relative z-10 pt-3 mt-3 border-t border-white/15">
                <a
                  href="tel:4252263215"
                  className="text-xs font-bold text-cyan-300 group-hover:text-white inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>(425) 226-3215</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            </div>

            {/* Card 3: Free Water Test */}
            <div className="group relative bg-gradient-to-br from-[#004b8d] via-[#005AA9] to-[#0066b8] text-white p-5 rounded-2xl border border-white/15 shadow-md shadow-blue-900/10 hover:shadow-xl hover:shadow-blue-500/25 hover:border-cyan-300/40 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-white/15 to-transparent rounded-bl-full pointer-events-none -z-0 opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 text-cyan-300 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:bg-white/25 transition-transform duration-200">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/15 text-cyan-200 border border-white/20">
                    100% Free
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-base text-white group-hover:text-cyan-200 transition-colors">
                    Free Water Testing
                  </h4>
                  <p className="text-xs text-blue-100/90 mt-1 leading-relaxed font-normal">
                    Bring 1 cup of aquarium water anytime for instant multi-parameter health check.
                  </p>
                </div>
              </div>
              <div className="relative z-10 pt-3 mt-3 border-t border-white/15">
                <Link
                  href="/services/in-store/aquarium-water-testing"
                  className="text-xs font-bold text-cyan-300 group-hover:text-white inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Testing Details</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          </div>

          
        </div>
      </section>
    </main>
  );
}
