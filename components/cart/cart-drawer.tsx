"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { RootState } from "@/store";
import { CartDrawerItem } from "./cart-drawer-item";
import { setLoading } from "@/store/slices/productsSlice";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const cart = useSelector((state: RootState) => state.cart);

  const cartCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  const freeShippingGoal = 50;
  const progress = Math.min((cart.subtotal / freeShippingGoal) * 100, 100);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 transition">
            <ShoppingBag className="h-5 w-5" />

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black text-[10px] text-white px-1">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        }
      />

      <SheetContent className="flex w-full flex-col p-0 sm:max-w-[440px]">
        {/* HEADER */}
        <div className="border-b px-5 py-4">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <p className="text-xs text-muted-foreground">
            {cartCount} item{cartCount !== 1 ? "s" : ""} in your bag
          </p>
        </div>

        {/* FREE SHIPPING PROGRESS */}
        {/* {cart.items.length > 0 && (
          <div className="px-5 pt-4">
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs text-gray-600">
                {cart.subtotal >= freeShippingGoal
                  ? "🎉 You unlocked free shipping"
                  : `Add $${(freeShippingGoal - cart.subtotal).toFixed(
                      2,
                    )} for free shipping`}
              </p>

              <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-black transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )} */}

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="h-10 w-10 text-gray-400 mb-3" />
              <p className="font-medium">Your cart is empty</p>
              <p className="text-xs text-gray-500 mt-1">
                Add items to start your order
              </p>

              <Button
                className="mt-5"
                onClick={() => {
                  setOpen(false);
                  router.push("/shop");
                }}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            cart.items.map((item) => (
              <CartDrawerItem key={item.product.id} item={item} />
            ))
          )}
        </div>

        {/* STICKY FOOTER */}
        {cart.items.length > 0 && (
          <div className="border-t bg-white px-5 py-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">${cart.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Shipping {cart.fulfillmentMethod === "pickup" ? "(Pickup)" : ""}</span>
              <span className="font-semibold text-slate-800">
                {cart.shipping === 0 ? "FREE" : `$${cart.shipping.toFixed(2)}`}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Sales Tax (10.5%)</span>
              <span className="font-semibold text-slate-800">${(cart.tax || 0).toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-sm font-bold text-slate-900 border-t pt-2">
              <span>Total</span>
              <span className="font-mono text-base">${cart.total.toFixed(2)}</span>
            </div>

            <Button
              className="w-full h-11 text-sm font-medium bg-[#005AA9] hover:bg-blue-700 mt-2"
              disabled={cart.items.length === 0}
              onClick={() => {
                setOpen(false);
                setLoading(true);
                router.push("/checkout");
              }}
            >
              Checkout
            </Button>

            <Button
              variant="outline"
              className="w-full h-10 text-sm"
              onClick={() => {
                setOpen(false);
                router.push("/cart");
              }}
            >
              View Cart
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
