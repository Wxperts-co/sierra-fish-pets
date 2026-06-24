import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type UserPageHeaderProps = {
  onAddUser?: () => void;
  onExportExcel?: () => void;
};

export default function UserPageHeader({ onAddUser, onExportExcel }: UserPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      {/* Left Section */}
      <div>
        <h1 className="text-3xl font-black text-slate-800">Users</h1>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Manage registered customers, roles, account status, and access permissions.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={onExportExcel}
          variant="outline"
          className="h-11 rounded-2xl border-slate-200 font-semibold px-5 active:scale-95 transition-all text-slate-600 hover:bg-slate-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Excel
        </Button>

        {/* <Button
          onClick={onAddUser}
          className="h-11 rounded-2xl bg-[#005AA9] hover:bg-[#003B73] text-white font-bold text-sm px-6 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button> */}
      </div>
    </div>
  );
}