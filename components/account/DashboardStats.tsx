import React from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Star, MapPin, ArrowRight } from "lucide-react";

interface DashboardStatsProps {
  totalOrdersCount: number;
  wishlistCount: number;
  reviewsCount: number;
  addressCount: number;
}

export default function DashboardStats({
  totalOrdersCount,
  wishlistCount,
  reviewsCount,
  addressCount,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* Total Orders */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-[#e6f0fa] text-[#005AA9] flex items-center justify-center shrink-0">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              Total Orders
            </p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">
              {totalOrdersCount}
            </h3>
          </div>
        </div>
        <Link
          href="/account/orders"
          className="mt-6 text-xs font-black text-[#005AA9] hover:underline flex items-center gap-1"
        >
          <span>View all orders</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Wishlist Items */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-[#fdf2f4] text-rose-500 flex items-center justify-center shrink-0">
            <Heart className="h-7 w-7" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              Wishlist Items
            </p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">
              {wishlistCount}
            </h3>
          </div>
        </div>
        <Link
          href="/account/wishlist"
          className="mt-6 text-xs font-black text-[#005AA9] hover:underline flex items-center gap-1"
        >
          <span>View wishlist</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-[#f0f9f1] text-emerald-600 flex items-center justify-center shrink-0">
            <Star className="h-7 w-7" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              Reviews
            </p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">
              {reviewsCount}
            </h3>
          </div>
        </div>
        <Link
          href="/account/reviews"
          className="mt-6 text-xs font-black text-[#005AA9] hover:underline flex items-center gap-1"
        >
          <span>View reviews</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Saved Addresses */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-[#f3effb] text-[#7c3aed] flex items-center justify-center shrink-0">
            <MapPin className="h-7 w-7" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              Saved Addresses
            </p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">
              {addressCount}
            </h3>
          </div>
        </div>
        <Link
          href="/account/addresses"
          className="mt-6 text-xs font-black text-[#005AA9] hover:underline flex items-center gap-1"
        >
          <span>Manage addresses</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
