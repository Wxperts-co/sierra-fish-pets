import * as XLSX from "xlsx";

export type ExportUser = {
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  createdAt: string;
};

function formatRole(role: ExportUser["role"]) {
  return role === "admin" ? "Administrator" : "Customer";
}

function formatVerified(v: boolean) {
  return v ? "Verified" : "Unverified";
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleString();
  } catch {
    return dateStr;
  }
}

export function exportUsersToExcel(users: ExportUser[]) {
  if (!users || users.length === 0) {
    throw new Error("No users available to export");
  }

  // Map users to the required export columns
  const rows = users.map((u) => ({
    Name: u.name,
    Email: u.email,
    Phone: u.phone ?? "",
    Role: formatRole(u.role),
    "Email Verification Status": formatVerified(u.isEmailVerified),
    "Joined Date": formatDate(u.createdAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: [
      "Name",
      "Email",
      "Phone",
      "Role",
      "Email Verification Status",
      "Joined Date",
    ],
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });

  const yyyy = new Date().toISOString().slice(0, 10);
  const filename = `users-${yyyy}.xlsx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default exportUsersToExcel;
