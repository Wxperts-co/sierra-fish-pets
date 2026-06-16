"use client";

import { useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setAuthModalView,
  closeAuthModal,
  openVerifyEmailModal,
} from "@/store/slices/authModalSlice";
import { setUser } from "@/store/slices/authSlice";
import { setWishlist } from "@/store/slices/wishlistSlice";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const { message } = useAppSelector((state) => state.authModal);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Save user object to Redux store
      dispatch(setUser(res.data.user));
      dispatch(setWishlist(res.data.user.wishlist || []));
      dispatch(closeAuthModal());
    } catch (err: any) {
      console.error(err);
      
      // If the email isn't verified, transition to verify OTP screen directly
      if (err.response?.status === 403 && err.response?.data?.notVerified) {
        dispatch(openVerifyEmailModal(formData.email));
        return;
      }
      
      const errMsg = err.response?.data?.message || err.message || "Invalid email or password.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* External Success/Error Message */}
      {message && message.type === "success" && (
        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl p-4 text-sm font-semibold mb-4">
          <span>{message.text}</span>
        </div>
      )}
      {message && message.type === "error" && (
        <div className="flex items-center gap-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-4 text-sm font-semibold mb-4">
          <span>{message.text}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <button
            type="button"
            onClick={() =>
              dispatch(
                setAuthModalView("forgot-password")
              )
            }
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="px-3 text-sm text-gray-500">
          OR
        </span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Google Login */}
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/?authAction=login" })}
        className="w-full rounded-lg border border-gray-300 py-3 font-medium transition hover:bg-gray-50"
      >
        Continue with Google
      </button>

      {/* Register Link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() =>
            dispatch(setAuthModalView("register"))
          }
          className="font-semibold text-black hover:underline"
        >
          Create Account
        </button>
      </p>
    </div>
  );
}