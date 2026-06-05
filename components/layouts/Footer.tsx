import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import {
  FaXTwitter,
  FaInstagram,
  FaFacebook,
  FaLinkedinIn,
  FaPinterestP,
} from "react-icons/fa6";
import {
  SiVisa,
  SiMastercard,
  SiApplepay,
  SiPaypal,
  SiAmericanexpress,
} from "react-icons/si";

const CORPORATE = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
  { label: "Brands We Carry", href: "/brands" },
  { label: "Affiliate Program", href: "/affiliate" },
];

const CUSTOMER_SERVICE = [
  { label: "Track Order", href: "/account/orders" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Shipping Info", href: "/shipping" },
  { label: "FAQs", href: "/faqs" },
  { label: "Pet Store Locator", href: "/contact" },
  { label: "Contact Us", href: "/contact" },
];

const SERVICES = [
  { label: "Aquarium Setup", href: "/services" },
  { label: "Live Fish Consultation", href: "/services" },
  { label: "New Arrivals", href: "/arrivals" },
  { label: "Pet Adoption", href: "/services" },
  { label: "Learn Center", href: "/edu" },
  { label: "In-Store Events", href: "/events" },
];

const SOCIAL = [
  {
    icon: FaXTwitter,
    label: "X",
    href: "#",
    bg: "bg-black",
    ring: "ring-black/20",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "#",
    bg: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    ring: "ring-pink-400/30",
  },
  {
    icon: FaFacebook,
    label: "Facebook",
    href: "#",
    bg: "bg-[#1877F2]",
    ring: "ring-blue-500/20",
  },
  {
    icon: FaLinkedinIn,
    label: "LinkedIn",
    href: "#",
    bg: "bg-[#0A66C2]",
    ring: "ring-sky-500/20",
  },
  {
    icon: FaPinterestP,
    label: "Pinterest",
    href: "#",
    bg: "bg-[#E60023]",
    ring: "ring-red-500/20",
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-white border-t border-slate-100">

      {/* ── Newsletter strip ─────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#003d73] via-[#005AA9] to-[#0077cc]">
        {/* Decorative bubbles */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-52 w-52 rounded-full bg-cyan-400/10 blur-2xl" />
        <div className="pointer-events-none absolute left-1/3 top-0 h-24 w-24 rounded-full bg-white/5 blur-xl" />

        <div className="container relative mx-auto grid grid-cols-1 items-center gap-5 px-4 py-6 md:grid-cols-3">
          {/* Icon + headline */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <p className="font-bold leading-snug text-white">
              Join now &amp; get{" "}
              <span className="rounded bg-white/20 px-1.5 py-0.5 text-cyan-200">
                10% off
              </span>{" "}
              your first order!
            </p>
          </div>

          {/* Subtext */}
          <p className="text-center text-sm text-blue-100/80 md:text-left">
            Subscribe to the weekly newsletter for new arrivals &amp; exclusive deals.
          </p>

          {/* Form */}
          <form className="flex h-10 overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm focus-within:bg-white/20 transition-colors">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 bg-transparent px-3 text-sm text-white placeholder:text-blue-200/70 outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-white px-4 text-xs font-bold text-[#005AA9] transition-colors hover:bg-cyan-50 active:scale-95"
            >
              Subscribe <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* ── Main body ──────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-12">

          {/* Brand column */}
          <div className="col-span-2 lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-100 transition-opacity hover:opacity-80"
            >
              <Image
                src="/images/logo/logo.png"
                alt="Sierra Fish & Pets"
                width={150}
                height={48}
                className="h-auto w-auto max-h-10 object-contain"
              />
            </Link>

            <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
              Yuba City's premier destination for aquatic life &amp; pets.
              Family-owned, expert care since 2005.{" "}
              <a
                href="mailto:info@sierrafishandpets.com"
                className="font-medium text-[#005AA9] hover:underline"
              >
                info@sierrafishandpets.com
              </a>
            </p>

            {/* Contact pills */}
            <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600 transition-colors hover:border-[#005AA9] hover:text-[#005AA9]"
              >
                <MapPin className="h-3 w-3" /> Yuba City, CA 95991
              </a>
              <a
                href="tel:5306711147"
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600 transition-colors hover:border-[#005AA9] hover:text-[#005AA9]"
              >
                <Phone className="h-3 w-3" /> (530) 671-1147
              </a>
            </div>

            {/* Social icons */}
            <div className="mt-4 flex items-center gap-2">
              {SOCIAL.map(({ icon: Icon, label, href, bg, ring }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-white text-sm ring-2 ${bg} ${ring} transition-all duration-200 hover:scale-110 hover:shadow-lg`}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { title: "Corporate", links: CORPORATE },
            { title: "Customer Service", links: CUSTOMER_SERVICE },
            { title: "Services", links: SERVICES },
          ].map(({ title, links }) => (
            <div key={title} className="col-span-1 lg:col-span-2 xl:col-span-2">
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-800">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="group flex items-center gap-1.5 text-[13px] text-slate-500 transition-colors hover:text-[#005AA9]"
                    >
                      <span className="h-px w-0 bg-[#005AA9] transition-all duration-200 group-hover:w-3" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────────────────── */}
      <div className="bg-slate-900">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row">

          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} Sierra Fish &amp; Pets. All rights reserved. ·{" "}
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            {" · "}
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </p>

          {/* Payment badges */}
          <div className="flex items-center gap-1.5">

            {/* Mastercard */}
            <div title="Mastercard" className="flex h-8 w-12 items-center justify-center rounded-md bg-white px-1.5">
              <div className="relative flex items-center">
                <span className="block h-5 w-5 rounded-full bg-[#EB001B]" />
                <span className="block h-5 w-5 -ml-2.5 rounded-full bg-[#F79E1B] mix-blend-multiply opacity-95" />
              </div>
            </div>

            {/* Apple Pay */}
            <div title="Apple Pay" className="flex h-8 items-center gap-1 rounded-md bg-white px-2.5">
              <svg className="h-3.5 w-auto" viewBox="0 0 24 24" fill="black">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-[11px] font-semibold text-black">Pay</span>
            </div>

            {/* Visa */}
            <div title="Visa" className="flex h-8 w-12 items-center justify-center rounded-md bg-white px-2">
              <SiVisa className="h-4 w-auto text-[#1A1F71]" />
            </div>

            {/* Amex */}
            <div title="American Express" className="flex h-8 w-12 items-center justify-center rounded-md bg-[#016FD0] px-1.5">
              <SiAmericanexpress className="h-4 w-auto text-white" />
            </div>

            {/* PayPal */}
            <div title="PayPal" className="flex h-7 items-center rounded-md border border-slate-200 bg-white px-2">
              <span className="text-[11px] font-bold">
                <span className="text-[#003087]">Pay</span><span className="text-[#009CDE]">Pal</span>
              </span>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
}
