import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  CategorySlug,
  StockStatus,
} from "@/types";
import { allProducts } from "@/data";

export const DEFAULT_MAX_PRICE = Math.ceil(Math.max(...allProducts.map((p) => p.price), 0));

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
  brands: string[];

  search: string;

  minPrice: number;
  maxPrice: number;

  stockStatus: StockStatus | null;
  minRating: number | null;
  sortBy: SortOption;
}

const initialState: FiltersState = {
  category: null,
  subcategory: null,
  brands: [],

  search: "",

  minPrice: 0,
  maxPrice: DEFAULT_MAX_PRICE,

  stockStatus: null,
  minRating: null,
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
      if (state.category !== action.payload) {
        state.category = action.payload;
        state.subcategory = null;
        state.brands = [];
      }
    },

    setSubcategory: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.subcategory = action.payload;
    },

    toggleBrand: (
        state,
        action: PayloadAction<string>
      ) => {
        const brand = action.payload;

        if (state.brands.includes(brand)) {
          state.brands = state.brands.filter(
            (item) => item !== brand
          );
        } else {
          state.brands.push(brand);
        }
      },
      setBrands: (
        state,
        action: PayloadAction<string[]>
      ) => {
        state.brands = action.payload;
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

    setMinRating: (
      state,
      action: PayloadAction<number | null>
    ) => {
      state.minRating = action.payload;
    },

    clearFilters: (state) => {
      state.subcategory = null;
      state.brands = [];

      state.search = "";

      state.minPrice = 0;
      state.maxPrice = DEFAULT_MAX_PRICE;

      state.stockStatus = null;
      state.minRating = null;
      state.sortBy = "featured";
    },
  },
});

export const {
  setCategory,
  setSubcategory,
  toggleBrand,
  setBrands,
  setSearch,
  setPriceRange,
  setStockStatus,
  setSortBy,
  clearFilters,
  setMinRating,
} = filtersSlice.actions;

export default filtersSlice.reducer;