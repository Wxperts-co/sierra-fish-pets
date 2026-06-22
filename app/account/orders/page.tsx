"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ShoppingBag, Package, RefreshCw } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import OrderCard from "@/components/account/OrderCard";
import AccountHeader from "@/components/account/AccountHeader";

export default function OrdersPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("/api/orders");
        if (response.data.success) {
          setDbOrders(response.data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch database orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  // Get database orders sorted by placed date descending
  const userOrders = React.useMemo(() => {
    return [...dbOrders].sort(
      (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
    );
  }, [dbOrders]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col items-center justify-center min-h-[350px]">
        <RefreshCw className="h-8 w-8 text-[#005AA9] animate-spin" />
        <p className="text-slate-500 font-bold text-sm mt-3 animate-pulse">Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 font-lato space-y-6">
      <AccountHeader
        title="Order History"
        description="Review and track all your past and active orders."
        icon={<ShoppingBag className="h-6 w-6 text-[#005AA9]" />}
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
            className="px-6 py-2.5 rounded-xl bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] text-white font-bold transition-all hover:opacity-90 inline-block text-center shadow-md shadow-blue-500/15"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <OrderCard key={order.id || order._id} order={order as any} />
          ))}
        </div>
      )}
    </div>
  );
}
