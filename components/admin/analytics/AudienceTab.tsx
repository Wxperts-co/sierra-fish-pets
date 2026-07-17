"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Users, UserPlus, Heart, HeartHandshake, Globe } from "lucide-react";
import CustomTooltip from "./CustomTooltip";

interface AudienceTabProps {
  timeframe: "7days" | "30days" | "1year";
}

const BRAND_BLUE = "#3b82f6";
const BRAND_TEAL = "#10b981";
const BRAND_PINK = "#ec4899";
const BRAND_ORANGE = "#f59e0b";
const BRAND_PURPLE = "#8b5cf6";

export default function AudienceTab({ timeframe }: AudienceTabProps) {
  // Audience growth trend
  const growthData = useMemo(() => {
    if (timeframe === "7days") {
      return [
        { name: "Mon", total: 8100, newUsers: 45 },
        { name: "Tue", total: 8160, newUsers: 60 },
        { name: "Wed", total: 8210, newUsers: 50 },
        { name: "Thu", total: 8280, newUsers: 70 },
        { name: "Fri", total: 8350, newUsers: 70 },
        { name: "Sat", total: 8410, newUsers: 60 },
        { name: "Sun", total: 8452, newUsers: 42 }
      ];
    } else if (timeframe === "1year") {
      return [
        { name: "Jul 25", total: 4200, newUsers: 380 },
        { name: "Aug 25", total: 4600, newUsers: 400 },
        { name: "Sep 25", total: 5100, newUsers: 500 },
        { name: "Oct 25", total: 5500, newUsers: 400 },
        { name: "Nov 25", total: 5900, newUsers: 400 },
        { name: "Dec 25", total: 6400, newUsers: 500 },
        { name: "Jan 26", total: 6800, newUsers: 400 },
        { name: "Feb 26", total: 7100, newUsers: 300 },
        { name: "Mar 26", total: 7500, newUsers: 400 },
        { name: "Apr 26", total: 7800, newUsers: 300 },
        { name: "May 26", total: 8100, newUsers: 300 },
        { name: "Jun 26", total: 8300, newUsers: 200 }
      ];
    } else {
      return [
        { name: "Week 1", total: 7200, newUsers: 280 },
        { name: "Week 2", total: 7600, newUsers: 400 },
        { name: "Week 3", total: 8000, newUsers: 400 },
        { name: "Week 4", total: 8452, newUsers: 452 }
      ];
    }
  }, [timeframe]);

  // Gender breakdown
  const genderData = [
    { name: "Female", value: 54, color: BRAND_PINK },
    { name: "Male", value: 41, color: BRAND_BLUE },
    { name: "Non-binary / Other", value: 5, color: BRAND_TEAL }
  ];

  // Age group breakdown
  const ageData = [
    { name: "18-24", value: 15 },
    { name: "25-34", value: 38 },
    { name: "35-44", value: 26 },
    { name: "45-54", value: 13 },
    { name: "55+", value: 8 }
  ];

  // Geographical state split
  const stateData = [
    { state: "California", users: "6,240 users", pct: "73.8%", pctNum: 73.8, color: BRAND_BLUE },
    { state: "Texas", users: "920 users", pct: "10.8%", pctNum: 10.8, color: BRAND_TEAL },
    { state: "Florida", users: "510 users", pct: "6.0%", pctNum: 6.0, color: BRAND_PINK },
    { state: "New York", users: "245 users", pct: "2.9%", pctNum: 2.9, color: BRAND_ORANGE },
    { state: "Other states", users: "537 users", pct: "6.5%", pctNum: 6.5, color: BRAND_PURPLE }
  ];

  // Summary Cards
  const summaryMetrics = useMemo(() => {
    if (timeframe === "7days") {
      return [
        { label: "Active Customers", value: "8,452", pct: "↑ 0.9%", pngIcon: "/images/icons/users.png", color: "bg-blue-50" },
        { label: "New Signups", value: "397", pct: "↑ 4.2%", pngIcon: "/images/icons/website-user.png", color: "bg-teal-50" },
        { label: "Customer LTV", value: "$185.00", pct: "↑ 2.1%", pngIcon: "/images/icons/salary.png", color: "bg-rose-50" },
        { label: "Retention Rate", value: "82.4%", pct: "↑ 1.1%", pngIcon: "/images/icons/conversion.png", color: "bg-amber-50" }
      ];
    } else if (timeframe === "1year") {
      return [
        { label: "Active Customers", value: "8,452", pct: "↑ 85.3%", pngIcon: "/images/icons/users.png", color: "bg-blue-50" },
        { label: "New Signups", value: "4,252", pct: "↑ 64.2%", pngIcon: "/images/icons/website-user.png", color: "bg-teal-50" },
        { label: "Customer LTV", value: "$198.50", pct: "↑ 12.8%", pngIcon: "/images/icons/salary.png", color: "bg-rose-50" },
        { label: "Retention Rate", value: "84.2%", pct: "↑ 4.5%", pngIcon: "/images/icons/conversion.png", color: "bg-amber-50" }
      ];
    } else {
      return [
        { label: "Active Customers", value: "8,452", pct: "↑ 14.5%", pngIcon: "/images/icons/users.png", color: "bg-blue-50" },
        { label: "New Signups", value: "1,482", pct: "↑ 18.4%", pngIcon: "/images/icons/website-user.png", color: "bg-teal-50" },
        { label: "Customer LTV", value: "$192.00", pct: "↑ 5.2%", pngIcon: "/images/icons/salary.png", color: "bg-rose-50" },
        { label: "Retention Rate", value: "83.1%", pct: "↑ 2.1%", pngIcon: "/images/icons/conversion.png", color: "bg-amber-50" }
      ];
    }
  }, [timeframe]);

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold tracking-tight">{item.label}</span>
              <div className={`p-1.5 rounded-full ${item.color} w-8 h-8 flex items-center justify-center shrink-0`}>
                <img src={item.pngIcon} className="w-5 h-5 object-contain" alt={item.label} />
              </div>
            </div>
            <div className="space-y-1 mt-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{item.value}</h2>
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <span className="text-emerald-500">{item.pct}</span>
                <span className="text-slate-400 font-medium">vs previous period</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Growth Trend */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm lg:col-span-2 overflow-hidden flex flex-col justify-between">
          <div className="bg-[#003B73] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/images/icons/traffic.png" className="w-4 h-4 object-contain" alt="Audience Growth" />
              <h3 className="text-sm font-bold text-white">Audience Growth</h3>
            </div>
          </div>
          <div className="p-5 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, bottom: 0, left: -10, right: 10 }}>
                <defs>
                  <linearGradient id="colorAudience" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND_BLUE} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={BRAND_BLUE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val} />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke={BRAND_BLUE} strokeWidth={2.5} fillOpacity={1} fill="url(#colorAudience)" name="Active Customers" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender breakdown */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="bg-[#003B73] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/images/icons/devicebreakdown.png" className="w-4 h-4 object-contain" alt="Gender Breakdown" />
              <h3 className="text-sm font-bold text-white">Gender Distribution</h3>
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="h-52 flex items-center justify-center relative">
              <PieChart width={150} height={150}>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="space-y-1.5 text-xs text-slate-500 font-semibold mt-2">
              {genderData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-700">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Demographic and age split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Geo country split list */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="bg-[#003B73] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <img src="/images/icons/map.png" className="w-4 h-4 object-contain" alt="Map" />
              Customer Location (States)
            </div>
          </div>
          <div className="p-5">
            <div className="space-y-4 pt-1">
              {stateData.map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-700">
                      {item.state}
                    </div>
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <span className="text-slate-400 font-medium">{item.users}</span>
                      <span>{item.pct}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.pctNum}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Age Groups bar graph */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="bg-[#003B73] px-5 py-4 flex items-center gap-2">
            <img src="/images/icons/users.png" className="w-4 h-4 object-contain" alt="Age Split" />
            <h3 className="text-sm font-bold text-white">Age Demographics</h3>
          </div>
          <div className="p-5 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} margin={{ top: 10, bottom: 5, left: -20, right: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip />
                <Bar dataKey="value" fill={BRAND_PURPLE} radius={[4, 4, 0, 0]} name="Percentage (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
