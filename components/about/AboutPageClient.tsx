"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  Quote,
  Star,
  Shield,
  Heart,
  Sparkles,
  MapPin,
  Phone,
  Clock,
  Compass,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import InstagramGallery from "@/components/Home/InstagramGallery";
import SemanticAccordion, {
  SemanticKeynoteItem,
  NerTagsData,
} from "@/components/about/SemanticAccordion";

const semanticKeynotesData: SemanticKeynoteItem[] = [
  {
    title: "Decades-Long Family Heritage & Community Trust",
    description:
      "Highlights Sierra Fish & Pets' 50+ year legacy as a family-owned Renton institution since 1972, emphasizing deep local roots and generational relationships built across multi-generational families.",
  },
  {
    title: "Authentic Passion over Sales Tactics",
    description:
      "Focuses on the core business philosophy of prioritizing animal welfare, deep water chemistry expertise, and honest care advice over quick sales or franchise-style scripts.",
  },
  {
    title: "Expert Staff with Practical Animal Experience",
    description:
      "Outlines the qualification of the staff—seasoned aquarists, knowledgeable dog owners, and experienced pet keepers—who provide practical, real-world guidance tailored to individual pet needs.",
  },
  {
    title: "Responsible Pet Ownership & Animal Welfare",
    description:
      "Emphasizes ethical retail practices, such as quarantining livestock, educating first-time pet owners on proper habitat sizes, and steering customers away from unsuitable pets.",
  },
  {
    title: "Proven Longevity Built on Core Fundamentals",
    description:
      "Contrasts short-lived pet industry trends with over half a century of consistent, evidence-based care standards, healthy aquatic systems, and reliable product recommendations.",
  },
  {
    title: "Hyper-Local Renton Community Presence",
    description:
      "Establishes the store's deep connection to Renton, WA, positioning the business as a neighborhood anchor actively connected to local pet owners and community life.",
  },
];

const nerTagsData: NerTagsData = {
  organization: ["Sierra Fish & Pets"],
  person: ["Mr. JONAS STERNBERG"],
  location: [
    "Renton (Renton, WA)",
    "Renton pet store",
    "Cedar River Trail",
    "Washington",
  ],
  productOrService: [
    "Local pet care services",
    "Pet consultation",
    "Aquarium supplies",
    "Saltwater reef tank gear",
    "Freshwater fish",
    "Betta fish",
    "Goldfish habitats",
    "Dog food",
    "Bird care supplies",
  ],
  conceptOrTheme: [
    "Family-owned business",
    "Ethical pet retail",
    "Water chemistry expertise",
    "Multi-generational local business",
    "Animal welfare education",
    "Responsible pet ownership",
  ],
};

const seoKeywordsData: string[] = [
  "sierra fish and pets renton wa",
  "family owned pet store renton",
  "local aquarium and pet care experts renton",
  "trusted pet store since 1972 renton wa",
  "honest pet supply store near cedar river trail",
  "ethical fish and pet supply shop renton",
  "local dog and aquatic specialists renton wa",
];

