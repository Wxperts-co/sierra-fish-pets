

"use client";

import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeAuthModal } from "@/store/slices/authModalSlice";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";



export default function AuthModal() {
  const dispatch = useAppDispatch();

  const { isOpen, view } = useAppSelector(
    (state) => state.authModal
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      onClick={() => dispatch(closeAuthModal())}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">
            {view === "login" && "Login"}
            {view === "register" && "Create Account"}
            {view === "forgot-password" && "Forgot Password"}
          </h2>

          <button
            onClick={() => dispatch(closeAuthModal())}
            className="rounded-lg p-1 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {view === "login" && <LoginForm />}

          {view === "register" && <RegisterForm />}

          {view === "forgot-password" && (
            <ForgotPasswordForm />
          )}
        </div>
      </div>
    </div>
  );
}