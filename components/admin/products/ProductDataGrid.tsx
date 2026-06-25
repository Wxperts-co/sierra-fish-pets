"use client";

import { DataGrid, GridColDef, GridRenderCellParams, GridRowId } from "@mui/x-data-grid";
import Image from "next/image";
import { Eye, Edit3, Trash2 } from "lucide-react";
import ActionsDropdown from "../common/ActionsDropdown";

type Product = {
  _id: string;
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  price: number;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  stockCount: number;
  createdAt: string;
  images?: string[];
};

type Props = {
  products: Product[];
  loading?: boolean;
  onView: (p: Product) => void;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  rowCount: number;
  paginationModel: { page: number; pageSize: number };
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
};

export default function ProductDataGrid({
  products,
  loading = false,
  onView,
  onEdit,
  onDelete,
  rowCount,
  paginationModel,
  onPaginationModelChange,
}: Props) {
  const rows = products.map((p, index) => ({
    ...p,
    id: p._id,
    serial: paginationModel.page * paginationModel.pageSize + index + 1,
  }));

  const columns: GridColDef[] = [
    {
      field: "serial",
      headerName: "S.NO.",
      width: 80,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1.5,
      minWidth: 300,
      renderCell: (params: GridRenderCellParams<Product>) => (
        <div className="flex items-center gap-3">
          {params.row.images && params.row.images[0] ? (
            <Image src={params.row.images[0]} alt={params.row.name} width={48} height={48} className="h-12 w-12 rounded-md object-cover" />
          ) : (
            <div className="h-12 w-12 rounded-md bg-slate-100" />
          )}
          <div>
            <div className="font-semibold text-slate-900">{params.row.name}</div>
            {/* <div className="text-sm text-slate-500 truncate">{params.row.sku}</div> */}
          </div>
        </div>
      ),
    },
    { field: "sku", headerName: "SKU", flex: 0.6, minWidth: 90 },
    { field: "brand", headerName: "Brand", flex: 0.8, minWidth: 100 },
    {
      field: "price",
      headerName: "Price",
      flex: 0.6,
      minWidth: 80,
      valueGetter: (value: any, row: Product) => {
        const price = typeof row?.price === "number" ? row.price : Number(value ?? 0);
        return `$${Number(price || 0).toFixed(2)}`;
      },
    },
    {
      field: "stock",
      headerName: "Stock",
      flex: 0.8,
      minWidth: 110,
      renderCell: (params: GridRenderCellParams<Product>) => {
        const row = (params.row ?? {}) as Partial<Product>;
        const count = typeof row.stockCount === "number" ? row.stockCount : params.value ?? 0;
        const status = row.stockStatus ?? "unknown";
        return `${count} (${String(status).replace("_", " ")})`;
      },
      sortable: false,
    },
    {
      field: "createdAt",
      headerName: "Created",
      flex: 0.6,
      minWidth: 100,
      valueGetter: (value: any, row: Product) => {
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
      renderCell: (params: GridRenderCellParams<Product>) => (
        <div className="flex items-center justify-end gap-2 w-full pr-2">
          <ActionsDropdown
            actions={[
              { label: "View", icon: <Eye className="h-4 w-4" />, onClick: () => onView(params.row) },
              { label: "Edit", icon: <Edit3 className="h-4 w-4" />, onClick: () => onEdit(params.row) },
              { label: "Delete", icon: <Trash2 className="h-4 w-4" />, onClick: () => onDelete(params.row) },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      <DataGrid
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
        rowHeight={72}
        sx={{
          minHeight: 560,
          '& .MuiDataGrid-cell': { overflow: 'visible !important' },
          '& .MuiDataGrid-row': { overflow: 'visible !important' },
        }}
      />
    </div>
  );
}
