"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail, Phone, User, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";

function ResetPasswordFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (searchParams) {
      const emailParam = searchParams.get("email");
      const otpParam = searchParams.get("otp");
      if (emailParam) setEmail(emailParam);
      if (otpParam) setOtp(otpParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email address is required.");
      return;
    }
    if (!otp) {
      setError("6-digit verification code is required.");
      return;
    }
    if (!name.trim()) {
      setError("Please provide your full name.");
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
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        password,
        name: name.trim(),
        phone: phone.trim() || undefined,
      });

      if (res.data.success) {
        setSuccess("Account activated and password set successfully! Redirecting you to login...");
        setTimeout(() => {
          router.push("/admin?success=GoogleAccountCreated"); // Utilizes existing sign-in success notification banner
        }, 3000);
      } else {
        setError(res.data.message || "Failed to set up account.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred. Please verify your OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 pl-11 text-sm text-slate-800 outline-none ring-0 transition placeholder:text-slate-400 focus:border-[#005AA9] focus:ring-2 focus:ring-[#005AA9]/10 focus:bg-white font-semibold";

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden relative z-10">
      {/* Header Banner */}
      <div className="bg-[#003B73] p-6 text-center border-b border-white/10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-3 shadow-md">
          <ShieldAlert className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-black text-white">Activate Team Account</h2>
        <p className="text-xs text-blue-200 font-semibold mt-1">Configure credentials to access Sierra Admin Dashboard</p>
      </div>

      <div className="p-6 sm:p-8">
        {/* Error Block */}
        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600 font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Block */}
        {success && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-600 font-semibold">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Verification Code */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">6-Digit Verification Code</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter 6-digit OTP code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={inputClass}
                maxLength={6}
                required
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Phone Number (Optional)</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#005AA9] hover:bg-[#003B73] text-white py-3.5 rounded-2xl font-black text-sm shadow-lg hover:shadow-xl transition duration-200 active:scale-98 disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? "Activating Account..." : "Set Password & Activate"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f3f] via-[#003B73] to-[#005ea8] flex items-center justify-center p-4 pt-28 relative overflow-hidden">
      {/* Decorative blur orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <Suspense fallback={
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 p-8 shadow-2xl flex items-center justify-center min-h-[300px]">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <ResetPasswordFormContent />
      </Suspense>
    </div>
  );
}
