"use client";

import { useState } from "react";
import axios from "axios";
import { useAppDispatch } from "@/store/hooks";
import { setAuthModalView, openResetPasswordModal } from "@/store/slices/authModalSlice";

export default function ForgotPasswordForm() {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/forgot-password", { email });
      if (res.data.success) {
        setSuccess(true);
      } else {
        setError(res.data.message || "Failed to send reset link.");
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="mb-4 text-5xl">📧</div>

        <h3 className="mb-2 text-lg font-semibold">
          Check Your Email
        </h3>

        <p className="mb-6 text-sm text-gray-600">
          We've sent a 6-digit password reset code to your email
          address.
        </p>

        <button
          type="button"
          onClick={() =>
            dispatch(openResetPasswordModal(email))
          }
          className="w-full rounded-lg bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] py-3 font-semibold text-white transition hover:opacity-95"
        >
          Enter Reset Code
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Enter your registered email address and
          we'll send you a code to reset your password.
        </p>
      </div>

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
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Sending Code..."
            : "Send Reset Code"}
        </button>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 text-center font-medium">
            {error}
          </p>
        )}
      </form>

      {/* Back To Login */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Remember your password?{" "}
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