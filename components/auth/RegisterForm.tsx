"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setAuthModalView } from "@/store/slices/authModalSlice";

export default function RegisterForm() {
  const dispatch = useAppDispatch();

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

      // TODO: Call Register API
      console.log("Register Data:", formData);

      // Example:
      // await registerUser(formData);

      // After successful registration:
      dispatch(setAuthModalView("login"));
    } catch (error) {
      console.error(error);
      setError("Registration failed. Please try again.");
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