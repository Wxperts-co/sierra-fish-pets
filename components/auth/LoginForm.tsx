"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  setAuthModalView,
  closeAuthModal,
} from "@/store/slices/authModalSlice";

export default function LoginForm() {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

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

      // TODO: Call Login API
      console.log("Login Data:", formData);

      // Example:
      // const response = await loginUser(formData);

      dispatch(closeAuthModal());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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