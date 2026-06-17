"use client";

import { useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openVerifyEmailModal, setAuthModalView } from "@/store/slices/authModalSlice";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle } from "lucide-react";

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
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
        role: isAdminRoute ? "admin" : undefined,
      });

      // Transition to OTP verification view (works for both modal and admin page)
      dispatch(openVerifyEmailModal(formData.email));
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 pl-11 text-sm text-slate-800 outline-none ring-0 transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  return (
    <div>
      {/* Success / error banners from modal Redux state (modal context only) */}
      {!isAdminRoute && message?.type === "success" && (
        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl p-4 text-sm font-semibold mb-4">
          {message.text}
        </div>
      )}
      {!isAdminRoute && message?.type === "error" && (
        <div className="flex items-center gap-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-4 text-sm font-semibold mb-4">
          {message.text}
        </div>
      )}

      {/* Inline error */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="register-fullname"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full name"
            required
            className={inputClass}
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="register-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            className={inputClass}
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="register-phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
            required
            className={inputClass}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
            className={inputClass + " pr-11"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="register-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            required
            className={inputClass + " pr-11"}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Submit */}
        <button
          id="register-submit"
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : isAdminRoute ? "Create Admin Account" : "Create Account"}
        </button>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">OR</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Google */}
      <button
        id="register-google"
        type="button"
        onClick={() =>
          signIn("google", {
            callbackUrl: isAdminRoute ? "/admin?authAction=signup" : "/?authAction=signup",
          })
        }
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white/60 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      {/* Switch to Login — modal context only (admin page has tabs instead) */}
      {!isAdminRoute && (
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => dispatch(setAuthModalView("login"))}
            className="font-semibold text-black hover:underline"
          >
            Login
          </button>
        </p>
      )}
    </div>
  );
}