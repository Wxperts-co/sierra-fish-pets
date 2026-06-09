"use client";

type SubCategory = {
  id: string;
  name: string;
  slug: string;
};

interface SubCategoryFilterProps {
  subcategories: SubCategory[];
  selectedSubcategories: string[];
  onToggle: (slug: string) => void;
}

export default function SubCategoryFilter({
  subcategories,
  selectedSubcategories,
  onToggle,
}: SubCategoryFilterProps) {
  if (!subcategories.length) return null;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
        Sub Categories
      </h3>

      <div className="space-y-1">
        {subcategories.map((subcategory) => {
          const isChecked = selectedSubcategories.includes(subcategory.slug);
          return (
            <label
              key={subcategory.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                isChecked
                  ? "bg-teal-50 text-teal-700"
                  : "hover:bg-slate-50 text-slate-600"
              }`}
            >
              {/* Custom styled checkbox */}
              <span
                className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                  isChecked
                    ? "border-teal-600 bg-teal-600"
                    : "border-slate-300 bg-white"
                }`}
                style={{ width: 18, height: 18, minWidth: 18 }}
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

              {/* Hidden native checkbox for a11y */}
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(subcategory.slug)}
                className="sr-only"
              />

              <span className={`text-sm font-medium ${isChecked ? "text-teal-700" : "text-slate-600"}`}>
                {subcategory.name}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}