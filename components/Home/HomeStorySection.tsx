"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Fish,
  Sparkles,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Package,
} from "lucide-react";
import SemanticAccordion, {
  SemanticKeynoteItem,
  NerTagsData,
} from "@/components/about/SemanticAccordion";

const homeSemanticKeynotes: SemanticKeynoteItem[] = [
  {
    title: "Deep Heritage and Family-Owned Legacy",
    description:
      "Chronicles Sierra Fish & Pets' evolution from a 1960s family aquarium hobby into a 7,200-square-foot flagship retail store in Renton, emphasizing decades of specialized experience and personalized customer relationships.",
  },
  {
    title: "Specialized Freshwater & Saltwater Aquarium Expertise",
    description:
      "Details extensive aquatic inventory, featuring rare and exotic freshwater species (gobies, knifefish, bichirs, African cichlids) alongside premium saltwater livestock and trusted reef-keeping equipment brands.",
  },
  {
    title: "Turnkey Custom Aquarium Design & Services",
    description:
      "Outlines professional aquatic maintenance offerings, including custom tank design, home/office installations, step-by-step guidance for beginner aquarists, and complex tank relocations.",
  },
  {
    title: "Comprehensive Full-Line Pet Supply Selection",
    description:
      "Positions the store as a complete resource for dogs, cats, birds, reptiles, and small animals, stocking premium foods, habitat setups, live feeder insects, and species-specific gear.",
  },
  {
    title: "Staff Expertise Over Generic Retail Sales",
    description:
      "Highlights a knowledgeable, hands-on staff composed of actual pet keepers who provide tailored care advice rather than simply directing customers to product shelves.",
  },
  {
    title: "Convenient Local Renton Destination",
    description:
      "Establishes the shop as a go-to local pet store located at 601 S Grady Way (in the Uwajimaya parking lot), offering one-stop shopping for pet owners throughout Renton and the surrounding areas.",
  },
];

const homeNerTags: NerTagsData = {
  organization: ["Sierra Fish & Pets", "Uwajimaya"],
  person: ["Mr. JONAS STERNBERG"],
  location: [
    "Renton (Renton, WA)",
    "601 S Grady Way",
    "Uwajimaya parking lot",
  ],
  productOrService: [
    "Custom aquarium design",
    "Aquarium installation",
    "Aquarium maintenance",
    "Tank relocation services",
    "Freshwater fish",
    "Saltwater fish",
    "African cichlids",
    "Livebearers",
    "Gobies",
    "Knifefish",
    "Bichirs",
    "Live aquarium plants",
    "Reef equipment",
    "Dog food",
    "Dog harnesses",
    "Cat litter",
    "Scratching posts",
    "Bird cages",
    "Species-specific seed mixes",
    "Terrarium setups",
    "Heat lamps",
    "Live feeder insects",
  ],
  conceptOrTheme: [
    "Family-owned pet store",
    "Local aquarium specialists",
    "Full-line pet supply retail",
    "Exotic fish stocking",
    "Specialized reptile care",
    "Hands-on expert customer advice",
  ],
};

const homeSeoKeywords: string[] = [
  "sierra fish and pets renton wa",
  "custom aquarium installation and maintenance renton",
  "local pet store near uwajimaya renton",
  "exotic freshwater and saltwater fish shop renton wa",
  "cichlids and rare fish store northern wa",
  "full line dog cat reptile supplies renton",
  "aquarium relocation and tank design services renton",
];

