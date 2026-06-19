"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { items, subtotal, discount, shipping, total } = useAppSelector(
    (state) => state.cart
  );

  const [couponCode, setCouponCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const cartCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const handleQuantityChange = (
    productId: string,
    currentQty: number,
    delta: number
  ) => {
    const newQty = currentQty + delta;

    if (newQty < 1) return;

    dispatch(
      updateQuantity({
        productId,
        quantity: newQty,
      })
    );
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setPromoApplied(true);
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);

    setTimeout(() => {
      router.push("/checkout");
    }, 300);
  };

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <div className="min-h-screen bg-slate-50/50 md:py-20 py-8">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-teal-600">
            Home
          </Link>
          <span>›</span>
          <span className="font-semibold text-slate-800">Cart</span>
        </nav>

        <h1 className="text-3xl font-black text-[#002244] mb-10">
          Shopping Cart ({cartCount})
        </h1>

        <AnimatePresence mode="wait">

          {/* EMPTY STATE */}
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl p-12 border shadow-xl flex flex-col items-center text-center max-w-xl mx-auto"
            >
              <ShoppingBag className="w-12 h-12 text-slate-400 mb-4" />

              <h2 className="text-xl font-bold text-[#002244]">
                Your cart is empty
              </h2>

              <p className="text-slate-500 mt-2">
                Add products to continue shopping
              </p>

              <Link
                href="/shop"
                className="mt-6 inline-flex items-center gap-2 bg-[#005AA9] text-white px-6 py-3 rounded-full font-semibold"
              >
                Start Shopping <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >

              {/* LEFT: ITEMS */}
              <div className="lg:col-span-8 space-y-4">

                {items.map((item) => (
                  <motion.div
                    layout
                    key={item.product.id}
                    className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-5 rounded-2xl border shadow-sm"
                  >
                    {/* PRODUCT */}
                    <div className="flex gap-4 flex-1">
                      <div className="relative w-20 h-20 bg-slate-50 rounded-xl overflow-hidden">
                        <Image
                          src={
                            item.product.images[0] ||
                            "/images/placeholder.png"
                          }
                          alt={item.product.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 uppercase">
                          {item.product.brand}
                        </p>

                        <Link
                          href={`/product/${item.product.id}`}
                          className="font-bold text-[#002244] hover:text-[#005AA9]"
                        >
                          {item.product.name}
                        </Link>

                        <p className="text-xs text-slate-400">
                          SKU: {item.product.sku}
                        </p>
                      </div>
                    </div>

                    {/* CONTROLS */}
                    <div className="flex items-center gap-6">

                      {/* Qty */}
                      <div className="flex items-center border rounded-full p-1 bg-slate-50">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product.id,
                              item.quantity,
                              -1
                            )
                          }
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="px-3 font-bold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product.id,
                              item.quantity,
                              1
                            )
                          }
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* PRICE */}
                      <div className="text-right">
                        <p className="font-bold text-[#002244]">
                          {formatPrice(
                            item.product.price * item.quantity
                          )}
                        </p>
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          dispatch(removeFromCart(item.product.id))
                        }
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </motion.div>
                ))}
              </div>

              {/* RIGHT: SUMMARY */}
              <div className="lg:col-span-4">

                <div className="bg-white p-6 rounded-3xl border shadow-lg">

                  <h2 className="font-bold text-lg mb-5">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-sm">

                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0
                          ? "Free"
                          : formatPrice(shipping)}
                      </span>
                    </div>

                  </div>

                  {/* COUPON */}
                  <form
                    onSubmit={handleApplyCoupon}
                    className="flex gap-2 mt-5"
                  >
                    <input
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value)
                      }
                      placeholder="Promo code"
                      disabled={promoApplied}
                      className="flex-1 border rounded-xl px-3 py-2 text-sm"
                    />

                    <button
                      disabled={promoApplied}
                      className="px-4 bg-black text-white rounded-xl text-sm"
                    >
                      {promoApplied ? "Applied" : "Apply"}
                    </button>
                  </form>

                  {/* TOTAL */}
                  <div className="flex justify-between mt-6 pt-4 border-t font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  {/* CHECKOUT */}
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="mt-6 w-full bg-[#005AA9] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    {isCheckingOut
                      ? "Redirecting..."
                      : "Proceed to Checkout"}
                  </button>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}