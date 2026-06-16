import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthModalView =
  | "login"
  | "register"
  | "forgot-password"
  | "verify-email"
  | "reset-password";

interface AuthModalState {
  isOpen: boolean;
  view: AuthModalView;
  tempEmail: string;
  message?: {
    type: "success" | "error";
    text: string;
  };
}

const initialState: AuthModalState = {
  isOpen: false,
  view: "login",
  tempEmail: "",
};

const authModalSlice = createSlice({
  name: "authModal",
  initialState,

  reducers: {
    openLoginModal: (state) => {
      state.isOpen = true;
      state.view = "login";
      state.message = undefined;
    },

    openRegisterModal: (state) => {
      state.isOpen = true;
      state.view = "register";
      state.message = undefined;
    },

    openLoginModalWithMessage: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.view = "login";
      state.message = { type: "success", text: action.payload };
    },

    openRegisterModalWithMessage: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.view = "register";
      state.message = { type: "error", text: action.payload };
    },

    clearAuthModalMessage: (state) => {
      state.message = undefined;
    },

    openForgotPasswordModal: (state) => {
      state.isOpen = true;
      state.view = "forgot-password";
      state.message = undefined;
    },

    openVerifyEmailModal: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.view = "verify-email";
      state.tempEmail = action.payload;
      state.message = undefined;
    },

    openResetPasswordModal: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.view = "reset-password";
      state.tempEmail = action.payload;
      state.message = undefined;
    },

    setAuthModalView: (
      state,
      action: PayloadAction<AuthModalView>
    ) => {
      state.view = action.payload;
      state.message = undefined;
    },

    setTempEmail: (state, action: PayloadAction<string>) => {
      state.tempEmail = action.payload;
    },

    closeAuthModal: (state) => {
      state.isOpen = false;
      state.tempEmail = "";
      state.message = undefined;
    },
  },
});

export const {
  openLoginModal,
  openRegisterModal,
  openLoginModalWithMessage,
  openRegisterModalWithMessage,
  clearAuthModalMessage,
  openForgotPasswordModal,
  openVerifyEmailModal,
  openResetPasswordModal,
  setAuthModalView,
  setTempEmail,
  closeAuthModal,
} = authModalSlice.actions;

export default authModalSlice.reducer;