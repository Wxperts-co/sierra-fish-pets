"use client";

import { AlertCircle, Loader2, ShieldAlert } from "lucide-react";

type UserDeleteModalProps = {
  isOpen: boolean;
  user?: {
    _id: string;
    name: string;
    email: string;
    status?: string;
  };
  onClose: () => void;
  onConfirm?: () => void | Promise<void>;
};

export default function UserDeleteModal({
  isOpen,
  user,
  onClose,
  onConfirm,
}: UserDeleteModalProps) {
  if (!isOpen || !user) return null;

  const isPermanent = user.status === "inactive";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${isPermanent ? "bg-red-100" : "bg-rose-50"}`}>
            {isPermanent ? (
              <ShieldAlert className="h-6 w-6 text-red-600" />
            ) : (
              <AlertCircle className="h-6 w-6 text-rose-600" />
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            {isPermanent ? "Permanently Delete User" : "Delete User"}
          </h2>
        </div>

        {/* Permanent Warning Banner */}
        {isPermanent && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4">
            <p className="text-sm font-bold text-red-700 mb-1">⚠️ Warning — This cannot be undone!</p>
            <p className="text-xs text-red-600 leading-relaxed">
              This user has an <strong>inactive</strong> status. Deleting them will <strong>permanently remove</strong> all their data from the database. There is no way to recover this account.
            </p>
          </div>
        )}

        {/* Content */}
        <div className="mb-6 space-y-2">
          <p className="text-sm text-slate-600">
            {isPermanent
              ? "Are you absolutely sure you want to permanently delete this user?"
              : "Are you sure you want to delete this user? This action cannot be undone."}
          </p>
          <div className="rounded-lg bg-slate-50 p-3 space-y-1">
            <p className="text-sm">
              <span className="font-semibold text-slate-700">Name:</span>{" "}
              <span className="text-slate-600">{user.name}</span>
            </p>
            <p className="text-sm">
              <span className="font-semibold text-slate-700">Email:</span>{" "}
              <span className="text-slate-600">{user.email}</span>
            </p>
            {isPermanent && (
              <p className="text-sm">
                <span className="font-semibold text-slate-700">Status:</span>{" "}
                <span className="text-red-600 font-semibold capitalize">{user.status}</span>
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition cursor-pointer ${
              isPermanent
                ? "bg-red-600 hover:bg-red-700"
                : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            {isPermanent ? "Permanently Delete" : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
}
