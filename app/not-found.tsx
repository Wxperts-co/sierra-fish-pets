import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-6">
      <div className="text-center max-w-2xl">
        {/* 404 */}
        <h1
          className="text-[180px] md:text-[220px] font-black leading-none text-black"
          style={{
            fontFamily: "Impact, Haettenschweiler, Arial Narrow Bold, sans-serif",
            transform: "skew(-8deg)",
          }}
        >
          404
        </h1>

        {/* Title */}
        <h2
          className="text-4xl md:text-5xl font-black uppercase text-black"
          style={{
            fontFamily: "Impact, Haettenschweiler, Arial Narrow Bold, sans-serif",
            transform: "skew(-6deg)",
          }}
        >
          Oops! That Page Can't Be Found.
        </h2>

        {/* Divider */}
        <div className="w-36 h-px bg-gray-300 mx-auto my-8" />

        {/* Description */}
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          We're really sorry but we can't seem to find the page
          you were looking for.
        </p>

        {/* Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-10 px-8 py-4 rounded-full bg-black text-white font-semibold transition hover:scale-105"
        >
          Back To Homepage
          <ArrowRight size={18} />
        </Link>
      </div>
    </main>
  );
}