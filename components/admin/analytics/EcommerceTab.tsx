"use client";

import React, { useMemo } from "react";
import CustomTooltip from "./CustomTooltip";
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
  Legend,
  LineChart,
  Line
} from "recharts";
import { DollarSign, ShoppingBag, TrendingUp, Percent, ArrowUpRight } from "lucide-react";

interface EcommerceTabProps {
  timeframe: "7days" | "30days" | "1year";
}

const BRAND_BLUE = "#3b82f6";
const BRAND_TEAL = "#10b981";
const BRAND_PINK = "#ec4899";
const BRAND_ORANGE = "#f59e0b";
const BRAND_PURPLE = "#8b5cf6";

export default function EcommerceTab({ timeframe }: EcommerceTabProps) {
  // Sales Trend Data
  const salesTrendData = useMemo(() => {
    if (timeframe === "7days") {
      return [
        { name: "Mon", revenue: 5200, orders: 120 },
        { name: "Tue", revenue: 6100, orders: 145 },
        { name: "Wed", revenue: 5800, orders: 130 },
        { name: "Thu", revenue: 7200, orders: 160 },
        { name: "Fri", revenue: 8900, orders: 195 },
        { name: "Sat", revenue: 9500, orders: 210 },
        { name: "Sun", revenue: 10200, orders: 230 },
      ];
    } else if (timeframe === "1year") {
      return [
        { name: "Jul 25", revenue: 142000, orders: 3200 },
        { name: "Aug 25", revenue: 155000, orders: 3500 },
        { name: "Sep 25", revenue: 148000, orders: 3300 },
        { name: "Oct 25", revenue: 162000, orders: 3700 },
        { name: "Nov 25", revenue: 189000, orders: 4100 },
        { name: "Dec 25", revenue: 245000, orders: 5200 },
        { name: "Jan 26", revenue: 172000, orders: 3800 },
        { name: "Feb 26", revenue: 168000, orders: 3600 },
        { name: "Mar 26", revenue: 185000, orders: 4100 },
        { name: "Apr 26", revenue: 198000, orders: 4400 },
        { name: "May 26", revenue: 210000, orders: 4700 },
        { name: "Jun 26", revenue: 225000, orders: 5000 },
      ];
    } else {
      return [
        { name: "Week 1", revenue: 38000, orders: 850 },
        { name: "Week 2", revenue: 45000, orders: 980 },
        { name: "Week 3", revenue: 42000, orders: 920 },
        { name: "Week 4", revenue: 51000, orders: 1100 },
      ];
    }
  }, [timeframe]);

  // Conversion Funnel Data
  const funnelData = [
    { stage: "Product Views", count: 12500, percentage: 100, fill: BRAND_BLUE },
    { stage: "Add to Cart", count: 4800, percentage: 38.4, fill: BRAND_PURPLE },
    { stage: "Initiate Checkout", count: 2400, percentage: 19.2, fill: BRAND_PINK },
    { stage: "Purchase Completed", count: 980, percentage: 7.8, fill: BRAND_TEAL }
  ];

  // Category Breakdown
  const categoryData = [
    { name: "Fish & Aquariums", value: 45, color: BRAND_BLUE },
    { name: "Dog Supplies", value: 25, color: BRAND_TEAL },
    { name: "Cat Food & Toys", value: 15, color: BRAND_PINK },
    { name: "Bird Accessories", value: 10, color: BRAND_ORANGE },
    { name: "Small Animals", value: 5, color: BRAND_PURPLE }
  ];

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    if (timeframe === "7days") {
      return [
        { label: "Sales Revenue", value: "$52,900.00", pct: "↑ 14.2%", pngIcon: "/images/icons/salary.png", color: "bg-violet-50" },
        { label: "Orders Placed", value: "1,190", pct: "↑ 8.6%", pngIcon: "/images/icons/order.png", color: "bg-blue-50" },
        { label: "Avg. Order Value", value: "$44.45", pct: "↑ 5.2%", pngIcon: "/images/icons/salary.png", color: "bg-emerald-50" },
        { label: "Checkout Conversion", value: "7.84%", pct: "↑ 2.1%", pngIcon: "/images/icons/conversion.png", color: "bg-amber-50" },
      ];
    } else if (timeframe === "1year") {
      return [
        { label: "Sales Revenue", value: "$2,217,000.00", pct: "↑ 38.5%", pngIcon: "/images/icons/salary.png", color: "bg-violet-50" },
        { label: "Orders Placed", value: "49,600", pct: "↑ 24.7%", pngIcon: "/images/icons/order.png", color: "bg-blue-50" },
        { label: "Avg. Order Value", value: "$44.70", pct: "↑ 11.1%", pngIcon: "/images/icons/salary.png", color: "bg-emerald-50" },
        { label: "Checkout Conversion", value: "7.84%", pct: "↑ 6.4%", pngIcon: "/images/icons/conversion.png", color: "bg-amber-50" },
      ];
    } else {
      return [
        { label: "Sales Revenue", value: "$176,000.00", pct: "↑ 18.4%", pngIcon: "/images/icons/salary.png", color: "bg-violet-50" },
        { label: "Orders Placed", value: "3,850", pct: "↑ 12.3%", pngIcon: "/images/icons/order.png", color: "bg-blue-50" },
        { label: "Avg. Order Value", value: "$45.71", pct: "↑ 5.4%", pngIcon: "/images/icons/salary.png", color: "bg-emerald-50" },
        { label: "Checkout Conversion", value: "7.84%", pct: "↑ 3.8%", pngIcon: "/images/icons/conversion.png", color: "bg-amber-50" },
      ];
    }
  }, [timeframe]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
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

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm lg:col-span-2 overflow-hidden flex flex-col justify-between">
          <div className="bg-[#003B73] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/images/icons/salary.png" className="w-4 h-4 object-contain" alt="Monetization" />
              <h3 className="text-sm font-bold text-white">Monetization Trend</h3>
            </div>
          </div>
          <div className="p-5 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData} margin={{ top: 10, bottom: 0, left: -10, right: 10 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND_BLUE} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={BRAND_BLUE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val >= 1000 ? `${val / 1000}k` : val}`} />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke={BRAND_BLUE} strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Share */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="bg-[#003B73] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/images/icons/daily-highlights.png" className="w-4 h-4 object-contain" alt="Category" />
              <h3 className="text-sm font-bold text-white">Sales by Category</h3>
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="h-56 flex items-center justify-center relative">
              <PieChart width={160} height={160}>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="space-y-1.5 text-xs text-slate-500 font-semibold mt-2">
              {categoryData.map((item, idx) => (
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

      {/* Funnel & Top Products Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Purchase Funnel Analysis */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-[#003B73] px-5 py-4 flex items-center gap-2">
            <img src="/images/icons/conversion.png" className="w-4 h-4 object-contain" alt="Funnel" />
            <h3 className="text-sm font-bold text-white">Shopping Behavior Funnel</h3>
          </div>
          <div className="p-5 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 10, left: 20, right: 30, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={9} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis dataKey="stage" type="category" stroke="#475569" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} width={120} />
                <Tooltip formatter={(value) => [value, "Users"]} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


      </div>
    </div>
  );
}
