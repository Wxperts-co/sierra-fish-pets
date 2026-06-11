"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  Quote,
  Star,
  Shield,
  Heart,
  Truck,
  Sparkles,
  MapPin,
  Phone,
  Clock,
  Compass,
  ArrowRight,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import InstagramGallery from "@/components/Home/InstagramGallery";

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

const cardHoverVariants = {
  hover: {
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);
  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    [],
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative bg-slate-50 text-slate-800 overflow-x-hidden">
      <section className="relative h-[100vh] w-full flex items-center justify-center overflow-hidden">
        {/* Fixed Viewport Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/banner/about5.png"
            alt="Sierra Fish & Pets store interior background"
            fill
            className="object-cover filter brightness-[0.9]"
            priority
          />
          {/* <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/50" /> */}
        </div>

        {/* Centered Glassmorphic Text Card */}
        {/* <div className="container relative z-10 mx-auto px-6 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl text-center backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 md:p-12"
          >
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#00aaff] mb-3 block">
              Established & Trusted
            </span>
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              SIERRA FISH & PETS
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
              Family-owned and delivering expert, pet-first care solutions in
              the Renton community for generations.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#005AA9] hover:bg-[#004b8d] text-white px-8 py-3.5 rounded-full font-bold transition-all duration-300 shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 text-sm uppercase tracking-wider"
              >
                Explore Shop
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#our-story"
                className="inline-flex items-center gap-2 border border-white/40 hover:border-white bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 rounded-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 text-sm uppercase tracking-wider"
              >
                Our Story
              </a>
            </div>
          </motion.div>
        </div> */}
      </section>

      {/* ─── OUR STORY / WELCOME SECTION ─── */}
      <section
        id="our-story"
        className="relative bg-white py-16 z-10 border-t border-slate-100"
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
              <span className="text-xs font-bold uppercase tracking-widest text-[#005AA9] mb-3 block">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#002244] leading-tight mb-8">
                A Legacy of Pet-First Care & Family Ownership
              </h2>
              <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                <p>
                  At Sierra Fish & Pets, we believe that pets are core members
                  of the family. Since our founding, we have committed ourselves
                  to raising the standard of local pet retail by prioritizing
                  health, high-quality nutrition, and professional expertise.
                </p>
                <p>
                  Located in the heart of Renton, Washington, our store is more
                  than just a retail shop—it is a community hub for pet lovers.
                  Whether you are setting up your very first coral reef
                  aquarium, transitioning your puppy to a premium diet, or
                  seeking specialized toys for your bird, our dedicated staff is
                  here to help you guide them to a happier life.
                </p>
                <p className="font-semibold text-[#005AA9]">
                  We stand by the philosophy that a healthy pet leads to a happy
                  home. We invite you to experience the difference that expert,
                  localized care makes.
                </p>
              </div>
            </motion.div>

            
          </div>
        </div>
      </section>

      {/* ─── CORE VALUES SECTION ─── */}
      <section className="relative bg-slate-50 py-16 z-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#005AA9] mb-3 block">
              Our Values
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#002244]">
              What Guides Our Service
            </h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-lg">
              We operate under core principles to ensure you and your pet
              receive the safest, most reliable care solutions.
            </p>
          </div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {/* Value Card 1 */}
            <motion.div
              variants={fadeInUpVariants}
              whileHover="hover"
              custom={0}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col items-start"
            >
              <div className="p-4 bg-[#EBF7FF] rounded-2xl mb-6 text-[#005AA9]">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Pet-First Philosophy
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Every single brand, ingredient, and toy is heavily screened. We
                never sell items we wouldn't trust for our own animals.
              </p>
            </motion.div>

            {/* Value Card 2 */}
            <motion.div
              variants={fadeInUpVariants}
              whileHover="hover"
              custom={1}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col items-start"
            >
              <div className="p-4 bg-orange-50 rounded-2xl mb-6 text-[#FF6B35]">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Premium Quality
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                We supply highly-rated diets, raw foods, durable accessories,
                and medical-grade care kits suited to your pet's needs.
              </p>
            </motion.div>

            {/* Value Card 3 */}
            <motion.div
              variants={fadeInUpVariants}
              whileHover="hover"
              custom={2}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col items-start"
            >
              <div className="p-4 bg-purple-50 rounded-2xl mb-6 text-purple-600">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Expert Care Team
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Our team undergoes continuous animal husbandry training to
                answer your questions on dietary needs, habitats, and behavior.
              </p>
            </motion.div>

            {/* Value Card 4 */}
            <motion.div
              variants={fadeInUpVariants}
              whileHover="hover"
              custom={3}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col items-start"
            >
              <div className="p-4 bg-emerald-50 rounded-2xl mb-6 text-emerald-600">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Community Hub
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                We collaborate with shelters for regular adoption weekends and
                design custom commercial or home aquarium setups locally.
              </p>
            </motion.div>
          </motion.div>
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
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight">
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
      <section className="relative bg-white py-16 z-10 border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#005AA9] mb-3 block">
            Client Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#002244] mb-4">
            What Pet Parents Say
          </h2>

          <div className="relative px-8 md:px-16">
            <Carousel
              plugins={[autoplayPlugin]}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((item) => (
                  <CarouselItem key={item.id} className="basis-full">
                    <div className="flex flex-col items-center">
                      {/* Quote Icon */}
                      <Quote className="text-slate-200 w-16 h-16 mb-6 transform rotate-180" />

                      {/* Stars Rating */}
                      <div className="flex justify-center gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < item.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Review Paragraph */}
                      <p className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed italic max-w-2xl mx-auto mb-4 font-nunito">
                        "{item.review}"
                      </p>

                      <div className="w-10 h-[2px] bg-slate-200 mb-8" />

                      {/* Reviewer Bio */}
                      <div className="flex items-center gap-4">
                        {/* Initials Avatar */}
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 shadow-md">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="text-left">
                          <h4 className="text-lg font-bold text-slate-900 leading-none mb-1">
                            {item.name}
                          </h4>

                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Next/Prev Navigation Buttons */}
              <CarouselPrevious className="hidden md:flex -left-6 bg-slate-50 hover:bg-slate-100 hover:text-[#005AA9] border-slate-200" />
              <CarouselNext className="hidden md:flex -right-6 bg-slate-50 hover:bg-slate-100 hover:text-[#005AA9] border-slate-200" />
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
