"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, User, Heart, ShoppingBag, X, ChevronDown, ChevronRight, MapPin } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import MobileMenu from "@/components/layouts/MobileMenu";
import MegaMenu from "./MegaMenu";
import { cn } from "@/lib/utils";
import categories from "@/data/categories.json";

const CATEGORY_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  aquatic: "🐠",
  reptile: "🦎",
  bird: "🦜",
  "small-animal": "🐹",
};

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<"shop" | "arrivals" | "blogs" | "page" | "services" | "brands" | null>(null);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setActiveDropdown(null);
  }

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (activeDropdown && !target.closest(".nav-dropdown-container")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

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
      <header className="z-50 sticky top-0 inset-x-0 bg-[#005AA9] shadow-md border-b border-[#004b8d] lg:hidden font-lato w-full">
        {/* Row 1: Logo and Search Input, plus Menu and Cart */}
        <div className="flex items-center justify-between px-3 py-2 gap-3">
          {/* Left: Hamburger menu + Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <MobileMenu />
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo/white-logo.png"
                alt="Sierra Fish & Pets"
                width={100}
                height={32}
                priority
                className="h-7 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Right: Search Input + Cart icon */}
          <div className="flex-1 flex items-center gap-2 justify-end">
            <div className="relative flex-1 max-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-8 pr-2.5 py-1.5 bg-white text-slate-800 placeholder:text-slate-400 text-xs rounded-lg border-0 focus:ring-2 focus:ring-cyan-400 outline-none transition-all shadow-inner font-medium"
              />
            </div>

            <Link
              href="/cart"
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[8px] font-black text-[#005AA9] shadow-sm">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Row 2: Location Selector */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[#004b8d]/50 text-white text-xs border-t border-[#004b8d]/30">
          <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span className="text-white/80">Location not set</span>
          <button className="flex items-center gap-0.5 text-cyan-300 font-bold hover:underline transition-all">
            Select delivery location
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        {/* Row 3: Horizontal Scrollable Categories */}
        <div
          className="bg-white py-2.5 overflow-x-auto scrollbar-none flex items-center gap-6 px-4 border-t border-[#004b8d]/20 border-b border-slate-200"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* For You Tab */}
          <Link
            href="/"
            className="flex flex-col items-center shrink-0 relative pb-1 group"
          >
            <span
              className={cn(
                "text-sm font-bold tracking-wide transition-colors whitespace-nowrap",
                pathname === "/"
                  ? "text-[#005AA9]"
                  : "text-slate-600 group-hover:text-[#005AA9]"
              )}
            >
              For You
            </span>
            {pathname === "/" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#005AA9] rounded-full" />
            )}
          </Link>

          {categories.map((category) => {
            const href = `/shop/${category.slug}`;
            const isActive = pathname === href;
            return (
              <Link
                key={category.id}
                href={href}
                className="flex flex-col items-center shrink-0 relative pb-1 group"
              >
                <span
                  className={cn(
                    "text-sm font-bold tracking-wide transition-colors whitespace-nowrap",
                    isActive
                      ? "text-[#005AA9]"
                      : "text-slate-600 group-hover:text-[#005AA9]"
                  )}
                >
                  {category.name}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#005AA9] rounded-full" />
                )}
              </Link>
            );
          })}
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
              <MegaMenu
                textClass={showSolidBackground ? "text-white" : "text-[#003DA5]"}
                isOpen={activeDropdown === "shop"}
                onToggle={() => setActiveDropdown(activeDropdown === "shop" ? null : "shop")}
                onClose={() => setActiveDropdown(null)}
              />

              <span className={cn("mx-2 h-4 w-px transition-colors duration-300", showSolidBackground ? "bg-white/20" : "bg-[#003DA5]")} />

              {/* Home */}
              <Link
                href="/"
                className={cn(
                  "relative px-3.5 py-3 text-base font-semibold tracking-wide transition-colors duration-150 after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-[2px] after:scale-x-0 after:rounded-full after:bg-cyan-300 after:transition-transform after:duration-200 hover:after:scale-x-100",
                  showSolidBackground ? "text-white hover:text-white/80" : "text-black/70 hover:text-[#003DA5]/80"
                )}
              >
                Home
              </Link>

             
              {/* Services Dropdown */}
              <div className="relative py-3 px-3.5 nav-dropdown-container">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === "services" ? null : "services")}
                  className={cn(
                    "flex items-center gap-1 text-base font-semibold tracking-wide transition-colors duration-150 cursor-pointer focus:outline-none",
                    showSolidBackground ? "text-white hover:text-white/80" : "text-black/70 hover:text-[#003DA5]/80"
                  )}
                >
                  Services
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", activeDropdown === "services" && "rotate-180")} />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={cn(
                    "absolute top-full left-0 z-50 min-w-[200px] translate-y-2 rounded-xl bg-white p-2 shadow-xl border border-slate-100 transition-all duration-200 origin-top-left",
                    activeDropdown === "services"
                      ? "opacity-100 visible scale-100 pointer-events-auto"
                      : "opacity-0 invisible scale-95 pointer-events-none"
                  )}
                >
                  {/* Aquarium Services Submenu */}
                  <div className="relative group/submenu">
                    <Link
                      href="/services"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors whitespace-nowrap"
                    >
                      Aquarium Services
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </Link>
                    {/* Submenu Panel */}
                    <div className="absolute left-full top-0 z-50 min-w-[240px] ml-1 rounded-xl bg-white p-2 shadow-2xl border border-slate-100 opacity-0 invisible scale-95 group-hover/submenu:opacity-100 group-hover/submenu:visible group-hover/submenu:scale-100 transition-all duration-150 origin-top-left">
                      <Link
                        href="/services#aquarium-design"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Aquarium Consulting & Design
                      </Link>
                      <Link
                        href="/services#custom-aquariums"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Custom Aquariums
                      </Link>
                      <Link
                        href="/services#installation"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Aquarium Installation
                      </Link>
                    </div>
                  </div>

                  {/* In-Store Services Submenu */}
                  <div className="relative group/submenu">
                    <Link
                      href="/services"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors whitespace-nowrap"
                    >
                      In-Store Services
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </Link>
                    {/* Submenu Panel */}
                    <div className="absolute left-full top-0 z-50 min-w-[240px] ml-1 rounded-xl bg-white p-2 shadow-2xl border border-slate-100 opacity-0 invisible scale-95 group-hover/submenu:opacity-100 group-hover/submenu:visible group-hover/submenu:scale-100 transition-all duration-150 origin-top-left">
                      <Link
                        href="/services#water-testing"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Aquarium Water Testing
                      </Link>
                      <Link
                        href="/services#fish-club"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Fish of the Month Club
                      </Link>
                      <Link
                        href="/services#pet-care"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Pet Nails and Wing Trim
                      </Link>
                      <Link
                        href="#"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Store Tour & Loyalty Program
                      </Link>
                    </div>
                  </div>

                  {/* Dog Adoption Events */}
                  <Link
                    href="#"
                    onClick={() => setActiveDropdown(null)}
                    className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors whitespace-nowrap"
                  >
                    Dog Adoption Events
                  </Link>
                </div>
              </div>

              {/* Brands Dropdown */}
              <div className="relative py-3 px-3.5 nav-dropdown-container">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === "brands" ? null : "brands")}
                  className={cn(
                    "flex items-center gap-1 text-base font-semibold tracking-wide transition-colors duration-150 cursor-pointer focus:outline-none",
                    showSolidBackground ? "text-white hover:text-white/80" : "text-black/70 hover:text-[#003DA5]/80"
                  )}
                >
                  Brands
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", activeDropdown === "brands" && "rotate-180")} />
                </button>

                {/* Dropdown Menu */}
                <div
                  onClick={() => setActiveDropdown(null)}
                  className={cn(
                    "absolute top-full left-0 z-50 min-w-[180px] translate-y-2 rounded-xl bg-white p-2 shadow-xl border border-slate-100 transition-all duration-200 origin-top-left",
                    activeDropdown === "brands"
                      ? "opacity-100 visible scale-100 pointer-events-auto"
                      : "opacity-0 invisible scale-95 pointer-events-none"
                  )}
                >
                  <Link
                    href="/brands"
                    className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                  >
                    All Brands
                  </Link>
                  <Link
                    href="/brands?category=dog"
                    className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                  >
                    Dog Brands
                  </Link>
                  <Link
                    href="/brands?category=cat"
                    className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                  >
                    Cat Brands
                  </Link>
                  <Link
                    href="/brands?category=aquatic"
                    className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                  >
                    Aquatic Brands
                  </Link>
                  <Link
                    href="/brands?category=reptile"
                    className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                  >
                    Reptile Brands
                  </Link>
                </div>
              </div>

               {/* Event calender */}
              <Link
                href="#"
                className={cn(
                  "relative px-3.5 py-3 text-base font-semibold tracking-wide transition-colors duration-150 after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-[2px] after:scale-x-0 after:rounded-full after:bg-cyan-300 after:transition-transform after:duration-200 hover:after:scale-x-100",
                  showSolidBackground ? "text-white hover:text-white/80" : "text-black/70 hover:text-[#003DA5]/80"
                )}
              >
                Event calender
              </Link>

              {/* About us */}
              <Link
                href="#"
                className={cn(
                  "relative px-3.5 py-3 text-base font-semibold tracking-wide transition-colors duration-150 after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-[2px] after:scale-x-0 after:rounded-full after:bg-cyan-300 after:transition-transform after:duration-200 hover:after:scale-x-100",
                  showSolidBackground ? "text-white hover:text-white/80" : "text-black/70 hover:text-[#003DA5]/80"
                )}
              >
                About us
              </Link>

              {/* Contact us */}
              <Link
                href="#"
                className={cn(
                  "relative px-3.5 py-3 text-base font-semibold tracking-wide transition-colors duration-150 after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-[2px] after:scale-x-0 after:rounded-full after:bg-cyan-300 after:transition-transform after:duration-200 hover:after:scale-x-100",
                  showSolidBackground ? "text-white hover:text-white/80" : "text-black/70 hover:text-[#003DA5]/80"
                )}
              >
                Contact us
              </Link>

             

              {/* Page Dropdown */}
              <div className="relative py-3 px-3.5 nav-dropdown-container">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === "page" ? null : "page")}
                  className={cn(
                    "flex items-center gap-1 text-base font-semibold tracking-wide transition-colors duration-150 cursor-pointer focus:outline-none",
                    showSolidBackground ? "text-white hover:text-white/80" : "text-black/70 hover:text-[#003DA5]/80"
                  )}
                >
                  More
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", activeDropdown === "page" && "rotate-180")} />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={cn(
                    "absolute top-full left-0 z-50 min-w-[180px] translate-y-2 rounded-xl bg-white p-2 shadow-xl border border-slate-100 transition-all duration-200 origin-top-left",
                    activeDropdown === "page"
                      ? "opacity-100 visible scale-100 pointer-events-auto"
                      : "opacity-0 invisible scale-95 pointer-events-none"
                  )}
                >
                  {/* Arrivals Submenu */}
                  <div className="relative group/submenu">
                    <Link
                      href="#"
                      className="flex items-center justify-between rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                    >
                      Arrivals
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </Link>
                    {/* Submenu Panel */}
                    <div className="absolute left-full top-0 z-50 min-w-[200px] ml-1 rounded-xl bg-white p-2 shadow-2xl border border-slate-100 opacity-0 invisible scale-95 group-hover/submenu:opacity-100 group-hover/submenu:visible group-hover/submenu:scale-100 transition-all duration-150 origin-top-left">
                      <Link
                        href="#"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors whitespace-nowrap"
                      >
                        Bird Arrivals
                      </Link>
                      <Link
                        href="#"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors whitespace-nowrap"
                      >
                        Freshwater Arrivals
                      </Link>
                      <Link
                        href="#"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors whitespace-nowrap"
                      >
                        Saltwater Arrivals
                      </Link>
                      <Link
                        href="#"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors whitespace-nowrap"
                      >
                        Reptile Arrivals
                      </Link>
                      <Link
                        href="#"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors whitespace-nowrap"
                      >
                        Small Animal Arrivals
                      </Link>
                      <Link
                        href="#"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors whitespace-nowrap"
                      >
                        Cat Arrivals
                      </Link>
                    </div>
                  </div>

                  {/* Blogs Submenu */}
                  <div className="relative group/submenu">
                    <Link
                      href="#"
                      className="flex items-center justify-between rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                    >
                      Blogs
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </Link>
                    {/* Submenu Panel */}
                    <div className="absolute left-full top-0 z-50 min-w-[160px] ml-1 rounded-xl bg-white p-2 shadow-2xl border border-slate-100 opacity-0 invisible scale-95 group-hover/submenu:opacity-100 group-hover/submenu:visible group-hover/submenu:scale-100 transition-all duration-150 origin-top-left">
                      <Link
                        href="#"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Dog
                      </Link>
                      <Link
                        href="#"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Cat
                      </Link>
                      <Link
                        href="#"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Aquatic
                      </Link>
                      <Link
                        href="#"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Reptile
                      </Link>
                      <Link
                        href="#"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Bird
                      </Link>
                      <Link
                        href="#"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Small animal
                      </Link>
                    </div>
                  </div>

                  {/* Sierra Edu Submenu */}
                  <div className="relative group/submenu">
                    <Link
                      href="/edu"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                    >
                      Sierra Edu
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </Link>
                    {/* Submenu Panel */}
                    <div className="absolute left-full top-0 z-50 min-w-[180px] ml-1 rounded-xl bg-white p-2 shadow-2xl border border-slate-100 opacity-0 invisible scale-95 group-hover/submenu:opacity-100 group-hover/submenu:visible group-hover/submenu:scale-100 transition-all duration-150 origin-top-left">
                      <Link
                        href="/edu/dogs"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Dog Care Guides
                      </Link>
                      <Link
                        href="/edu/cats"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Cat Care Guides
                      </Link>
                      <Link
                        href="/edu/aquariums"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Aquarium Education
                      </Link>
                      <Link
                        href="/edu/reptiles"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Reptile Care
                      </Link>
                      <Link
                        href="/edu/reptiles"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Bird Care Guides
                      </Link>
                      <Link
                        href="/edu/reptiles"
                        onClick={() => setActiveDropdown(null)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                      >
                        Small Animal Care Guides
                      </Link>
                    </div>
                  </div>

                  {/* Gallery Link */}
                  <Link
                    href="/gallery"
                    onClick={() => setActiveDropdown(null)}
                    className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                  >
                    Gallery
                  </Link>

                  {/* Gift card Link */}
                  <Link
                    href="#"
                    onClick={() => setActiveDropdown(null)}
                    className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                  >
                    Gift card
                  </Link>
                </div>
              </div>

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
              {/* <Link
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
              </Link> */}

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
            "z-40 border-b border-[#004b8d] bg-[#004b8d] px-4 py-3 transition-all duration-300 hidden lg:block",
            isHome ? "fixed top-16 inset-x-0" : "sticky top-16 inset-x-0"
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
