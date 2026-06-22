"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import {
  CheckCircle2,
  Calendar,
  Truck,
  MapPin,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams ? searchParams.get("id") : null;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided.");
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`/api/orders?id=${orderId}`);
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError(response.data.message || "Failed to load order details.");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Something went wrong fetching order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Credit Card";
      case "debit_card":
        return "Debit Card";
      case "paypal":
        return "PayPal / UPI";
      case "cash_on_delivery":
        return "Cash on Delivery";
      default:
        return method.replace(/_/g, " ").toUpperCase();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#005AA9] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-extrabold text-sm tracking-wide">Retrieving order receipt...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-rose-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-[#002244]">Receipt Error</h1>
            <p className="text-slate-500 text-sm">{error || "Could not retrieve order details."}</p>
          </div>
          <Link
            href="/shop"
            className="w-full inline-flex items-center justify-center bg-[#005AA9] hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold transition-all gap-2"
          >
            Go to Shop
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const placedDate = new Date(order.placedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] md:py-24 py-10 font-lato">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* SUCCESS HERO HEADER */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20"
          >
            <CheckCircle2 className="w-12 h-12 stroke-[2px]" />
          </motion.div>

          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-[#002244] tracking-tight">Order Placed Successfully!</h1>
            <p className="text-slate-500 font-bold text-sm md:text-base">
              Thank you for shopping with Sierra Fish & Pets. Your order has been registered.
            </p>
          </div>
        </div>

        {/* ORDER DETAILS SUMMARY CARD */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-wider">Order Number</p>
              <h2 className="text-xl md:text-2xl font-black tracking-wide text-cyan-300">#{order.orderNumber}</h2>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-wider">Order Date</p>
                <p className="text-sm font-bold mt-1 text-slate-100">{placedDate}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-wider">Order Total</p>
                <p className="text-sm font-black mt-1 text-emerald-400 font-mono">{formatPrice(order.total)}</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Steps & Logistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Est. Delivery */}
              <div className="flex gap-3.5 items-start">
                <div className="w-10 h-10 bg-blue-50 text-[#005AA9] rounded-xl flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Estimated Delivery</h4>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {order.estimatedDelivery
                      ? new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Pending"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">3 - 5 business days shipping</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="flex gap-3.5 items-start">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Shipping To</h4>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{order.shippingAddress.fullName}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="flex gap-3.5 items-start">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Payment Details</h4>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{getPaymentMethodLabel(order.paymentMethod)}</p>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-0.5">
                    Status: <span className="font-bold text-emerald-600">{order.paymentStatus}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Product Items Summary */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <ShoppingBag className="w-4.5 h-4.5 text-slate-400" />
                <span>Items Placed in Order ({order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)})</span>
              </h3>

              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden px-4 bg-slate-50/20">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="py-4 flex items-center gap-4">
                    <div className="relative w-12 h-12 bg-white border border-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                      <Image
                        src={item.productImage || "/images/placeholder.png"}
                        alt={item.productName}
                        width={40}
                        height={40}
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-xs text-slate-800 truncate">{item.productName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">SKU: {item.sku || "N/A"}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-extrabold text-slate-800 font-mono">
                        {item.quantity} × {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-slate-100 pt-6 max-w-sm ml-auto space-y-2.5 text-xs font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-800 font-mono">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                  <span className="font-mono">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-slate-800 font-mono">
                  {order.shippingCost === 0 ? "FREE" : formatPrice(order.shippingCost)}
                </span>
              </div>
              <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between font-black text-slate-800 text-sm">
                <span>Total Paid</span>
                <span className="text-slate-900 font-mono text-base">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/account/orders"
            className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-md text-center text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Order History</span>
            <ArrowRight className="w-4.5 h-4.5" />
          </Link>
          <Link
            href="/shop"
            className="px-8 py-3.5 border border-slate-200 text-slate-700 bg-white font-bold rounded-2xl hover:bg-slate-50 transition-all text-center text-sm cursor-pointer"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#005AA9] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-500 font-extrabold text-sm tracking-wide">Loading confirmation details...</p>
          </div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
