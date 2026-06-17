"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addUser, resetAddUserState } from "@/store/slices/usersSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const addUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]),
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

export default function AddUserPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.users);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  useEffect(() => {
    return () => {
      dispatch(resetAddUserState());
    };
  }, [dispatch]);

  const onSubmit = async (values: AddUserFormValues) => {
    setSuccessMessage(null);

    const resultAction = await dispatch(addUser(values));

    if (addUser.fulfilled.match(resultAction)) {
      setSuccessMessage("User created successfully.");
      setTimeout(() => router.push("/admin/users"), 800);
    } else {
      const message =
        resultAction.payload || resultAction.error?.message || "Failed to create user.";
      console.error("Add user failed:", message);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/users"
          className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-900">Add New User</h1>
          <p className="mt-2 text-sm text-slate-500">
            Create a new user account for the admin dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <Input
                type="text"
                placeholder="Enter full name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <Input
                type="email"
                placeholder="Enter email address"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <Input
                type="password"
                placeholder="Enter a password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Role</label>
              <select
                className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
                {...register("role")}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="text-xs text-red-600">{errors.role.message}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-slate-500">
                Password must be at least 6 characters.
              </p>
            </div>
            <Button type="submit" className="min-w-[160px]" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
