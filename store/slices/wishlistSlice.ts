import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { openLoginModal } from "./authModalSlice";

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
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.productIds = action.payload.filter(id => id && id.trim() !== "");
    },

    addToWishlist: (state, action: PayloadAction<string>) => {
      const exists = state.productIds.includes(action.payload);
      if (!exists) {
        state.productIds.push(action.payload);
      }
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.productIds = state.productIds.filter((id) => id !== action.payload);
    },

    toggleWishlist: (state, action: PayloadAction<string>) => {
      const exists = state.productIds.includes(action.payload);
      if (exists) {
        state.productIds = state.productIds.filter((id) => id !== action.payload);
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
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

// Async thunk action to toggle wishlist with database synchronization
export const toggleWishlistDb = (productId: string) => async (
  dispatch: any,
  getState: any
) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) {
    dispatch(openLoginModal());
    return;
  }

  // Optimistically toggle locally
  dispatch(toggleWishlist(productId));

  try {
    const res = await axios.post("/api/auth/wishlist/toggle", { productId });
    if (res.data.success) {
      dispatch(setWishlist(res.data.wishlist));
    }
  } catch (error) {
    console.error("Failed to sync wishlist with database:", error);
    // Revert local state in case of error
    dispatch(toggleWishlist(productId));
  }
};

export default wishlistSlice.reducer;