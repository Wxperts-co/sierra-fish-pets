import * as XLSX from "xlsx";
import axios from "axios";
import { showErrorToast } from "@/lib/toast";
import { type RetailerCsvExportProduct } from "@/lib/products/retailerCsvColumns";

export type ExportProduct = RetailerCsvExportProduct;

export function exportProductsToExcel(products: ExportProduct[]) {
  if (!products || products.length === 0) {
    throw new Error("No products available to export");
  }

  const rows = products.map((p) => ({
    ID: p.id,
    Name: p.name,
    SKU: p.sku,
    Brand: p.brand,
    Price: p.price,
    "Compare At Price": p.compareAtPrice ?? "",
    "Stock Count": p.stockCount,
    Category: p.categorySlug ?? "",
    Subcategory: p.subcategorySlug ?? "",
    Featured: p.isFeatured ? "Yes" : "No",
    Description: p.description ?? p.shortDescription ?? "",
    Image: p.images?.[0] ?? "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: [
      "ID",
      "Name",
      "SKU",
      "Brand",
      "Price",
      "Compare At Price",
      "Stock Count",
      "Category",
      "Subcategory",
      "Featured",
      "Description",
      "Image",
    ],
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

  const yyyy = new Date().toISOString().slice(0, 10);
  const filename = `products-${yyyy}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

export async function importProductsFromExcel(file: File) {
  if (!file) {
    throw new Error("No file selected");
  }

  const reader = new FileReader();

  return new Promise<any>((resolve, reject) => {
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let range = 0;
        // Detect if the first row is instruction/metadata (like "Read only") and skip it
        const a1Val = worksheet["A1"]?.v;
        if (
          typeof a1Val === "string" &&
          (a1Val.toLowerCase().includes("read only") ||
            a1Val.toLowerCase().includes("can update") ||
            a1Val.toLowerCase().includes("instruction"))
        ) {
          range = 1;
        }

        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { range });

        if (!jsonData || jsonData.length === 0) {
          throw new Error("No data found in file");
        }

        // Send to backend API for importing
        const response = await axios.post("/api/admin/products/import", {
          products: jsonData,
        });

        if (response.data?.success) {
          resolve(response.data);
        } else {
          throw new Error(response.data?.message || "Failed to import products");
        }
      } catch (error: any) {
        console.error("Failed to import products:", error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsArrayBuffer(file);
  });
}

export default exportProductsToExcel;
