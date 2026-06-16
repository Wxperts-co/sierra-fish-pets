"use client";

import React, { useState } from "react";
import axios from "axios";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import AccountHeader from "@/components/account/AccountHeader";

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/auth/security/update-password", {
        currentPassword,
        newPassword,
      });

      if (res.data.success) {
        setSuccessMsg("Your password has been changed successfully!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while changing your password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 md:p-8 font-lato space-y-6">
      <AccountHeader
        title="Password & Security"
        description="Change your account password below to keep your profile secure."
        icon={<Lock className="h-6 w-6 text-primary" />}
      />

      {/* Success Alert */}
      {successMsg && (
        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl p-4 text-sm font-semibold">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="flex items-center gap-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl p-4 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        {/* Current Password */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              required
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary transition font-semibold text-slate-800 bg-slate-50/50"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
            >
              {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              required
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary transition font-semibold text-slate-800 bg-slate-50/50"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
            >
              {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
              required
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary transition font-semibold text-slate-800 bg-slate-50/50"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
            >
              {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] text-white font-bold transition-transform hover:scale-[1.02] shadow-md shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center gap-2"
          >
            {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            <span>{loading ? "Updating password..." : "Update Password"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
