"use client";

import { Bell, Info, Package, Tag, CheckCircle } from "lucide-react";

const notificationsList = [
  {
    id: "not-1",
    title: "Order #SFP-2025-0047 Shipped!",
    message: "Your order has been shipped and is on the way. Estimated delivery is May 23, 2024.",
    icon: Package,
    colorClass: "bg-cyan-50 text-cyan-600 border-cyan-100",
    date: "May 20, 2024",
    isUnread: true,
  },
  {
    id: "not-2",
    title: "Big Aquatic Sale is Live!",
    message: "Treat your fish! Save 20% on all fish food and aquarium filters using code AQUA20.",
    icon: Tag,
    colorClass: "bg-blue-50 text-[#005AA9] border-blue-100",
    date: "May 19, 2024",
    isUnread: true,
  },
  {
    id: "not-3",
    title: "Email Verified Successfully",
    message: "Thank you for verifying your email. You can now check out and manage your account seamlessly.",
    icon: CheckCircle,
    colorClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
    date: "May 18, 2024",
    isUnread: true,
  },
];

export default function NotificationsPage() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 font-lato space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-[#005AA9]" />
            <span>Notifications</span>
          </h2>
          <p className="text-slate-500 text-sm font-semibold">
            Track order status updates and exclusive pet supply offers.
          </p>
        </div>
        <span className="text-xs font-black bg-[#e6f0fa] text-[#005AA9] px-3 py-1.5 rounded-full select-none">
          3 Unread
        </span>
      </div>

      <div className="space-y-4 pt-2">
        {notificationsList.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-150 ${
                item.isUnread
                  ? "bg-slate-50/50 border-slate-100 shadow-sm"
                  : "bg-white border-slate-100"
              }`}
            >
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border ${item.colorClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-extrabold text-slate-800 text-[15px]">{item.title}</h4>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{item.date}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                  {item.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
