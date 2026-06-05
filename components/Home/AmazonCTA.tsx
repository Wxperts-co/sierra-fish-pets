import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function AmazonCTA() {
  return (
    <section className="w-full">
      <div className="flex flex-col md:flex-row" style={{ minHeight: "480px" }}>
        {/* ── LEFT: Content panel ── */}
        <div className="flex flex-col justify-center items-center px-12 py-12 md:px-20 md:w-1/2 bg-[#005AA9] text-center">
          {/* Logo – rendered white via CSS filter on blue bg */}
          <div className="relative mb-8">
            <Image
              src="/images/logo/white-logo.png"
              alt="Sierra Fish & Pets"
              width={400}
              height={100}
              className="object-contain object-left w-[300px]"

            />
          </div>


          {/* Page title */}
          <h2 className="text-white text-2xl md:text-4xl font-bold leading-tight mb-5">
            Save big annually with our veterinarian recommended wellness plan.
          </h2>


          <div className="flex justify-center">
            {/* CTA Button */}
            <Link
              href="https://www.amazon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="self-start inline-flex items-center gap-2 rounded-full bg-gray-900 px-7 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-gray-900 transition-all duration-200 active:scale-95 inlieblock"
            >
              Shop on Amazon
              <ExternalLink className="h-3.5 w-3.5 opacity-60" />
            </Link>
          </div>
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
