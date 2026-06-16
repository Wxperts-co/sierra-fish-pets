"use client";

import { Star, MessageSquare } from "lucide-react";
import AccountHeader from "@/components/account/AccountHeader";

export const userReviews = [
  {
    id: "rev-1",
    productName: "Fluval 307 Canister Filter",
    rating: 5,
    title: "Crystal Clear Water!",
    comment: "This filter keeps my 55-gallon tank crystal clear. It's incredibly quiet and maintenance is straightforward. Worth every penny!",
    date: "May 21, 2024",
  },
  {
    id: "rev-2",
    productName: "Blue Buffalo Life Protection Formula Dog Food",
    rating: 4,
    title: "My dog loves it",
    comment: "Great quality ingredients. My retriever has a shiny coat and digests it very well. Just wish it was a bit cheaper.",
    date: "April 15, 2024",
  },
];

export default function ReviewsPage() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 font-lato space-y-6">
      <AccountHeader
        title="My Reviews"
        description="View and edit feedback you left on products you purchased."
        icon={<Star className="h-6 w-6 text-amber-400 fill-amber-400" />}
      />

      <div className="space-y-6 pt-2">
        {userReviews.map((rev) => (
          <div key={rev.id} className="border border-slate-100 rounded-2xl p-6 bg-[#f8fafd]/50 hover:bg-[#f8fafd] transition-colors duration-200 space-y-3">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h4 className="font-extrabold text-slate-800 text-[15px]">{rev.productName}</h4>
                <p className="text-xs text-slate-400 font-bold mt-0.5">{rev.date}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4.5 w-4.5 ${
                      i < rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-slate-800 text-sm">{rev.title}</h5>
              <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
