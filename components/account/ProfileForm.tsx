"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { User, Phone, Mail, CheckCircle, AlertCircle, Camera, RefreshCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateUser } from "@/store/slices/authSlice";
import AccountHeader from "./AccountHeader";

export default function ProfileForm() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Initialize form with Redux user values
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side file size validation (3MB limit)
    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg("File size is too large. Maximum limit is 3MB.");
      return;
    }

    setUploading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const fileData = new FormData();
    fileData.append("avatar", file);

    try {
      const res = await axios.post("/api/auth/profile/avatar", fileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setSuccessMsg("Profile picture updated successfully!");
        dispatch(updateUser(res.data.user));
      } else {
        setErrorMsg(res.data.message || "Failed to upload profile picture.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while uploading your profile picture."
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await axios.post("/api/auth/profile/update", {
        name: formData.name,
        phone: formData.phone,
      });

      if (res.data.success) {
        setSuccessMsg("Profile details updated successfully!");
        dispatch(updateUser(res.data.user));
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while updating profile details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 md:p-8 font-lato space-y-6">
      <AccountHeader
        title="Profile Information"
        description="Update your personal account profile details below."
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

      {/* Avatar Image Uploader */}
      <div className="flex flex-col items-center sm:items-start gap-4 pb-6 border-b border-slate-100 max-w-xl">
        <label className="block text-sm font-bold text-slate-700">
          Profile Picture
        </label>
        <div className="flex items-center gap-5">
          <div className="relative group h-20 w-20 rounded-full overflow-hidden border border-slate-200 bg-slate-50 shadow-sm shrink-0">
            {user?.avatar?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar.url}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-blue-50 text-primary font-black text-xl uppercase">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}
            
            {/* Upload Hover Overlay */}
            <div
              onClick={triggerFileSelect}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer select-none"
            >
              {uploading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Camera className="h-4 w-4" />
                  <span className="text-[9px] font-black mt-1 uppercase tracking-wider">Change</span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={triggerFileSelect}
              disabled={uploading}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              {uploading && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
              <span>Choose Photo</span>
            </button>
            <p className="text-[10px] text-slate-400 font-bold leading-normal">
              JPG, PNG or GIF. Max size: 1MB.
            </p>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <User className="h-5 w-5" />
            </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary transition font-semibold text-slate-800 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Email Address (Read Only) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-bold text-slate-700">
              Email Address
            </label>
            <span className="text-xs text-slate-400 font-semibold select-none">
              Non-editable field
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Mail className="h-5 w-5" />
            </span>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none font-semibold text-slate-500 bg-slate-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">
            Phone Number
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Phone className="h-5 w-5" />
            </span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary transition font-semibold text-slate-800 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-[linear-gradient(135deg,#003B73_0%,#005EA8_40%,#0077C8_75%,#1E8FD2_100%)] text-white font-bold transition-transform hover:scale-[1.02] shadow-md shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Saving changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
