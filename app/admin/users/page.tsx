"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import UserStats from "@/components/admin/users/UserStats";
import UserFilters from "@/components/admin/users/UserFilters";
import UserTable from "@/components/admin/users/UserTable";
import UserPageHeader from "@/components/admin/users/UserPageHeader";
import UserDetailModal from "@/components/admin/users/UserDetailModal";
import UserEditModal from "../../../components/admin/users/UserEditModal";
import UserDeleteModal from "@/components/admin/users/UserDeleteModal";
import { setLoading } from "@/store/slices/productsSlice";
import axios from "axios";
import { exportUsersToExcel, ExportUser } from "@/src/lib/export/usersExport";
import { showErrorToast } from "@/src/lib/toast";
import { setUser } from "@/store/slices/authSlice";

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  status: "active" | "inactive" | "banned";
  isEmailVerified: boolean;
  avatar?: { url: string; public_id: string };
  createdAt: string;
};

export default function UsersPage() {
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    status: "all",
    isEmailVerified: "all",
  });

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleAddUser = () => {
    router.push("/admin/users/add");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get("/api/admin/users");
        console.log(data);
        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchTerm = filters.search.trim().toLowerCase();
    const matchesSearch =
      !searchTerm ||
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.phone?.toLowerCase().includes(searchTerm);

    const matchesRole = filters.role === "all" || user.role === filters.role;
    const matchesStatus = filters.status === "all" || user.status === filters.status;
    const matchesVerification =
      filters.isEmailVerified === "all" ||
      (filters.isEmailVerified === "verified" && user.isEmailVerified) ||
      (filters.isEmailVerified === "unverified" && !user.isEmailVerified);

    return matchesSearch && matchesRole && matchesStatus && matchesVerification;
  });

  const totalPages = 1;
  const totalItems = filteredUsers.length;
  const itemsPerPage = 10;

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
  };

  const handleEdit = (user: User) => {
    setIsDetailModalOpen(false);
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? { ...user, ...updatedUser } : user
      )
    );
    setSelectedUser(updatedUser);
    setIsEditModalOpen(false);
  };

  const handleDelete = (user: User) => {
    setIsDetailModalOpen(false);
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedUser) return;

    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== selectedUser._id));
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleToggleStatus = (user: User) => {
    // TODO: call toggle-status API
    console.log("Toggle status", user);
  };

  const handleExport = () => {
    const exportUsers: ExportUser[] = filteredUsers.map((u) => ({
      name: u.name,
      email: u.email,
      phone: u.phone ?? "",
      role: u.role,
      isEmailVerified: u.isEmailVerified,
      createdAt: u.createdAt,
    }));

    if (!exportUsers || exportUsers.length === 0) {
      showErrorToast("No users available to export");
      return;
    }

    try {
      exportUsersToExcel(exportUsers);
    } catch (err) {
      console.error("Failed to export users:", err);
      showErrorToast("Failed to export users");
    }
  };

  return (
    <div className="space-y-6">
      <UserPageHeader onAddUser={handleAddUser} onExportExcel={handleExport} />
      <UserStats users={users} />

      <UserFilters
        filters={filters}
        onFilterChange={(newFilters) =>
          setFilters((prev) => ({
            ...prev,
            ...newFilters,
          }))
        }
        onReset={() =>
          setFilters({
            search: "",
            role: "all",
            status: "all",
            isEmailVerified: "all",
          })
        }
      />

      <UserTable
        users={filteredUsers}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      <UserDetailModal
        isOpen={isDetailModalOpen}
        user={selectedUser ?? undefined}
        onClose={handleCloseModal}
        onEdit={selectedUser ? () => handleEdit(selectedUser) : undefined}
        onDelete={selectedUser ? () => handleDelete(selectedUser) : undefined}
      />

      <UserEditModal
        isOpen={isEditModalOpen}
        user={selectedUser ?? undefined}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveUser}
      />

      <UserDeleteModal
        isOpen={isDeleteModalOpen}
        user={selectedUser ?? undefined}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}