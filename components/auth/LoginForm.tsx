"use client";

import { useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setAuthModalView,
  closeAuthModal,
  openVerifyEmailModal,
} from "@/store/slices/authModalSlice";
import { setUser } from "@/store/slices/authSlice";
import { setWishlist } from "@/store/slices/wishlistSlice";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;
  const { message } = useAppSelector((state) => state.authModal);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const res = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
        role: isAdminRoute ? "admin" : "user",
      });

      dispatch(setUser(res.data.user));
      dispatch(setWishlist(res.data.user.wishlist || []));
       dispatch(closeAuthModal());
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 403 && err.response?.data?.notVerified) {
        dispatch(openVerifyEmailModal(formData.email));
        return;
      }
      setError(err.response?.data?.message || err.message || "Invalid email or password.");
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
        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="login-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email address"
            required
            className={inputClass}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Password"
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

        {/* Forgot password — modal context only */}
        {!isAdminRoute && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => dispatch(setAuthModalView("forgot-password"))}
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        )}

        {/* Submit */}
        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : isAdminRoute ? "Sign In as Admin" : "Login"}
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
        id="login-google"
        type="button"
        onClick={() =>
          signIn("google", {
            callbackUrl: isAdminRoute ? "/admin" : "/?authAction=login",
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

      {/* Switch to Register — modal context only (admin page has tabs instead) */}
      {!isAdminRoute && (
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => dispatch(setAuthModalView("register"))}
            className="font-semibold text-black hover:underline"
          >
            Create Account
          </button>
        </p>
      )}
    </div>
  );
}