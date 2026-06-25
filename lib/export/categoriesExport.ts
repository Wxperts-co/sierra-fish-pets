import * as XLSX from "xlsx";
import type { Category } from "@/types";

export type ExportCategory = Category & {
  _id: string;
};

function formatSubcategories(subcategories: Category["subcategories"]) {
  return (subcategories || [])
    .map((subcategory) => `${subcategory.name} (${subcategory.slug})`)
    .join("; ");
}

export function exportCategoriesToExcel(categories: ExportCategory[]) {
  if (!categories || categories.length === 0) {
    throw new Error("No categories available to export");
  }

  const rows = categories.map((category) => ({
    Name: category.name,
    Slug: category.slug,
    Description: category.description,
    Image: category.image,
    Icon: category.icon,
    "Product Count": category.productCount,
    "Subcategory Count": category.subcategories?.length ?? 0,
    Subcategories: formatSubcategories(category.subcategories),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: [
      "Name",
      "Slug",
      "Description",
      "Image",
      "Icon",
      "Product Count",
      "Subcategory Count",
      "Subcategories",
    ],
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");

  const yyyy = new Date().toISOString().slice(0, 10);
  const filename = `categories-${yyyy}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

export default exportCategoriesToExcel;
