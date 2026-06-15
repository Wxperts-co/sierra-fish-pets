"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { removeFromCart, updateQuantity } from "@/store/slices/cartSlice";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Lock,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, subtotal, discount, shipping, total } = useAppSelector(
    (state) => state.cart
  );

  const [couponCode, setCouponCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const handleQuantityChange = (productId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty >= 1) {
      dispatch(updateQuantity({ productId, quantity: newQty }));
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      setPromoApplied(true);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <nav
          aria-label="breadcrumb"
          className="flex flex-wrap items-center gap-0.5 text-sm font-medium text-slate-500 mb-8"
        >
          <span className="flex items-center gap-0.5">
            <Link
              href="/"
              className="text-slate-500 transition-colors duration-150 hover:text-teal-600 hover:underline"
            >
              Home
            </Link>
            <span className="px-0.5 text-slate-400"> › </span>
          </span>
          <span className="flex items-center gap-0.5">
            <span className="font-bold text-[#0d1b2a]">Shopping Cart</span>
          </span>
        </nav>

        <h1 className="text-3xl font-black text-[#002244] mb-10">
          Shopping Cart
        </h1>

        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl p-12 border border-slate-100 shadow-xl shadow-slate-100/30 flex flex-col items-center text-center max-w-xl mx-auto"
            >
              <div className="p-5 bg-sky-50 rounded-2xl mb-6">
                <ShoppingBag className="w-12 h-12 text-[#005AA9]" />
              </div>
              <h2 className="text-2xl font-bold text-[#002244] mb-3">
                Your cart is empty
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                Looks like you haven&apos;t added anything to your cart yet. Explore our high-quality pet supplies to get started!
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#005AA9] hover:bg-[#003d73] text-white px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-[1.03] shadow-md shadow-[#005AA9]/10"
              >
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left: Cart Items */}
              <div className="lg:col-span-8 space-y-4">
                {items.map((item) => (
                  <motion.div
                    layout
                    key={item.product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-100/20 gap-4"
                  >
                    {/* Product Image & Title */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative w-20 h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                        <Image
                          src={item.product.images[0] || "/images/placeholder.png"}
                          alt={item.product.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          {item.product.brand}
                        </span>
                        <h3 className="font-bold text-[#002244] text-base hover:text-[#005AA9] transition-colors line-clamp-2">
                          <Link href={`/product/${item.product.id}`}>
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="text-slate-500 text-xs mt-1">
                          SKU: {item.product.sku}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls & Price */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-8 shrink-0">
                      {/* Qty Selector */}
                      <div className="flex items-center border border-slate-200 rounded-full p-1 bg-slate-50/50">
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity, -1)}
                          className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-600 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3.5 text-sm font-bold text-[#002244] select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity, 1)}
                          className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-600 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item Total Price */}
                      <div className="text-right">
                        <p className="font-extrabold text-[#002244] text-base">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-slate-400 text-xs mt-0.5">
                            {formatPrice(item.product.price)} each
                          </p>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => dispatch(removeFromCart(item.product.id))}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all cursor-pointer shrink-0"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Right: Summary */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/30 p-6">
                  <h2 className="text-lg font-bold text-[#002244] border-b border-slate-100 pb-4 mb-5">
                    Order Summary
                  </h2>

                  <div className="space-y-4 text-sm font-medium mb-6">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span className="text-[#002244] font-bold">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount</span>
                        <span className="font-bold">-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-500">
                      <span>Shipping</span>
                      <span className="text-emerald-600 font-bold">
                        {shipping === 0 ? "Free" : formatPrice(shipping)}
                      </span>
                    </div>
                  </div>

                  {/* Coupon Form */}
                  <form onSubmit={handleApplyCoupon} className="mb-6 flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Promo code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={promoApplied}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 text-slate-800 placeholder:text-slate-400 text-sm rounded-xl border border-slate-100 focus:border-sky-300 outline-none transition-all font-medium disabled:opacity-60"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={promoApplied}
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
                    >
                      {promoApplied ? "Applied" : "Apply"}
                    </button>
                  </form>

                  {/* Total */}
                  <div className="border-t border-slate-100 pt-5 mb-8 flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">
                        Total Amount
                      </p>
                      <p className="text-2xl font-black text-[#002244] leading-none">
                        {formatPrice(total)}
                      </p>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => alert("Checkout functionality coming soon!")}
                    className="w-full flex items-center justify-center gap-2 bg-[#005AA9] hover:bg-[#003d73] text-white py-4 rounded-full font-bold text-sm transition-all hover:scale-[1.02] shadow-md shadow-[#005AA9]/10 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    Secure Checkout
                  </button>
                </div>

                {/* Additional Info */}
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 text-center">
                  <p className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    100% Safe & Secure Payments
                  </p>
                  <p className="text-slate-400 text-[10px] leading-relaxed mt-2">
                    We accept Credit Cards, PayPal, and Debit Cards. All transaction information is protected by industry-standard encryption.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
