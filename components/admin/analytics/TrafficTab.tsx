"use client";

import React, { useMemo, useState, useEffect } from "react";
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
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`/api/admin/analytics?timeframe=${timeframe}`);
        const data = await res.json();
        setAnalyticsData(data);
      } catch (err) {
        console.error("Failed to load GA4 traffic data:", err);
      }
    }
    fetchAnalytics();
  }, [timeframe]);

  // Session Growth data
  const sessionData = useMemo(() => {
    if (!analyticsData?.trend?.length) return [];
    return analyticsData.trend.map((t: any) => ({
      name: t.date,
      sessions: t.sessions || t.activeUsers,
      pageviews: t.pageViews,
    }));
  }, [analyticsData]);

  // Traffic Channels breakdown
  const channelData = useMemo(() => {
    if (!analyticsData?.sources?.length) return [];
    const total = analyticsData.sources.reduce((acc: number, s: any) => acc + s.users, 0) || 1;
    return analyticsData.sources.slice(0, 5).map((s: any, idx: number) => ({
      name: s.source || "(direct)",
      value: parseFloat(((s.users / total) * 100).toFixed(1)),
      color: CHANNEL_COLORS[idx % CHANNEL_COLORS.length]
    }));
  }, [analyticsData]);

  // Device type breakdown
  const deviceData = useMemo(() => {
    if (!analyticsData?.devices?.length) return [];
    const total = analyticsData.devices.reduce((acc: number, d: any) => acc + d.users, 0) || 1;
    return analyticsData.devices.map((d: any) => {
      const devName = d.device.charAt(0).toUpperCase() + d.device.slice(1);
      let Icon = Monitor;
      let color = BRAND_TEAL;
      if (d.device.toLowerCase().includes("mobile")) { Icon = Smartphone; color = BRAND_BLUE; }
      if (d.device.toLowerCase().includes("tablet")) { Icon = Tablet; color = BRAND_PINK; }
      return {
        name: devName,
        value: parseFloat(((d.users / total) * 100).toFixed(1)),
        color,
        icon: Icon
      };
    });
  }, [analyticsData]);

  // Organic Acquisition Split
  const organicSplitData = useMemo(() => {
    if (!analyticsData?.sources?.length) return [];
    return analyticsData.sources.map((s: any) => ({
      name: s.source,
      value: s.users
    }));
  }, [analyticsData]);

  // Top Metrics summary
  const topMetrics = useMemo(() => {
    const ov = analyticsData?.overview || {};
    const avgSec = Math.round(ov.avgSessionDuration || 0);
    const mins = Math.floor(avgSec / 60);
    const secs = avgSec % 60;
    const durationStr = `${mins}m ${secs.toString().padStart(2, "0")}s`;

    return [
      { label: "Unique Users", value: (ov.activeUsers || 0).toLocaleString(), pct: "Live", pngIcon: "/images/icons/users.png", color: "bg-blue-50" },
      { label: "Avg. Engagement Time", value: durationStr, pct: "Live", pngIcon: "/images/icons/web-session.png", color: "bg-teal-50" },
      { label: "Sessions", value: (ov.sessions || 0).toLocaleString(), pct: "Live", pngIcon: "/images/icons/sessions.png", color: "bg-violet-50" },
      { label: "Bounce Rate", value: `${((ov.bounceRate || 0) * 100).toFixed(1)}%`, pct: "Live", pngIcon: "/images/icons/bounce-rate.png", color: "bg-rose-50" }
    ];
  }, [analyticsData]);

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
                {item.pct === "Live" ? (
                  <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    Live GA4 Data
                  </span>
                ) : (
                  <>
                    <span className={item.pct.includes("↑") || item.label === "Bounce Rate" ? "text-emerald-500" : "text-rose-500"}>{item.pct}</span>
                    <span className="text-slate-400 font-medium">vs previous period</span>
                  </>
                )}
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
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={20} />
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
                  {channelData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="space-y-1.5 text-xs text-slate-500 font-semibold mt-2">
              {channelData.map((item: any, idx: number) => (
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
              {deviceData.map((device: any, idx: number) => {
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
              <BarChart data={organicSplitData} margin={{ top: 10, bottom: 5, left: -20, right: 0 }}>
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
