"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import {
  Lock,
  CreditCard,
  Truck,
  CheckCircle2,
  MapPin,
  User,
  Phone,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Plus,
  BadgePercent,
  ShoppingBag,
  HelpCircle,
  Sparkles,
  Info,
  Check,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { openLoginModal } from "@/store/slices/authModalSlice";
import { showErrorToast } from "@/lib/toast";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Redux cart & auth states
  const { items, subtotal, discount: initialDiscount, shipping: initialShipping, total: initialTotal } = useAppSelector(
    (state) => state.cart
  );
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Stepper state: "shipping" | "payment" | "review"
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping");
  const [loading, setLoading] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Billing / Shipping inputs
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [shippingDetails, setShippingDetails] = useState({
    email: "",
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [useCustomAddress, setUseCustomAddress] = useState(false);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "cash_on_delivery" | "paypal">("credit_card");


  // Delivery Notes
  const [orderNotes, setOrderNotes] = useState("");

  // Populate form with default user data or address on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      // Find default address
      const defaultAddr = user.addresses?.find((a) => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        setShippingDetails({
          email: user.email || "",
          fullName: defaultAddr.fullName,
          phone: defaultAddr.phone,
          address: defaultAddr.address,
          city: defaultAddr.city,
          state: defaultAddr.state,
          zipCode: defaultAddr.zipCode,
          country: defaultAddr.country || "United States",
        });
        setUseCustomAddress(false);
      } else if (user.addresses && user.addresses.length > 0) {
        setSelectedAddressId(user.addresses[0].id);
        setShippingDetails({
          email: user.email || "",
          fullName: user.addresses[0].fullName,
          phone: user.addresses[0].phone,
          address: user.addresses[0].address,
          city: user.addresses[0].city,
          state: user.addresses[0].state,
          zipCode: user.addresses[0].zipCode,
          country: user.addresses[0].country || "United States",
        });
        setUseCustomAddress(false);
      } else {
        // Logged in but no saved addresses
        setShippingDetails({
          email: user.email || "",
          fullName: user.name || "",
          phone: user.phone || "",
          address: user.address || "",
          city: user.city || "",
          state: user.state || "",
          zipCode: user.zipCode || "",
          country: user.country || "United States",
        });
        setUseCustomAddress(true);
      }
    } else {
      // Guest user
      setShippingDetails({
        email: "",
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
      });
      setUseCustomAddress(true);
    }
  }, [user, isAuthenticated]);

  // Handle Saved Address Selection
  const handleSelectSavedAddress = (id: string) => {
    setSelectedAddressId(id);
    const addr = user?.addresses?.find((a) => a.id === id);
    if (addr) {
      setShippingDetails({
        email: user?.email || "",
        fullName: addr.fullName,
        phone: addr.phone,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zipCode,
        country: addr.country || "United States",
      });
    }
    setUseCustomAddress(false);
  };

  // Form Validation
  const validateShippingForm = () => {
    const { email, fullName, phone, address, city, state, zipCode } = shippingDetails;
    if (!email || !email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email address.";
    if (!fullName.trim()) return "Please enter full name.";
    if (!phone.trim()) return "Please enter phone number.";
    if (!address.trim()) return "Please enter street address.";
    if (!city.trim()) return "Please enter city.";
    if (!state.trim()) return "Please enter state.";
    if (!zipCode.trim()) return "Please enter pincode/zipcode.";
    return null;
  };

  const handleContinueToPayment = () => {
    const error = validateShippingForm();
    if (error) {
      showErrorToast(error);
      return;
    }
    setStep("review");
  };



  // Price Calculations
  const calculatedShippingCost = useMemo(() => {
    // If subtotal is greater than 49, shipping is free
    return subtotal > 49 ? 0 : 0;
  }, [subtotal]);

  const finalTotal = useMemo(() => {
    const discountAmount = initialDiscount + couponDiscount;
    const finalVal = subtotal - discountAmount + calculatedShippingCost;
    return finalVal < 0 ? 0 : finalVal;
  }, [subtotal, initialDiscount, couponDiscount, calculatedShippingCost]);

  // Apply Coupon Handler
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    // Simulated coupon validation rules
    if (code === "WELCOME10") {
      if (subtotal >= 30) {
        setAppliedCoupon("WELCOME10");
        setCouponDiscount(Number((subtotal * 0.1).toFixed(2)));
        setCouponCode("");
      } else {
        showErrorToast("Minimum purchase of $30 required for WELCOME10.");
      }
    } else if (code === "FREESHIP") {
      if (subtotal >= 49) {
        setAppliedCoupon("FREESHIP");
        setCouponDiscount(calculatedShippingCost);
        setCouponCode("");
      } else {
        showErrorToast("Minimum purchase of $49 required for FREESHIP.");
      }
    } else if (code === "PETLOVE20") {
      if (subtotal >= 100) {
        setAppliedCoupon("PETLOVE20");
        setCouponDiscount(20);
        setCouponCode("");
      } else {
        showErrorToast("Minimum purchase of $100 required for PETLOVE20.");
      }
    } else {
      showErrorToast("Invalid or expired promo code.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  // Place Order Action (MongoDB integration)
  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      showErrorToast("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        items,
        shippingAddress: {
          fullName: shippingDetails.fullName,
          phone: shippingDetails.phone,
          addressLine1: shippingDetails.address,
          addressLine2: "",
          city: shippingDetails.city,
          state: shippingDetails.state,
          zipCode: shippingDetails.zipCode,
          country: shippingDetails.country,
        },
        paymentMethod: paymentMethod === "credit_card" ? "credit_card" : paymentMethod === "paypal" ? "paypal" : "cash_on_delivery",
        subtotal,
        discount: initialDiscount + couponDiscount,
        shippingCost: calculatedShippingCost,
        total: finalTotal,
        couponCode: appliedCoupon || undefined,
        notes: orderNotes || undefined,
        guestEmail: shippingDetails.email,
        guestPhone: shippingDetails.phone,
      };

      const response = await axios.post("/api/orders", orderPayload);
      // Replace lines 288-295 with:
      if (response.data.success) {
        // Clear Redux Cart
        dispatch(clearCart());

        if (response.data.checkoutUrl) {
          // Redirect user to Stripe Checkout page
          window.location.href = response.data.checkoutUrl;
        } else {
          // Redirect directly for cash_on_delivery or other methods
          router.push(`/order-success?id=${response.data.order.id}`);
        }
      } else {
        showErrorToast(response.data.message || "Failed to place order.");
      }

    } catch (err: any) {
      console.error(err);
      showErrorToast(err.response?.data?.message || "Something went wrong while placing order.");
    } finally {
      setLoading(false);
    }
  };

  // Format Prices
  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);



  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-[#005AA9]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-[#002244]">Your cart is empty</h1>
            <p className="text-slate-500 text-sm">Please add items to your cart before proceeding to checkout.</p>
          </div>
          <Link
            href="/shop"
            className="w-full inline-flex items-center justify-center bg-[#005AA9] hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold transition-all gap-2"
          >
            Start Shopping
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] md:py-24 py-8 font-lato">
      <div className="max-w-6xl mx-auto px-4 mt-8">

        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#005AA9] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopping Cart</span>
          </Link>

        </div>

        {/* STEPPER COMPONENT */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-2">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step === "shipping"
                  ? "bg-[#005AA9] text-white ring-4 ring-blue-100"
                  : "bg-emerald-500 text-white"
                  }`}
              >
                {step !== "shipping" ? <Check className="w-4.5 h-4.5 stroke-[3px]" /> : "1"}
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Step 1</p>
                <p className={`text-sm font-black ${step === "shipping" ? "text-[#005AA9]" : "text-slate-800"}`}>
                  Address
                </p>
              </div>
            </div>

            <div className="hidden sm:block flex-1 h-0.5 bg-slate-100 mx-4" />

            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step === "review"
                  ? "bg-[#005AA9] text-white ring-4 ring-blue-100"
                  : step === "payment"
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
              >
                {step === "payment" ? <Check className="w-4.5 h-4.5 stroke-[3px]" /> : "2"}
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Step 2</p>
                <p className={`text-sm font-black ${step === "review" ? "text-[#005AA9]" : step === "payment" ? "text-slate-800" : "text-slate-400"}`}>
                  Summary
                </p>
              </div>
            </div>

            <div className="hidden sm:block flex-1 h-0.5 bg-slate-100 mx-4" />

            {/* Step 3 */}
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step === "payment"
                  ? "bg-[#005AA9] text-white ring-4 ring-blue-100"
                  : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
              >
                3
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Step 3</p>
                <p className={`text-sm font-black ${step === "payment" ? "text-[#005AA9]" : "text-slate-400"}`}>
                  Payment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: STEP PANELS (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">

              {/* STEP 1: SHIPPING DETAILS */}
              {step === "shipping" && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/40 p-6 md:p-8 space-y-6"
                >
                  <div className="border-b border-slate-50 pb-4">
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[#005AA9]" />
                      Shipping Destinations
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Specify where you would like your order delivered.</p>
                  </div>

                  {/* SAVED ADDRESS SELECTOR */}
                  {isAuthenticated && user && user.addresses && user.addresses.length > 0 && (
                    <div className="space-y-4">
                      <p className="text-sm font-bold text-slate-700">Choose from Saved Addresses</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {user.addresses.map((addr) => {
                          const isSelected = selectedAddressId === addr.id && !useCustomAddress;
                          return (
                            <div
                              key={addr.id}
                              onClick={() => handleSelectSavedAddress(addr.id)}
                              className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 hover:shadow-md relative ${isSelected
                                ? "border-[#005AA9] bg-blue-50/20 ring-2 ring-blue-500/10"
                                : "border-slate-100 bg-slate-50/30 hover:border-slate-300"
                                }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-[#005AA9]/10 text-[#005AA9] uppercase">
                                  {addr.label || "Home"}
                                </span>
                                {addr.isDefault && (
                                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="font-extrabold text-slate-800 text-sm">{addr.fullName}</p>
                              <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                                {addr.address}, {addr.city}, {addr.state} {addr.zipCode}
                              </p>
                              <p className="text-xs text-slate-500 font-bold mt-2">{addr.phone}</p>

                              {isSelected && (
                                <div className="absolute top-4 right-4 w-5 h-5 bg-[#005AA9] text-white rounded-full flex items-center justify-center">
                                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Add / Ship to custom address trigger */}
                        <div
                          onClick={() => {
                            setUseCustomAddress(true);
                            setShippingDetails({
                              email: user?.email || "",
                              fullName: "",
                              phone: "",
                              address: "",
                              city: "",
                              state: "",
                              zipCode: "",
                              country: "United States",
                            });
                          }}
                          className={`cursor-pointer rounded-2xl border border-dashed p-5 transition-all duration-200 hover:shadow-md flex flex-col items-center justify-center text-center gap-2 group ${useCustomAddress
                            ? "border-[#005AA9] bg-blue-50/10"
                            : "border-slate-200 bg-white hover:border-slate-400"
                            }`}
                        >
                          <Plus className={`w-5 h-5 transition-transform group-hover:scale-110 ${useCustomAddress ? "text-[#005AA9]" : "text-slate-400"
                            }`} />
                          <div>
                            <p className={`text-sm font-extrabold ${useCustomAddress ? "text-[#005AA9]" : "text-slate-700"}`}>
                              Ship to Custom Address
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Fill out an ad-hoc shipping form.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GUEST BANNER */}
                  {!isAuthenticated && (
                    <div className="flex items-start gap-3.5 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                      <Sparkles className="w-5 h-5 text-[#005AA9] shrink-0 mt-0.5 animate-pulse" />
                      <div className="space-y-1">
                        <p className="text-sm font-extrabold text-[#002244]">Already have an account?</p>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          Sign in to checkout faster using your saved addresses, track order progress, and earn loyalty rewards.
                        </p>
                        <button
                          type="button"
                          onClick={() => dispatch(openLoginModal())}
                          className="text-xs font-black text-[#005AA9] hover:underline uppercase tracking-wide mt-1 focus:outline-none cursor-pointer"
                        >
                          Sign In Now &rarr;
                        </button>
                      </div>
                    </div>
                  )}

                  {/* FORM FIELDS (only editable when useCustomAddress is true, or if guest checkout) */}
                  {useCustomAddress && (
                    <div className="space-y-4 pt-2">
                      <p className="text-sm font-bold text-slate-700">Enter Shipping Address Details</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Email Address */}
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-extrabold text-slate-500 uppercase">Email Address</label>
                          <input
                            type="email"
                            value={shippingDetails.email}
                            onChange={(e) => setShippingDetails({ ...shippingDetails, email: e.target.value })}
                            placeholder="e.g. john@example.com"
                            disabled={isAuthenticated}
                            className={`w-full border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-blue-100 transition-all font-semibold text-slate-800 text-sm placeholder:text-slate-400 ${isAuthenticated ? "bg-slate-50 cursor-not-allowed text-slate-400 border-slate-100" : ""
                              }`}
                          />
                        </div>

                        {/* Name */}
                        <div className="space-y-1">
                          <label className="text-xs font-extrabold text-slate-500 uppercase">Recipient Name</label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={shippingDetails.fullName}
                              onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                              placeholder="e.g. John Doe"
                              className="w-full border border-slate-200 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-blue-100 transition-all font-semibold text-slate-800 text-sm placeholder:text-slate-400"
                            />
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1">
                          <label className="text-xs font-extrabold text-slate-500 uppercase">Phone Number</label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="tel"
                              value={shippingDetails.phone}
                              onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                              placeholder="e.g. (425) 555-0101"
                              className="w-full border border-slate-200 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-blue-100 transition-all font-semibold text-slate-800 text-sm placeholder:text-slate-400"
                            />
                          </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-extrabold text-slate-500 uppercase">Street Address</label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={shippingDetails.address}
                              onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                              placeholder="e.g. 123 Main Street, Apt 4B"
                              className="w-full border border-slate-200 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-blue-100 transition-all font-semibold text-slate-800 text-sm placeholder:text-slate-400"
                            />
                          </div>
                        </div>

                        {/* City */}
                        <div className="space-y-1">
                          <label className="text-xs font-extrabold text-slate-500 uppercase">City</label>
                          <input
                            type="text"
                            value={shippingDetails.city}
                            onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                            placeholder="e.g. Renton"
                            className="w-full border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-blue-100 transition-all font-semibold text-slate-800 text-sm placeholder:text-slate-400"
                          />
                        </div>

                        {/* State & Pincode Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-extrabold text-slate-500 uppercase">State</label>
                            <input
                              type="text"
                              value={shippingDetails.state}
                              onChange={(e) => setShippingDetails({ ...shippingDetails, state: e.target.value })}
                              placeholder="e.g. WA"
                              className="w-full border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-blue-100 transition-all font-semibold text-slate-800 text-sm placeholder:text-slate-400"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-extrabold text-slate-500 uppercase">Pincode</label>
                            <input
                              type="text"
                              value={shippingDetails.zipCode}
                              onChange={(e) => setShippingDetails({ ...shippingDetails, zipCode: e.target.value })}
                              placeholder="e.g. 98057"
                              className="w-full border border-slate-200 px-4 py-3 rounded-xl outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-blue-100 transition-all font-semibold text-slate-800 text-sm placeholder:text-slate-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-50 flex justify-end">
                    <button
                      onClick={handleContinueToPayment}
                      className="px-8 py-3.5 bg-[#005AA9] hover:bg-blue-700 text-white rounded-2xl font-black transition-all hover:scale-[1.01] shadow-lg shadow-blue-500/15 flex items-center gap-2 cursor-pointer text-sm tracking-wide"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PAYMENT METHOD */}
              {step === "payment" && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/40 p-6 md:p-8 space-y-6"
                >
                  <div className="border-b border-slate-50 pb-4">
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#005AA9]" />
                      Payment Method
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Select how you would like to pay. No real money will be charged.</p>
                  </div>

                  {/* Selection Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Credit Card / Stripe selection */}
                    <div
                      onClick={() => setPaymentMethod("credit_card")}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col gap-3 hover:shadow-md relative ${paymentMethod === "credit_card"
                        ? "border-[#005AA9] bg-blue-50/20 ring-2 ring-blue-500/10"
                        : "border-slate-100 bg-slate-50/30 hover:border-slate-300"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <CreditCard className={`w-5 h-5 ${paymentMethod === "credit_card" ? "text-[#005AA9]" : "text-slate-400"}`} />
                        {paymentMethod === "credit_card" && (
                          <div className="w-4 h-4 bg-[#005AA9] text-white rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3px]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-slate-800">Pay Online (Stripe)</p>
                        <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Pay securely via Credit/Debit Cards, UPI, PayPal, or Wallets.</p>
                      </div>
                    </div>

                    {/* Cash on delivery selection */}
                    <div
                      onClick={() => setPaymentMethod("cash_on_delivery")}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col gap-3 hover:shadow-md relative ${paymentMethod === "cash_on_delivery"
                        ? "border-[#005AA9] bg-blue-50/20 ring-2 ring-blue-500/10"
                        : "border-slate-100 bg-slate-50/30 hover:border-slate-300"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <Truck className={`w-5 h-5 ${paymentMethod === "cash_on_delivery" ? "text-[#005AA9]" : "text-slate-400"}`} />
                        {paymentMethod === "cash_on_delivery" && (
                          <div className="w-4 h-4 bg-[#005AA9] text-white rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3px]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-slate-800">Cash on Delivery</p>
                        <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Pay with cash when package reaches your door.</p>
                      </div>
                    </div>
                  </div>

                  {/* DETAIL CONFIGURATIONS FOR SELECTED METHOD */}
                  <div className="pt-2">

                    {/* Pay Online details */}
                    {paymentMethod === "credit_card" && (
                      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 text-sm flex gap-3 text-blue-800">
                        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="space-y-1 font-semibold">
                          <p className="font-extrabold">Pay Online (Stripe)</p>
                          <p className="text-xs text-blue-700 leading-relaxed">
                            You will be securely redirected to the Stripe payment gateway to complete your checkout. All transactions are fully encrypted and secure.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Cash on Delivery Details */}
                    {paymentMethod === "cash_on_delivery" && (
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 text-sm flex gap-3 text-emerald-800">
                        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="space-y-1 font-semibold">
                          <p className="font-extrabold">Cash on Delivery (COD)</p>
                          <p className="text-xs text-emerald-700 leading-relaxed">
                            No immediate charge will be processed. Place order now and prepare exact cash amount of{" "}
                            <span className="font-extrabold">{formatPrice(finalTotal)}</span> when the courier delivers your package.
                          </p>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-50 flex justify-between">
                    <button
                      onClick={() => setStep("review")}
                      className="px-6 py-3.5 border border-slate-200 text-slate-600 rounded-2xl font-bold transition-all hover:bg-slate-50 cursor-pointer text-sm"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="px-8 py-3.5 bg-[#005AA9] hover:bg-blue-700 text-white rounded-2xl font-black transition-all hover:scale-[1.01] shadow-lg shadow-blue-500/15 flex items-center gap-2 cursor-pointer text-sm tracking-wide disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>
                            {paymentMethod === "credit_card" ? "Connecting to Stripe..." : "Placing Order..."}
                          </span>
                        </>
                      ) : (
                        <>
                          {paymentMethod === "credit_card" ? (
                            <Lock className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          <span>
                            {paymentMethod === "credit_card" ? "Continue to Payment" : "Place Order"}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: REVIEW & CONFIRM */}
              {step === "review" && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/40 p-6 md:p-8 space-y-6"
                >
                  <div className="border-b border-slate-50 pb-4">
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#005AA9]" />
                      Review Your Order
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Review your order details and delivery destination.</p>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-1 gap-6 border-b border-slate-100 pb-6">
                    {/* Delivery summary */}
                    <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                      <h4 className="font-extrabold text-sm text-slate-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>Shipping Destination</span>
                      </h4>
                      <div className="text-xs text-slate-600 font-semibold space-y-1">
                        <p className="font-extrabold text-slate-800">{shippingDetails.fullName}</p>
                        <p>{shippingDetails.address}</p>
                        <p>{shippingDetails.city}, {shippingDetails.state} {shippingDetails.zipCode}</p>
                        <p className="text-slate-400">{shippingDetails.country}</p>
                        <p className="pt-2 font-bold text-slate-700">Phone: {shippingDetails.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-50 flex justify-between">
                    <button
                      onClick={() => setStep("shipping")}
                      className="px-6 py-3.5 border border-slate-200 text-slate-600 rounded-2xl font-bold transition-all hover:bg-slate-50 cursor-pointer text-sm"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep("payment")}
                      className="px-8 py-3.5 bg-[#005AA9] hover:bg-blue-700 text-white rounded-2xl font-black transition-all hover:scale-[1.01] shadow-lg shadow-blue-500/15 flex items-center gap-2 cursor-pointer text-sm tracking-wide"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* RIGHT: ORDER SUMMARY (4 Columns) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-200/40 space-y-6">
              <h3 className="font-black text-slate-800 text-base border-b border-slate-50 pb-3 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs bg-[#005AA9]/10 text-[#005AA9] px-2.5 py-0.5 rounded-full font-bold">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </h3>

              {/* Items List Mini Drawer */}
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="py-3 flex items-center gap-3 first:pt-0 last:pb-0">
                    <div className="relative w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                      <Image
                        src={item.product.images?.[0] || "/images/placeholder.png"}
                        alt={item.product.name}
                        width={40}
                        height={40}
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-xs text-slate-800 truncate hover:text-[#005AA9] transition-colors">
                        {item.product.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Qty: {item.quantity} • {formatPrice(item.product.price)} each
                      </p>
                    </div>
                    <span className="text-xs font-black text-slate-800 shrink-0 text-right font-mono">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon apply form */}
              <div className="border-t border-slate-50 pt-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl text-emerald-800 text-xs font-bold animate-fade-in">
                    <div className="flex items-center gap-1.5">
                      <BadgePercent className="w-4.5 h-4.5 text-emerald-600" />
                      <span>{appliedCoupon} Applied</span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700 underline text-[10px] uppercase font-black tracking-wide"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Promo Code (e.g. WELCOME10)"
                      className="flex-grow border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none focus:border-[#005AA9] transition font-bold"
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-4 py-2 rounded-xl font-bold transition"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2.5 border-t border-slate-50 pt-4 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-800 font-mono">{formatPrice(subtotal)}</span>
                </div>

                {initialDiscount + couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span className="font-mono">-{formatPrice(initialDiscount + couponDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  <span className="text-slate-800 font-mono">
                    {calculatedShippingCost === 0 ? "FREE" : formatPrice(calculatedShippingCost)}
                  </span>
                </div>

                <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between font-black text-slate-800 text-base">
                  <span>Grand Total</span>
                  <span className="text-slate-900 font-mono text-lg">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Security badge notes */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure Shopping</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  Your credentials are secure. We encrypt transactions with bank-grade algorithms. No real billing or payment checks will be made.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}