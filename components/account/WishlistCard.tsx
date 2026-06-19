"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Product } from "@/types";

interface WishlistCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onRemove: (productId: string) => void;
}

export default function WishlistCard({
  product,
  onAddToCart,
  onRemove,
}: WishlistCardProps) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100
      )
    : 0;

  return (
    <div className="group relative flex gap-4 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Product Thumbnail */}
      <Link
        href={`/product/${product.id}`}
        className="relative h-28 w-28 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100 block"
      >
        <Image
          src={product.images?.[0] || "/images/placeholder.png"}
          alt={product.name}
          fill
          sizes="112px"
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <span className="absolute left-2 top-2 bg-rose-500 text-white text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded uppercase">
            -{discountPercent}%
          </span>
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="space-y-1">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            {product.brand}
          </p>
          <Link
            href={`/product/${product.id}`}
            className="block font-bold text-slate-800 text-sm hover:text-primary transition-colors line-clamp-2 leading-tight pr-6"
          >
            {product.name}
          </Link>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base font-black text-slate-800">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs font-semibold text-slate-400 line-through">
                ${product.compareAtPrice?.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-50">
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stockStatus === "out_of_stock"}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer ${
              product.stockStatus === "out_of_stock"
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-blue-50 text-primary hover:bg-primary hover:text-white"
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>
              {product.stockStatus === "out_of_stock" ? "Out of Stock" : "Add to Cart"}
            </span>
          </button>
          <button
            onClick={() => onRemove(product.id)}
            className="p-2 rounded-lg border border-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            title="Remove from wishlist"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
