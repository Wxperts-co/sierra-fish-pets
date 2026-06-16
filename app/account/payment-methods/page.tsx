"use client";

import { CreditCard, Plus, ShieldCheck, CheckCircle } from "lucide-react";

export default function PaymentMethodsPage() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 font-lato space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-[#005AA9]" />
            <span>Payment Methods</span>
          </h2>
          <p className="text-slate-500 text-sm font-semibold">
            Manage your saved credit cards and billing information.
          </p>
        </div>
        <button className="px-5 py-2.5 rounded-2xl bg-[#005AA9] hover:bg-blue-700 text-white font-bold transition-all inline-flex items-center gap-2 text-sm cursor-pointer shadow-md shadow-blue-500/10">
          <Plus className="h-4 w-4" />
          <span>Add New Card</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Visa Card Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md border border-slate-700/30 flex flex-col justify-between h-48">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Primary Card</p>
              <h4 className="font-extrabold text-lg mt-1">Visa Classic</h4>
            </div>
            <span className="text-xs font-black tracking-wider bg-white/10 px-2.5 py-1 rounded-full uppercase">
              Default
            </span>
          </div>

          <p className="text-xl font-bold tracking-widest my-4">•••• •••• •••• 4242</p>

          <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Card Holder</p>
              <p className="font-bold text-white">John Doe</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Expires</p>
              <p className="font-bold text-white">12/28</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-[#f8fafd] border border-slate-100 rounded-2xl p-6 flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#005AA9] flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Security Assured</h4>
              <p className="text-xs text-slate-500 font-medium">All billing info is fully encrypted and stored securely.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">PCI-DSS Compliant</h4>
              <p className="text-xs text-slate-500 font-medium">Processing meets global standards for card safety.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
