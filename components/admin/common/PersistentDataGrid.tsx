import React, { useState } from "react";
import { DataGrid as MuiDataGrid, DataGridProps, GridColumnVisibilityModel } from "@mui/x-data-grid";

interface PersistentDataGridProps extends DataGridProps {
  storageKey?: string;
}

export default function PersistentDataGrid({
  storageKey,
  columnVisibilityModel: propModel,
  onColumnVisibilityModelChange: propOnChange,
  ...props
}: PersistentDataGridProps) {
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>(() => {
    if (typeof window !== "undefined" && storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // ignore
        }
      }
    }
    return {};
  });

  const handleVisibilityChange = (newModel: GridColumnVisibilityModel, details: any) => {
    setColumnVisibilityModel(newModel);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(newModel));
    }
    if (propOnChange) {
      propOnChange(newModel, details);
    }
  };

  const finalModel = propModel !== undefined ? propModel : columnVisibilityModel;

  return (
    <MuiDataGrid
      {...props}
      columnVisibilityModel={finalModel}
      onColumnVisibilityModelChange={handleVisibilityChange}
    />
  );
}
