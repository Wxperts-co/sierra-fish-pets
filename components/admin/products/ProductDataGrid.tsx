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
  compareAtPrice?: number | null;
  categorySlug?: string;
  subcategorySlug?: string;
  upc?: string;
  rating?: number;
  reviewCount?: number;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  dimensions?: string;
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
  onUpdateStock?: (productId: string, newStock: number) => Promise<boolean>;
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
  onUpdateStock,
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
      field: "id",
      headerName: "ID",
      width: 120,
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
    {
      field: "slug",
      headerName: "Slug",
      width: 150,
    },
    { field: "sku", headerName: "SKU", flex: 0.6, minWidth: 90 },
    {
      field: "upc",
      headerName: "UPC",
      width: 120,
    },
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
      field: "compareAtPrice",
      headerName: "Compare Price",
      width: 120,
      valueGetter: (value: any, row: Product) => {
        const val = row?.compareAtPrice ?? value;
        return val != null ? `$${Number(val).toFixed(2)}` : "-";
      },
    },
    {
      field: "stockCount",
      headerName: "Stock Qty",
      type: "number",
      flex: 0.7,
      minWidth: 110,
      editable: true,
      align: "center",
      headerAlign: "center",
      valueGetter: (value: any, row: Product) => {
        return typeof row?.stockCount === "number" ? row.stockCount : Number(value ?? 0);
      },
      renderCell: (params: GridRenderCellParams<Product>) => (
        <div className="flex items-center gap-1.5 font-bold text-slate-800 cursor-pointer hover:bg-slate-50 px-2.5 py-1.5 rounded-xl border border-dashed border-slate-200 hover:border-slate-400/80 transition-all select-none">
          <span>{params.row.stockCount}</span>
          <Edit3 className="h-3 w-3 text-slate-400 opacity-60" />
        </div>
      ),
    },
    {
      field: "stockStatus",
      headerName: "Stock Status",
      flex: 0.8,
      minWidth: 110,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<Product>) => {
        const status = params.row.stockStatus ?? "in_stock";
        let colorClass = "bg-emerald-50 text-emerald-700 border-emerald-100";
        if (status === "out_of_stock") {
          colorClass = "bg-rose-50 text-rose-700 border-rose-100";
        } else if (status === "low_stock") {
          colorClass = "bg-amber-50 text-amber-700 border-amber-100";
        }
        return (
          <span className={`inline-flex items-center leading-none border text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${colorClass}`}>
            {status.replace("_", " ")}
          </span>
        );
      },
    },
    {
      field: "categorySlug",
      headerName: "Category",
      width: 150,
    },
    {
      field: "subcategorySlug",
      headerName: "Subcategory",
      width: 150,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 90,
      type: "number",
    },
    {
      field: "reviewCount",
      headerName: "Reviews",
      width: 90,
      type: "number",
    },
    {
      field: "isNewArrival",
      headerName: "New Arrival",
      width: 110,
      type: "boolean",
      valueGetter: (value: any, row: Product) => row?.isNewArrival ?? value,
      renderCell: (params: GridRenderCellParams<Product>) => (
        <span>{params.row.isNewArrival ? "Yes" : "No"}</span>
      ),
    },
    {
      field: "isFeatured",
      headerName: "Featured",
      width: 100,
      type: "boolean",
      valueGetter: (value: any, row: Product) => row?.isFeatured ?? value,
      renderCell: (params: GridRenderCellParams<Product>) => (
        <span>{params.row.isFeatured ? "Yes" : "No"}</span>
      ),
    },
    {
      field: "isBestSeller",
      headerName: "Best Seller",
      width: 110,
      type: "boolean",
      valueGetter: (value: any, row: Product) => row?.isBestSeller ?? value,
      renderCell: (params: GridRenderCellParams<Product>) => (
        <span>{params.row.isBestSeller ? "Yes" : "No"}</span>
      ),
    },
    {
      field: "dimensions",
      headerName: "Dimensions",
      width: 120,
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
        processRowUpdate={async (newRow, oldRow) => {
          if (onUpdateStock && newRow.stockCount !== oldRow.stockCount) {
            const success = await onUpdateStock(newRow._id, newRow.stockCount);
            if (success) {
              return newRow;
            }
          }
          return oldRow;
        }}
        onProcessRowUpdateError={(error) => {
          console.error("Row update error:", error);
        }}
        sx={{
          minHeight: 560,
          '& .MuiDataGrid-cell': { overflow: 'visible !important' },
          '& .MuiDataGrid-row': { overflow: 'visible !important' },
        }}
      />
    </div>
  );
}
