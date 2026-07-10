"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, CheckCircle2, ChevronRight, Gift, ShoppingBag, Minus, Plus } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { showErrorToast } from "@/lib/toast";

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface GiftCardItem {
  id: string;
  type: string;
  name: string;
  tagline: string;
  image: string;
  shortDescription: string;
  description: string;
  priceOptions: string[];
  features: string[];
  terms: string;
}

interface PurchaseForm {
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  message: string;
  quantity: number;
}

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function GiftCardsPage() {
  const dispatch = useAppDispatch();
  const [giftCards, setGiftCards] = useState<GiftCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState<GiftCardItem | null>(null);
  const [buyCard, setBuyCard] = useState<GiftCardItem | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const [form, setForm] = useState<PurchaseForm>({
    recipientName: "",
    recipientEmail: "",
    senderName: "",
    message: "",
    quantity: 1,
  });
  const [addedToCart, setAddedToCart] = useState(false);
  const [customAmount, setCustomAmount] = useState("");

  const openBuyModal = (card: GiftCardItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBuyCard(card);
    setSelectedAmount(card.priceOptions[0] ?? "");
    setForm({ recipientName: "", recipientEmail: "", senderName: "", message: "", quantity: 1 });
    setAddedToCart(false);
    setCustomAmount("");
  };

  useEffect(() => {
    const fetchGiftCards = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/gift-cards");
        const data = await response.json();
        if (data.success && Array.isArray(data.giftCards)) {
          setGiftCards(data.giftCards);
        }
      } catch (error) {
        console.error("Failed to load gift cards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGiftCards();
  }, []);

  const closeBuyModal = () => {
    setBuyCard(null);
    setAddedToCart(false);
    setCustomAmount("");
  };

  const handleAddToCart = () => {
    if (!buyCard || !selectedAmount) return;

    const parsedAmount = selectedAmount === "custom"
      ? Number(customAmount)
      : Number(selectedAmount.replace(/[^0-9.]/g, ""));

    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    if (!form.recipientName.trim()) {
      showErrorToast("Please enter a recipient name.");
      return;
    }

    if (buyCard.type === "egift") {
      if (!form.recipientEmail.trim()) {
        showErrorToast("Please enter a recipient email address.");
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(form.recipientEmail.trim())) {
        showErrorToast("Please enter a valid email address.");
        return;
      }
    }

    if (!form.senderName.trim()) {
      showErrorToast("Please enter your name.");
      return;
    }

    const uniqueId = `${buyCard.id}-${parsedAmount}-${Date.now()}`;

    const giftCardProduct: any = {
      id: uniqueId,
      name: `${buyCard.name} ($${parsedAmount})`,
      slug: uniqueId,
      sku: `GC-${buyCard.id.toUpperCase()}-${parsedAmount}`,
      categorySlug: "gift-card" as any,
      subcategorySlug: "gift-card",
      brand: "Sierra Fish & Pets",
      price: parsedAmount,
      images: [buyCard.image],
      description: buyCard.description,
      shortDescription: buyCard.shortDescription,
      features: buyCard.features,
      tags: ["giftcard", "gift-card"],
      rating: 5,
      reviewCount: 0,
      reviews: [],
      stockStatus: "in_stock",
      stockCount: 9999,
      isNewArrival: false,
      isFeatured: false,
      isBestSeller: false,
      createdAt: new Date().toISOString(),
      giftCardDetails: {
        recipientName: form.recipientName.trim(),
        recipientEmail: buyCard.type === "egift" ? form.recipientEmail.trim() : "",
        senderName: form.senderName.trim(),
        message: form.message.trim(),
      },
    };

    dispatch(
      addToCart({
        product: giftCardProduct,
        quantity: form.quantity,
      })
    );

    setAddedToCart(true);
  };

  return (
    <main className="relative text-slate-800 min-h-screen overflow-x-hidden pb-24 bg-slate-50">
      {/* ─── HERO HEADER SECTION ─── */}
      <section className="relative overflow-hidden w-full h-[200px] sm:h-[260px] md:h-[420px] [clip-path:inset(0)]">
        {/* Image — clipped to banner bounds */}
        <div className="absolute md:fixed inset-x-0 top-0 w-full h-[200px] sm:h-[260px] md:h-[420px] pointer-events-none overflow-hidden z-0">
          {/* Mobile image */}
          <Image
            src="/images/banner/shophero5.png"
            alt="Gift cards banner"
            fill
            priority
            className="object-cover object-[center_60%] block md:hidden"
            sizes="100vw"
          />
          {/* Desktop image */}
          <Image
            src="/images/banner/shophero3.png"
            alt="Gift cards banner"
            fill
            priority
            className="object-cover object-[center_40%] hidden md:block"
            sizes="100vw"
          />
        </div>

        {/* Mobile overlay — darkens image so text is readable */}
        <div className="absolute inset-0 z-[2] block md:hidden bg-[linear-gradient(to_bottom,rgba(0,30,70,0.62)_0%,rgba(0,30,70,0.35)_60%,rgba(0,30,70,0.10)_100%)]" />

        {/* Centered text block */}
        <div className="absolute inset-x-0 top-0 z-[3] flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="mb-4 text-[clamp(2rem,4.5vw,3rem)] font-black leading-[1.05] tracking-[-0.03em] bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] bg-clip-text text-transparent drop-shadow-sm">
              Gift Cards
            </h1>

            {/* Breadcrumb */}
            <nav
              aria-label="breadcrumb"
              className="flex flex-wrap items-center justify-center gap-0.5 text-sm font-medium text-white drop-shadow-md md:text-slate-500 md:drop-shadow-none"
            >
              <span className="flex items-center gap-0.5">
                <Link
                  href="/"
                  className="text-white md:text-slate-500 transition-colors duration-150 hover:text-[#00aaff] hover:underline"
                >
                  Home
                </Link>
                <span className="px-0.5 text-white/90 md:text-slate-400"> › </span>
              </span>
              <span className="flex items-center gap-0.5">
                <span className="font-bold text-[#0d1b2a] md:text-[#0d1b2a] text-white">Gift Cards</span>
              </span>
            </nav>
          </motion.div>
        </div>
      </section>

      {/* ─── GIFT CARDS DISPLAY SECTION ─── */}
      <section className="container mx-auto px-6 max-w-3xl mt-12">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#005AA9] mb-2 block">Give the Perfect Gift</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#002244] leading-tight">
            Sierra Fish &amp; Pets Gift Cards
          </h2>
          <p className="mt-3 text-slate-500 max-w-lg mx-auto text-sm font-light">
            Choose between an instant digital e-gift card or a premium physical card sent by mail.
          </p>
        </div>

        {loading ? (
          <div className="grid place-items-center py-20">
            <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-100 px-6 py-4 text-slate-600 shadow-sm">
              <div className="h-3 w-3 rounded-full animate-pulse bg-[#005AA9]" />
              Loading gift cards...
            </div>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {giftCards.map((card) => (
            <motion.div
              key={card.id}
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              onClick={() => setActiveCard(card)}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-lg shadow-slate-100 hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-slate-50 bg-slate-50 mb-4 shadow-sm">
                  <Image src={card.image} alt={card.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">{card.name}</h3>
                  <span className="text-[9px] font-bold text-[#00aaff] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full">{card.type}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{card.tagline}</p>
                <p className="text-xs text-slate-600 font-light leading-relaxed mb-4">{card.shortDescription}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {card.priceOptions.map((opt, i) => (
                    <span key={i} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{opt}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => openBuyModal(card, e)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#005AA9] hover:bg-[#004b8d] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition-all duration-200 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Buy This Card
                </button>
                <button
                  onClick={() => setActiveCard(card)}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-100 transition-all duration-200 active:scale-95"
                >
                  <Gift className="w-4 h-4" />
                  View Details
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      </section>

      {/* ─── DETAILS OVERLAY MODAL ─── */}
      <AnimatePresence>
        {activeCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} onClick={() => setActiveCard(null)} className="absolute inset-0 bg-slate-900" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 overflow-y-auto max-h-[85vh] z-10 flex flex-col scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="absolute top-4 right-4 p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors active:scale-95 z-50" onClick={() => setActiveCard(null)}>
                <X className="w-4 h-4" />
              </button>
              <div className="flex flex-col gap-5">
                <div>
                  <span className="text-[9px] font-bold text-[#005AA9] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
                    {activeCard.type === "egift" ? "Digital Delivery" : "Mail Delivery"}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-3 mb-1">{activeCard.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeCard.tagline}</p>
                </div>
                <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                  <Image src={activeCard.image} alt={activeCard.name} fill className="object-cover" sizes="100vw" priority />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Description</h4>
                  <p className="text-sm text-slate-600 font-light leading-relaxed">{activeCard.description}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Key Features</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeCard.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#00aaff] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => { setActiveCard(null); openBuyModal(activeCard); }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#005AA9] hover:bg-[#004b8d] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md shadow-blue-500/15 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Buy {activeCard.name}
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Terms &amp; Conditions</h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{activeCard.terms}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── PURCHASE FORM MODAL ─── */}
      <AnimatePresence>
        {buyCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} onClick={closeBuyModal} className="absolute inset-0 bg-slate-900" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] z-10 scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header with image */}
              <div className="relative w-full aspect-[2.5/1] rounded-t-3xl overflow-hidden">
                <Image src={buyCard.image} alt={buyCard.name} fill className="object-cover" sizes="100vw" priority />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />
                <button className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full transition-colors z-50" onClick={closeBuyModal}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{buyCard.name}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{buyCard.tagline}</p>
                </div>

                {/* Amount selection */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-700">Set an amount</h4>
                  <div className="flex flex-wrap gap-2">
                    {buyCard.priceOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => { setSelectedAmount(opt); setCustomAmount(""); }}
                        className={`px-3.5 py-1.5 rounded-lg text-sm font-bold border-2 transition-all duration-150 ${
                          selectedAmount === opt
                            ? "bg-[#005AA9] border-[#005AA9] text-white shadow-md shadow-blue-500/20"
                            : "bg-white border-slate-200 text-slate-700 hover:border-[#005AA9] hover:text-[#005AA9]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                    {/* Custom Amount toggle */}
                    <button
                      onClick={() => {
                        if (selectedAmount === "custom") {
                          setSelectedAmount(buyCard.priceOptions[0] ?? "");
                          setCustomAmount("");
                        } else {
                          setSelectedAmount("custom");
                          setCustomAmount("");
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-sm font-bold border-2 transition-all duration-150 ${
                        selectedAmount === "custom"
                          ? "bg-[#005AA9] border-[#005AA9] text-white shadow-md shadow-blue-500/20"
                          : "bg-white border-slate-200 text-slate-700 hover:border-[#005AA9] hover:text-[#005AA9]"
                      }`}
                    >
                      Custom Amount
                    </button>
                  </div>

                  {/* Custom amount input — shows only when custom is selected */}
                  <AnimatePresence>
                    {selectedAmount === "custom" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">$</span>
                          <input
                            type="number"
                            min={1}
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder="Enter amount"
                            autoFocus
                            className="w-full border-2 border-[#005AA9] rounded-lg pl-7 pr-3 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005AA9]/20 transition-all"
                          />
                        </div>
                        {customAmount && Number(customAmount) > 0 && (
                          <p className="mt-1 text-xs text-[#005AA9] font-semibold">Selected: ${customAmount}</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Delivery Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-700">Delivery Info</h4>

                  {/* Recipient */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recipient Info</p>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Name:</label>
                      <input
                        type="text"
                        value={form.recipientName}
                        onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                        placeholder="Recipient's full name"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-[#005AA9]/20 transition-all"
                      />
                    </div>
                    {buyCard.type === "egift" && (
                      <div>
                        <label className="block text-xs text-slate-600 mb-1">Email:</label>
                        <input
                          type="email"
                          value={form.recipientEmail}
                          onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })}
                          placeholder="Recipient's email address"
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-[#005AA9]/20 transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* Sender */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Your Info</p>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Name:</label>
                      <input
                        type="text"
                        value={form.senderName}
                        onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                        placeholder="Your full name"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-[#005AA9]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Message:</label>
                      <textarea
                        rows={3}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Add a personal message (optional)"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-[#005AA9]/20 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-700">Quantity:</span>
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setForm((f) => ({ ...f, quantity: Math.max(1, f.quantity - 1) }))}
                      className="px-3 py-2 text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 py-2 text-sm font-bold text-slate-800 border-x border-slate-200 min-w-[3rem] text-center">{form.quantity}</span>
                    <button
                      onClick={() => setForm((f) => ({ ...f, quantity: f.quantity + 1 }))}
                      className="px-3 py-2 text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                {addedToCart ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl text-sm font-bold"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Added to Cart!
                  </motion.div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedAmount}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#005AA9] hover:bg-[#004b8d] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wide shadow-md shadow-blue-500/15 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                )}

                {/* Terms */}
                <p className="text-[10px] text-slate-400 leading-relaxed text-center">{buyCard.terms}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
