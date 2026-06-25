import Image from "next/image";
import React from "react";
import { Clock, PawPrint } from "lucide-react";

export interface Dog {
  id: string;
  name: string;
  slug: string;
  image: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  color: string;
  vaccinated: boolean;
  neutered: boolean;
  goodWithKids: boolean;
  goodWithDogs: boolean;
  goodWithCats: boolean;
  adoptionStatus: string;
  featured: boolean;
  description: string;
  personality: string[];
  adoptionFee: string;
}

interface AdoptionCardProps {
  dog: Dog;
  badge?: "NEW" | "POPULAR" | null;
  onOpenProfile: (dog: Dog) => void;
}

export default function AdoptionCard({ dog, badge, onOpenProfile }: AdoptionCardProps) {
  return (
    <div className="flex flex-col bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.07)] hover:scale-[1.01] transition-all duration-300 group">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden z-0">
        <Image
          src={dog.image || "/placeholder-product.png"}
          alt={dog.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge Pill */}
        {badge && (
          <div
            className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider select-none ${
              badge === "NEW"
                ? "bg-emerald-500 text-white"
                : "bg-orange-500 text-white"
            }`}
          >
            {badge}
          </div>
        )}
      </div>

      {/* Info Block */}
      <div className="p-6 flex flex-col flex-1">
        {/* Name */}
        <h3 className="font-extrabold text-2xl text-slate-800 tracking-tight mb-2">
          {dog.name}
        </h3>

        {/* Meta Row: Age & Breed */}
        <div className="flex items-center flex-wrap gap-2 text-slate-500 text-xs font-semibold">
          <div className="flex items-center gap-1.5 shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#005AA9]/70" />
            <span>{dog.age}</span>
          </div>
          <span className="text-slate-300 font-bold select-none">•</span>
          <div className="flex items-center gap-1.5 min-w-0">
            <PawPrint className="w-3.5 h-3.5 text-[#005AA9]/70 shrink-0" />
            <span className="truncate">{dog.breed}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 font-medium leading-relaxed mt-4 mb-6 line-clamp-2 min-h-[2.5rem]">
          {dog.description}
        </p>

        {/* CTA Button */}
        <button
          onClick={() => onOpenProfile(dog)}
          className="mt-auto w-full bg-[#005AA9] hover:bg-[#004b8d] text-white py-3 rounded-2xl text-xs font-bold transition-all duration-200 text-center shadow-md shadow-blue-500/5 hover:scale-[1.02] active:scale-98 cursor-pointer"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}
