"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, User, Heart, ShoppingBag, X } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import MobileMenu from "@/components/layouts/MobileMenu";
import MegaMenu from "./MegaMenu";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "#" },
  { label: "Arrivals", href: "#" },
  { label: "Brands", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Gallery", href: "#" },
  { label: "Contact", href: "#" },
] as const;

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const cartCount = useAppSelector((state) => state.cart.items.length);
  const wishlistCount = useAppSelector(
    (state) => state.wishlist.productIds.length
  );

  const isHome = pathname === "/";

  // Check scroll position to handle floating-to-sticky transitions
  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    // Run once on mount to handle pre-scrolled page loads
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Determine if header should have a solid background or be transparent overlay
  const showSolidBackground = !isHome || scrolled || searchOpen;

  return (
    <>
      {/* ════════════════════════════════════════════════════
          MOBILE HEADER  (hidden on lg+)
          Layout: [hamburger] [centered logo] [cart]
      ════════════════════════════════════════════════════ */}
      <header
        className={cn(
          "z-50 flex items-center justify-between px-3 py-2.5 transition-all duration-300 lg:hidden font-lato",
          showSolidBackground
            ? "fixed top-0 inset-x-0 bg-[#005AA9] shadow-md border-b border-[#004b8d]"
            : "absolute top-0 inset-x-0 bg-transparent border-b border-transparent"
        )}
      >
        {/* Left — hamburger */}
        <MobileMenu />

        {/* Center — logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <Image
            src="/images/logo/logo.png"
            alt="Sierra Fish & Pets"
            width={120}
            height={40}
            priority
            className="h-auto w-auto max-h-9 object-contain px-2 py-1"
          />
        </Link>

        {/* Right — search + cart */}
        <div className="flex items-center gap-1">

          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15"
            aria-label="Search"
          >
            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>

          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-black text-[#005AA9]">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════
          DESKTOP HEADER  (hidden below lg)
          Layout: [logo] [nav links] [actions]
      ════════════════════════════════════════════════════ */}
      <header
        className={cn(
          "z-50 hidden transition-all duration-300 lg:block font-lato",
          showSolidBackground
            ? "fixed top-0 inset-x-0 bg-[#005AA9] shadow-md border-b border-[#004b8d]"
            : "absolute top-0 inset-x-0 bg-transparent border-b border-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-25 items-center justify-between gap-4">
            {/* Left — logo */}
            <Link href="/" className="flex h-16 shrink-0 items-center overflow-visible">
              <Image
                src={showSolidBackground ? "/images/logo/logo6.png" : "/images/logo/logo3.png"}
                alt="Sierra Fish & Pets"
                width={400}
                height={100}
                priority
                className={cn(
                  "block h-auto w-[300px] object-contain object-center px-3 transition-all duration-300",
                  showSolidBackground
                    ? "pt-3"
                    : "rounded-lg pt-3"
                )}
              />
            </Link>

            {/* Center — Navigation links */}
            <div className="flex items-center">
              <MegaMenu textClass={showSolidBackground ? "text-white" : "text-[#003DA5]"} />

              <span className={cn("mx-2 h-4 w-px transition-colors duration-300", showSolidBackground ? "bg-white/20" : "bg-[#003DA5]")} />

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-3 text-base font-semibold tracking-wide transition-colors duration-150 after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-[2px] after:scale-x-0 after:rounded-full after:bg-cyan-300 after:transition-transform after:duration-200 hover:after:scale-x-100",
                    showSolidBackground ? "text-white hover:text-white/80" : "text-black/70 hover:text-[#003DA5]/80"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right — Actions */}
            <div className={cn("flex items-center gap-1.5 transition-colors duration-300", showSolidBackground ? "text-white" : "text-[#003DA5]")}>
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus:outline-none"
                aria-label="Search"
              >
                {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </button>

              {/* Account */}
              <Link
                href="/account"
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className={cn(
                    "absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black text-white",
                    showSolidBackground ? "bg-rose-500" : "bg-rose-500"
                  )}>
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className={cn(
                    "absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black",
                    showSolidBackground ? "bg-white text-[#005AA9]" : "bg-[#003DA5] text-white"
                  )}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>



              {/* Theme Toggle */}

            </div>
          </div>
        </div>
      </header>

      {/* Slide-down Search Bar (Unified) */}
      {searchOpen && (
        <div
          className={cn(
            "z-40 border-b border-[#004b8d] bg-[#004b8d] px-4 py-3 transition-all duration-300",
            isHome ? "fixed top-[56px] lg:top-16 inset-x-0" : "sticky top-[56px] lg:top-16 inset-x-0"
          )}
        >
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center gap-2.5 overflow-hidden rounded-full bg-white/10 px-4 py-2.5 focus-within:bg-white/20 focus-within:ring-2 focus-within:ring-cyan-400 transition-all">
              <Search className="h-5 w-5 shrink-0 text-white/70" />
              <input
                autoFocus
                placeholder="Search fish, pets, food, supplies…"
                className="flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/50 tracking-wide"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
