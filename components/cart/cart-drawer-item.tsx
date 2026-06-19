"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { removeFromCart, updateQuantity } from "@/store/slices/cartSlice";


interface Props {
  item: {
    product: {
      id: string;
      name: string;
      images: string[];
      price: number;
    };
    quantity: number;
  };
}

export function CartDrawerItem({ item }: Props) {
  const dispatch = useDispatch();

  const increase = () =>
    dispatch(
      updateQuantity({
        productId: item.product.id,
        quantity: item.quantity + 1,
      })
    );

  const decrease = () => {
    if (item.quantity === 1) return;
    dispatch(
      updateQuantity({
        productId: item.product.id,
        quantity: item.quantity - 1,
      })
    );
  };

  const remove = () => dispatch(removeFromCart(item.product.id));

  return (
    <div className="flex gap-4 rounded-xl border p-3 hover:shadow-sm transition bg-white">
      {/* IMAGE */}
      <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-gray-50">
        <Image
          src={item.product.images?.[0] || "/images/placeholder.png"}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h4 className="text-sm font-medium leading-snug line-clamp-2">
            {item.product.name}
          </h4>

          <p className="mt-1 text-sm font-semibold">
            ${(item.product.price * item.quantity).toFixed(2)}
          </p>
        </div>

        {/* CONTROLS ROW */}
        <div className="flex items-center justify-between mt-3">
          {/* QUANTITY PILL (modern UX) */}
          <div className="flex items-center rounded-full border px-2 py-1 gap-2">
            <button onClick={decrease} className="p-1 hover:opacity-70">
              <Minus className="h-3 w-3" />
            </button>

            <span className="text-xs w-6 text-center">
              {item.quantity}
            </span>

            <button onClick={increase} className="p-1 hover:opacity-70">
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* REMOVE */}
          <button
            onClick={remove}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}