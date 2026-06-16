import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import {
  FaXTwitter,
  FaInstagram,
  FaFacebook,
  FaLinkedinIn,
  FaPinterestP,
  FaGoogle,
  FaYelp,
  FaYoutube,
} from "react-icons/fa6";

const CORPORATE = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Gallery", href: "/gallery" },
  { label: "Brands We Carry", href: "/brands" },
  { label: "Affiliate Program", href: "/affiliate" },
];

const CUSTOMER_SERVICE = [
  { label: "Track Order", href: "/account/orders" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Shipping Info", href: "/shipping" },
  { label: "FAQs", href: "/faqs" },
  { label: "Pet Store Locator", href: "/contact-us" },
  { label: "Contact Us", href: "/contact-us" },
];

const SERVICES = [
  { label: "Aquarium Setup", href: "/services" },
  { label: "Live Fish Consultation", href: "/services" },
  { label: "Pet Adoption", href: "/services" },
  { label: "In-Store Events", href: "/events" },
];

const SOCIAL = [
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/accounts/login/?next=%2Fsierraspetswa%2F&source=omni_redirect",
    bg: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    ring: "ring-pink-400/30",
  },
  {
    icon: FaFacebook,
    label: "Facebook",
    href: "https://www.facebook.com/SierraFishandPets/",
    bg: "bg-[#1877F2]",
    ring: "ring-blue-500/20",
  },
  {
    icon: FaYoutube,
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCniMRwcin9mKyM7AKFc8pwA",
    bg: "bg-[#FF0000]",
    ring: "ring-red-500/20",
  },
  {
    icon: FaGoogle,
    label: "Google",
    href: "https://maps.app.goo.gl/2FGdE7AMyrQmkdrN9",
    bg: "bg-[#4285F4]",
    ring: "ring-blue-400/20",
  },
  {
    icon: FaYelp,
    label: "Yelp",
    href: "https://www.yelp.com/biz/sierra-fish-and-pets-renton",
    bg: "bg-[#FF1A1A]",
    ring: "ring-red-400/20",
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-white border-t border-slate-100 relative z-20">
      {/* ── Newsletter strip ─────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#003d73] via-[#005AA9] to-[#0077cc]">
        {/* Decorative bubbles */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-52 w-52 rounded-full bg-cyan-400/10 blur-2xl" />
        <div className="pointer-events-none absolute left-1/3 top-0 h-24 w-24 rounded-full bg-white/5 blur-xl" />

        <div className="container relative mx-auto grid grid-cols-1 items-center gap-5 px-4 py-6 md:grid-cols-3">
          {/* Icon + headline */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <p className="text-sm font-semibold leading-none text-white md:text-base">
              STORE HOURS :
              <span className="ml-2 text-[13px]">
                Mon–Fri 11AM–7PM • Sat 11AM–7PM • Sun 11AM–5PM
              </span>
            </p>
          </div>

          {/* Payment Badges */}
          <div className="flex flex-wrap items-center gap-3 justify-center md:justify-end md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100/90 mr-1">
              We Accept:
            </span>

            {/* Visa */}
            <div
              title="Visa"
              className="flex h-8 w-14 items-center justify-center rounded-md bg-white p-1 shadow-sm transition-transform hover:scale-105"
            >
              <Image
                src="/images/logo/visa.png"
                alt="Visa"
                width={56}
                height={32}
                className="h-7 w-auto object-contain"
              />
            </div>

            {/* Mastercard */}
            <div
              title="Mastercard"
              className="flex h-8 w-14 items-center justify-center rounded-md bg-white p-1 shadow-sm transition-transform hover:scale-105"
            >
              <Image
                src="/images/logo/mastercard.png"
                alt="Mastercard"
                width={56}
                height={32}
                className="h-7 w-auto object-contain"
              />
            </div>

            {/* American Express */}
            <div
              title="American Express"
              className="flex h-8 w-14 items-center justify-center rounded-md bg-white p-1 shadow-sm transition-transform hover:scale-105"
            >
              <Image
                src="/images/logo/american-express.png"
                alt="American Express"
                width={56}
                height={32}
                className="h-7 w-auto object-contain"
              />
            </div>

            {/* Discover */}
            <div
              title="Discover"
              className="flex h-8 w-14 items-center justify-center rounded-md bg-white p-1 shadow-sm transition-transform hover:scale-105"
            >
              <Image
                src="/images/logo/discover.png"
                alt="Discover"
                width={56}
                height={32}
                className="h-7 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main body ──────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-12">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center  hover:opacity-90"
            >
              <Image
                src="/images/logo/logo3.png"
                alt="Sierra Fish & Pets"
                width={150}
                height={48}
                className="h-auto w-auto max-h-25 object-contain"
              />
            </Link>

            <p className=" text-[13px] leading-relaxed text-slate-500">
              Renton City's premier destination for aquatic life &amp; pets.
              Family-owned, expert care .{" "}
              <a
                href="mailto:info@sierrafishandpets.net"
                className="font-medium text-[#005AA9] hover:underline"
              >
                info@sierrafishandpets.com
              </a>
            </p>

            {/* Contact pills */}
            <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
              <a
                href="https://maps.app.goo.gl/48Q7dQBbespuFhX27"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600 transition-colors hover:border-[#005AA9] hover:text-[#005AA9]"
              >
                <MapPin className="h-3 w-3" /> 601 S Grady Way Suite M, Renton,
                WA 98057
              </a>
              <a
                href="tel:5306711147"
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600 transition-colors hover:border-[#005AA9] hover:text-[#005AA9]"
              >
                <Phone className="h-3 w-3" /> 425-226-3215
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
        <div className="container mx-auto flex flex-col items-center  justify-center gap-4 px-4 py-4 sm:flex-row">
          <p className="text-[13px] text-slate-400">
            © {new Date().getFullYear()} Sierra Fish &amp; Pets. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
