// store/slices/productsSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types";

interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
}

const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  loading: false,
};

const productsSlice = createSlice({
  name: "products",

  initialState,

  reducers: {
    setProducts: (
      state,
      action: PayloadAction<Product[]>
    ) => {
      state.products = action.payload;
    },

    setSelectedProduct: (
      state,
      action: PayloadAction<Product | null>
    ) => {
      state.selectedProduct = action.payload;
    },

    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },

    setLoading: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setProducts,
  setSelectedProduct,
  clearSelectedProduct,
  setLoading,
} = productsSlice.actions;

export default productsSlice.reducer;