export default function HomeStorySection() {
  return (
    <section className="relative bg-gradient-to-b from-white via-[#f8fbff] to-white py-12 sm:py-16 border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Editorial Story Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 lg:p-6 shadow-sm space-y-4">
          {/* Header */}
          <div className="max-w-7xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EBF7FF] border border-blue-200/70 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#005AA9] shadow-xs mb-3">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Renton&apos;s Local Pet Institution</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[28px] font-black text-[#002244] tracking-tight leading-tight mb-2">
              Sierra Fish &amp; Pets: Renton&apos;s Premier Local Pet Store &amp; Custom Aquarium Specialists
            </h2>
            <p className="text-sm sm:text-base font-bold text-[#005AA9]">
              Aquariums Since the 1960s. A Store Since 1972.
            </p>
          </div>

          {/* 2-Column Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Story Column */}
            <div className="lg:col-span-7 space-y-4 text-slate-600  text-xs sm:text-sm text-justify">
              <p>
                Walk in, and the cichlid wall is the first thing you see – a whole run of them catching the light, with tanks of stranger fish just past it that most stores don&apos;t bother carrying at all. Sierra Fish &amp; Pets started with a family that kept aquariums as hobbyists through the 1960s, and by 1972 that hobby had grown into an actual storefront. What opened then as a single shop is now a 7,200-square-foot flagship tucked into the Uwajimaya parking lot in Renton, and it still runs the way a family business runs: people who know your fish&apos;s name before they know your last one.
              </p>

              <div className="pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-[#002244] mb-2 text-left">
                  A Full-Line Pet Store for Renton
                </h3>
                <p>
                  As a pet store in Renton, WA, we never limited ourselves to just aquariums, even though that&apos;s where the family&apos;s passion started. Dogs, cats, birds, reptiles, and small animals – all get the same attention here – real food, real supplies, and staff who&apos;ve actually kept the animals they&apos;re selling gear for. Type <Link href="/shop" className="text-[#005AA9] font-semibold hover:underline">pet store near me</Link> into your phone on a Saturday morning, and there&apos;s a fair chance you&apos;ll end up walking through our doors, past the cichlid wall, toward whatever section your particular animal calls home. The aquarium side of the business is still where we&apos;re most at home.
                </p>
              </div>

              <div className="pt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-[#002244] mb-2 text-left">
                  Our Aquarium Roots Run Deepest
                </h3>
                <p>
                  Aquariums are still where the business feels most like itself. Our wall of African cichlids and livebearers is the obvious draw for anyone after freshwater fish, but the real regulars come back for the fish most shops skip entirely – gobies, knifefish, bichirs, and the kind of stock that rewards a second look. Saltwater fish have their own growing corner of the store now, stocked with the equipment brands serious reef keepers already trust. Between the two, our shelves of aquarium supplies cover everything from live plants to dry goods, so a trip here rarely ends with a second stop somewhere else.
                </p>
                <p className="mt-3">
                  For anything bigger than a shelf can hold, our team handles design, installation, and maintenance on tanks built for homes and offices alike. We&apos;ve relocated tanks across town, rebuilt them piece by piece in a new room, and walked more than one nervous first-time owner through an <Link href="/services" className="text-[#005AA9] font-semibold hover:underline">aquarium installation</Link> without letting it turn into an expensive mistake. More than 50 years in, and we&apos;re still doing what the family started doing in someone&apos;s living room decades ago – just at a scale nobody back then would have believed.
                </p>
              </div>
            </div>

            {/* Right Interactive Highlights Column */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-[#f8fbff] border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
                <h3 className="text-base sm:text-[14px] font-black text-[#002244] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#005AA9]" />
                  What Pet Supplies Can You Find at Sierra Fish &amp; Pets?
                </h3>
                <p className="text-xs text-slate-500 italic">
                  Walk our aisles, and the range becomes obvious fast.
                </p>

                {/* Sub-item: Dog & Cat Supplies */}
                <div className="bg-white rounded-xl p-4 border border-slate-200/70 shadow-xs">
                  <h4 className="text-xs sm:text-sm font-bold text-[#002244] mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#005AA9]" />
                    Dog &amp; Cat Supplies
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Our pet supplies cover the essentials and the specifics – dog supplies from everyday kibble to harnesses and chew toys, and cat supplies spanning litter, scratching posts, and the toys that actually get used more than once instead of sitting untouched after the first week.
                  </p>
                </div>

                {/* Sub-item: Bird & Reptile Supplies */}
                <div className="bg-white rounded-xl p-4 border border-slate-200/70 shadow-xs">
                  <h4 className="text-xs sm:text-sm font-bold text-[#002244] mb-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#005AA9]" />
                    Bird &amp; Reptile Supplies
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    We&apos;ve focused on variety rather than volume, carrying bird supplies for everything from finches to larger companion birds, including cages, perches, and seed mixes suited to specific species rather than a single catch-all blend. Reptile supplies round out the lineup for terrarium setups, heat lamps, and live feeder insects for animals such as hedgehogs, geckos, and our staff can usually talk through what a given setup actually needs rather than just pointing at a shelf.
                  </p>
                </div>
              </div>

              {/* Store Location & Call CTA Box */}
              <div className="bg-gradient-to-br from-[#002244] to-[#005AA9] rounded-2xl p-6 text-white shadow-md space-y-4">
                <p className="text-xs sm:text-sm leading-relaxed text-blue-100">
                  Come see the cichlid wall for yourself, ask us anything about your own tank, or call <strong className="text-white">(425) 226-3215</strong> to check what&apos;s in stock before you drive over.
                </p>
                <div className="pt-2 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-300 shrink-0" />
                    <span>601 S Grady Way, Renton, WA</span>
                  </div>
                  <a
                    href="tel:4252263215"
                    className="inline-flex items-center gap-1.5 bg-white text-[#002244] hover:bg-blue-50 px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#005AA9]" />
                    <span>Call Store</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      
      </div>
    </section>
  );
}
