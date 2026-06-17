import { Download, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type UserPageHeaderProps = {
  onAddUser?: () => void;
  onExportExcel?: () => void;
};

export default function UserPageHeader({ onAddUser, onExportExcel }: UserPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      {/* Left Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Users
        </h1>

        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-slate-700 font-medium">Users</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={onExportExcel}
          variant="outline"
          className="h-10 px-4 rounded-xl border-slate-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Excel
        </Button>

        {/* <Button
          variant="outline"
          className="h-10 px-4 rounded-xl border-slate-200"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button> */}

        <Button
          onClick={onAddUser}
          className="h-10 px-5 rounded-xl bg-[#5B3DF5] hover:bg-[#4c31df]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>
    </div>
  );
}