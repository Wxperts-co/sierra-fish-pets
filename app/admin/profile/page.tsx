"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  User,
  Phone,
  Mail,
  Camera,
  Edit,
  Save,
  X,
  Check,
  AlertCircle,
  Calendar,
  Shield,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateUser } from "@/store/slices/authSlice";

export default function AdminProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Invite User States
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("manager");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [inviteError, setInviteError] = useState("");

  // Initialize data from Redux user state
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg("File size too large. Maximum size limit is 3MB.");
      return;
    }

    setUploading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const data = new FormData();
    data.append("avatar", file);

    try {
      const res = await axios.post("/api/auth/profile/avatar", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setSuccessMsg("Profile picture updated successfully.");
        dispatch(updateUser(res.data.user));
      } else {
        setErrorMsg(res.data.message || "Failed to update profile picture.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
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
        setSuccessMsg("Profile details updated successfully.");
        dispatch(updateUser(res.data.user));
        setIsEditing(false);
      } else {
        setErrorMsg(res.data.message || "Failed to update details.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to save profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteSuccess("");
    setInviteError("");

    try {
      const res = await axios.post("/api/admin/users/invite", {
        email: inviteEmail,
        role: inviteRole,
      });

      if (res.data.success) {
        setInviteSuccess(res.data.message || "Invitation email sent successfully.");
        setInviteEmail("");
        setInviteRole("manager");
      } else {
        setInviteError(res.data.message || "Failed to send invitation.");
      }
    } catch (err: any) {
      console.error(err);
      setInviteError(err.response?.data?.message || "An error occurred during invitation.");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
    setIsEditing(false);
    setErrorMsg("");
    setSuccessMsg("");
  };

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const stockLabels: Record<string, string> = {
    in_stock: "In stock",
    low_stock: "Low stock",
    out_of_stock: "Out of stock",
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800">Admin Profile</h1>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          View and update your administrator profile details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* Left Side: Avatar Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-slate-100 bg-slate-50 relative flex items-center justify-center shadow-md">
              {user.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-extrabold text-[#003B73]">
                  {user.name?.[0]?.toUpperCase()}
                </span>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                  <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-1 right-1 h-9 w-9 bg-[#005AA9] hover:bg-[#003B73] text-white flex items-center justify-center rounded-full shadow-lg border-2 border-white transition active:scale-90 cursor-pointer"
              title="Upload New Avatar"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: "none" }}
            />
          </div>

          <div className="space-y-1">
            <h3 className="font-black text-slate-800 text-lg leading-tight">{user.name}</h3>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-black bg-blue-50 text-[#003B73] border border-blue-100 uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        </div>

        {/* Right Side: Details Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
          {/* Card Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Profile Information</h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Manage details linked to your account.</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex h-9 items-center gap-1.5 border border-slate-200 hover:border-slate-350 rounded-xl bg-white hover:bg-slate-50 px-4 text-xs font-bold text-slate-600 transition active:scale-95 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit Details
              </button>
            )}
          </div>

          {/* Form / Details Container */}
          <form onSubmit={handleSaveDetails} className="p-6 space-y-6">
            {/* Status alerts */}
            {successMsg && (
              <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl p-4 text-sm font-semibold">
                <Check className="h-5 w-5 shrink-0 bg-emerald-100 p-0.5 rounded-full" />
                <span>{successMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div className="flex items-center gap-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-2xl p-4 text-sm font-semibold">
                <AlertCircle className="h-5 w-5 shrink-0 bg-rose-100 p-0.5 rounded-full" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Full Name
                </label>
                {isEditing ? (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full h-10 pl-10 pr-3 text-sm rounded-xl border border-slate-200 outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-[#005AA9] transition"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mt-1">
                    <User className="h-4 w-4 text-[#003B73] shrink-0" />
                    <span>{user.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mt-1">
                  <Mail className="h-4 w-4 text-[#003B73] shrink-0" />
                  <span>{user.email}</span>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Phone Number
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      className="w-full h-10 pl-10 pr-3 text-sm rounded-xl border border-slate-200 outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-[#005AA9] transition"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mt-1">
                    <Phone className="h-4 w-4 text-[#003B73] shrink-0" />
                    <span>{user.phone || "Not provided"}</span>
                  </div>
                )}
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Access Level
                </label>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mt-1">
                  <Shield className="h-4 w-4 text-[#003B73] shrink-0" />
                  <span className="capitalize">{user.role} Dashboard access</span>
                </div>
              </div>

              {/* Joined */}
             
            </div>

            {/* Editable Actions */}
            {isEditing && (
              <div className="border-t border-slate-100 pt-6 flex items-center justify-end gap-3 bg-slate-50/20 -mx-6 -mb-6 p-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex h-10 items-center gap-1.5 border border-slate-200 hover:bg-slate-150 rounded-xl px-5 text-xs font-bold text-slate-600 transition active:scale-95 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#005AA9] hover:bg-[#003B73] text-white px-5 text-xs font-bold shadow-md transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Details"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {user.role === "admin" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col mt-6">
          {/* Card Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-base font-extrabold text-slate-800">Invite Team Member</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Send email invitation containing an account activation OTP code.</p>
          </div>

          <form onSubmit={handleInviteUser} className="p-6 space-y-4">
            {inviteSuccess && (
              <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl p-4 text-sm font-semibold">
                <Check className="h-5 w-5 shrink-0 bg-emerald-100 p-0.5 rounded-full" />
                <span>{inviteSuccess}</span>
              </div>
            )}
            {inviteError && (
              <div className="flex items-center gap-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-2xl p-4 text-sm font-semibold">
                <AlertCircle className="h-5 w-5 shrink-0 bg-rose-100 p-0.5 rounded-full" />
                <span>{inviteError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    name="inviteEmail"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    placeholder="Enter email to invite"
                    className="w-full h-10 pl-10 pr-3 text-sm rounded-xl border border-slate-200 outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-[#005AA9] transition font-semibold"
                  />
                </div>
              </div>

              {/* Role Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Dashboard Role
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    name="inviteRole"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full h-10 pl-10 pr-3 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-[#005AA9] focus:ring-1 focus:ring-[#005AA9] transition font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    <option value="sales">Sales</option>
                    <option value="delivery boy">Delivery Boy</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 flex items-center justify-end">
              <button
                type="submit"
                disabled={inviteLoading}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#005AA9] hover:bg-[#003B73] text-white px-5 text-xs font-bold shadow-md transition active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                {inviteLoading ? "Sending Invite..." : "Send Invitation"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
