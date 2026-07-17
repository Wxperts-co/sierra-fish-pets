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
  Legend,
  LineChart,
  Line
} from "recharts";
import { Users, Clock, Compass, Activity, Monitor, Smartphone, Tablet } from "lucide-react";
import CustomTooltip from "./CustomTooltip";

interface TrafficTabProps {
  timeframe: "7days" | "30days" | "1year";
}

const BRAND_BLUE = "#3b82f6";
const BRAND_TEAL = "#10b981";
const BRAND_PINK = "#ec4899";
const BRAND_ORANGE = "#f59e0b";
const BRAND_PURPLE = "#8b5cf6";
const BRAND_SLATE = "#64748b";

const CHANNEL_COLORS = [BRAND_BLUE, BRAND_TEAL, BRAND_PINK, BRAND_ORANGE, BRAND_PURPLE];

export default function TrafficTab({ timeframe }: TrafficTabProps) {
  // Session Growth data
  const sessionData = useMemo(() => {
    if (timeframe === "7days") {
      return [
        { name: "Mon", sessions: 1800, pageviews: 4200 },
        { name: "Tue", sessions: 2200, pageviews: 5100 },
        { name: "Wed", sessions: 2100, pageviews: 4800 },
        { name: "Thu", sessions: 2800, pageviews: 6200 },
        { name: "Fri", sessions: 2600, pageviews: 5900 },
        { name: "Sat", sessions: 3200, pageviews: 7300 },
        { name: "Sun", sessions: 3500, pageviews: 8120 }
      ];
    } else if (timeframe === "1year") {
      return [
        { name: "Jul 25", sessions: 85000, pageviews: 210000 },
        { name: "Aug 25", sessions: 92000, pageviews: 225000 },
        { name: "Sep 25", sessions: 98000, pageviews: 240000 },
        { name: "Oct 25", sessions: 95000, pageviews: 230000 },
        { name: "Nov 25", sessions: 102000, pageviews: 250000 },
        { name: "Dec 25", sessions: 118000, pageviews: 280000 },
        { name: "Jan 26", sessions: 108000, pageviews: 260000 },
        { name: "Feb 26", sessions: 112000, pageviews: 275000 },
        { name: "Mar 26", sessions: 120000, pageviews: 290000 },
        { name: "Apr 26", sessions: 128000, pageviews: 310000 },
        { name: "May 26", sessions: 125000, pageviews: 305000 },
        { name: "Jun 26", sessions: 135000, pageviews: 325000 }
      ];
    } else {
      return [
        { name: "Week 1", sessions: 12400, pageviews: 28600 },
        { name: "Week 2", sessions: 14800, pageviews: 34100 },
        { name: "Week 3", sessions: 13200, pageviews: 30800 },
        { name: "Week 4", sessions: 16500, pageviews: 38200 }
      ];
    }
  }, [timeframe]);

  // Traffic Channels breakdown
  const channelData = [
    { name: "Direct", value: 37.7, color: BRAND_BLUE },
    { name: "Organic Search", value: 29.9, color: BRAND_TEAL },
    { name: "Social Media", value: 19.8, color: BRAND_PINK },
    { name: "Referral", value: 10.5, color: BRAND_ORANGE },
    { name: "Email", value: 5.4, color: BRAND_PURPLE }
  ];

  // User type breakdown (New vs Returning)
  const userTypeData = [
    { name: "New Users", value: 72, color: BRAND_BLUE },
    { name: "Returning Users", value: 28, color: BRAND_TEAL }
  ];

  // Device type breakdown
  const deviceData = [
    { name: "Mobile", value: 65, color: BRAND_BLUE, icon: Smartphone },
    { name: "Desktop", value: 30, color: BRAND_TEAL, icon: Monitor },
    { name: "Tablet", value: 5, color: BRAND_PINK, icon: Tablet }
  ];

  // Top Metrics summary
  const topMetrics = useMemo(() => {
    if (timeframe === "7days") {
      return [
        { label: "Unique Users", value: "8,120", pct: "↑ 5.4%", pngIcon: "/images/icons/users.png", color: "bg-blue-50" },
        { label: "Avg. Engagement Time", value: "2m 14s", pct: "↑ 1.8%", pngIcon: "/images/icons/web-session.png", color: "bg-teal-50" },
        { label: "Sessions", value: "18,700", pct: "↑ 6.2%", pngIcon: "/images/icons/sessions.png", color: "bg-violet-50" },
        { label: "Bounce Rate", value: "42.6%", pct: "↘ 4.5%", pngIcon: "/images/icons/bounce-rate.png", color: "bg-rose-50" }
      ];
    } else if (timeframe === "1year") {
      return [
        { label: "Unique Users", value: "345,230", pct: "↑ 42.1%", pngIcon: "/images/icons/users.png", color: "bg-blue-50" },
        { label: "Avg. Engagement Time", value: "2m 28s", pct: "↑ 12.4%", pngIcon: "/images/icons/web-session.png", color: "bg-teal-50" },
        { label: "Sessions", value: "1,298,000", pct: "↑ 38.5%", pngIcon: "/images/icons/sessions.png", color: "bg-violet-50" },
        { label: "Bounce Rate", value: "41.2%", pct: "↘ 8.2%", pngIcon: "/images/icons/bounce-rate.png", color: "bg-rose-50" }
      ];
    } else {
      return [
        { label: "Unique Users", value: "32,985", pct: "↑ 18.6%", pngIcon: "/images/icons/users.png", color: "bg-blue-50" },
        { label: "Avg. Engagement Time", value: "2m 18s", pct: "↑ 3.2%", pngIcon: "/images/icons/web-session.png", color: "bg-teal-50" },
        { label: "Sessions", value: "56,900", pct: "↑ 14.5%", pngIcon: "/images/icons/sessions.png", color: "bg-violet-50" },
        { label: "Bounce Rate", value: "42.1%", pct: "↘ 5.8%", pngIcon: "/images/icons/bounce-rate.png", color: "bg-rose-50" }
      ];
    }
  }, [timeframe]);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topMetrics.map((item, idx) => (
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
                <span className={item.pct.includes("↑") || item.label === "Bounce Rate" ? "text-emerald-500" : "text-rose-500"}>{item.pct}</span>
                <span className="text-slate-400 font-medium">vs previous period</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sessions & Pageviews Chart */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm lg:col-span-2 overflow-hidden flex flex-col justify-between">
          <div className="bg-[#003B73] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/images/icons/traffic.png" className="w-4 h-4 object-contain" alt="Traffic" />
              <h3 className="text-sm font-bold text-white">Traffic Growth & Engagement</h3>
            </div>
          </div>
          <div className="p-5 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sessionData} margin={{ top: 10, bottom: 0, left: -10, right: 10 }}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND_BLUE} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={BRAND_BLUE} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND_TEAL} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={BRAND_TEAL} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val} />
                <Tooltip />
                <Area type="monotone" dataKey="sessions" stroke={BRAND_BLUE} strokeWidth={2.5} fillOpacity={1} fill="url(#colorSessions)" name="Sessions" />
                <Area type="monotone" dataKey="pageviews" stroke={BRAND_TEAL} strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" name="Pageviews" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Channels */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="bg-[#003B73] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/images/icons/traffic-breakdown.png" className="w-4 h-4 object-contain" alt="Channels" />
              <h3 className="text-sm font-bold text-white">Acquisition Channels</h3>
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="h-52 flex items-center justify-center relative">
              <PieChart width={150} height={150}>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="space-y-1.5 text-xs text-slate-500 font-semibold mt-2">
              {channelData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-600">
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

      {/* Row 3: Users Types and Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Device breakdown */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="bg-[#003B73] px-5 py-4 flex items-center gap-2">
            <img src="/images/icons/devicebreakdown.png" className="w-4 h-4 object-contain" alt="Devices" />
            <h3 className="text-sm font-bold text-white">Device Split</h3>
          </div>
          <div className="p-5">
            <div className="space-y-4 pt-1">
              {deviceData.map((device, idx) => {
                const Icon = device.icon;
                return (
                  <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{device.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${device.value}%`, backgroundColor: device.color }} />
                      </div>
                      <span className="font-bold text-slate-700 w-8 text-right">{device.value}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>


        {/* Channels organic split (Bar Chart) */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="bg-[#003B73] px-5 py-4 flex items-center gap-2">
            <img src="/images/icons/web-traffic.png" className="w-4 h-4 object-contain" alt="Organic Split" />
            <h3 className="text-sm font-bold text-white">Organic Acquisition Split</h3>
          </div>
          <div className="p-5 h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: "Google", value: 6500 },
                { name: "Bing", value: 1200 },
                { name: "DuckDuck", value: 850 },
                { name: "Yahoo", value: 410 },
                { name: "Ecosia", value: 240 }
              ]} margin={{ top: 10, bottom: 5, left: -20, right: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} fontWeight={600} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill={BRAND_TEAL} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
