"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MapPin,
  User,
  CreditCard,
  Star,
  Bell,
  Lock,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { clearWishlist } from "@/store/slices/wishlistSlice";

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const wishlistProductIds = useAppSelector(
    (state) => state.wishlist.productIds
  );

  const handleLogout = async () => {
    try {
      // 1. Sign out of NextAuth first to update session status
      try {
        const { signOut } = await import("next-auth/react");
        await signOut({ redirect: false });
      } catch (e) {
        // Safe fallback
      }

      // 2. Clear local session cookies and Redux states
      await axios.post("/api/auth/logout");
      dispatch(logout());
      dispatch(clearWishlist());
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const sidebarLinks = [
    { href: "/account", label: "Dashboard", icon: LayoutDashboard },
    { href: "/account/orders", label: "Orders", icon: ShoppingBag },
    {
      href: "/account/wishlist",
      label: "Wishlist",
      icon: Heart,
      badge: wishlistProductIds.length,
    },
    { href: "/account/addresses", label: "Addresses", icon: MapPin },
    { href: "/account/profile", label: "Profile", icon: User },
    
    { href: "/account/reviews", label: "Reviews", icon: Star },
    
    { href: "/account/security", label:" Reset Password", icon: Lock },
  ];

  return (
    <aside className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-5 space-y-6 lg:sticky lg:top-28">
      <nav className="space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-[15px] font-bold transition-all duration-200 group ${
                isActive
                  ? "bg-[#e6f0fa] text-[#005AA9]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isActive
                      ? "text-[#005AA9] scale-105"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span>{link.label}</span>
              </div>
              {link.badge !== undefined && link.badge > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#005AA9] px-1 text-[10px] font-black text-white">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[15px] font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer group"
        >
          <LogOut className="h-5 w-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
          <span>Logout</span>
        </button>
      </div>

      {/* Need Help? Box */}
      <div className="bg-[#f8fafd] rounded-2xl p-4 border border-slate-100 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#005AA9]" />
          <span className="font-extrabold text-slate-800 text-sm">
            Need Help?
          </span>
        </div>
        <p className="text-[11px] font-semibold text-slate-500 leading-normal">
          We&apos;re here to help you. Contact our team anytime.
        </p>
        <Link
          href="/contact-us"
          className="text-xs font-black text-[#005AA9] hover:underline"
        >
          Contact Support
        </Link>
      </div>
    </aside>
  );
}
