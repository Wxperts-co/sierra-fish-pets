"use client";

import { StockStatus } from "@/types";

interface StockStatusFilterProps {
  selectedStatus: StockStatus | null;
  onSelect: (status: StockStatus | null) => void;
}

const options: {
  label: string;
  value: StockStatus;
}[] = [
  {
    label: "In Stock",
    value: "in_stock",
  },
  {
    label: "Out of Stock",
    value: "out_of_stock",
  },
];

export default function StockStatusFilter({
  selectedStatus,
  onSelect,
}: StockStatusFilterProps) {
  return (
    <div className="space-y-1 pb-1">
      {options.map((option) => {
        const isChecked =
          selectedStatus === option.value;

        return (
          <label
            key={option.value}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              isChecked
                ? "bg-[#379ae5]/10 text-[#005ca5]"
                : "hover:bg-slate-50 text-slate-600"
            }`}
          >
            {/* Checkbox */}
            <span
              className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border-2 transition-colors ${
                isChecked
                  ? "border-[#379ae5] bg-[#379ae5]"
                  : "border-slate-300 bg-white"
              }`}
            >
              {isChecked && (
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  width={10}
                  height={10}
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>

            <input
              type="checkbox"
              checked={isChecked}
              onChange={() =>
                onSelect(
                  isChecked
                    ? null
                    : option.value
                )
              }
              className="sr-only"
            />

            <span
              className={`text-sm font-medium ${
                isChecked
                  ? "text-[#005ca5]"
                  : "text-slate-600"
              }`}
            >
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}