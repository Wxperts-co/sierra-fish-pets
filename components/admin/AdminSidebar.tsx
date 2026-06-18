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
  Images,
  Info,
  LogOut,
  Fish,
  CalendarDays,
  PawPrint,
  BadgePercent,
  Gift,
} from "lucide-react";
import axios from "axios";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

const menuItems = [
  { name: "Dashboard",    href: "/admin",              icon: LayoutDashboard },
  { name: "Users",        href: "/admin/users",        icon: Users },
  { name: "Products",     href: "/admin/products",     icon: ShoppingBag },
  { name: "Orders",       href: "",       icon: ClipboardList },
  { name: "Categories",   href: "/admin/categories",   icon: Tag },
  { name: "Events", href: "", icon: CalendarDays },
  { name: "Dog Adoption", href: "", icon: PawPrint },
  { name: "Brands", href: "", icon: BadgePercent },
  { name: "Gift Cards", href: "", icon: Gift },
  { name: "Blog Posts",   href: "",        icon: FileText },
  { name: "FAQs",         href: "",         icon: HelpCircle },
  { name: "Hero Slider",  href: "",  icon: Layers },
  { name: "Gallery",      href: "",      icon: Images },
  { name: "About",        href: "",        icon: Info },
];

export default function AdminSidebar() {
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
    <aside className="w-64 h-full flex flex-col shrink-0 bg-[#003B73] border-r border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">

      {/* ── Brand / Profile ── */}
      <div className="flex items-center justify-center px-5 py-6 shrink-0">
        <div className="relative h-14 w-40 overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-[0_15px_35px_-25px_rgba(0,0,0,0.5)]">
          <Image src="/images/logo/logo.png" alt="Sierra Admin Logo" fill className="object-contain" />
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-2">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
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
  );
}
