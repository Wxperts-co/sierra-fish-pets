"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  SlidersHorizontal,
  ClipboardList,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  HelpCircle,
  Layers,
  Info,
  LogOut,
  Fish,
  CalendarDays,
  PawPrint,
  BadgePercent,
  Gift,
  X,
  User,
} from "lucide-react";
import axios from "axios";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

const menuItems = [
  { name: "Dashboard",    href: "/admin",              icon: LayoutDashboard },
  { name: "Users",        href: "/admin/users",        icon: Users },
  { name: "Products",     href: "/admin/products",     icon: ShoppingBag },
  { name: "Orders",       href: "/admin/orders",       icon: ClipboardList },
  { name: "Categories",   href: "/admin/categories",   icon: Tag },
  { name: "Events", href: "/admin/events", icon: CalendarDays },
  { name: "New Arrivals", href: "/admin/new-arrivals", icon: PawPrint },
  { name: "Dog Adoption", href: "/admin/dog-adoption", icon: PawPrint },
  { name: "Brands", href: "/admin/brands", icon: BadgePercent },
  { name: "Gift Cards", href: "/admin/gift-cards", icon: Gift },
  { name: "Reviews",      href: "/admin/reviews",      icon: MessageSquare },
  { name: "Blog Posts", href: "/admin/blogs", icon: FileText },
  { name: "Hero Slider",  href: "/admin/hero-slider",  icon: Layers },
  { name: "Profile",      href: "/admin/profile",      icon: User },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      const { signOut } = await import("next-auth/react");
      await signOut({ redirect: false });
      await axios.post("/api/auth/logout");
      dispatch(logout());
      window.location.href = "/admin";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : (pathname ?? "").startsWith(href);

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 h-full flex flex-col shrink-0 bg-[#003B73] border-r border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        {/* ── Brand / Profile ── */}
        <div className="flex items-center justify-between px-5 py-6 shrink-0 lg:justify-center">
          <div className="relative h-14 w-40 overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-[0_15px_35px_-25px_rgba(0,0,0,0.5)]">
            <Image src="/images/logo/logo.png" alt="Sierra Admin Logo" fill className="object-contain" sizes="160px" />
          </div>
          
          {/* Close button inside sidebar on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition active:scale-95 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-2">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-white/15 text-white shadow-[0_12px_30px_-18px_rgba(255,255,255,0.35)]"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon
                className={`h-5 w-5 shrink-0 ${active ? "text-white" : "text-blue-200 group-hover:text-white"}`}
              />
              <span className="truncate">{item.name}</span>
              {active && (
                <span className="ml-auto h-2.5 w-2.5 rounded-full bg-blue-300 shadow-[0_0_0_5px_rgba(96,165,250,0.18)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Logout ── */}
      <div className="border-t border-white/10 p-4 shrink-0">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-3xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
        >
          <LogOut className="h-4 w-4 shrink-0 text-white" />
          Sign out
        </button>
      </div>
    </aside>
    </>
  );
}
