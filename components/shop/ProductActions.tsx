"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart, updateQuantity } from "@/store/slices/cartSlice";
import { toggleWishlistDb } from "@/store/slices/wishlistSlice";
import type { Product } from "@/types";

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const dispatch = useAppDispatch();

  const cartItem = useAppSelector((state) =>
    state.cart.items.find((item) => item.product.id === product.id)
  );
  const isInCart = !!cartItem;

  const [quantity, setQuantity] = useState(1);

  // Sync quantity with cart item if product is already in cart
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem?.quantity]);

  const isInWishlist = useAppSelector((state) =>
    state.wishlist.productIds.includes(product.id)
  );

  const handleDecrease = () => {
    const newQty = Math.max(1, quantity - 1);
    setQuantity(newQty);
    if (isInCart) {
      dispatch(updateQuantity({ productId: product.id, quantity: newQty }));
    }
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    if (isInCart) {
      dispatch(updateQuantity({ productId: product.id, quantity: newQty }));
    }
  };

  const handleAddToCart = () => {
    if (!isInCart) {
      dispatch(addToCart({ product, quantity }));
    } else {
      dispatch(addToCart({ product, quantity: 1 }));
    }
    setQuantity((q) => q + 1);
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlistDb(product.id));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Quantity Selector */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Quantity
        </span>
        <div className="flex items-center w-max rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="w-11 h-11 flex items-center justify-center font-bold text-slate-500 hover:bg-slate-50 hover:text-[#005AA9] transition active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            -
          </button>
          <span className="w-12 h-11 flex items-center justify-center font-semibold text-slate-800 text-sm border-x border-slate-100 select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            className="w-11 h-11 flex items-center justify-center font-bold text-slate-500 hover:bg-slate-50 hover:text-[#005AA9] transition active:scale-95 cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 md:gap-4">
        <button
          onClick={handleAddToCart}
          className="
            flex items-center gap-1.5 md:gap-2
            rounded-xl
            bg-[#005AA9]
            px-4 md:px-8
            py-2.5 md:py-3
            text-xs md:text-sm
            font-semibold
            text-white
            transition
            hover:bg-[#00488a]
            active:scale-95
            cursor-pointer
          "
        >
          <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
          {isInCart ? "Added to Cart" : "Add To Cart"}
        </button>

        <button
          onClick={handleToggleWishlist}
          className="
            flex items-center gap-1.5 md:gap-2
            rounded-xl
            border
            border-gray-300
            px-4 md:px-8
            py-2.5 md:py-3
            text-xs md:text-sm
            font-semibold
            transition
            hover:bg-gray-50
            active:scale-95
            cursor-pointer
          "
        >
          <Heart
            className={`h-4 w-4 md:h-5 md:w-5 ${isInWishlist ? "fill-rose-500 text-rose-500" : "text-gray-500"}`}
          />
          {isInWishlist ? "Wishlisted" : "Add To Wishlist"}
        </button>
      </div>
    </div>
  );
}
