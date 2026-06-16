"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleWishlistDb } from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { allProducts } from "@/data";
import WishlistCard from "@/components/account/WishlistCard";
import AccountHeader from "@/components/account/AccountHeader";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const wishlistProductIds = useAppSelector((state) => state.wishlist.productIds);

  // Filter products that exist in wishlist
  const wishlistProducts = allProducts.filter((product) =>
    wishlistProductIds.includes(product.id)
  );

  const handleAddToCart = (product: any) => {
    dispatch(addToCart(product));
  };

  const handleRemove = (productId: string) => {
    dispatch(toggleWishlistDb(productId));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 md:p-8 font-lato space-y-6">
      <AccountHeader
        title="My Wishlist"
        description="Keep track of your favorite products and purchase them anytime."
        icon={<Heart className="h-6 w-6 text-rose-500 fill-rose-500" />}
      />

      {wishlistProducts.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-200 rounded-2xl">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500 mb-4 animate-pulse">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-800 mb-1">
            Your wishlist is empty
          </h3>
          <p className="text-slate-500 mb-6 text-sm font-medium">
            Explore our categories and add products to your wishlist!
          </p>
          <Link
            href="/shop"
            className="px-6 py-2.5 rounded-xl bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] text-white font-bold transition-opacity hover:opacity-95"
          >
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlistProducts.map((product) => (
            <WishlistCard
              key={product.id}
              product={product as any}
              onAddToCart={handleAddToCart}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
