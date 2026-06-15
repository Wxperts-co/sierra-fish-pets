"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Star, ThumbsUp, Flag, Plus, ShoppingCart } from "lucide-react";
import { Product, ProductReview } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { faq as faqData } from "@/data";

interface ProductDetailsTabsProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailsTabs({ product, relatedProducts }: ProductDetailsTabsProps) {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews" | "faq" | "shipping">("description");

  // Frequently Bought Together states
  const bundleItems = relatedProducts.slice(0, 2);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    [product.id]: true,
    ...bundleItems.reduce((acc, item) => ({ ...acc, [item.id]: true }), {} as Record<string, boolean>),
  });

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Calculate bundle total
  const selectedProducts = [product, ...bundleItems].filter((item) => checkedItems[item.id]);
  const bundleTotal = selectedProducts.reduce((sum, item) => sum + item.price, 0);

  const handleAddBundleToCart = () => {
    selectedProducts.forEach((p) => {
      dispatch(addToCart(p));
    });
  };

  // Generate dynamic reviews based on product details if none exist in JSON
  const reviewsList = useMemo(() => {
    if (product.reviews && product.reviews.length > 0) {
      return product.reviews;
    }
    const isDog = product.categorySlug === "dog";
    const isCat = product.categorySlug === "cat";
    const isAquatic = product.categorySlug === "aquatic";
    const petWord = isDog ? "dog" : isCat ? "cat" : isAquatic ? "fish" : "pet";
    return [
      {
        id: `dyn-rev-1-${product.id}`,
        userId: "usr-dyn-1",
        userName: "Sarah Jenkins",
        rating: 5,
        title: `Outstanding quality, perfect for my ${petWord}!`,
        body: `My ${petWord} absolutely loves this ${product.name}. We noticed a dramatic improvement in energy levels and overall wellness. The quality of ingredients from ${product.brand || "this brand"} is top-notch.`,
        date: "2024-11-20",
        verified: true,
      },
      {
        id: `dyn-rev-2-${product.id}`,
        userId: "usr-dyn-2",
        userName: "David L.",
        rating: 4,
        title: "Great product and quick shipping",
        body: `The ${product.name} arrived in perfect packaging. Good portion size and the quality is excellent. My ${petWord} is usually a picky eater but finished it right away.`,
        date: "2024-11-05",
        verified: true,
      }
    ];
  }, [product]);

  const ratingPercentages = useMemo(() => {
    const rating = product.rating;
    if (rating >= 4.5) return { 5: 82, 4: 14, 3: 3, 2: 1, 1: 0 };
    if (rating >= 4.0) return { 5: 70, 4: 20, 3: 6, 2: 3, 1: 1 };
    if (rating >= 3.0) return { 5: 40, 4: 30, 3: 20, 2: 8, 1: 2 };
    return { 5: 10, 4: 20, 3: 30, 2: 25, 1: 15 };
  }, [product.rating]);

  const featuresList = product.features?.length > 0
    ? product.features
    : [
        "Premium quality ingredients for optimal health",
        "Formulated by pet nutrition experts and veterinarians",
        "Rich in essential vitamins, minerals, and amino acids",
        "Supports digestive system and immune health",
        "No artificial colors, flavors, or chemical preservatives",
      ];

  return (
    <div className="mt-16 w-full space-y-16">
      
      {/* ─── 1. TABBED PANEL SECTION ─── */}
      <div className="w-full">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none gap-8">
          {(
            [
              { id: "description", label: "Description" },
              { id: "specifications", label: "Specifications" },
              { id: "faq", label: "FAQ" },
              { id: "shipping", label: "Shipping & Returns" },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 md:text-sm text-[11px] font-bold tracking-wide uppercase whitespace-nowrap transition-all border-b-2 -mb-px focus:outline-none cursor-pointer ${
                  isActive
                    ? "border-[#005AA9] text-[#005AA9]"
                    : "border-transparent text-slate-500 hover:text-[#005AA9]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Box */}
        <div className="mt-6 border border-slate-100 rounded-2xl p-6 md:p-8 bg-white shadow-sm">
          {activeTab === "description" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Description & Features */}
              <div className="lg:col-span-7 space-y-6">
                <p className="text-slate-600 leading-relaxed text-sm">
                  {product.description}
                </p>
                <div className="space-y-3 pt-2">
                  {featuresList.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Specs Table */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#002244] border-b border-slate-200/60 pb-2">
                  Key Specifications
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-slate-200/40 pb-2">
                    <span className="text-slate-500 font-medium">Brand</span>
                    <span className="text-[#002244] font-bold">{product.brand || "Generic"}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/40 pb-2">
                    <span className="text-slate-500 font-medium">Category</span>
                    <span className="text-[#002244] font-bold capitalize">{product.categorySlug?.replace("-", " ")}</span>
                  </div>
                  {product.weight && (
                    <div className="flex justify-between border-b border-slate-200/40 pb-2">
                      <span className="text-slate-500 font-medium">Weight</span>
                      <span className="text-[#002244] font-bold">{product.weight}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between border-b border-slate-200/40 pb-2">
                      <span className="text-slate-500 font-medium">Dimensions</span>
                      <span className="text-[#002244] font-bold">{product.dimensions}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-slate-200/40 pb-2">
                    <span className="text-slate-500 font-medium">SKU</span>
                    <span className="text-[#002244] font-mono font-bold">{product.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Country of Origin</span>
                    <span className="text-[#002244] font-bold">USA</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="max-w-2xl divide-y divide-slate-100 text-sm">
              <div className="grid grid-cols-3 py-3">
                <span className="font-semibold text-slate-500">Product SKU</span>
                <span className="col-span-2 text-slate-800 font-mono font-medium">{product.sku}</span>
              </div>
              <div className="grid grid-cols-3 py-3">
                <span className="font-semibold text-slate-500">Manufacturer Brand</span>
                <span className="col-span-2 text-slate-800 font-medium">{product.brand || "Sierra Fish & Pets"}</span>
              </div>
              <div className="grid grid-cols-3 py-3">
                <span className="font-semibold text-slate-500">Category Tag</span>
                <span className="col-span-2 text-slate-800 font-medium capitalize">{product.categorySlug}</span>
              </div>
              <div className="grid grid-cols-3 py-3">
                <span className="font-semibold text-slate-500">Stock Availability</span>
                <span className="col-span-2 text-slate-800 font-medium capitalize">{product.stockStatus.replace("_", " ")} ({product.stockCount} units)</span>
              </div>
              {product.weight && (
                <div className="grid grid-cols-3 py-3">
                  <span className="font-semibold text-slate-500">Item Weight</span>
                  <span className="col-span-2 text-slate-800 font-medium">{product.weight}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="grid grid-cols-3 py-3">
                  <span className="font-semibold text-slate-500">Dimensions</span>
                  <span className="col-span-2 text-slate-800 font-medium">{product.dimensions}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <p className="text-slate-600 text-sm">
                Showing top reviews for <strong>{product.name}</strong>. See the detailed ratings and testimonials below.
              </p>
              <button 
                onClick={() => {
                  const element = document.getElementById("reviews-section");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm font-bold text-[#005AA9] hover:underline cursor-pointer"
              >
                Go to detailed Customer Reviews &darr;
              </button>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="space-y-6">
              {faqData.map((item: any, i: number) => (
                <div key={i} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                  <h5 className="font-bold text-slate-800 text-sm mb-2">Q: {item.question}</h5>
                  <p className="text-slate-600 text-xs leading-relaxed font-medium">
                    A: {item.answer}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
              <h5 className="font-bold text-slate-800 text-sm">Delivery Policy</h5>
              <p className="text-xs">
                We offer free standard shipping on orders over $49 across the continental USA. Orders are processed within 1-2 business days, and deliveries take between 3-5 business days.
              </p>
              <h5 className="font-bold text-slate-800 text-sm">Returns & Swaps</h5>
              <p className="text-xs">
                If you are not entirely satisfied, you can return the item in its original condition within 30 days of receipt. Please contact our support team to request a return label.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── 2. CUSTOMER REVIEWS SECTION ─── */}
      <div id="reviews-section" className="w-full border-t border-slate-100 md:pt-12 pt-4">
        <div className="flex  items-center justify-between mb-8">
          <h3 className="text-2xl font-extrabold text-[#002244]">Customer Reviews</h3>
          <button className="md:px-5 md:py-2.5 px-2 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition active:scale-95 text-xs">
            Write a Review
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Summary Column */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
            <span className="text-3xl md:text-5xl font-black text-[#002244]">
              {product.rating.toFixed(1)}
            </span>
            <div className="flex items-center gap-1 my-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(product.rating)
                      ? "fill-[#FFB300] text-[#FFB300]"
                      : "fill-slate-100 text-slate-100"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
              Based on {product.reviewCount || reviewsList.length} reviews
            </span>

            {/* Progress Bars */}
            <div className="w-full space-y-2.5">
              {([5, 4, 3, 2, 1] as const).map((stars) => {
                const pct = ratingPercentages[stars];
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <span className="w-3 shrink-0">{stars}</span>
                    <span className="text-slate-400 font-medium">★</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-medium text-slate-400">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Reviews Column */}
          <div className="lg:col-span-8 space-y-6">
            {reviewsList.map((rev, idx) => (
              <div key={rev.id || idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rev.rating
                            ? "fill-[#FFB300] text-[#FFB300]"
                            : "fill-slate-100 text-slate-100"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{rev.date}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-extrabold text-[#002244]">{rev.userName}</span>
                  {rev.verified && (
                    <span className="text-emerald-500 font-bold flex items-center gap-1 text-[10px] uppercase tracking-wider">
                      <Check className="h-3.5 w-3.5" /> Verified Purchase
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-[#002244] text-sm">{rev.title}</h5>
                  <p className="text-slate-600 text-xs leading-relaxed">{rev.body}</p>
                </div>

                {/* Helpful buttons row */}
                <div className="flex items-center gap-4 pt-2 border-t border-slate-50 text-xs">
                  <button className="flex items-center gap-1.5 font-bold text-slate-500 hover:text-[#005AA9] transition cursor-pointer">
                    <ThumbsUp className="h-4 w-4" /> Helpful ({(idx * 7) + 5})
                  </button>
                  <button className="flex items-center gap-1.5 font-bold text-slate-400 hover:text-red-500 transition cursor-pointer">
                    <Flag className="h-3.5 w-3.5" /> Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 3. FREQUENTLY BOUGHT TOGETHER SECTION ─── */}
      {bundleItems.length > 0 && (
        <div className="w-full border-t border-slate-100 pt-12">
          <h3 className="text-2xl font-extrabold text-[#002244] mb-8">Frequently Bought Together</h3>
          
          <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col xl:flex-row gap-8 items-center xl:items-stretch">
            {/* Visual Products Row */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 flex-1">
              {/* Product 1 (Current) */}
              <div className="flex flex-col items-center text-center max-w-[140px] relative">
                <input
                  type="checkbox"
                  checked={checkedItems[product.id]}
                  disabled // Main product must remain checked
                  className="absolute top-2 left-2 z-20 h-4.5 w-4.5 accent-[#005AA9] rounded border-slate-300"
                />
                <div className="w-24 h-24 relative bg-slate-50 rounded-xl overflow-hidden border border-slate-100/60 p-2">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-2 mt-2 leading-tight">
                  {product.name}
                </span>
                <span className="text-xs font-black text-[#005AA9] mt-1">${product.price.toFixed(2)}</span>
              </div>

              <Plus className="h-5 w-5 text-slate-300" />

              {/* Related Product 1 */}
              <div className="flex flex-col items-center text-center max-w-[140px] relative">
                <input
                  type="checkbox"
                  checked={checkedItems[bundleItems[0].id]}
                  onChange={() => handleCheckboxChange(bundleItems[0].id)}
                  className="absolute top-2 left-2 z-20 h-4.5 w-4.5 accent-[#005AA9] cursor-pointer rounded border-slate-300"
                />
                <div className="w-24 h-24 relative bg-slate-50 rounded-xl overflow-hidden border border-slate-100/60 p-2">
                  <Image
                    src={bundleItems[0].images[0]}
                    alt={bundleItems[0].name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800 line-clamp-2 mt-2 leading-tight">
                  {bundleItems[0].name}
                </span>
                <span className="text-xs font-black text-[#005AA9] mt-1">${bundleItems[0].price.toFixed(2)}</span>
              </div>

              {bundleItems[1] && (
                <>
                  <Plus className="h-5 w-5 text-slate-300" />
                  {/* Related Product 2 */}
                  <div className="flex flex-col items-center text-center max-w-[140px] relative">
                    <input
                      type="checkbox"
                      checked={checkedItems[bundleItems[1].id]}
                      onChange={() => handleCheckboxChange(bundleItems[1].id)}
                      className="absolute top-2 left-2 z-20 h-4.5 w-4.5 accent-[#005AA9] cursor-pointer rounded border-slate-300"
                    />
                    <div className="w-24 h-24 relative bg-slate-50 rounded-xl overflow-hidden border border-slate-100/60 p-2">
                      <Image
                        src={bundleItems[1].images[0]}
                        alt={bundleItems[1].name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 line-clamp-2 mt-2 leading-tight">
                      {bundleItems[1].name}
                    </span>
                    <span className="text-xs font-black text-[#005AA9] mt-1">${bundleItems[1].price.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Total and CTA Panel */}
            <div className="w-full xl:w-72 bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col justify-center text-center xl:text-left space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Bundle Price:</span>
                <div className="md:text-3xl text-2xl font-black text-[#002244]">${bundleTotal.toFixed(2)}</div>
                <span className="text-[10px] text-slate-400 font-medium">({selectedProducts.length} items selected)</span>
              </div>

              <button
                onClick={handleAddBundleToCart}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#005AA9] hover:bg-[#004785] text-white font-bold transition active:scale-95 shadow-md shadow-[#005AA9]/10 text-xs cursor-pointer"
              >
                <ShoppingCart className="h-4 w-4" /> Add selected to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
