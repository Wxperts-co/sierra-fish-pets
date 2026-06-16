import React from "react";
import { Home, Briefcase, Building, Check, Edit3, Trash2 } from "lucide-react";
import { UserAddress } from "@/types";

interface AddressCardProps {
  addr: UserAddress;
  savedAddressesCount: number;
  onEdit: (addr: UserAddress) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const getLabelIcon = (label: string) => {
  switch (label.toLowerCase()) {
    case "home":
      return <Home className="h-3.5 w-3.5" />;
    case "work":
    case "office":
      return <Briefcase className="h-3.5 w-3.5" />;
    default:
      return <Building className="h-3.5 w-3.5" />;
  }
};

export default function AddressCard({
  addr,
  savedAddressesCount,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  return (
    <div
      className={`border rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-200 ${
        addr.isDefault
          ? "border-primary/20 bg-blue-50/5"
          : "border-slate-100"
      }`}
    >
      <div className="space-y-4">
        {/* Header: Label, Default badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 border border-slate-100 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
            {getLabelIcon(addr.label)}
            <span>{addr.label}</span>
          </span>
          {addr.isDefault && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
              <Check className="h-3 w-3" />
              <span>Default</span>
            </span>
          )}
        </div>

        {/* Address details */}
        <div className="space-y-1 text-slate-600 text-sm font-semibold leading-relaxed">
          <p className="font-extrabold text-slate-800 text-[15px]">{addr.fullName}</p>
          <p>{addr.address}</p>
          <p>
            {addr.city}, {addr.state} {addr.zipCode}
          </p>
          <p className="text-xs text-slate-400 font-bold">{addr.country}</p>
          <p className="text-slate-400 text-xs mt-1.5 font-bold">Phone: {addr.phone}</p>
        </div>
      </div>

      {/* Actions footer */}
      <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100/50">
        <button
          onClick={() => onEdit(addr)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(addr.id)}
          disabled={addr.isDefault && savedAddressesCount > 1}
          className="px-3.5 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete</span>
        </button>
        {!addr.isDefault && (
          <button
            onClick={() => onSetDefault(addr.id)}
            className="ml-auto text-xs font-black text-[#005AA9] hover:underline"
          >
            Set as Default
          </button>
        )}
      </div>
    </div>
  );
}
