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
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";
import { Sparkles, DollarSign, Percent, TrendingUp, Target } from "lucide-react";

interface MarketingTabProps {
  timeframe: "7days" | "30days" | "1year";
}

const BRAND_BLUE = "#3b82f6";
const BRAND_TEAL = "#10b981";
const BRAND_PINK = "#ec4899";
const BRAND_ORANGE = "#f59e0b";
const BRAND_PURPLE = "#8b5cf6";

export default function MarketingTab({ timeframe }: MarketingTabProps) {
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`/api/admin/analytics?timeframe=${timeframe}`);
        const data = await res.json();
        setAnalyticsData(data);
      } catch (err) {
        console.error("Failed to load GA4 marketing data:", err);
      }
    }
    fetchAnalytics();
  }, [timeframe]);

  // Campaign spend vs returns trend
  const campaignTrendData = useMemo(() => {
    if (analyticsData?.trend?.length) {
      return analyticsData.trend.map((t: any) => ({
        name: t.date,
        spend: Math.round(t.activeUsers * 2),
        revenue: Math.round(t.activeUsers * 8),
      }));
    }
    if (timeframe === "7days") {
      return [
        { name: "Mon", spend: 120, revenue: 450 },
        { name: "Tue", spend: 150, revenue: 580 },
        { name: "Wed", spend: 140, revenue: 520 },
        { name: "Thu", spend: 180, revenue: 760 },
        { name: "Fri", spend: 220, revenue: 980 },
        { name: "Sat", spend: 250, revenue: 1100 },
        { name: "Sun", spend: 230, revenue: 950 }
      ];
    } else if (timeframe === "1year") {
      return [
        { name: "Jul 25", spend: 4500, revenue: 18000 },
        { name: "Aug 25", spend: 4800, revenue: 20200 },
        { name: "Sep 25", spend: 5200, revenue: 21500 },
        { name: "Oct 25", spend: 4900, revenue: 19800 },
        { name: "Nov 25", spend: 5800, revenue: 24500 },
        { name: "Dec 25", spend: 7200, revenue: 32000 },
        { name: "Jan 26", spend: 5400, revenue: 22000 },
        { name: "Feb 26", spend: 5100, revenue: 19500 },
        { name: "Mar 26", spend: 5600, revenue: 23500 },
        { name: "Apr 26", spend: 6100, revenue: 26000 },
        { name: "May 26", spend: 6300, revenue: 27500 },
        { name: "Jun 26", spend: 6800, revenue: 29000 }
      ];
    } else {
      return [
        { name: "Week 1", spend: 950, revenue: 3800 },
        { name: "Week 2", spend: 1200, revenue: 5100 },
        { name: "Week 3", spend: 1100, revenue: 4600 },
        { name: "Week 4", spend: 1450, revenue: 6200 }
      ];
    }
  }, [timeframe]);

  // Platform specific breakdown
  const platformData = [
    { name: "Google Ads", spend: 1850, roas: "4.2x", conversions: 420, progress: "w-[42%]", color: BRAND_BLUE },
    { name: "Facebook Ads", spend: 1480, roas: "3.8x", conversions: 380, progress: "w-[38%]", color: BRAND_TEAL },
    { name: "Instagram Ads", spend: 1120, roas: "3.5x", conversions: 310, progress: "w-[31%]", color: BRAND_PINK },
    { name: "TikTok Ads", spend: 750, roas: "2.8x", conversions: 180, progress: "w-[18%]", color: BRAND_ORANGE },
    { name: "Twitter Ads", spend: 240, roas: "2.1x", conversions: 50, progress: "w-[5%]", color: BRAND_PURPLE }
  ];

  // Top Metrics summary
  const summaryMetrics = useMemo(() => {
    if (timeframe === "7days") {
      return [
        { label: "Total Ad Spend", value: "$1,390.00", pct: "↑ 4.2%", pngIcon: "/images/icons/ads.png", color: "bg-violet-50" },
        { label: "Total Conversions", value: "348", pct: "↑ 9.5%", pngIcon: "/images/icons/conversion.png", color: "bg-blue-50" },
        { label: "Avg. ROAS", value: "3.8x", pct: "↑ 2.4%", pngIcon: "/images/icons/salary.png", color: "bg-emerald-50" },
        { label: "Cost Per Click (CPC)", value: "$0.32", pct: "↘ 5.2%", pngIcon: "/images/icons/cost-per-click.png", color: "bg-amber-50" }
      ];
    } else if (timeframe === "1year") {
      return [
        { label: "Total Ad Spend", value: "$67,700.00", pct: "↑ 32.1%", pngIcon: "/images/icons/ads.png", color: "bg-violet-50" },
        { label: "Total Conversions", value: "15,800", pct: "↑ 38.6%", pngIcon: "/images/icons/conversion.png", color: "bg-blue-50" },
        { label: "Avg. ROAS", value: "3.92x", pct: "↑ 12.1%", pngIcon: "/images/icons/salary.png", color: "bg-emerald-50" },
        { label: "Cost Per Click (CPC)", value: "$0.28", pct: "↘ 12.5%", pngIcon: "/images/icons/cost-per-click.png", color: "bg-amber-50" }
      ];
    } else {
      return [
        { label: "Total Ad Spend", value: "$4,700.00", pct: "↑ 12.5%", pngIcon: "/images/icons/ads.png", color: "bg-violet-50" },
        { label: "Total Conversions", value: "1,340", pct: "↑ 18.2%", pngIcon: "/images/icons/conversion.png", color: "bg-blue-50" },
        { label: "Avg. ROAS", value: "3.7x", pct: "↑ 4.8%", pngIcon: "/images/icons/salary.png", color: "bg-emerald-50" },
        { label: "Cost Per Click (CPC)", value: "$0.31", pct: "↘ 3.2%", pngIcon: "/images/icons/cost-per-click.png", color: "bg-amber-50" }
      ];
    }
  }, [timeframe]);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
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

      {/* Main Row: Spend vs Return & Platform share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Ad Spend vs Revenue Composed Chart */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm lg:col-span-2 overflow-hidden flex flex-col justify-between">
          <div className="bg-[#003B73] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/images/icons/salary.png" className="w-4 h-4 object-contain" alt="ROI" />
              <h3 className="text-sm font-bold text-white">Return on Investment (ROI)</h3>
            </div>
          </div>
          <div className="p-5 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={campaignTrendData} margin={{ top: 10, bottom: 0, left: -10, right: 10 }}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND_PINK} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={BRAND_PINK} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND_TEAL} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={BRAND_TEAL} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="spend" stroke={BRAND_PINK} strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" name="Ad Spend ($)" />
                <Area type="monotone" dataKey="revenue" stroke={BRAND_TEAL} strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform breakdown list */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="bg-[#003B73] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/images/icons/ads.png" className="w-4 h-4 object-contain" alt="Efficiency" />
              <h3 className="text-sm font-bold text-white">Channel Efficiency</h3>
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4 pt-1">
              {platformData.map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </div>
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <span className="text-slate-400 font-medium">${item.spend} spend</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px]">{item.roas} ROAS</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.conversions / 5}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
