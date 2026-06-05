import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function AmazonCTA() {
  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row" style={{ minHeight: "480px" }}>
        {/* ── LEFT: Content panel ── */}
        <div className="flex flex-col justify-center px-12 py-12 md:px-20 md:w-1/2 bg-[#005AA9]">
          {/* Logo – rendered white via CSS filter on blue bg */}
          <div className="relative w-[200px] h-[68px] mb-8">
            <Image
              src="/images/logo/logo.png"
              alt="Sierra Fish & Pets"
              fill
              className="object-contain object-left"
              
            />
          </div>

          {/* Thin divider */}
          <div className="w-12 h-[3px] rounded-full bg-white/40 mb-6" />

          {/* Page title */}
          <h2 className="text-white text-2xl md:text-[28px] font-bold leading-tight mb-5">
            Amazon Affiliate Page
          </h2>

          {/* Description */}
          <p className="text-white/80 text-[14px] leading-[1.85] max-w-[400px] mb-9">
            We LOVE Our Pets. At Sierra Fish &amp; Pets we stock some of the
            latest greatest supplies for all your pets — however we can&apos;t
            stock EVERYTHING we LOVE. Here are some products we have purchased
            or used off <span className="text-white font-semibold">AMAZON</span>{" "}
            that we suggest for you and your pets.
          </p>

          {/* CTA Button */}
          <Link
            href="https://www.amazon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start inline-flex items-center gap-2 rounded-full bg-gray-900 px-7 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-gray-900 transition-all duration-200 active:scale-95"
          >
            Shop on Amazon
            <ExternalLink className="h-3.5 w-3.5 opacity-60" />
          </Link>
        </div>

        {/* ── RIGHT: Full image, no cropping ── */}
        <div
          className="relative min-h-[320px] md:min-h-0 md:w-1/2 bg-[#cfecf4]"
        >
          <Image
            src="/images/cta.png"
            alt="Sierra Fish & Pets – Amazon Pet Products"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
