"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ShoppingBag,
  Heart,
  Star,
  MapPin,
  ChevronRight,
  ArrowRight,
  Plus,
  CreditCard,
  Lock,
  MessageSquare,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { clearWishlist } from "@/store/slices/wishlistSlice";
import { userReviews } from "./reviews/page";
import DashboardStats from "@/components/account/DashboardStats";
import RecentOrders from "@/components/account/RecentOrders";

export default function AccountDashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { user } = useAppSelector((state) => state.auth);
  const wishlistProductIds = useAppSelector(
    (state) => state.wishlist.productIds,
  );

  const handleLogout = async () => {
    try {
      try {
        const { signOut } = await import("next-auth/react");
        await signOut({ redirect: false });
      } catch (e) {
        // Safe fallback
      }
      await axios.post("/api/auth/logout");
      dispatch(logout());
      dispatch(clearWishlist());
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "Pet Lover";

  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders");
        if (response.data?.success) {
          setDbOrders(response.data.orders || []);
        }
      } catch (error) {
        console.error("Failed to fetch database orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  const userOrders = useMemo(() => {
    return [...dbOrders].sort(
      (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
    );
  }, [dbOrders]);

  // Choose display orders
  const displayOrders = userOrders.slice(0, 3).map((o) => ({
    id: o._id || o.id,
    productName: o.items[0]?.productName || "Pet Supplies",
    orderNumber: o.orderNumber,
    status: o.status,
    date: new Date(o.placedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    price: `$${o.total.toFixed(2)}`,
    image: o.items[0]?.productImage || "/images/products/aqua1.jpeg",
  }));

  const totalOrdersCount = userOrders.length;
  const wishlistCount =
    wishlistProductIds.length > 0 ? wishlistProductIds.length : 8;
  const addressCount = user?.addresses && user.addresses.length > 0 ? user.addresses.length : 0;
  const reviewsCount = userReviews.length;



  return (
    <div className="space-y-8 font-lato">
      {/* Desktop View */}
      <div className="hidden lg:block space-y-8">
        {/* 1. Welcome Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#ebf5ff] to-[#f4faff] border border-blue-50 shadow-sm p-6 md:p-8 flex flex-col md:flex-row justify-between items-center min-h-[220px]">
          {/* Text Area */}
          <div className="space-y-4 z-10 text-center md:text-left max-w-lg">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Welcome back, {firstName}! 👋
            </h2>
            <p className="text-slate-600 font-semibold text-[15px] leading-relaxed">
              Here&apos;s what&apos;s happening with your account today.
            </p>
            <div className="flex flex-wrap gap-3.5 justify-center md:justify-start">
              <Link
                href="/shop"
                className="px-6 py-2.5 rounded-xl bg-[#005AA9] hover:bg-blue-700 text-white font-bold transition-all text-sm shadow-md shadow-blue-500/15"
              >
                Shop Now
              </Link>
              <Link
                href="/account/orders"
                className="px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white font-bold transition-colors text-sm"
              >
                View Orders
              </Link>
            </div>
          </div>

          {/* Floating Goldfish Illustration */}
          <div className="relative h-44 w-72 md:w-80 shrink-0 select-none mt-6 md:mt-0 z-0">
            <Image
              src="/images/banner/aquarium_banner.png"
              alt="Goldfish banner theme illustration"
              fill
              priority
              sizes="(max-w-768px) 100vw, 320px"
              className="object-contain"
            />
          </div>
        </div>

        {/* 2. Metric Cards Grid */}
        <DashboardStats
          totalOrdersCount={totalOrdersCount}
          wishlistCount={wishlistCount}
          reviewsCount={reviewsCount}
          addressCount={addressCount}
        />

        {/* 3. Bottom Columns (Recent Orders & Quick Actions) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Orders List */}
          <RecentOrders orders={displayOrders} />

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">
              Quick Actions
            </h3>

            <div className="space-y-4">
              {/* Add New Address */}
              <Link
                href="/account/addresses"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-[#f8fafd]/50 hover:bg-[#f8fafd] transition-colors duration-150 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#005AA9] flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight">
                      Add New Address
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                      Add a new shipping address
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Payment Methods */}
              <Link
                href="/account/payment-methods"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-[#f8fafd]/50 hover:bg-[#f8fafd] transition-colors duration-150 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#005AA9] flex items-center justify-center shrink-0">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight">
                      Payment Methods
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                      Manage your payment methods
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Change Password */}
              <Link
                href="/account/security"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-[#f8fafd]/50 hover:bg-[#f8fafd] transition-colors duration-150 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#005AA9] flex items-center justify-center shrink-0">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight">
                      Change Password
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                      Update your account password
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Contact Support */}
              <Link
                href="/contact-us"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-[#f8fafd]/50 hover:bg-[#f8fafd] transition-colors duration-150 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#005AA9] flex items-center justify-center shrink-0">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight">
                      Contact Support
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                      Get help with your orders
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden space-y-6">
        {/* 1. Welcome Card */}
        <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-6 space-y-5">
          {/* User Profile Header */}
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 rounded-full bg-blue-50 text-[#005AA9] flex items-center justify-center overflow-hidden border border-slate-100">
              {user?.avatar?.url ? (
                <Image
                  src={user.avatar.url}
                  alt={user.name || "User"}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <svg
                  className="h-8 w-8 text-[#005AA9]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 leading-tight">
                Hello, {firstName}! 👋
              </h2>
              <p className="text-xs font-bold text-slate-400 mt-0.5">
                Welcome back to Sierra Fish & Pets
              </p>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-slate-100" />

          {/* Stats Row */}
          <div className="flex items-center justify-around py-1">
            {/* Orders Stat */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-lg bg-blue-50 text-[#005AA9]">
                  <ShoppingBag className="h-4.5 w-4.5" />
                </div>
                <span className="font-black text-slate-800 text-[15px]">{totalOrdersCount}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-extrabold mt-1">Orders</p>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-slate-100" />

            {/* Reviews Stat */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-lg bg-amber-50 text-amber-500">
                  <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                </div>
                <span className="font-black text-slate-800 text-[15px]">{reviewsCount}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-extrabold mt-1">Reviews</p>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-slate-100" />

            {/* Wishlist Stat */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-lg bg-rose-50 text-rose-500">
                  <Heart className="h-4.5 w-4.5 fill-rose-500 text-rose-500" />
                </div>
                <span className="font-black text-slate-800 text-[15px]">{wishlistCount}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-extrabold mt-1">Wishlist</p>
            </div>
          </div>
        </div>

        {/* 2. Recent Orders Card */}
        <div className="bg-white rounded-3xl border border-slate-100/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-800 text-[16px]">
              Recent Orders
            </h3>
            <Link
              href="/account/orders"
              className="text-xs font-black text-[#005AA9] hover:underline flex items-center gap-0.5"
            >
              <span>View all orders</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {displayOrders.map((order) => {
              const statusClass =
                order.status === "delivered"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : order.status === "shipped"
                  ? "bg-blue-50 text-blue-600 border-blue-100"
                  : "bg-[#e8f3ff] text-[#005AA9] border-[#d2e7ff]";

              const formattedPrice = order.price.startsWith("$")
                ? `₹${(parseFloat(order.price.replace("$", "")) * 80).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : order.price;

              return (
                <div
                  key={order.id}
                  className="py-4 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-12 w-12 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={order.image}
                        alt={order.productName}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight truncate">
                        Order #{order.orderNumber}
                      </h4>
                      <p className="text-slate-400 text-[10px] font-bold mt-1">
                        {order.date} · {formattedPrice}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusClass}`}
                    >
                      {order.status}
                    </span>
                    <Link href="/account/orders" className="text-slate-400 hover:text-slate-600 shrink-0">
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Grid Menu */}
        <div className="grid grid-cols-2 gap-4">
          {/* Orders Card */}
          <Link
            href="/account/orders"
            className="bg-white rounded-2xl border border-slate-100/80 shadow-sm p-4 flex flex-col justify-between min-h-[120px] hover:border-slate-200 transition-colors"
          >
            <div className="flex items-start justify-between w-full">
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#005AA9] flex items-center justify-center shrink-0">
                <ShoppingBag className="h-4.5 w-4.5" />
              </div>
              <ChevronRight className="h-4.5 w-4.5 text-slate-300" />
            </div>
            <div className="mt-3">
              <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight">
                Orders
              </h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                Track & view your orders
              </p>
            </div>
          </Link>

          {/* Wishlist Card */}
          <Link
            href="/account/wishlist"
            className="bg-white rounded-2xl border border-slate-100/80 shadow-sm p-4 flex flex-col justify-between min-h-[120px] hover:border-slate-200 transition-colors relative"
          >
            <div className="flex items-start justify-between w-full">
              <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <Heart className="h-4.5 w-4.5 fill-rose-500 text-rose-500" />
              </div>
              
              <div className="flex items-center gap-1.5">
                {wishlistCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#005AA9] px-1 text-[10px] font-black text-white">
                    {wishlistCount}
                  </span>
                )}
                <ChevronRight className="h-4.5 w-4.5 text-slate-300" />
              </div>
            </div>
            <div className="mt-3">
              <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight">
                Wishlist
              </h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                View your saved items
              </p>
            </div>
          </Link>

          {/* Addresses Card */}
          <Link
            href="/account/addresses"
            className="bg-white rounded-2xl border border-slate-100/80 shadow-sm p-4 flex flex-col justify-between min-h-[120px] hover:border-slate-200 transition-colors"
          >
            <div className="flex items-start justify-between w-full">
              <div className="h-9 w-9 rounded-xl bg-[#e6f7ed] text-emerald-600 flex items-center justify-center shrink-0">
                <MapPin className="h-4.5 w-4.5" />
              </div>
              <ChevronRight className="h-4.5 w-4.5 text-slate-300" />
            </div>
            <div className="mt-3">
              <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight">
                Addresses
              </h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                Manage your addresses
              </p>
            </div>
          </Link>

          {/* Profile Card */}
          <Link
            href="/account/profile"
            className="bg-white rounded-2xl border border-slate-100/80 shadow-sm p-4 flex flex-col justify-between min-h-[120px] hover:border-slate-200 transition-colors"
          >
            <div className="flex items-start justify-between w-full">
              <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <ChevronRight className="h-4.5 w-4.5 text-slate-300" />
            </div>
            <div className="mt-3">
              <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight">
                Profile
              </h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                View & edit your information
              </p>
            </div>
          </Link>

          {/* Reviews Card */}
          <Link
            href="/account/reviews"
            className="bg-white rounded-2xl border border-slate-100/80 shadow-sm p-4 flex flex-col justify-between min-h-[120px] hover:border-slate-200 transition-colors"
          >
            <div className="flex items-start justify-between w-full">
              <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <Star className="h-4.5 w-4.5 fill-amber-500 text-amber-500" />
              </div>
              <ChevronRight className="h-4.5 w-4.5 text-slate-300" />
            </div>
            <div className="mt-3">
              <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight">
                Reviews
              </h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                Manage your reviews
              </p>
            </div>
          </Link>

          {/* Reset Password Card */}
          <Link
            href="/account/security"
            className="bg-white rounded-2xl border border-slate-100/80 shadow-sm p-4 flex flex-col justify-between min-h-[120px] hover:border-slate-200 transition-colors"
          >
            <div className="flex items-start justify-between w-full">
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#005AA9] flex items-center justify-center shrink-0">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <ChevronRight className="h-4.5 w-4.5 text-slate-300" />
            </div>
            <div className="mt-3">
              <h4 className="font-extrabold text-slate-800 text-[13px] leading-tight">
                Reset Password
              </h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                Change your password
              </p>
            </div>
          </Link>
        </div>

        {/* Logout Row */}
        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-2xl border border-slate-100/80 shadow-sm p-4 flex items-center justify-between hover:bg-rose-50 group transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 group-hover:bg-rose-100 transition-colors">
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="font-extrabold text-rose-600 text-[14px]">
              Logout
            </span>
          </div>
          <ChevronRight className="h-4.5 w-4.5 text-slate-300 group-hover:text-rose-500 transition-colors" />
        </button>
      </div>
    </div>
  );
}
