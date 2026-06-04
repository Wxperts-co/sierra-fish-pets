import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  CategorySlug,
  StockStatus,
} from "@/types";

export type SortOption =
  | "featured"
  | "newest"
  | "best-selling"
  | "price-low-high"
  | "price-high-low"
  | "rating";

interface FiltersState {
  category: CategorySlug | null;
  subcategory: string | null;
  brand: string | null;

  search: string;

  minPrice: number;
  maxPrice: number;

  stockStatus: StockStatus | null;

  sortBy: SortOption;
}

const initialState: FiltersState = {
  category: null,
  subcategory: null,
  brand: null,

  search: "",

  minPrice: 0,
  maxPrice: 10000,

  stockStatus: null,

  sortBy: "featured",
};

const filtersSlice = createSlice({
  name: "filters",

  initialState,

  reducers: {
    setCategory: (
      state,
      action: PayloadAction<CategorySlug | null>
    ) => {
      state.category = action.payload;
    },

    setSubcategory: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.subcategory = action.payload;
    },

    setBrand: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.brand = action.payload;
    },

    setSearch: (
      state,
      action: PayloadAction<string>
    ) => {
      state.search = action.payload;
    },

    setPriceRange: (
      state,
      action: PayloadAction<{
        min: number;
        max: number;
      }>
    ) => {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
    },

    setStockStatus: (
      state,
      action: PayloadAction<StockStatus | null>
    ) => {
      state.stockStatus = action.payload;
    },

    setSortBy: (
      state,
      action: PayloadAction<SortOption>
    ) => {
      state.sortBy = action.payload;
    },

    clearFilters: (state) => {
      state.category = null;
      state.subcategory = null;
      state.brand = null;

      state.search = "";

      state.minPrice = 0;
      state.maxPrice = 10000;

      state.stockStatus = null;

      state.sortBy = "featured";
    },
  },
});

export const {
  setCategory,
  setSubcategory,
  setBrand,
  setSearch,
  setPriceRange,
  setStockStatus,
  setSortBy,
  clearFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;