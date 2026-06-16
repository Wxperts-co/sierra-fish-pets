"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  MapPin,
  FileText,
} from "lucide-react";
import { Order } from "@/types";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const itemQuantity = order.items.reduce((acc, item) => acc + item.quantity, 0);
  const placedDate = new Date(order.placedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "shipped":
        return "bg-cyan-50 text-cyan-600 border-cyan-100";
      case "processing":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "pending":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "cancelled":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div
      className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
        isExpanded ? "border-primary/30 shadow-md" : "border-slate-100 shadow-sm"
      }`}
    >
      {/* Summary Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-slate-50/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              Order Number
            </p>
            <p className="font-extrabold text-slate-800">#{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Date Placed
            </p>
            <p className="font-bold text-slate-700 text-sm">{placedDate}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> Total
            </p>
            <p className="font-black text-slate-800">${order.total.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              Status
            </p>
            <span
              className={`inline-block border text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${getStatusBadgeClass(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
          <button className="text-sm font-bold text-primary flex items-center gap-1 cursor-pointer">
            <span>{isExpanded ? "Hide Details" : "View Details"}</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Details Panel */}
      {isExpanded && (
        <div className="p-6 border-t border-slate-100 bg-white space-y-6">
          {/* Items List */}
          <div className="space-y-4">
            <h4 className="font-black text-slate-800 text-base flex items-center gap-2 pb-2 border-b border-slate-100">
              <Package className="h-4.5 w-4.5 text-slate-400" />
              <span>Items Ordered ({itemQuantity})</span>
            </h4>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="py-4 flex items-start gap-4 first:pt-0 last:pb-0"
                >
                  <div className="relative h-16 w-16 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      sizes="64px"
                      className="object-contain p-1.5"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-slate-800 text-sm truncate hover:text-primary transition-colors">
                      {item.productName}
                    </h5>
                    <p className="text-slate-400 text-xs font-semibold mt-0.5">
                      SKU: {item.sku}
                    </p>
                    <p className="text-slate-500 text-xs font-bold mt-1">
                      Qty: {item.quantity} • ${item.unitPrice.toFixed(2)} each
                    </p>
                  </div>
                  <div className="text-right font-black text-slate-800 text-sm">
                    ${item.totalPrice.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-6">
            {/* Shipping & Delivery Info */}
            <div className="space-y-4">
              {/* Delivery Address */}
              <div className="space-y-2">
                <h4 className="font-black text-slate-800 text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>Shipping Destination</span>
                </h4>
                <p className="text-slate-600 text-sm font-semibold leading-relaxed pl-6">
                  <span className="block font-extrabold text-slate-800">
                    {order.shippingAddress.fullName}
                  </span>
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                  <span className="block">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </span>
                  <span className="block text-xs text-slate-400">{order.shippingAddress.country}</span>
                </p>
              </div>

              {/* Tracking details */}
              {order.trackingNumber && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-black text-slate-800 text-sm flex items-center gap-2">
                    <Truck className="h-4 w-4 text-slate-400" />
                    <span>Tracking Details</span>
                  </h4>
                  <p className="text-slate-600 text-sm font-semibold pl-6">
                    Tracking No: <span className="font-black text-slate-800 select-all">{order.trackingNumber}</span>
                    {order.estimatedDelivery && (
                      <span className="block mt-1 text-xs text-slate-400">
                        Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric"
                        })}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Payment & Calculations summary */}
            <div className="space-y-4">
              <h4 className="font-black text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <span>Receipt Summary</span>
              </h4>
              <div className="space-y-2 text-sm font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-800">${order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-slate-800">
                    {order.shippingCost === 0 ? "FREE" : `$${order.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 font-black text-base text-slate-800">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="pt-2 text-xs text-slate-400 text-right">
                  Paid via {order.paymentMethod.replace("_", " ").toUpperCase()} • Status: {order.paymentStatus.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
