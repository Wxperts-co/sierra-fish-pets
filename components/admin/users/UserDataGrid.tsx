"use client";

import { GridColDef, GridRenderCellParams, GridRowId } from "@mui/x-data-grid";
import DataGrid from "../common/PersistentDataGrid";
import UserActions from "./UserActions";
import Image from "next/image";

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin" | "manager" | "sales" | "delivery boy";
  status: "active" | "inactive" | "banned";
  isEmailVerified: boolean;
  avatar?: { url: string; public_id: string };
  createdAt: string;
};

type Props = {
  users: User[];
  loading?: boolean;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus?: (user: User) => void;
  rowCount: number;
  paginationModel: { page: number; pageSize: number };
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
};

export default function UserDataGrid({
  users,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  rowCount,
  paginationModel,
  onPaginationModelChange,
}: Props) {
  const rows = users.map((u, index) => ({
    ...u,
    id: u._id,
    serial: paginationModel.page * paginationModel.pageSize + index + 1,
  }));

  const columns: GridColDef[] = [
    {
      field: "serial",
      headerName: "#",
      width: 70,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "User",
      flex: 1.5,
      minWidth: 280,
      renderCell: (params: GridRenderCellParams<User>) => (
        <div className="flex items-center gap-3 py-2">
          {params.row.avatar?.url ? (
            <Image src={params.row.avatar.url} alt={params.row.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover border border-slate-150 shadow-sm" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#003B73] to-[#0077C8] flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {params.row.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="leading-tight">
            <div className="font-semibold text-slate-900">{params.row.name}</div>
            <div className="text-sm text-slate-500 truncate">{params.row.email}</div>
          </div>
        </div>
      ),
    },
    { field: "role", headerName: "Role", flex: 0.6, minWidth: 90 },
    { field: "status", headerName: "Status", flex: 0.6, minWidth: 90 },
    {
      field: "isEmailVerified",
      headerName: "Verified",
      flex: 0.4,
      minWidth: 90,
      renderCell: (params: GridRenderCellParams<User>) => (
        <div className="w-full text-center">{params.row.isEmailVerified ? "Yes" : "No"}</div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Joined",
      flex: 0.6,
      minWidth: 100,
      valueGetter: (value: any, row: User) => {
        const created = value ?? row?.createdAt ?? "";
        try {
          return created ? new Date(created).toLocaleDateString() : "";
        } catch {
          return String(created);
        }
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      flex: 0.8,
      minWidth: 110,
      renderCell: (params: GridRenderCellParams<User>) => (
        <div className="flex items-center justify-end gap-2 w-full pr-2">
          <UserActions
            onView={() => onView(params.row)}
            onEdit={() => onEdit(params.row)}
            onDelete={() => onDelete(params.row)}
            onToggleStatus={onToggleStatus ? () => onToggleStatus(params.row) : undefined}
            status={params.row.status}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden" style={{ width: "100%" }}>
      <div style={{ height: 560, width: "100%" }}>
        <DataGrid
          storageKey="admin_grid_users"
          rows={rows}
          columns={columns}
          pagination
          paginationMode="server"
          rowCount={rowCount}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          loading={loading}
          autoHeight
          sx={{
            '& .MuiDataGrid-cell': { overflow: 'visible !important' },
            '& .MuiDataGrid-row': { overflow: 'visible !important' },
          }}
        />
      </div>
    </div>
  );
}
