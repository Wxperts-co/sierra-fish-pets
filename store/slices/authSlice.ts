import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isLoggingOut: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  isLoggingOut: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setUser: (
      state,
      action: PayloadAction<User>
    ) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoggingOut = false;
    },

    updateUser: (
      state,
      action: PayloadAction<Partial<User>>
    ) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoggingOut = true;
    },

    setAuthLoading: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setUser,
  updateUser,
  logout,
  setAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;
