"use client";

type Brand = {
  id: string;
  name: string;
  slug: string;
};

interface BrandFilterProps {
  brands: Brand[];
  selectedBrands: string[];
  onToggle: (slug: string) => void;
}

export default function BrandFilter({
  brands,
  selectedBrands,
  onToggle,
}: BrandFilterProps) {
  if (!brands.length) return null;

  return (
    <div className="space-y-1 pb-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
      {brands.map((brand) => {
        const isChecked = selectedBrands.includes(
          brand.slug
        );

        return (
          <label
            key={brand.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              isChecked
                ? "bg-[#379ae5]/10 text-[#005ca5]"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {/* Custom Checkbox */}
            <span
              className={`flex shrink-0 items-center justify-center rounded border-2 transition-colors ${
                isChecked
                  ? "border-[#379ae5] bg-[#379ae5]"
                  : "border-slate-300 bg-white"
              }`}
              style={{
                width: 18,
                height: 18,
                minWidth: 18,
              }}
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

            {/* Hidden Checkbox */}
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(brand.slug)}
              className="sr-only"
            />

            <span
              className={`text-sm font-medium ${
                isChecked
                  ? "text-[#005ca5]"
                  : "text-slate-600"
              }`}
            >
              {brand.name}
            </span>
          </label>
        );
      })}
    </div>
  );
}