"use client";

import { useState } from "react";
import { X, Mail, Phone, MapPin, Calendar, Shield, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin" | "manager" | "sales" | "delivery boy";
  status: "active" | "inactive" | "banned";
  isEmailVerified: boolean;
  avatar?: {
    url: string;
    public_id: string;
  };
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  createdAt: string;
  updatedAt?: string;
};

type UserDetailModalProps = {
  isOpen: boolean;
  user?: User;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function UserDetailModal({
  isOpen,
  user,
  onClose,
  onEdit,
  onDelete,
}: UserDetailModalProps) {
  if (!isOpen || !user) return null;

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statusColors = {
    active: { bg: "bg-green-50", text: "text-green-700", badge: "bg-green-100" },
    inactive: { bg: "bg-slate-50", text: "text-slate-700", badge: "bg-slate-100" },
    banned: { bg: "bg-rose-50", text: "text-rose-700", badge: "bg-rose-100" },
  };

  const roleColors = {
    user: { text: "text-blue-700", badge: "bg-blue-100" },
    admin: { text: "text-purple-700", badge: "bg-purple-100" },
  };

  const statusColor = statusColors[user.status as keyof typeof statusColors] ?? statusColors.inactive;
  const roleColor = roleColors[user.role as keyof typeof roleColors] ?? roleColors.user;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">User Details</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-200 transition"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar & Basic Info */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0">
              {user.avatar?.url ? (
                <Image
                  src={user.avatar.url}
                  alt={user.name}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full object-cover border-2 border-slate-200"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {user.name[0]?.toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{user.name}</h3>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${roleColor.badge} ${roleColor.text} capitalize`}>
                  {user.role}
                </span>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusColor.badge} ${statusColor.text} capitalize`}>
                  {user.status}
                </span>
                {user.isEmailVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <CheckCircle className="h-3 w-3" />
                    Email Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    <XCircle className="h-3 w-3" />
                    Email Unverified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-lg border border-slate-200 p-4 space-y-3">
            <h4 className="font-semibold text-slate-800">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          {(user.address || user.city || user.state || user.country) && (
            <div className="rounded-lg border border-slate-200 p-4 space-y-3">
              <h4 className="font-semibold text-slate-800">Address</h4>
              <div className="space-y-2 text-sm text-slate-600">
                {user.address && <p>{user.address}</p>}
                {(user.city || user.state || user.zipCode || user.country) && (
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-slate-400" />
                    <span>
                      {[user.city, user.state, user.zipCode, user.country]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Account Metadata */}
          <div className="rounded-lg border border-slate-200 p-4 space-y-3">
            <h4 className="font-semibold text-slate-800">Account Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Member Since</p>
                <div className="flex items-center gap-2 text-slate-700 font-medium mt-1">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {joinDate}
                </div>
              </div>
              <div>
                <p className="text-slate-500">Role</p>
                <div className="flex items-center gap-2 text-slate-700 font-medium mt-1">
                  <Shield className="h-4 w-4 text-slate-400" />
                  <span className="capitalize">{user.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-slate-50 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Close
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Edit User
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex-1 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition"
            >
              Delete User
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
