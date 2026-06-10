"use client";

import { ShoppingCart, Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import type { Product } from "@/types";

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const dispatch = useAppDispatch();

  const isInWishlist = useAppSelector((state) =>
    state.wishlist.productIds.includes(product.id)
  );

  const isInCart = useAppSelector((state) =>
    state.cart.items.some((item) => item.product.id === product.id)
  );

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product.id));
  };

  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={handleAddToCart}
        className="
          flex items-center gap-2
          rounded-xl
          bg-[#005AA9]
          px-8
          py-3
          font-semibold
          text-white
          transition
          hover:bg-[#00488a]
          active:scale-95
        "
      >
        <ShoppingCart className="h-5 w-5" />
        {isInCart ? "Added to Cart" : "Add To Cart"}
      </button>

      <button
        onClick={handleToggleWishlist}
        className="
          flex items-center gap-2
          rounded-xl
          border
          border-gray-300
          px-8
          py-3
          font-semibold
          transition
          hover:bg-gray-50
          active:scale-95
        "
      >
        <Heart
          className={`h-5 w-5 ${isInWishlist ? "fill-rose-500 text-rose-500" : "text-gray-500"}`}
        />
        {isInWishlist ? "Wishlisted" : "Add To Wishlist"}
      </button>
    </div>
  );
}
