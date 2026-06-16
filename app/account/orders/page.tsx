"use client";

import Link from "next/link";
import { ShoppingBag, Package } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { orders } from "@/data";
import OrderCard from "@/components/account/OrderCard";
import AccountHeader from "@/components/account/AccountHeader";

export default function OrdersPage() {
  const { user } = useAppSelector((state) => state.auth);

  // Filter orders by current user or mock usr-001 for showcase
  const userOrders = orders
    .filter((o) => o.userId === user?.id || o.userId === "usr-001")
    .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 md:p-8 font-lato space-y-6">
      <AccountHeader
        title="Order History"
        description="Review and track all your past and active orders."
        icon={<ShoppingBag className="h-6 w-6 text-primary" />}
      />

      {userOrders.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-slate-200 rounded-2xl">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-800 mb-1">
            No orders found
          </h3>
          <p className="text-slate-500 mb-6 text-sm font-medium">
            Looks like you haven&apos;t placed any orders yet.
          </p>
          <Link
            href="/shop"
            className="px-6 py-2.5 rounded-xl bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] text-white font-bold transition-opacity hover:opacity-95"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <OrderCard key={order.id} order={order as any} />
          ))}
        </div>
      )}
    </div>
  );
}
