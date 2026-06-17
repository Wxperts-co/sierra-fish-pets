import { Eye, Edit3, Trash2, UserCheck, UserX } from "lucide-react";

type UserActionsProps = {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus?: () => void;
  status?: "active" | "inactive" | "banned";
};

export default function UserActions({
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  status = "active",
}: UserActionsProps) {
  const statusLabel =
    status === "active"
      ? "Deactivate"
      : status === "inactive"
      ? "Activate"
      : "Unban";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onView}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
        aria-label="View user"
      >
        <Eye className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
        aria-label="Edit user"
      >
        <Edit3 className="h-4 w-4" />
      </button>
{/* 
      {onToggleStatus && (
        <button
          type="button"
          onClick={onToggleStatus}
          className="inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          {statusLabel}
        </button>
      )} */}

      <button
        type="button"
        onClick={onDelete}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white hover:bg-rose-600 transition"
        aria-label="Delete user"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