const testimonials = [
  {
    id: "test-1",
    name: "Everest C",
    designation: "Aquarium Hobbyist",
    review:
      "I picked up a hillstream sucker, and the employee who helped us was so wonderful! There was one in particular with a small white spot on him that I adored and was super lively. The man spent, I kid you not, like 5-10 minutes getting this fish for us. Excellent customer service, and the lady who runs the front desk is wonderful help. She helped me before with getting a heater. I wish I lived closer so I could come more often.",
    rating: 5,
    image: "/images/testimonial/EverestC.png",
  },
  {
    id: "test-2",
    name: "Schuyler Summers",
    designation: "Bird Parent",
    review:
      "The staff in aquatics are super helpful and friendly. They have mainly fresh water fish with a small selection of corals and occasionally macroalgae too.",
    rating: 5,
    image: "/images/testimonial/SchuylerSummers.png",
  },
  {
    id: "test-3",
    name: "Michael Savage",
    designation: "Cat Dad",
    review:
      "I found this by accident and feel like I been really missing out they have a huge selection of fish, altho most are guppies and Molly's and that sort of thing. They do have one wall of cichlids but I feel like the selection wasn't that great on the cichlid front mostly African, not to much south American. Still a really cool store tho, ghost shirmos for only 75 events a piece! I will definitely be back.",
    rating: 5,
    image: "/images/testimonial/MichaelSavage.png",
  },
  {
    id: "test-4",
    name: "Nathan Drysdale",
    designation: "Puppy Trainer",
    review:
      "This had been the best store for finding everything that I have been wanting to set up my tank. They also had a great selection for taking care of your birds and small mammals. One of the things that I appreciated the most about this store was that it was kept very clean and organized.",
    rating: 5,
    image: "/images/testimonial/NathanDrysdale.png",
  },
  {
    id: "test-5",
    name: "Gabriel Davis",
    designation: "Puppy Trainer",
    review:
      "I can’t say enough good things about this store! When I first started looking into aquariums and fishkeeping, I had no idea what I was doing. The staff here were patient, knowledgeable, and genuinely excited to help me learn. They walked me through everything from tank setup and water care to choosing the right fish for my situation.",
    rating: 5,
    image: "/images/testimonial/GabrielDavis.png",
  },
  {
    id: "test-6",
    name: "Chris Swanson",
    designation: "Puppy Trainer",
    review:
      "Great local pet and fish store. Family owned , Great selection of everything from toys for dogs and cats. Great selection of fish tanks. And Great selection of a lot of different kinds of fish, birds and reptiles.This is where I got my first snake from. She is doing great, have had her for about a year now.It is the only pet shop I will go too.",
    rating: 5,
    image: "/images/testimonial/ChrisSwanson.png",
  },
];

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function AboutPageClient() {
  const [scrolled, setScrolled] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const autoplay = useRef(
    Autoplay({
      delay: 3500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const scrollPrev = useCallback(() => {
    if (carouselApi) {
      carouselApi.scrollPrev();
      autoplay.current.reset();
    }
  }, [carouselApi]);

  const scrollNext = useCallback(() => {
    if (carouselApi) {
      carouselApi.scrollNext();
      autoplay.current.reset();
    }
  }, [carouselApi]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative bg-slate-50 text-slate-800 overflow-x-hidden">
      <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
        {/* Image — clipped to banner bounds */}
        <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
          {/* Mobile image */}
          <Image
            src="/images/banner/shophero5.png"
            alt="About us banner"
            fill
            priority
            className="object-cover object-[center_60%] block md:hidden"
            sizes="100vw"
          />
          {/* Desktop image */}
          <Image
            src="/images/banner/shophero3.png"
            alt="About us banner"
            fill
            priority
            className="object-cover object-[center_40%] hidden md:block"
            sizes="100vw"
          />
        </div>

        {/* Mobile overlay — darkens image so text is readable */}
        <div className="absolute inset-0 z-[2] block md:hidden bg-[linear-gradient(to_bottom,rgba(0,30,70,0.62)_0%,rgba(0,30,70,0.35)_60%,rgba(0,30,70,0.10)_100%)]" />

        {/* Centered text block */}
        <div className="absolute inset-x-0 top-0 z-[3] flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="mb-4 text-[clamp(2rem,4.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em] text-white drop-shadow-md md:bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] md:bg-clip-text md:text-transparent md:drop-shadow-none">
              About Us
            </h1>

            {/* Breadcrumb */}
            <nav
              aria-label="breadcrumb"
              className="flex flex-wrap items-center justify-center gap-0.5 text-sm font-medium text-white drop-shadow-md md:text-slate-500 md:drop-shadow-none"
            >
              <span className="flex items-center gap-0.5">
                <Link
                  href="/"
                  className="text-white md:text-slate-500 transition-colors duration-150 hover:text-teal-600 hover:underline"
                >
                  Home
                </Link>
                <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
              </span>
              <span className="flex items-center gap-0.5">
                <span className="font-bold text-[#0d1b2a] md:text-[#0d1b2a] text-white">About Us</span>
              </span>
            </nav>
          </motion.div>
        </div>
      </section>

      {/* ─── OUR STORY / WELCOME SECTION ─── */}
      <section
        id="our-story"
        className="relative bg-white md:py-16 py-4 z-10 border-t border-slate-100"
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Story Image (Right) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5"
            >
              <div className="relative h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 group">
                <Image
                  src="/images/banner/about2.png"
                  alt="Sierra Fish & Pets community banner image"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002244]/40 via-transparent to-transparent" />
              </div>
            </motion.div>
            {/* Story Text (Left) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUpVariants}
              className="lg:col-span-7"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-[#005AA9] mb-2 block">
                Who We Are
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-[#002244] leading-tight mb-5">
                About Sierra Fish &amp; Pets | Renton&apos;s Trusted Family-Owned Pet Store Since 1972
              </h2>
              <div className="space-y-2 text-justify text-slate-600 leading-relaxed md:text-[15px] text-xs">
                <p>
                  Every pet store can tell you what&apos;s in stock – but not every pet store can tell you what happened here in 1972, when a single storefront in Renton, Washington, opened its doors with a few <Link href="/shop" className="text-[#005AA9] font-semibold hover:underline">aquariums</Link>, a lot of nerve, and no real idea it would still be standing more than fifty years later. But it is. And it&apos;s still family-owned, still local, and still run by people who&apos;d rather talk your ear off about water chemistry than rush you to the register. Sierra Fish &amp; Pets started small – the way most things worth keeping do. A handful of tanks, a shelf of dog food, and a founder who believed Renton deserved a pet store that actually knew its animals, not merely sold them. And that belief turned out to be the whole business plan.
                </p>
                <p>
                  Word got around. Neighbors became regulars, and regulars became friends. Somewhere along the way, &ldquo;the fish store on the corner&rdquo; became a Renton institution – the place three generations of local families have brought their kids to press their noses against the glass and pick out their first betta. We&apos;ve watched Renton grow up around us. New neighborhoods, new faces, a whole new generation of pet owners – and through all of it, we&apos;ve stayed exactly what we started out as: a family business that treats your pets like they matter, because to us, they really do.
                </p>
                <p>
                  That&apos;s not a slogan we flaunt. It&apos;s just how we were built. The people behind our counter aren&apos;t seasonal hires reading off a script. They&apos;re aquarists who&apos;ve kept saltwater reef tanks alive for decades. They&apos;re dog people who&apos;ve raised their own dogs on the food they recommend. They&apos;re the ones who&apos;ll crouch down and talk to your kid about why goldfish need bigger tanks than the bowl on TV, because someone did the same for them once. Fifty-plus years in one place teaches you things a franchise never learns – which fish actually get along, which food stops the itching, which bird species will genuinely bond with a first-time owner. 
                </p>
                <p>
                  <span className="font-semibold text-[#005AA9]">We&apos;ve made the mistakes, asked the hard questions, and stuck around long enough to get it right. That&apos;s what you&apos;re walking into when you come to Sierra Fish &amp; Pets. We&apos;re not the newest name in Renton <Link href="/services" className="text-[#005AA9] font-semibold hover:underline">pet care</Link>. We&apos;re just the one that never left.</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CORE VALUES SECTION ─── */}
      <section className="relative bg-slate-50 md:py-16 py-8 z-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#005AA9] mb-3 block">
              Our Values
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#002244]">
              What Guides Our Service
            </h2>
            <p className="mt-4 text-slate-500 max-w-5xl mx-auto text-lg">
              We operate under core principles to ensure you and your pet
              receive the safest, most reliable care solutions.
            </p>
          </div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {/* Value Card 1 */}
            <motion.div
              variants={fadeInUpVariants}
              className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-[#005AA9]/10 hover:border-[#005AA9]/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-start cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-[#EBF7FF] text-[#005AA9] flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#005AA9] group-hover:text-white group-hover:scale-110 shadow-xs">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-[#005AA9] transition-colors mb-2">
                Pet-First Philosophy
              </h3>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-[13px]">
                Every single brand, ingredient, and toy is heavily screened. We
                never sell items we wouldn&apos;t trust for our own animals.
              </p>
            </motion.div>

            {/* Value Card 2 */}
            <motion.div
              variants={fadeInUpVariants}
              className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-start cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF6B35] flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#FF6B35] group-hover:text-white group-hover:scale-110 shadow-xs">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-[#FF6B35] transition-colors mb-2">
                Premium Quality
              </h3>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-[13px]">
                We supply highly-rated diets, raw foods, durable accessories,
                and medical-grade care kits suited to your pet&apos;s needs.
              </p>
            </motion.div>

            {/* Value Card 3 */}
            <motion.div
              variants={fadeInUpVariants}
              className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-start cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white group-hover:scale-110 shadow-xs">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors mb-2">
                Expert Care Team
              </h3>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-[13px]">
                Our team undergoes continuous animal husbandry training to
                answer your questions on dietary needs, habitats, and behavior.
              </p>
            </motion.div>

            {/* Value Card 4 */}
            <motion.div
              variants={fadeInUpVariants}
              className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-start cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-2">
                Community Hub
              </h3>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-[13px]">
                We collaborate with shelters for regular adoption weekends and
                design custom commercial or home aquarium setups locally.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── 50+ YEARS PASSION & EXPERTISE SECTION ─── */}
      <section className="relative bg-white md:py-16 py-8 z-10 border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-5xl text-left">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#005AA9] mb-3 block">
              Half a Century in Renton
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#002244] leading-tight">
              Over 50+ Years of Passion, Expertise &amp; Local Pet Care in Renton, WA
            </h2>
          </div>

          <div className="space-y-5 text-slate-600 leading-relaxed md:text-base text-xs bg-slate-50/80 p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
            <p className="font-semibold text-slate-800 text-sm md:text-lg">
              Pet stores open every year. Few make it past five.
            </p>
            <p>
              We&apos;ve made it past fifty – not by chasing trends, but by getting the fundamentals right, over and over, for half a century.
            </p>
            <p>
              That kind of longevity isn&apos;t luck. It&apos;s built through honest recommendations, healthy tanks, and Renton families who keep coming back because the advice we gave them actually worked. We&apos;ve quarantined sick fish before it was standard practice. We&apos;ve turned people away from animals that weren&apos;t right for their home, even when the sale would&apos;ve been easy.
            </p>
            <p>
              Local pet care isn&apos;t a category to us – it&apos;s the whole point. We live here, and our kids went to school here. The dogs we&apos;ve helped raise are the same dogs we see at the Cedar River Trail on weekends.
            </p>
            <p>
              Fifty years in, Sierra Fish &amp; Pets is still Renton&apos;s, through and through – and we intend to keep it that way for fifty more.
            </p>
            <div className="pt-4 border-t border-slate-200 space-y-1">
              <p className="font-semibold text-slate-800">
                Come see what five decades of doing it right looks like.
              </p>
              <p className="font-bold text-[#005AA9] text-sm md:text-lg">
                Visit Sierra Fish &amp; Pets in Renton, WA today – your pets (and your questions) are always welcome.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MIDDLE CALL TO ACTION (PARALLAX BANNER) ─── */}
      <section className="relative h-[550px] flex items-center z-10 overflow-hidden">
        {/* Parallax Image Background */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/banner/about4.png"
            alt="Sierra Fish & Pets customer service"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="container relative z-10 mx-auto px-6 max-w-6xl flex justify-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full lg:max-w-[50%] bg-black/45 backdrop-blur-md border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl text-white text-left"
          >
            <h2 className="text-2xl md:text-4xl font-extrabold mb-6 tracking-tight">
              We're Always Here for Our Customers
            </h2>

            {/* Contact Pills Stack */}
            <div className="space-y-4 mb-8 text-left max-w-md">
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                <MapPin className="text-[#00aaff] w-6.5 h-6.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Visit Us
                  </h4>
                  <p className="text-sm font-semibold">
                    601 S Grady Way, Renton, WA
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                <Phone className="text-[#00aaff] w-6.5 h-6.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Call Us
                  </h4>
                  <p className="text-sm font-semibold">425-226-3215</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                <Clock className="text-[#00aaff] w-6.5 h-6.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Hours Today
                  </h4>
                  <p className="text-sm font-semibold">Mon–Sat: 11AM–7PM</p>
                </div>
              </div>
            </div>

            <a
              href="https://maps.app.goo.gl/48Q7dQBbespuFhX27"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#002244] hover:bg-[#EBF7FF] hover:text-[#005AA9] px-8 py-3.5 rounded-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/20"
            >
              Get Directions
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIALS (EMBLA-BASED CAROUSEL) ─── */}
      <section className="relative bg-[#f8fbff]/60 py-8 md:py-12 z-10 border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#005AA9] mb-1.5 block">
            Client Testimonials
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#002244] mb-1.5 tracking-tight">
            What Pet Parents Say
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto mb-6">
            Real feedback from local pet owners and aquarium hobbyists in Renton.
          </p>

          <div className="relative max-w-6xl mx-auto px-2 sm:px-8">
            <Carousel
              setApi={setCarouselApi}
              plugins={[autoplay.current]}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-3">
                {testimonials.map((item, idx) => (
                  <CarouselItem key={`${item.id}-${idx}`} className="pl-3 basis-full md:basis-1/2">
                    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#005AA9]/30 transition-all duration-300 flex flex-col justify-between h-full text-left">
                      <div>
                        {/* Top: Avatar, Name, Rating */}
                        <div className="flex items-center justify-between gap-3 mb-3.5 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#EBF7FF] shadow-xs shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={44}
                                height={44}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                {item.name}
                              </h4>
                              <span className="text-[11px] font-semibold text-[#005AA9]">
                                {item.designation}
                              </span>
                            </div>
                          </div>

                          {/* Stars */}
                          <div className="flex items-center gap-0.5 shrink-0">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < item.rating
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Review text */}
                        <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed italic line-clamp-4">
                          &ldquo;{item.review}&rdquo;
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Next/Prev Navigation Buttons */}
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Previous testimonial"
                className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white border border-slate-200 shadow-md text-slate-700 hover:bg-[#005AA9] hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={scrollNext}
                aria-label="Next testimonial"
                className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-20 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white border border-slate-200 shadow-md text-slate-700 hover:bg-[#005AA9] hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </Carousel>
          </div>
        </div>
      </section>

  

      {/* ─── INSTAGRAM GALLERY ─── */}
      <div className="relative z-10">
        <InstagramGallery />
      </div>
    </main>
  );
}
