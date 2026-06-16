"use client";

import { useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openVerifyEmailModal, setAuthModalView } from "@/store/slices/authModalSlice";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const { message } = useAppSelector((state) => state.authModal);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post("/api/auth/register", {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      // After successful registration, transition to verification view
      dispatch(openVerifyEmailModal(formData.email));
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || "Registration failed. Please try again.";
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
        {/* Full Name */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Full Name
          </label>

          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

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

        {/* Phone */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Phone Number
          </label>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
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
            placeholder="Create a password"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Confirm Password
          </label>

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Create Account"}
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

      {/* Google Register */}
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/?authAction=signup" })}
        className="w-full rounded-lg border border-gray-300 py-3 font-medium transition hover:bg-gray-50"
      >
        Continue with Google
      </button>

      {/* Login Link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() =>
            dispatch(setAuthModalView("login"))
          }
          className="font-semibold text-black hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}