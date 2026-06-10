"use client";

interface RatingFilterProps {
  selectedRating: number | null;
  onSelect: (rating: number | null) => void;
}

const ratings = [4, 3, 2, 1];

export default function RatingFilter({
  selectedRating,
  onSelect,
}: RatingFilterProps) {
  return (
    <div className="space-y-1 pb-1">
      {ratings.map((rating) => {
        const isChecked = selectedRating === rating;

        return (
          <label
            key={rating}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
              isChecked
                ? "bg-yellow-50 text-yellow-700"
                : "hover:bg-slate-50 text-slate-600"
            }`}
          >
            <input
              type="radio"
              name="rating"
              checked={isChecked}
              onChange={() =>
                onSelect(
                  isChecked ? null : rating
                )
              }
              className="h-4 w-4 accent-yellow-500 cursor-pointer"
            />

            <span className="flex items-center gap-1 text-sm font-medium">
              {rating}
              <span className="text-yellow-500">
                ★
              </span>
              <span>& above</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}