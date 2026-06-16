"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  X,
  ChevronDown,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import MobileMenu from "@/components/layouts/MobileMenu";
import MegaMenu from "./MegaMenu";
import { cn } from "@/lib/utils";
import categories from "@/data/categories.json";
import navbarData from "@/data/navbar.json";
import { openLoginModal } from "@/store/slices/authModalSlice";

const CATEGORY_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  aquatic: "🐠",
  reptile: "🦎",
  bird: "🦜",
  "small-animal": "🐹",
};

export default function Header() {
  const dispatch = useAppDispatch();
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setActiveDropdown(null);
    setActiveSubmenu(null);
  }

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (activeDropdown && !target.closest(".nav-dropdown-container")) {
        setActiveDropdown(null);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  const cartCount = useAppSelector((state) => state.cart.items.length);
  const wishlistCount = useAppSelector(
    (state) => state.wishlist.productIds.length,
  );
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const isHome = pathname === "/";
  const isShopHero = pathname === "/shop"; // transparent overlay on shop page too
  const isAboutUs = pathname === "/about";
  const isContactUs = pathname === "/contact-us";
  const isEventCalendar = pathname === "/event-calendar";
  const isGallery = pathname === "/gallery";
  const isGiftCards = pathname === "/gift-cards";
  const isServiceDetail = pathname ? pathname.startsWith("/services/") : false;
  const isBrandsPage =
    pathname === "/brands" ||
    (pathname ? pathname.startsWith("/brands/") : false);
  const isArrivals =
    pathname === "/arrivals" ||
    (pathname ? pathname.startsWith("/arrivals/") : false);
  const isBlogs =
    pathname === "/blogs" ||
    (pathname ? pathname.startsWith("/blogs/") : false);
  const isSierraEdu =
    pathname === "/sierra-edu" ||
    (pathname ? pathname.startsWith("/edu/") : false);

  const isTransparentPage =
    isHome ||
    isShopHero ||
    isAboutUs ||
    isContactUs ||
    isEventCalendar ||
    isServiceDetail ||
    isGallery ||
    isGiftCards ||
    isBrandsPage ||
    isArrivals ||
    isBlogs ||
    isSierraEdu;

  // Check scroll position to handle floating-to-sticky transitions
  useEffect(() => {
    if (!isTransparentPage) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Determine if header should have a solid background or be transparent overlay
  const showSolidBackground = !isTransparentPage || scrolled || searchOpen;

  const isDarkTransparentPage =
    isAboutUs ||
    isContactUs ||
    isEventCalendar ||
    isServiceDetail ||
    isGallery ||
    isGiftCards ||
    isBrandsPage ||
    isArrivals ||
    isBlogs ||
    isSierraEdu;
  const useWhiteText = showSolidBackground || isDarkTransparentPage;

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
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-white rounded-lg px-2 py-1"
            >
              <Image
                src="/images/logo/logo.png"
                alt="Sierra Fish & Pets"
                width={100}
                height={32}
                priority
                className="h-7 w-auto object-contain rounded-lg"
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
                  : "text-slate-600 group-hover:text-[#005AA9]",
              )}
            >
              For You
            </span>
            {pathname === "/" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#005AA9] rounded-full" />
            )}
          </Link>

          {categories.map((category) => {
            const href = `/shop?category=${category.slug}`;
            const isActive = pathname?.startsWith("/shop");
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
                      : "text-slate-600 group-hover:text-[#005AA9]",
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
            : cn(
                "absolute top-0 inset-x-0 bg-transparent border-b",
                isDarkTransparentPage
                  ? "border-white/10"
                  : isHome || isEventCalendar
                    ? "border-slate-200/60"
                    : "border-transparent",
              ),
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-25 items-center justify-between gap-4">
            {/* Left — logo */}
            <Link
              href="/"
              className="flex h-16 shrink-0 items-center overflow-visible"
            >
              <Image
                src={
                  showSolidBackground
                    ? "/images/logo/logo.png"
                    : "/images/logo/logo3.png"
                }
                alt="Sierra Fish & Pets"
                width={400}
                height={100}
                priority
                className={cn(
                  "block h-auto w-[260px] object-contain object-center transition-all duration-300",
                  showSolidBackground ? "rounded-xl" : "",
                )}
              />
            </Link>

            {/* Center — Navigation links */}
            <div className="flex items-center">
              {navbarData.map((item: any) => {
                if (item.type === "megamenu") {
                  return (
                    <React.Fragment key={item.label}>
                      <MegaMenu
                        textClass={
                          useWhiteText ? "text-white" : "text-[#003DA5]"
                        }
                        isOpen={activeDropdown === "shop"}
                        onToggle={() =>
                          setActiveDropdown(
                            activeDropdown === "shop" ? null : "shop",
                          )
                        }
                        onClose={() => setActiveDropdown(null)}
                      />
                      <span
                        className={cn(
                          "mx-2 h-4 w-px transition-colors duration-300",
                          useWhiteText ? "bg-white/20" : "bg-[#003DA5]",
                        )}
                      />
                    </React.Fragment>
                  );
                }

                if (item.type === "link") {
                  return (
                    <Link
                      href={item.href}
                      key={item.label}
                      className={cn(
                        "relative px-3.5 py-3 text-base font-semibold tracking-wide transition-colors duration-150 after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-[2px] after:scale-x-0 after:rounded-full after:bg-cyan-300 after:transition-transform after:duration-200 hover:after:scale-x-100",
                        useWhiteText
                          ? "text-white hover:text-white/80"
                          : "text-black/70 hover:text-[#003DA5]/80",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                }

                if (item.type === "dropdown") {
                  const dropKey = item.label.toLowerCase();
                  return (
                    <div
                      key={item.label}
                      className="relative py-3 px-3.5 nav-dropdown-container"
                    >
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === dropKey ? null : dropKey,
                          )
                        }
                        className={cn(
                          "flex items-center gap-1 text-base font-semibold tracking-wide transition-colors duration-150 cursor-pointer focus:outline-none",
                          useWhiteText
                            ? "text-white hover:text-white/80"
                            : "text-black/70 hover:text-[#003DA5]/80",
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            activeDropdown === dropKey && "rotate-180",
                          )}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      <div
                        className={cn(
                          "absolute top-full left-0 z-50 translate-y-2 rounded-xl bg-white p-2 shadow-xl border border-slate-100 transition-all duration-200 origin-top-left",
                          dropKey === "more"
                            ? "min-w-[140px]"
                            : "min-w-[200px]",
                          activeDropdown === dropKey
                            ? "opacity-100 visible scale-100 pointer-events-auto"
                            : "opacity-0 invisible scale-95 pointer-events-none",
                        )}
                      >
                        {item.menuItems?.map((menuItem: any, idx: number) => {
                          if (menuItem.type === "submenu") {
                            return (
                              <div key={idx} className="relative group/submenu">
                                <div className="flex items-center justify-between rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors whitespace-nowrap cursor-default select-none">
                                  {menuItem.label}
                                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                                </div>

                                {/* Submenu Panel */}
                                <div
                                  className={cn(
                                    "absolute left-full top-0 z-50 ml-1 rounded-xl bg-white p-2 shadow-2xl border border-slate-100 opacity-0 invisible scale-95 group-hover/submenu:opacity-100 group-hover/submenu:visible group-hover/submenu:scale-100 transition-all duration-150 origin-top-left",
                                    dropKey === "more"
                                      ? "min-w-[170px]"
                                      : "min-w-[240px]",
                                  )}
                                >
                                  {menuItem.submenuItems?.map(
                                    (subItem: any, sIdx: number) => {
                                      const isSierraEdu =
                                        menuItem.label === "Sierra Edu";
                                      const isSubOpen =
                                        activeSubmenu === subItem.label;

                                      return (
                                        <div
                                          key={sIdx}
                                          className="relative group/edu-submenu"
                                        >
                                          {subItem.items ? (
                                            <>
                                              {isSierraEdu ? (
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveSubmenu(
                                                      isSubOpen
                                                        ? null
                                                        : subItem.label,
                                                    );
                                                  }}
                                                  className="w-full text-left flex items-center justify-between rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors whitespace-nowrap cursor-pointer select-none focus:outline-none"
                                                >
                                                  {subItem.label}
                                                  <ChevronRight
                                                    className={cn(
                                                      "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
                                                      isSubOpen && "rotate-90",
                                                    )}
                                                  />
                                                </button>
                                              ) : (
                                                <div className="flex items-center justify-between rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors whitespace-nowrap cursor-default select-none">
                                                  {subItem.label}
                                                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                                                </div>
                                              )}

                                              {/* Third Level Submenu */}
                                              <div
                                                className={cn(
                                                  "absolute left-full top-0 z-50 ml-1 rounded-xl bg-white p-2 shadow-2xl border border-slate-100 transition-all duration-150 origin-top-left",
                                                  dropKey === "more"
                                                    ? "min-w-[180px]"
                                                    : "min-w-[220px]",
                                                  isSierraEdu
                                                    ? isSubOpen
                                                      ? "opacity-100 visible scale-100 pointer-events-auto"
                                                      : "opacity-0 invisible scale-95 pointer-events-none"
                                                    : "opacity-0 invisible scale-95 pointer-events-none group-hover/edu-submenu:opacity-100 group-hover/edu-submenu:visible group-hover/edu-submenu:scale-100",
                                                )}
                                              >
                                                {subItem.items.map(
                                                  (
                                                    nestedItem: any,
                                                    nIdx: number,
                                                  ) => (
                                                    <Link
                                                      key={nIdx}
                                                      href={nestedItem.href}
                                                      onClick={() => {
                                                        setActiveDropdown(null);
                                                        setActiveSubmenu(null);
                                                      }}
                                                      className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                                                    >
                                                      {nestedItem.label}
                                                    </Link>
                                                  ),
                                                )}
                                              </div>
                                            </>
                                          ) : (
                                            <Link
                                              href={subItem.href}
                                              onClick={() => {
                                                setActiveDropdown(null);
                                                setActiveSubmenu(null);
                                              }}
                                              className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                                            >
                                              {subItem.label}
                                            </Link>
                                          )}
                                        </div>
                                      );
                                    },
                                  )}
                                </div>
                              </div>
                            );
                          }

                          // Standard Link
                          return (
                            <Link
                              key={idx}
                              href={menuItem.href}
                              onClick={() => setActiveDropdown(null)}
                              className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#005AA9] transition-colors"
                            >
                              {menuItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {/* Right — Actions */}
            <div
              className={cn(
                "flex items-center gap-1.5 transition-colors duration-300",
                useWhiteText ? "text-white" : "text-[#003DA5]",
              )}
            >
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus:outline-none"
                aria-label="Search"
              >
                {searchOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </button>

              

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
                  <span
                    className={cn(
                      "absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black",
                      useWhiteText
                        ? "bg-white text-[#005AA9]"
                        : "bg-[#003DA5] text-white",
                    )}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              {isAuthenticated ? (
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-2.5 py-1 rounded-full transition-colors hover:bg-white/15"
                  aria-label="Account"
                >
                  <div className="relative h-8 w-8 rounded-full overflow-hidden border border-white/20 shrink-0 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user?.avatar?.url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                      alt={user?.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-bold truncate max-w-[120px] hidden sm:inline">
                    {user?.name || "Account"}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 hidden sm:block" />
                </Link>
              ) : (
                <button
                  onClick={() => dispatch(openLoginModal())}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/15 cursor-pointer focus:outline-none"
                  aria-label="Account"
                >
                  <User className="h-5 w-5" />
                </button>
              )}

              {/* Theme Toggle */}
            </div>
          </div>
        </div>
      </header>

      {/* Slide-down Search Bar (Unified) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-[#005AA9] text-white transition-all duration-300 hidden lg:block">
          <div className="container mx-auto px-4 pt-32 pb-16 max-w-6xl">
            {/* Top Row: what are you looking for? / CLOSE ✕ */}
            <div className="flex items-center justify-between mb-8 select-none">
              <span className="text-sm font-extrabold tracking-wide text-white/80 lowercase">
                what are you looking for?
              </span>
              <button
                onClick={() => setSearchOpen(false)}
                className="flex items-center gap-1.5 text-xs font-black tracking-widest text-white hover:opacity-80 transition-opacity uppercase cursor-pointer"
              >
                <span>close</span>
                <span className="text-sm font-bold">✕</span>
              </button>
            </div>

            {/* Input Row with Bottom Border and Search Icon */}
            <div className="relative flex items-center border-b border-white pb-3">
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent text-3xl sm:text-5xl font-normal text-white placeholder:text-white/40 outline-none pr-12 tracking-wide"
              />
              <Search className="absolute right-1 h-7 w-7 text-white stroke-[1.5px]" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
