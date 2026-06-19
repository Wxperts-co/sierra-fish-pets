"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import { Lock, CreditCard, Truck, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, shipping, total } = useAppSelector(
    (state) => state.cart
  );

  const [step, setStep] = useState<"shipping" | "payment" | "review">(
    "shipping"
  );

  const [loading, setLoading] = useState(false);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const handlePlaceOrder = async () => {
    setLoading(true);

    // simulate API call (replace with backend later)
    setTimeout(() => {
      setLoading(false);
      router.push("/order-success");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT: FORM */}
        <div className="lg:col-span-8 space-y-6">

          {/* STEPS HEADER */}
          <div className="flex items-center gap-3 text-sm font-medium">
            <span
              className={`px-3 py-1 rounded-full ${
                step === "shipping"
                  ? "bg-black text-white"
                  : "bg-white border"
              }`}
            >
              Shipping
            </span>

            <span>→</span>

            <span
              className={`px-3 py-1 rounded-full ${
                step === "payment"
                  ? "bg-black text-white"
                  : "bg-white border"
              }`}
            >
              Payment
            </span>

            <span>→</span>

            <span
              className={`px-3 py-1 rounded-full ${
                step === "review"
                  ? "bg-black text-white"
                  : "bg-white border"
              }`}
            >
              Review
            </span>
          </div>

          {/* SHIPPING STEP */}
          {step === "shipping" && (
            <div className="bg-white p-6 rounded-2xl border space-y-4">
              <h2 className="font-bold flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Shipping Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="border p-3 rounded-xl" placeholder="First name" />
                <input className="border p-3 rounded-xl" placeholder="Last name" />
                <input className="border p-3 rounded-xl md:col-span-2" placeholder="Address" />
                <input className="border p-3 rounded-xl" placeholder="City" />
                <input className="border p-3 rounded-xl" placeholder="Pincode" />
                <input className="border p-3 rounded-xl md:col-span-2" placeholder="Phone number" />
              </div>

              <button
                onClick={() => setStep("payment")}
                className="w-full bg-black text-white py-3 rounded-xl font-semibold"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* PAYMENT STEP */}
          {step === "payment" && (
            <div className="bg-white p-6 rounded-2xl border space-y-4">
              <h2 className="font-bold flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Method
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 border p-3 rounded-xl">
                  <input type="radio" name="payment" defaultChecked />
                  Credit / Debit Card
                </label>

                <label className="flex items-center gap-3 border p-3 rounded-xl">
                  <input type="radio" name="payment" />
                  UPI / Razorpay
                </label>

                <label className="flex items-center gap-3 border p-3 rounded-xl">
                  <input type="radio" name="payment" />
                  Cash on Delivery
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("shipping")}
                  className="w-full border py-3 rounded-xl"
                >
                  Back
                </button>

                <button
                  onClick={() => setStep("review")}
                  className="w-full bg-black text-white py-3 rounded-xl font-semibold"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* REVIEW STEP */}
          {step === "review" && (
            <div className="bg-white p-6 rounded-2xl border space-y-5">
              <h2 className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Review Order
              </h2>

              {/* ITEMS */}
              <div className="space-y-3 max-h-60 overflow-auto">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                      <span>{item.product.name}</span>
                    </div>

                    <span>
                      {item.quantity} × {formatPrice(item.product.price)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("payment")}
                  className="w-full border py-3 rounded-xl"
                >
                  Back
                </button>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-[#005AA9] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {loading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl border sticky top-10">
            <h2 className="font-bold mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
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
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <p className="text-xs text-slate-500 mt-4 flex items-center gap-2">
              <Lock className="w-3 h-3" />
              Secure checkout powered by encryption
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}