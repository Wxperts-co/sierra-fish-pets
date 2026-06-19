"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import UserStats from "@/components/admin/users/UserStats";
import UserFilters from "@/components/admin/users/UserFilters";
import UserDataGrid from "@/components/admin/users/UserDataGrid";
import UserPageHeader from "@/components/admin/users/UserPageHeader";
import UserDetailModal from "@/components/admin/users/UserDetailModal";
import UserEditModal from "../../../components/admin/users/UserEditModal";
import UserDeleteModal from "@/components/admin/users/UserDeleteModal";
import { setLoading } from "@/store/slices/productsSlice";
import axios from "axios";
import { exportUsersToExcel, ExportUser } from "@/lib/export/usersExport";
import { showErrorToast } from "@/lib/toast";
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
  const [searchInput, setSearchInput] = useState("");
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({ total: 0, active: 0, admins: 0, banned: 0 });

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleAddUser = () => {
    router.push("/admin/users/add");
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Reset page when other filters change
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setFilters({
      search: "",
      role: "all",
      status: "all",
      isEmailVerified: "all",
    });
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.set("page", String(paginationModel.page + 1));
        params.set("limit", String(paginationModel.pageSize));
        if (filters.search) params.set("search", filters.search);
        if (filters.role !== "all") params.set("role", filters.role);
        if (filters.status !== "all") params.set("status", filters.status);
        if (filters.isEmailVerified !== "all") params.set("isEmailVerified", filters.isEmailVerified);

        const { data } = await axios.get(`/api/admin/users?${params.toString()}`);
        if (data.success) {
          setUsers(data.users || []);
          setTotalCount(data.count || 0);
          if (data.stats) {
            setStats(data.stats);
          }
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [paginationModel.page, paginationModel.pageSize, filters.search, filters.role, filters.status, filters.isEmailVerified]);

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

  const handleSaveUser = async (updatedUser: User) => {
    try {
      const { data } = await axios.patch(`/api/admin/users/${updatedUser._id}`, updatedUser);

      if (data && data.success) {
        // Re-fetch current page users and stats
        const params = new URLSearchParams();
        params.set("page", String(paginationModel.page + 1));
        params.set("limit", String(paginationModel.pageSize));
        if (filters.search) params.set("search", filters.search);
        if (filters.role !== "all") params.set("role", filters.role);
        if (filters.status !== "all") params.set("status", filters.status);
        if (filters.isEmailVerified !== "all") params.set("isEmailVerified", filters.isEmailVerified);

        const refreshRes = await axios.get(`/api/admin/users?${params.toString()}`);
        if (refreshRes.data && refreshRes.data.success) {
          setUsers(refreshRes.data.users || []);
          setTotalCount(refreshRes.data.count || 0);
          if (refreshRes.data.stats) {
            setStats(refreshRes.data.stats);
          }
        }
        setIsEditModalOpen(false);
      } else {
        showErrorToast(data?.message || "Failed to save user");
      }
    } catch (error) {
      console.error("Failed to save user:", error);
      showErrorToast("Failed to save user");
    }
  };

  const handleDelete = (user: User) => {
    setIsDetailModalOpen(false);
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // Re-fetch current page users and stats
      const params = new URLSearchParams();
      params.set("page", String(paginationModel.page + 1));
      params.set("limit", String(paginationModel.pageSize));
      if (filters.search) params.set("search", filters.search);
      if (filters.role !== "all") params.set("role", filters.role);
      if (filters.status !== "all") params.set("status", filters.status);
      if (filters.isEmailVerified !== "all") params.set("isEmailVerified", filters.isEmailVerified);

      const refreshRes = await axios.get(`/api/admin/users?${params.toString()}`);
      if (refreshRes.data && refreshRes.data.success) {
        setUsers(refreshRes.data.users || []);
        setTotalCount(refreshRes.data.count || 0);
        if (refreshRes.data.stats) {
          setStats(refreshRes.data.stats);
        }
      }
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleToggleStatus = (user: User) => {
    // TODO: call toggle-status API
    console.log("Toggle status", user);
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.role !== "all") params.set("role", filters.role);
      if (filters.status !== "all") params.set("status", filters.status);
      if (filters.isEmailVerified !== "all") params.set("isEmailVerified", filters.isEmailVerified);
      params.set("limit", "100000"); // Retrieve all matching users for export

      const { data } = await axios.get(`/api/admin/users?${params.toString()}`);
      const exportUsersData = data.users || [];

      if (!exportUsersData || exportUsersData.length === 0) {
        showErrorToast("No users available to export");
        return;
      }

      const exportUsers: ExportUser[] = exportUsersData.map((u: any) => ({
        name: u.name,
        email: u.email,
        phone: u.phone ?? "",
        role: u.role,
        isEmailVerified: u.isEmailVerified,
        createdAt: u.createdAt,
      }));

      exportUsersToExcel(exportUsers);
    } catch (err) {
      console.error("Failed to export users:", err);
      showErrorToast("Failed to export users");
    }
  };

  return (
    <div className="space-y-6">
      <UserPageHeader onAddUser={handleAddUser} onExportExcel={handleExport} />
      <UserStats stats={stats} loading={loading} />

      <UserFilters
        filters={{ ...filters, search: searchInput }}
        onFilterChange={(newFilters) => {
          if (newFilters.search !== undefined) {
            setSearchInput(newFilters.search);
          } else {
            handleFilterChange(newFilters);
          }
        }}
        onReset={handleResetFilters}
      />

      <UserDataGrid
        users={users}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        loading={loading}
        rowCount={totalCount}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
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