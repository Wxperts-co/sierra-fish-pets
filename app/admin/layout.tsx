"use client";

import { useEffect, useState, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, setAuthLoading } from "@/store/slices/authSlice";
import { setWishlist } from "@/store/slices/wishlistSlice";
import axios from "axios";
import { Search, Bell } from "lucide-react";
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
  if (!isAuthenticated || user?.role !== "admin") {
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
      <AdminSidebar />

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top navbar — admin-specific, blue-accented */}
        <header className="h-16 bg-[#003B73] border-b border-white/10 flex  items-center justify-end px-6 shrink-0">
          {/* Search */}
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70 pointer-events-none" />
            <input
              type="text"
              placeholder="Search orders, products..."
              className="pl-10 pr-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm text-white outline-none w-72 focus:bg-white/15 focus:border-white/30 focus:ring-2 focus:ring-white/20 transition"
            />
          </div> */}

          {/* Right: bell + user */}
          <div className="flex  items-center gap-2">
            {/* <button className="p-2 rounded-full hover:bg-white/15 transition-colors relative text-white/80 hover:text-white">
              <Bell className="h-5 w-5" />
            </button> */}

            <div className="flex items-center gap-3 ml-1 pl-3 border-l border-white/15">
              {/* Blue gradient avatar */}
              <div
                className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 select-none shadow-md shadow-slate-950/30"
                style={{ background: "linear-gradient(135deg,#003B73 0%,#005EA8 50%,#0077C8 100%)" }}
              >
                {user?.name?.[0]?.toUpperCase() ?? "A"}
              </div>
              <div className="leading-tight">
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
