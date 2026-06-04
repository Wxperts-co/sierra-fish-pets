import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  productIds: string[];
}

const initialState: WishlistState = {
  productIds: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    addToWishlist: (
      state,
      action: PayloadAction<string>
    ) => {
      const exists = state.productIds.includes(
        action.payload
      );

      if (!exists) {
        state.productIds.push(action.payload);
      }
    },

    removeFromWishlist: (
      state,
      action: PayloadAction<string>
    ) => {
      state.productIds = state.productIds.filter(
        (id) => id !== action.payload
      );
    },

    toggleWishlist: (
      state,
      action: PayloadAction<string>
    ) => {
      const exists = state.productIds.includes(
        action.payload
      );

      if (exists) {
        state.productIds = state.productIds.filter(
          (id) => id !== action.payload
        );
      } else {
        state.productIds.push(action.payload);
      }
    },

    clearWishlist: (state) => {
      state.productIds = [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;