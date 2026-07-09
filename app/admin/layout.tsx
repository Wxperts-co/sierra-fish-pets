"use client";

import { useEffect, useState, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, setAuthLoading } from "@/store/slices/authSlice";
import { setWishlist } from "@/store/slices/wishlistSlice";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Search, Bell, Menu } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminLoginForm from "@/components/admin/AdminLoginForm";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      if (!isAuthenticated) {
        try {
          dispatch(setAuthLoading(true));
          const res = await axios.get("/api/auth/me");
          if (res.data.success && res.data.user) {
            dispatch(setUser(res.data.user));
            dispatch(setWishlist(res.data.user.wishlist || []));
          }
        } catch {
          // No valid session
        } finally {
          dispatch(setAuthLoading(false));
        }
      }
      setCheckingSession(false);
    };

    checkSession();
  }, [dispatch, isAuthenticated]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading || checkingSession) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#f5f6fa]">
        <div className="text-center space-y-3">
          <div className="h-11 w-11 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-medium text-sm">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // ── Not authenticated / not admin → show login page ────────────────────────
  const ALLOWED_ADMIN_ROLES = ["admin", "manager", "sales", "delivery boy"];
  if (!isAuthenticated || !user?.role || !ALLOWED_ADMIN_ROLES.includes(user.role)) {
    return (
      <div className="fixed inset-0 z-[200] overflow-auto">
        <Suspense fallback={
          <div className="flex h-screen items-center justify-center bg-[#001f3f]">
            <div className="h-11 w-11 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <AdminLoginForm />
        </Suspense>
      </div>
    );
  }

  // ── Authenticated admin → full-screen dashboard ────────────────────────────
  return (
    <div className="fixed inset-0 z-[200] flex bg-[#f5f6fa] overflow-hidden">
      {/* ── Sidebar ── */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top navbar — admin-specific, blue-accented */}
        <header className="relative h-16 bg-[#003B73] border-b border-white/10 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Toggle on Mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-white hover:bg-white/10 transition active:scale-95 cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo on Mobile view —  */}
            <div className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-28 overflow-hidden rounded-xl bg-white/5 border border-white/10 shrink-0 select-none">
              <Image
                src="/images/logo/logo.png"
                alt="Sierra Admin Logo"
                fill
                className="object-contain"
                sizes="112px"
              />
            </div>
          </div>

          {/* Right: user profile */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 pl-3 border-l border-white/15">
              {/* Profile avatar image or initials link to profile */}
              <Link
                href="/admin/profile"
                className="h-9 w-9 rounded-full overflow-hidden shrink-0 select-none shadow-md shadow-slate-950/30 relative flex items-center justify-center bg-slate-100 cursor-pointer active:scale-95 transition"
                title="View Admin Profile"
              >
                {user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="h-full w-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: "linear-gradient(135deg,#003B73 0%,#005EA8 50%,#0077C8 100%)" }}
                  >
                    {user?.name?.[0]?.toUpperCase() ?? "A"}
                  </div>
                )}
              </Link>
              
              {/* Name and Email — hidden on mobile */}
              <div className="hidden lg:block leading-tight">
                <p className="text-sm font-semibold text-white leading-none">
                  {user?.name ?? "Admin User"}
                </p>
                <p className="text-xs text-blue-200 mt-0.5 leading-none font-medium">
                  {user?.email ?? "admin@store.com"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
