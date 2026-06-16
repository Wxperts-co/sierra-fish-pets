"use client";

import { useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setAuthModalView, openLoginModalWithMessage } from "@/store/slices/authModalSlice";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function ResetPasswordForm() {
  const dispatch = useAppDispatch();
  const tempEmail = useAppSelector((state) => state.authModal.tempEmail);

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!tempEmail) {
      setError("Email is missing. Please start the forgot password process again.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/reset-password", {
        email: tempEmail,
        otp: otp.trim(),
        password,
      });

      if (res.data.success) {
        dispatch(
          openLoginModalWithMessage(
            "Password reset successfully. Please login with your new password."
          )
        );
      } else {
        setError(res.data.message || "Failed to reset password.");
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

  return (
    <div className="space-y-4">
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600">
          Enter the 6-digit code sent to <strong>{tempEmail}</strong> and your new password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* OTP Code */}
        <div>
          <label className="mb-2 block text-sm font-medium">Verification Code</label>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="6-digit OTP code"
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black text-center tracking-widest font-black text-lg"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="mb-2 block text-sm font-medium">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 outline-none transition focus:border-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-2 block text-sm font-medium">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 outline-none transition focus:border-black"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>

      {/* Back To Login */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Remember your password?{" "}
        <button
          type="button"
          onClick={() => dispatch(setAuthModalView("login"))}
          className="font-semibold text-black hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}
