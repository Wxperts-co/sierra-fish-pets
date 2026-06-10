"use client";

import * as Slider from "@radix-ui/react-slider";
import { useAppDispatch } from "@/store/hooks";
import { setPriceRange } from "@/store/slices/filtersSlice";

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  onChange: (min: number, max: number) => void;
}

const MIN = 0;
const MAX = 400;

export default function PriceFilter({
  minPrice,
  maxPrice,
  onChange,
}: PriceFilterProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-4 px-2 pb-2">
      <Slider.Root
        className="relative flex h-5 w-full touch-none select-none items-center"
        value={[minPrice, maxPrice]}
        min={MIN}
        max={MAX}
        step={5}
        minStepsBetweenThumbs={1}

        // Updates UI while dragging
        onValueChange={([min, max]) => {
          dispatch(
            setPriceRange({
              min,
              max,
            })
          );
        }}

        // Updates URL when drag ends
        onValueCommit={([min, max]) => {
          onChange(min, max);
        }}
      >
        <Slider.Track className="relative h-1.5 grow rounded-full bg-slate-100">
          <Slider.Range className="absolute h-full rounded-full bg-[#379ae5]" />
        </Slider.Track>

        <Slider.Thumb
          className="block h-4 w-4 rounded-full border-2 border-[#379ae5] bg-white shadow-md outline-none ring-offset-2 focus:ring-2 focus:ring-[#379ae5] cursor-pointer"
          aria-label="Minimum price"
        />

        <Slider.Thumb
          className="block h-4 w-4 rounded-full border-2 border-[#379ae5] bg-white shadow-md outline-none ring-offset-2 focus:ring-2 focus:ring-[#379ae5] cursor-pointer"
          aria-label="Maximum price"
        />
      </Slider.Root>

      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700">
          ${minPrice}
        </div>

        <span className="text-slate-400 text-xs">—</span>

        <div className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700">
          ${maxPrice}
        </div>
      </div>
    </div>
  );
}