"use client";

import Image from "next/image";
import { CalendarDays, MapPin, Mars, Venus } from "lucide-react";

export interface ArrivalPet {
  id: string;
  name: string;
  slug: string;
  category: string;
  breed: string;

  gender: string;
  age: string;
  size: string;

  price: number;
  discountPrice?: number | null;

  arrivalDate: string;

  status: string;
  featured: boolean;

  description: string;

  images: string[];

  location: string;

  stock: number;

  vaccinated: boolean;
  dewormed: boolean;
  microchipped: boolean;
  highlights: string[];
}

interface ArrivalCardProps {
  pet: ArrivalPet;
  onViewDetails?: (pet: ArrivalPet) => void;
}

export default function ArrivalCard({
  pet,
  onViewDetails,
}: ArrivalCardProps) {
  const displayPrice = pet.discountPrice ?? pet.price;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const mIndex = parseInt(month, 10) - 1;
    const mName = months[mIndex] || month;
    return `${mName} ${parseInt(day, 10)}, ${year}`;
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-[200px] overflow-hidden">
        <Image
          src={pet.images?.[0] || "/images/products/dog1.avif"}
          alt={pet.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

        {/* Category */}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 backdrop-blur">
            {pet.category.replace("-", " ")}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute right-3 top-3">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${
              pet.status === "available"
                ? "bg-emerald-500"
                : pet.status === "reserved"
                ? "bg-amber-500"
                : "bg-rose-500"
            }`}
          >
            {pet.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-base font-bold text-slate-900 line-clamp-1">
          {pet.name}
        </h3>

        {/* Breed */}
        <p className="mt-0.5 text-xs text-slate-500">{pet.breed}</p>

        {/* Arrival Date */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <CalendarDays size={14} className="text-slate-400" />
          <span>
            Arrived {formatDate(pet.arrivalDate)}
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-base font-extrabold text-[#005AA9]">
            ${displayPrice.toLocaleString()}
          </span>

          {pet.discountPrice && (
            <span className="text-[11px] text-slate-400 line-through">
              ${pet.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Button */}
        <button
          onClick={() => onViewDetails?.(pet)}
          className="mt-3.5 w-full rounded-xl bg-[#005AA9] px-4 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:bg-[#004b8d]"
        >
          View Details
        </button>
      </div>
    </article>
  );
}