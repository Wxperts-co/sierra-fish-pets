"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Star, ThumbsUp, Flag, Plus, ShoppingCart, X, ChevronLeft, ChevronRight, Camera, Loader2 } from "lucide-react";
import { Product } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { showErrorToast } from "@/lib/toast";

interface ProductDetailsTabsProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailsTabs({ product, relatedProducts }: ProductDetailsTabsProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const currentUserId = user?.id || user?._id || "";

  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews" | "shipping">("description");

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

  // Reviews & Stats state
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [stats, setStats] = useState({
    averageRating: product.rating || 0,
    totalCount: product.reviewCount || 0,
    ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>,
  });

  // Eligibility state
  const [eligibility, setEligibility] = useState<{
    eligible: boolean;
    code?: string;
    message?: string;
    hasExisting?: boolean;
    existingReview?: any;
    orderId?: string;
  } | null>(null);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Lightbox states
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxImagesList, setLightboxImagesList] = useState<string[]>([]);

  // Fetch reviews logic
  const fetchReviews = useCallback(async () => {
    try {
      setLoadingReviews(true);
      const res = await fetch(`/api/products/${product.id}/reviews?page=${page}&limit=10&sort=${sortBy}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  }, [product.id, page, sortBy]);

  // Fetch eligibility logic
  const fetchEligibility = useCallback(async () => {
    if (!isAuthenticated) {
      setEligibility({
        eligible: false,
        code: "AUTH_REQUIRED",
        message: "Please sign in to review this product.",
      });
      return;
    }
    try {
      const res = await fetch(`/api/products/${product.id}/reviews/eligibility`);
      const data = await res.json();
      if (data.success) {
        setEligibility(data);
      }
    } catch (error) {
      console.error("Failed to check eligibility:", error);
    }
  }, [product.id, isAuthenticated]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    fetchEligibility();
  }, [fetchEligibility]);

  // Handle pre-filling form if editing an existing review
  useEffect(() => {
    if (eligibility?.hasExisting && eligibility?.existingReview) {
      const rev = eligibility.existingReview;
      setRating(rev.rating || 5);
      setFormTitle(rev.title || "");
      setComment(rev.comment || "");
      setImages(rev.images || []);
    } else {
      setRating(5);
      setFormTitle("");
      setComment("");
      setImages([]);
    }
  }, [eligibility]);

  // Upload photo handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImages(true);
    setFormError("");
    setFormSuccess("");

    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("files", e.target.files[i]);
    }

    try {
      const res = await fetch("/api/reviews/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImages((prev) => [...prev, ...data.urls]);
      } else {
        setFormError(data.message || "Failed to upload images.");
      }
    } catch (err) {
      setFormError("An error occurred during file upload.");
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit review handler
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      setFormError("Please select a rating.");
      return;
    }
    if (!comment.trim()) {
      setFormError("Please write a comment.");
      return;
    }

    setSubmitLoading(true);
    setFormError("");
    setFormSuccess("");

    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          title: formTitle,
          comment,
          images,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFormSuccess(data.message || "Review submitted successfully!");
        setIsFormOpen(false);
        await Promise.all([fetchReviews(), fetchEligibility()]);
        router.refresh();
      } else {
        setFormError(data.message || "Failed to submit review.");
      }
    } catch (err: any) {
      setFormError(err.message || "An error occurred.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Helpful click handler
  const handleHelpfulClick = async (reviewId: string) => {
    if (!isAuthenticated) {
      showErrorToast("Please sign in to vote a review as helpful.");
      return;
    }
    try {
      const res = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        // Optimistically update helpful state in list
        setReviews((prev) =>
          prev.map((r) => {
            if (r._id === reviewId) {
              const hasVoted = r.helpfulVotes.includes(currentUserId);
              const newVotes = hasVoted
                ? r.helpfulVotes.filter((id: string) => id !== currentUserId)
                : [...r.helpfulVotes, currentUserId];
              return {
                ...r,
                helpfulCount: data.helpfulCount,
                helpfulVotes: newVotes,
              };
            }
            return r;
          })
        );
      } else {
        showErrorToast(data.message || "Failed to vote helpful.");
      }
    } catch (err) {
      showErrorToast("An error occurred.");
    }
  };

  // Lightbox handlers
  const openLightbox = (reviewImages: string[], index: number) => {
    setLightboxImagesList(reviewImages);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setLightboxImagesList([]);
  };

  const nextLightboxImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % lightboxImagesList.length);
  };

  const prevLightboxImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + lightboxImagesList.length) % lightboxImagesList.length);
  };

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
              { id: "reviews", label: `Reviews (${stats.totalCount})` },
              { id: "shipping", label: "Shipping & Returns" },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "reviews") {
                    setActiveTab("reviews");
                    const element = document.getElementById("reviews-section");
                    element?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
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
                Showing reviews for <strong>{product.name}</strong>. See the detailed ratings and testimonials below.
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
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-extrabold text-[#002244]">Customer Reviews</h3>
          
          {eligibility?.eligible ? (
            <button
              onClick={() => setIsFormOpen((prev) => !prev)}
              className="md:px-5 md:py-2.5 px-3 py-2 rounded-xl bg-[#005AA9] text-white font-bold hover:bg-[#004785] transition active:scale-95 text-xs shadow-md shadow-[#005AA9]/15"
            >
              {eligibility.hasExisting ? "Edit Your Review" : "Write a Review"}
            </button>
          ) : (
            <div className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
              {eligibility?.message || "Sign in to write a review"}
            </div>
          )}
        </div>

        {/* Dynamic Review Submission Form */}
        {isFormOpen && (
          <form onSubmit={handleSubmitReview} className="mb-10 bg-slate-50 border border-slate-200/60 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm max-w-3xl">
            <h4 className="text-lg font-bold text-[#002244]">
              {eligibility?.hasExisting ? "Update Your Experience" : "Share Your Experience"}
            </h4>

            {/* Star Rating Select */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">Overall Rating</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = star <= (hoverRating ?? rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          filled ? "fill-[#FFB300] text-[#FFB300]" : "fill-none text-slate-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="formTitle" className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">Review Title (Optional)</label>
              <input
                id="formTitle"
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Example: Extremely satisfied! My pet loves it"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-[#005AA9] focus:outline-none focus:ring-2 focus:ring-[#005AA9]/10 transition"
              />
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label htmlFor="comment" className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">Detailed Review</label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How does your pet like this product? Mention quality, size, flavor, etc."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-[#005AA9] focus:outline-none focus:ring-2 focus:ring-[#005AA9]/10 transition"
              />
            </div>

            {/* Photo Uploads */}
            <div className="space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">Add Photos (Optional)</label>
              <div className="flex flex-wrap items-center gap-3">
                {/* Upload Button */}
                <label className="h-20 w-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-[#005AA9] hover:bg-[#005AA9]/5 transition">
                  <Camera className="h-6 w-6 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-500 mt-1">Upload</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploadingImages}
                  />
                </label>

                {/* Uploaded Previews */}
                {images.map((url, idx) => (
                  <div key={idx} className="h-20 w-20 relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 group shadow-sm">
                    <Image
                      src={url}
                      alt={`Review photo ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 h-5 w-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {uploadingImages && (
                  <div className="h-20 w-20 flex items-center justify-center bg-slate-100 border border-slate-200 rounded-xl">
                    <Loader2 className="h-6 w-6 text-[#005AA9] animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {formError && (
              <div className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="text-xs font-bold text-emerald-500 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
                {formSuccess}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitLoading || uploadingImages}
                className="px-6 py-2.5 rounded-xl bg-[#005AA9] text-white font-bold hover:bg-[#004785] transition text-xs shadow-md shadow-[#005AA9]/15 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {eligibility?.hasExisting ? "Update Review" : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 transition text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Summary Column */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
            <span className="text-3xl md:text-5xl font-black text-[#002244]">
              {stats.averageRating.toFixed(1)}
            </span>
            <div className="flex items-center gap-1 my-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(stats.averageRating)
                      ? "fill-[#FFB300] text-[#FFB300]"
                      : "fill-slate-100 text-slate-100"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
              Based on {stats.totalCount} reviews
            </span>

            {/* Progress Bars */}
            <div className="w-full space-y-2.5">
              {([5, 4, 3, 2, 1] as const).map((stars) => {
                const pct = stats.ratingBreakdown?.[stars] || 0;
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
            {/* Sorting Controls */}
            {reviews.length > 0 && (
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-slate-500">
                  Showing {reviews.length} of {stats.totalCount} Reviews
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPage(1);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Most Recent</option>
                    <option value="highest-rating">Highest Rating</option>
                    <option value="lowest-rating">Lowest Rating</option>
                    <option value="helpful">Most Helpful</option>
                  </select>
                </div>
              </div>
            )}

            {loadingReviews ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin text-[#005AA9] mb-2" />
                <span className="text-xs font-bold">Loading reviews...</span>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400">
                <p className="text-sm font-bold">No reviews yet for this product.</p>
                <p className="text-xs mt-1">Be the first to share your feedback!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((rev) => {
                  const isHelpfulByUser = rev.helpfulVotes.includes(currentUserId);
                  return (
                    <div key={rev._id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
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
                        <span className="text-xs font-semibold text-slate-400">
                          {new Date(rev.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {rev.userAvatar ? (
                          <div className="relative h-7 w-7 rounded-full overflow-hidden border border-slate-200">
                            <Image src={rev.userAvatar} alt={rev.userName} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-[#005AA9]/10 text-[#005AA9] flex items-center justify-center text-xs font-bold uppercase">
                            {rev.userName.slice(0, 2)}
                          </div>
                        )}
                        <span className="font-extrabold text-[#002244] text-xs">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-emerald-500 font-bold flex items-center gap-1 text-[10px] uppercase tracking-wider">
                            <Check className="h-3.5 w-3.5" /> Verified Purchase
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {rev.title && <h5 className="font-bold text-[#002244] text-sm">{rev.title}</h5>}
                        <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">{rev.comment}</p>
                      </div>

                      {/* Photo Gallery inside Review Card */}
                      {rev.images && rev.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {rev.images.map((imgUrl: string, imgIdx: number) => (
                            <button
                              key={imgIdx}
                              type="button"
                              onClick={() => openLightbox(rev.images, imgIdx)}
                              className="relative h-16 w-16 rounded-lg border border-slate-200 overflow-hidden cursor-pointer hover:opacity-95 transition"
                            >
                              <Image src={imgUrl} alt={`Review media ${imgIdx}`} fill className="object-cover" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Helpful voting and reporting */}
                      <div className="flex items-center gap-4 pt-2 border-t border-slate-50 text-xs">
                        <button
                          type="button"
                          onClick={() => handleHelpfulClick(rev._id)}
                          className={`flex items-center gap-1.5 font-bold transition cursor-pointer ${
                            isHelpfulByUser ? "text-[#005AA9]" : "text-slate-500 hover:text-[#005AA9]"
                          }`}
                        >
                          <ThumbsUp className={`h-4 w-4 ${isHelpfulByUser ? "fill-[#005AA9]" : ""}`} /> Helpful ({rev.helpfulCount})
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1.5 font-bold text-slate-400 hover:text-red-500 transition cursor-pointer"
                        >
                          <Flag className="h-3.5 w-3.5" /> Report
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-bold text-slate-600">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      disabled={page === totalPages}
                      className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
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
                    src={product.images?.[0] || "/images/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="96px"
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
                    src={bundleItems[0].images?.[0] || "/images/placeholder.png"}
                    alt={bundleItems[0].name}
                    fill
                    className="object-contain"
                    sizes="96px"
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
                        src={bundleItems[1].images?.[0] || "/images/placeholder.png"}
                        alt={bundleItems[1].name}
                        fill
                        className="object-contain"
                        sizes="96px"
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

      {/* Lightbox Modal */}
      {lightboxIndex !== null && lightboxImagesList.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-[99999] flex flex-col items-center justify-center select-none animate-fadeIn">
          {/* Top Panel */}
          <div className="absolute top-4 right-4 flex items-center gap-4 text-white font-bold text-xs">
            <span>
              Image {lightboxIndex + 1} of {lightboxImagesList.length}
            </span>
            <button
              onClick={closeLightbox}
              className="p-2 bg-white/10 hover:bg-white/20 transition rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Controls */}
          {lightboxImagesList.length > 1 && (
            <>
              <button
                onClick={prevLightboxImage}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextLightboxImage}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Center Image */}
          <div className="relative w-full max-w-4xl h-[75vh] px-8 flex items-center justify-center">
            <Image
              src={lightboxImagesList[lightboxIndex]}
              alt={`Review media fullscreen view`}
              width={1200}
              height={900}
              className="object-contain max-w-full max-h-full rounded-md shadow-2xl"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
