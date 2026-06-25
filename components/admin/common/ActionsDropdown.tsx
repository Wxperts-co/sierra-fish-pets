"use client";

import React, { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";

type ActionItem = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

type Props = {
  actions: ActionItem[];
};

export default function ActionsDropdown({ actions }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If space below the button is less than 160px (dropdown height is approx 130px), open upward.
      setOpenUpward(spaceBelow < 160);
    }
    setIsOpen(!isOpen);
  };

  const getButtonClasses = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("delete")) {
      return "hover:border-red-200 hover:bg-red-50 text-slate-500 hover:text-red-650";
    }
    if (l.includes("edit")) {
      return "hover:border-blue-200 hover:bg-blue-50 text-slate-500 hover:text-[#005AA9]";
    }
    // Default/View
    return "hover:border-slate-300 hover:bg-slate-50 text-slate-500 hover:text-slate-800";
  };

  const getDropdownItemClasses = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("delete")) {
      return "text-red-600 hover:bg-red-50";
    }
    if (l.includes("edit")) {
      return "text-blue-600 hover:bg-blue-50";
    }
    return "text-slate-700 hover:bg-slate-50";
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Mobile view: Three dots dropdown trigger */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={handleToggle}
          className="inline-flex h-9 w-9 items-center justify-center border border-slate-100 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition active:scale-95 cursor-pointer"
          aria-label="Open actions"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {isOpen && (
          <div
            className={`absolute right-0 w-36 rounded-xl border border-slate-200 bg-white shadow-xl py-1.5 z-[250] animate-in fade-in duration-150 ${
              openUpward
                ? "bottom-full mb-1 slide-in-from-bottom-1"
                : "top-full mt-1 slide-in-from-top-1"
            }`}
          >
            {actions.map((act, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  act.onClick();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold transition ${getDropdownItemClasses(act.label)}`}
              >
                <span className="shrink-0">{act.icon}</span>
                <span>{act.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop view: Side-by-side action buttons */}
      <div className="hidden sm:flex items-center justify-end gap-2">
        {actions.map((act, idx) => (
          <button
            key={idx}
            type="button"
            onClick={act.onClick}
            className={`inline-flex h-9 w-9 items-center justify-center border border-slate-100 rounded-xl bg-white transition active:scale-95 cursor-pointer ${getButtonClasses(act.label)}`}
            title={act.label}
          >
            {act.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
