"use client";

import { Users, UserCheck, ShieldAlert, ShieldCheck } from "lucide-react";

type UserStatsProps = {
  users?: {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin" | "manager" | "sales" | "delivery boy";
    status: "active" | "inactive" | "banned";
    isEmailVerified: boolean;
    createdAt: string;
  }[];
  stats?: {
    total: number;
    active: number;
    admins: number;
    banned: number;
  };
  loading?: boolean;
};

export default function UserStats({ users, stats, loading = false }: UserStatsProps) {
  const computedStats = {
    total: stats?.total ?? 0,
    active: stats?.active ?? 0,
    admins: stats?.admins ?? 0,
    banned: stats?.banned ?? 0,
  };



  const cards = [
    {
      label: "Total Users",
      value: computedStats.total,
      icon: Users,
      iconBg: "bg-[#eef6ff]",
      iconColor: "text-[#005AA9]",
      valueColor: "text-slate-800",
    },
    {
      label: "Active Accounts",
      value: computedStats.active,
      icon: UserCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    {
      label: "Admin Users",
      value: computedStats.admins,
      icon: ShieldCheck,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      valueColor: "text-purple-600",
    },
    {
      label: "Banned / Inactive",
      value: computedStats.banned,
      icon: ShieldAlert,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      valueColor: "text-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
              <h3 className={`text-2xl font-black mt-2 ${card.valueColor}`}>
                {loading ? "..." : card.value.toLocaleString()}
              </h3>
            </div>
            <div className={`p-3 ${card.iconBg} rounded-xl ${card.iconColor}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
