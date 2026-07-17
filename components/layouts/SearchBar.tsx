"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import type { Product } from "@/types";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onClose?: () => void;
  inputClassName?: string;
  iconClassName?: string;
}

export default function SearchBar({ 
  className = "relative flex-1 max-w-[200px]", 
  placeholder = "Search products...",
  onClose,
  inputClassName = "w-full pl-8 pr-2.5 py-1.5 bg-white text-slate-800 placeholder:text-slate-400 text-xs rounded-lg border-0 focus:ring-2 focus:ring-cyan-400 outline-none transition-all shadow-inner font-medium",
  iconClassName = "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400"
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(debouncedQuery)}&limit=5`);
        const data = await res.json();
        if (data.success) {
          setResults(data.products || []);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Search fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      setIsOpen(false);
      if (onClose) onClose();
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
    if (onClose) onClose();
  };

  return (
    <div className={className} ref={dropdownRef}>
      <Search className={iconClassName} />
      <input
        type="text"
        placeholder={placeholder}
        className={inputClassName}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (results.length > 0) setIsOpen(true);
        }}
      />
      {isLoading && (
        <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 animate-spin text-slate-400" />
      )}

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="fixed left-3 right-3 top-12 z-50 max-h-[min(420px,calc(100vh-5rem))] overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-xl lg:absolute lg:left-0 lg:right-0 lg:top-full lg:mt-2 lg:max-h-[400px] lg:w-full lg:min-w-[250px]">
          {results.length > 0 ? (
            <div className="flex flex-col gap-1 p-2.5 lg:p-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={handleResultClick}
                  className="group flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-slate-50 lg:p-2"
                >
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-slate-100 lg:h-10 lg:w-10">
                    <Image
                      src={product.images?.[0] || "/placeholderimg.png"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="line-clamp-2 text-sm font-bold leading-snug text-slate-800 lg:line-clamp-none lg:truncate lg:text-xs">
                      {product.name}
                    </span>
                    <span className="text-xs font-medium text-slate-500 lg:text-[10px]">
                      ${product.price?.toFixed(2)}
                    </span>
                  </div>
                </Link>
              ))}
              <button
                onClick={() => {
                  handleResultClick();
                  router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
                }}
                className="w-full mt-1 py-2 text-xs font-bold text-[#005AA9] hover:bg-blue-50 rounded-lg transition-colors text-center"
              >
                View all results
              </button>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-500 font-medium">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
