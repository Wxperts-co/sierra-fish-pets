"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Lock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, setAuthLoading } from "@/store/slices/authSlice";
import { openLoginModal } from "@/store/slices/authModalSlice";
import { setWishlist } from "@/store/slices/wishlistSlice";
import AccountSidebar from "@/components/account/AccountSidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  const { isAuthenticated, loading } = useAppSelector(
    (state) => state.auth,
  );
  const [checkingSession, setCheckingSession] = useState(true);

  // Attempt to restore session on mount
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
        } catch (error) {
          // Token missing or invalid, leave isAuthenticated as false
        } finally {
          dispatch(setAuthLoading(false));
          setCheckingSession(false);
        }
      } else {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [dispatch, isAuthenticated]);

  // Loading Skeleton
  if (loading || checkingSession) {
    return (
      <div className="container mx-auto px-4 py-36 max-w-6xl flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl space-y-6">
          <div className="h-10 bg-slate-200 rounded-lg animate-pulse w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 col-span-1">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-12 bg-slate-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
            <div className="col-span-3 space-y-6">
              <div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
              <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Auth Guard: Not Logged In View
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-36 max-w-4xl flex-grow flex flex-col items-center justify-center text-center">
        <div className="max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl p-8 md:p-12">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-500 mb-6">
            <Lock className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">
            Access Denied
          </h1>
          <p className="text-slate-600 mb-8 leading-relaxed font-medium">
            Please log in or register to view your account dashboard, track
            orders, and manage addresses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => dispatch(openLoginModal())}
              className="px-8 py-3 rounded-xl bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] font-semibold text-white transition-transform hover:scale-[1.02] shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              Sign In
            </button>
            <Link
              href="/"
              className="px-8 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f8fafd] py-8  md:py-36 font-lato">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Sidebar & Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Fixed/Sticky Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <AccountSidebar />
          </div>

          {/* Account Sub-Page Content */}
          <main className="lg:col-span-3 space-y-8 min-h-[500px]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
