"use client";

import { Users, UserCheck, ShieldAlert,CalendarDays  } from "lucide-react";

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  status: "active" | "inactive" | "banned";
  isEmailVerified: boolean;
  createdAt: string;
};

type UserStatsProps = {
  users?: User[];
  stats?: {
    total: number;
    active: number;
    admins: number;
    banned: number;
  };
  loading?: boolean;
};

export default function UserStats({ users, stats, loading = false }: UserStatsProps) {
  // Compute stats if users array is provided
  const computedStats = {
    total: stats?.total ?? 0,
    active: stats?.active ?? 0,
    admins: stats?.admins ?? 0,
    banned: stats?.banned ?? 0,
  };

  if (users && users.length > 0) {
    computedStats.total = users.length;
    computedStats.active = users.filter((u) => u.status === "active").length;
    computedStats.admins = users.filter((u) => u.role === "admin").length;
    computedStats.banned = users.filter((u) => u.status === "inactive" || u.status === "banned").length;
  }

  const cards = [
    {
      label: "Total Users",
      value: computedStats.total,
      icon: Users,
      color: "from-[#003B73] to-[#005EA8]",
      bgGlow: "bg-blue-500/10",
      textColor: "text-[#003B73]",
    },
    {
      label: "Active Accounts",
      value: computedStats.active,
      icon: UserCheck,
      color: "from-emerald-600 to-teal-500",
      bgGlow: "bg-emerald-500/10",
      textColor: "text-emerald-600",
    },
    {
      label: "Upcoming Events",
      value: computedStats.admins,
      icon: CalendarDays ,
      color: "from-purple-600 to-indigo-500",
      bgGlow: "bg-purple-500/10",
      textColor: "text-purple-600",
    },
    {
      label: "Banned / Inactive",
      value: computedStats.banned,
      icon: ShieldAlert,
      color: "from-rose-600 to-red-500",
      bgGlow: "bg-rose-500/10",
      textColor: "text-rose-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
          >
            <div className="space-y-3 flex-1">
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-200"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const valueToRender = card.label === "Total Users" ? (users?.length ?? card.value) : card.value;
        return (
          <div
            key={i}
            className="relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5"
          >
            {/* Background Glow */}
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${card.bgGlow} blur-xl group-hover:scale-150 transition-transform duration-500`} />

            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-1.5">
                <span className="text-sm font-medium text-slate-500">{card.label}</span>
                <p className="text-3xl font-extrabold text-slate-800 leading-none">
                  {valueToRender.toLocaleString()}
                </p>
              </div>

              <div className={`p-3.5 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-sm shadow-slate-900/10`}>
                <Icon className="h-5.5 w-5.5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
