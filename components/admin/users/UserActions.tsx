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
        className="inline-flex h-9 w-9 items-center justify-center border border-slate-100 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition active:scale-95 cursor-pointer"
        aria-label="View user"
      >
        <Eye className="h-4 w-4 text-slate-500" />
      </button>

      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-9 w-9 items-center justify-center border border-slate-100 hover:border-blue-200 rounded-xl bg-white hover:bg-blue-50 text-slate-500 hover:text-[#005AA9] transition active:scale-95 cursor-pointer"
        aria-label="Edit user"
      >
        <Edit3 className="h-4 w-4 text-blue-500" />
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
        className="inline-flex h-9 w-9 items-center justify-center border border-slate-100 hover:border-red-200 rounded-xl bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 transition active:scale-95 cursor-pointer"
        aria-label="Delete user"
      >
        <Trash2 className="h-4 w-4 text-red-500 stroke-[2]" />
      </button>
    </div>
  );
}
