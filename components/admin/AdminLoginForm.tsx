"use client";

import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminLoginForm() {
  const searchParams = useSearchParams();

  // Google OAuth redirect error codes
  const googleError = searchParams?.get("error");
  const googleSuccess = searchParams?.get("success");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f3f] via-[#003B73] to-[#005ea8] flex items-center justify-center p-4 admin-login-bg-fallback">
      {/* Decorative blur orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-4 shadow-lg">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Sierra Admin Portal</h1>
          <p className="mt-1 text-sm text-blue-200">Restricted to authorized administrators only</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden admin-login-card-fallback">
          {/* Header */}
          <div className="border-b border-white/10 p-5 text-center bg-white/5">
            <h2 className="text-lg font-bold text-white">Administrator Sign In</h2>
          </div>

          <div className="p-7">
            {googleError === "UserAlreadyExists" && (
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-rose-500/20 border border-rose-400/30 px-4 py-3 text-sm text-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                An account with this Google email already exists.
              </div>
            )}
            {googleError === "UserNotExist" && (
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-rose-500/20 border border-rose-400/30 px-4 py-3 text-sm text-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                No admin account found. Please contact an administrator.
              </div>
            )}
            {googleSuccess === "GoogleAccountCreated" && (
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 px-4 py-3 text-sm text-emerald-200">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Admin account created! Please sign in.
              </div>
            )}

            <LoginForm />
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-blue-300">
          Admin accounts are created by the system owner only.
          <br />This portal is for Sierra Fish &amp; Pets staff only.
        </p>
      </div>
    </div>
  );
}
