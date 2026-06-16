import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  orderNumber: string;
  status: string;
  date: string;
  price: string;
  image: string;
}

interface RecentOrdersProps {
  orders: OrderItem[];
}

const getStatusClass = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "shipped":
      return "bg-blue-50 text-blue-600 border-blue-100";
    case "processing":
      return "bg-orange-50 text-orange-600 border-orange-100";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">
          Recent Orders
        </h3>
        <Link
          href="/account/orders"
          className="text-xs font-black text-[#005AA9] hover:underline flex items-center gap-1"
        >
          <span>View All Orders</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {orders.map((order) => (
          <div
            key={order.id}
            className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0 group"
          >
            {/* Product Info */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative h-16 w-16 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shrink-0">
                <Image
                  src={order.image}
                  alt={order.productName}
                  fill
                  sizes="64px"
                  className="object-contain p-1.5"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-slate-800 text-sm truncate leading-tight">
                  {order.productName}
                </h4>
                <p className="text-slate-400 text-xs font-bold mt-1">
                  Order #{order.orderNumber}
                </p>
              </div>
            </div>

            {/* Status, Date & Price */}
            <div className="flex items-center gap-6 md:gap-10">
              <div className="hidden sm:block text-center shrink-0">
                <span
                  className={`inline-block border text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
                <p className="text-[10px] text-slate-400 font-bold mt-1.5">
                  {order.date}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-black text-slate-800 text-sm">
                  {order.price}
                </p>
              </div>
              <Link
                href="/account/orders"
                className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              >
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
