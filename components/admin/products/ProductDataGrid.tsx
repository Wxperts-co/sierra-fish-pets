"use client";

import { DataGrid, GridColDef, GridRenderCellParams, GridRowId } from "@mui/x-data-grid";
import Image from "next/image";
import { Eye, Edit3, Trash2 } from "lucide-react";

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
      width: 70,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1.5,
      renderCell: (params: GridRenderCellParams<Product>) => (
        <div className="flex items-center gap-3 py-2">
          {params.row.images && params.row.images[0] ? (
            <Image src={params.row.images[0]} alt={params.row.name} width={48} height={48} className="h-12 w-12 rounded-md object-cover" />
          ) : (
            <div className="h-12 w-12 rounded-md bg-slate-100" />
          )}
          <div>
            <div className="font-semibold text-slate-900">{params.row.name}</div>
            <div className="text-sm text-slate-500 truncate">{params.row.sku}</div>
          </div>
        </div>
      ),
    },
    { field: "sku", headerName: "SKU", flex: 0.6 },
    { field: "brand", headerName: "Brand", flex: 0.8 },
    {
      field: "price",
      headerName: "Price",
      flex: 0.6,
      valueGetter: (value: any, row: Product) => {
        const price = typeof row?.price === "number" ? row.price : Number(value ?? 0);
        return `$${Number(price || 0).toFixed(2)}`;
      },
    },
    {
      field: "stock",
      headerName: "Stock",
      flex: 0.8,
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
      renderCell: (params: GridRenderCellParams<Product>) => (
        <div className="flex items-center justify-end gap-2 w-full pr-2">
          <button type="button" onClick={() => onView(params.row)} className="inline-flex h-9 w-9 items-center justify-center border border-slate-100 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition active:scale-95 cursor-pointer"><Eye className="h-4 w-4" /></button>
          <button type="button" onClick={() => onEdit(params.row)} className="inline-flex h-9 w-9 items-center justify-center border border-slate-100 hover:border-blue-200 rounded-xl bg-white hover:bg-blue-50 text-slate-500 hover:text-[#005AA9] transition active:scale-95 cursor-pointer"><Edit3 className="h-4 w-4" /></button>
          <button type="button" onClick={() => onDelete(params.row)} className="inline-flex h-9 w-9 items-center justify-center border border-slate-100 hover:border-red-200 rounded-xl bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 transition active:scale-95 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
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
        sx={{ minHeight: 560 }}
      />
    </div>
  );
}
