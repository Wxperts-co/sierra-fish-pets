"use client";

import { useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setAuthModalView } from "@/store/slices/authModalSlice";

export default function VerifyEmailForm() {
  const dispatch = useAppDispatch();
  const { tempEmail } = useAppSelector((state) => state.authModal);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.post("/api/auth/verify-email", {
        email: tempEmail,
        otp,
      });

      setSuccess(res.data.message || "Email verified successfully!");

      // Transition to login after 1.5 seconds
      setTimeout(() => {
        dispatch(setAuthModalView("login"));
      }, 1500);
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || "Email verification failed. Please try again.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 text-center">
        An email with a 6-digit verification code has been sent to: <br />
        <strong className="text-slate-800">{tempEmail || "your email"}</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* OTP Code Input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-center">
            Enter Verification Code
          </label>

          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              // Only allow digits
              const val = e.target.value.replace(/\D/g, "");
              setOtp(val);
              if (error) setError("");
            }}
            placeholder="000000"
            required
            className="w-full text-center tracking-[12px] font-bold text-2xl rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
          />
        </div>

        {/* Messages */}
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        {success && <p className="text-sm text-emerald-600 text-center font-medium">{success}</p>}

        {/* Verify Button */}
        <button
          type="submit"
          disabled={loading || success !== ""}
          className="w-full rounded-lg bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>
      </form>

      {/* Back link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Did not receive code?{" "}
        <button
          type="button"
          onClick={() => dispatch(setAuthModalView("register"))}
          className="font-semibold text-black hover:underline"
        >
          Register Again
        </button>
      </p>
    </div>
  );
}
