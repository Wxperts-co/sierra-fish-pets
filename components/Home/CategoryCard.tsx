import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

import categories from "@/data/categories.json";

const CATEGORY_BACKGROUNDS: Record<string, string> = {
  dog: "bg-[#FFF0ED]",
  cat: "bg-[#F6EFFF]",
  aquatic: "bg-[#EBF7FF]",
  reptile: "bg-[#EEFBF0]",
  bird: "bg-[#FFFBE5]",
  "small-animal": "bg-[#F5F5F7]",
};

export default function CategoryCards() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">

        {/* Header Title */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            <span className="text-[#005AA9]">Top</span> categories
          </h2>
        </div>

        {/* Categories Grid (Single row of 6 on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">

          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop/${category.slug}`}
              className="group flex flex-col items-center"
            >
              {/* Rounded Card with pastel BG — image fills the entire card */}
              <div
                className={`aspect-square w-full rounded-[2rem] relative overflow-hidden transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg ${
                  CATEGORY_BACKGROUNDS[category.slug] || "bg-slate-100"
                }`}
              >
                {/* Animal Image — covers entire card, matching background */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />

                {/* Plus icon overlay on Hover */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-300">
                    <Plus className="w-5 h-5 stroke-[3] text-slate-800" />
                  </div>
                </div>
              </div>

              {/* Label Text below Card */}
              <div className="mt-4 text-center">
                <h3 className="text-[17px] font-bold text-slate-800 group-hover:text-[#005AA9] transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}