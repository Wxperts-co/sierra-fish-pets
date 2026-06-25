"use client";

import { Eye, Edit3, Trash2 } from "lucide-react";
import ActionsDropdown from "../common/ActionsDropdown";

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
  const actions = [
    { label: "View", icon: <Eye className="h-4 w-4" />, onClick: onView },
    { label: "Edit", icon: <Edit3 className="h-4 w-4" />, onClick: onEdit },
    { label: "Delete", icon: <Trash2 className="h-4 w-4" />, onClick: onDelete },
  ];

  return <ActionsDropdown actions={actions} />;
}
