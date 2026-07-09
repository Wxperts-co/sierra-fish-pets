"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const editUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  role: z.enum(["user", "admin", "manager", "sales", "delivery boy"]),
  status: z.enum(["active", "inactive", "banned"]),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "manager" | "sales" | "delivery boy";
  status: "active" | "inactive" | "banned";
  isEmailVerified: boolean;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  createdAt: string;
};

type UserEditModalProps = {
  isOpen: boolean;
  user?: User;
  onClose: () => void;
  onSave: (user: User) => void;
};

export default function UserEditModal({ isOpen, user, onClose, onSave }: UserEditModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      status: "active",
    },
  });

  useEffect(() => {
    if (!user) return;

    reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      zipCode: user.zipCode,
      country: user.country,
      role: user.role,
      status: user.status,
    });
  }, [user, reset]);

  if (!isOpen || !user) return null;

  const onSubmit = (values: EditUserFormValues) => {
    onSave({
      ...user,
      ...values,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit User</h2>
            <p className="text-sm text-slate-500">Update user details in the modal.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100 transition"
            aria-label="Close edit modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <Input type="text" {...register("name")} disabled />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <Input type="email" {...register("email")} disabled />
              {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Phone</label>
              <Input type="text" {...register("phone")} />
              {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Address</label>
              <Input type="text" {...register("address")} />
              {errors.address && <p className="text-xs text-red-600">{errors.address.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">City</label>
              <Input type="text" {...register("city")} />
              {errors.city && <p className="text-xs text-red-600">{errors.city.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">State</label>
              <Input type="text" {...register("state")} />
              {errors.state && <p className="text-xs text-red-600">{errors.state.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Zip Code</label>
              <Input type="text" {...register("zipCode")} />
              {errors.zipCode && <p className="text-xs text-red-600">{errors.zipCode.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Country</label>
              <Input type="text" {...register("country")} />
              {errors.country && <p className="text-xs text-red-600">{errors.country.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Role</label>
              <select
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
                {...register("role")}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="sales">Sales</option>
                <option value="delivery boy">Delivery Boy</option>
              </select>
              {errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
                {...register("status")}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
              {errors.status && <p className="text-xs text-red-600">{errors.status.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" className="min-w-[140px]" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
