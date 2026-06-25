"use client";

import { Eye, Edit3, Trash2 } from "lucide-react";
import ActionsDropdown from "../common/ActionsDropdown";

type CategoryActionsProps = {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function CategoryActions({ onView, onEdit, onDelete }: CategoryActionsProps) {
  const actions = [
    { label: "View", icon: <Eye className="h-4 w-4 text-slate-500" />, onClick: onView },
    { label: "Edit", icon: <Edit3 className="h-4 w-4 text-blue-500" />, onClick: onEdit },
    { label: "Delete", icon: <Trash2 className="h-4 w-4 text-red-500" />, onClick: onDelete },
  ];

  return <ActionsDropdown actions={actions} />;
}
