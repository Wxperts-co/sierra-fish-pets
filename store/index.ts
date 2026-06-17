import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";
import cartReducer from "./slices/cartSlice";
import productsReducer from "./slices/productsSlice";
import wishlistReducer from "./slices/wishlistSlice";
import filtersReducer from "./slices/filtersSlice";
import authReducer from "./slices/authSlice";
import authModalReducer from "./slices/authModalSlice";
import ordersReducer from "./slices/ordersSlice";
import usersReducer from "./slices/usersSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    cart: cartReducer,
    product: productsReducer,
    wishlist: wishlistReducer,
    filters: filtersReducer,
    auth: authReducer,
    authModal: authModalReducer,
    orders: ordersReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch = typeof store.dispatch;