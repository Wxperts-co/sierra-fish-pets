"use client";

import { GridColDef, GridRenderCellParams, GridRowId } from "@mui/x-data-grid";
import DataGrid from "../common/PersistentDataGrid";
import { Button } from "@mui/material";
import CategoryActions from "./CategoryActions";
import type { AdminCategory } from "./types";

type Props = {
  categories: AdminCategory[];
  loading?: boolean;
  onView: (category: AdminCategory) => void;
  onEdit: (category: AdminCategory) => void;
  onDelete: (category: AdminCategory) => void;
  onManageSubcategories: (category: AdminCategory) => void;
};

export default function CategoryDataGrid({ categories, loading = false, onView, onEdit, onDelete, onManageSubcategories }: Props) {
  const rows = categories.map((c, index) => ({
    ...c,
    id: String(c._id),
    serial: index + 1,
    subcategoriesCount: c.subcategories?.length || 0,
    productCount: c.productCount ?? 0,
    description: c.description ?? "",
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
      headerName: "Category",
      flex: 1.5,
      minWidth: 180,
      renderCell: (params: GridRenderCellParams<any>) => (
        <div className="">
          <div className="font-semibold text-slate-900">{params.row.name}</div>
          {/* <div className="text-sm text-slate-500 truncate">{params.row.description || "No description"}</div> */}
        </div>
      ),
    },
    { field: "slug", headerName: "Slug", flex: 0.8, minWidth: 120 },
    { field: "productCount", headerName: "Products", type: "number", flex: 0.6, minWidth: 90 },
    {
      field: "subcategoriesCount",
      headerName: "Subcategories",
      type: "number",
      flex: 0.6,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<any>) => (
        <div className="flex items-center justify-end w-full pr-2 h-full">
          <button
            onClick={() => onManageSubcategories(params.row)}
            className="px-3.5 py-1 text-xs font-extrabold text-[#005AA9] bg-[#005AA9]/10 hover:bg-[#005AA9]/20 hover:border-[#005AA9]/30 active:scale-95 transition-all rounded-full border border-[#005AA9]/15 shadow-sm inline-flex items-center justify-center"
          >
            Manage ({params.row.subcategoriesCount})
          </button>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      minWidth: 110,
      renderCell: (params: GridRenderCellParams<AdminCategory>) => (
        <div className="flex items-center justify-end gap-2 w-full pr-2">
          <CategoryActions
            onView={() => onView(params.row)}
            onEdit={() => onEdit(params.row)}
            onDelete={() => onDelete(params.row)}
          />
        </div>
      ),
      flex: 0.8,
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden" style={{ width: "100%" }}>
      <div style={{ height: 560, width: "100%" }}>
        <DataGrid
          storageKey="admin_grid_categories"
          rows={rows}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          paginationModel={{ pageSize: 10, page: 0 }}
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
