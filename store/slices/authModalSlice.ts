import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthModalView =
  | "login"
  | "register"
  | "forgot-password";

interface AuthModalState {
  isOpen: boolean;
  view: AuthModalView;
}

const initialState: AuthModalState = {
  isOpen: false,
  view: "login",
};

const authModalSlice = createSlice({
  name: "authModal",
  initialState,

  reducers: {
    openLoginModal: (state) => {
      state.isOpen = true;
      state.view = "login";
    },

    openRegisterModal: (state) => {
      state.isOpen = true;
      state.view = "register";
    },

    openForgotPasswordModal: (state) => {
      state.isOpen = true;
      state.view = "forgot-password";
    },

    setAuthModalView: (
      state,
      action: PayloadAction<AuthModalView>
    ) => {
      state.view = action.payload;
    },

    closeAuthModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  openLoginModal,
  openRegisterModal,
  openForgotPasswordModal,
  setAuthModalView,
  closeAuthModal,
} = authModalSlice.actions;

export default authModalSlice.reducer;