"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";

type UserDeleteModalProps = {
  isOpen: boolean;
  user?: {
    _id: string;
    name: string;
    email: string;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      const res =await axios.delete(`/api/admin/users/${user._id}`);

      console.log(res.data)
      
      if (onConfirm) {
        await onConfirm();
      }

      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
            <AlertCircle className="h-6 w-6 text-rose-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Delete User</h2>
        </div>

        {/* Content */}
        <div className="mb-6 space-y-2">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this user? This action cannot be undone.
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
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 p-3">
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50 transition"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete User"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
