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
  LineChart,
  Line
} from "recharts";
import { FileText, Eye, Clock, LogOut, Search } from "lucide-react";

interface PagesTabProps {
  timeframe: "7days" | "30days" | "1year";
}

const BRAND_BLUE = "#3b82f6";
const BRAND_TEAL = "#10b981";
const BRAND_PINK = "#ec4899";
const BRAND_PURPLE = "#8b5cf6";

export default function PagesTab({ timeframe }: PagesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`/api/admin/analytics?timeframe=${timeframe}`);
        const data = await res.json();
        setAnalyticsData(data);
      } catch (err) {
        console.error("Failed to load GA4 pages data:", err);
      }
    }
    fetchAnalytics();
  }, [timeframe]);

  // Pageviews trend data
  const pageviewsData = useMemo(() => {
    if (!analyticsData?.trend?.length) return [];
    return analyticsData.trend.map((t: any) => ({
      name: t.date,
      pageviews: t.pageViews,
      unique: t.activeUsers,
    }));
  }, [analyticsData]);

  // Default Application Routes Manifest
  const ALL_SITE_ROUTES = [
    { path: "/", title: "Sierra Fish & Pets | Home Page" },
    { path: "/shop", title: "Shop Premium Pet Supplies" },
    { path: "/cart", title: "Shopping Cart" },
    { path: "/checkout", title: "Secure Checkout" },
    { path: "/order-success", title: "Order Success Confirmation" },
    { path: "/about", title: "About Us | Sierra Fish & Pets" },
    { path: "/contact-us", title: "Contact Us | Get in Touch" },
    { path: "/services", title: "Pet Services & Grooming" },
    { path: "/event-calendar", title: "Store Events Calendar" },
    { path: "/flyers", title: "Weekly Specials & Flyers" },
    { path: "/gift-cards", title: "Purchase Gift Cards" },
    { path: "/arrivals", title: "New Arrivals & Stock Updates" },
    { path: "/blogs", title: "Sierra Pet Blog" },
    { path: "/brands", title: "Shop by Pet Brand" },
    { path: "/account", title: "Customer Profile Account" },
    { path: "/admin", title: "Admin Portal Dashboard" },
  ];

  // Top Pages list combining live GA4 data with application route manifest
  const topPages = useMemo(() => {
    const gaMap = new Map<string, any>();
    if (analyticsData?.pages?.length) {
      analyticsData.pages.forEach((p: any) => {
        gaMap.set(p.path, p);
      });
    }

    return ALL_SITE_ROUTES.map((route) => {
      const gaItem = gaMap.get(route.path);
      const views = gaItem ? gaItem.views : 0;
      const users = gaItem ? gaItem.users : 0;
      const avgSec = Math.round(analyticsData?.overview?.avgSessionDuration || 0);
      const mins = Math.floor(avgSec / 60);
      const secs = avgSec % 60;
      const durationStr = `${mins}m ${secs.toString().padStart(2, "0")}s`;

      return {
        path: route.path,
        title: route.title,
        views: views.toLocaleString(),
        unique: users.toLocaleString(),
        time: gaItem ? durationStr : "0m 00s",
        bounce: gaItem ? `${((analyticsData?.overview?.bounceRate || 0) * 100).toFixed(1)}%` : "0.0%",
      };
    });
  }, [analyticsData]);

  const filteredPages = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return topPages.filter(
      (page: any) =>
        page.path.toLowerCase().includes(query) ||
        page.title.toLowerCase().includes(query)
    );
  }, [searchQuery, topPages]);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const ov = analyticsData?.overview || {};
    const avgSec = Math.round(ov.avgSessionDuration || 0);
    const mins = Math.floor(avgSec / 60);
    const secs = avgSec % 60;
    const durationStr = `${mins}m ${secs.toString().padStart(2, "0")}s`;

    return [
      { label: "Total Pageviews", value: (ov.pageViews || 0).toLocaleString(), pct: "Live", pngIcon: "/images/icons/page-view.png", color: "bg-blue-50" },
      { label: "Unique Pageviews", value: (ov.activeUsers || 0).toLocaleString(), pct: "Live", pngIcon: "/images/icons/viewbypage.png", color: "bg-teal-50" },
      { label: "Avg. Time on Page", value: durationStr, pct: "Live", pngIcon: "/images/icons/web-session.png", color: "bg-violet-50" },
      { label: "Exit Rate", value: `${((ov.bounceRate || 0) * 100).toFixed(1)}%`, pct: "Live", pngIcon: "/images/icons/bounce-rate.png", color: "bg-rose-50" }
    ];
  }, [analyticsData]);

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
                {item.pct === "Live" ? (
                  <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    Live GA4 Data
                  </span>
                ) : (
                  <>
                    <span className="text-emerald-500">{item.pct}</span>
                    <span className="text-slate-400 font-medium">vs previous period</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pages and Screens View Trend */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="bg-[#003B73] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/icons/pageperformance.png" className="w-4 h-4 object-contain" alt="Pageviews" />
            <h3 className="text-sm font-bold text-white">Pageviews vs Unique Pageviews</h3>
          </div>
        </div>
        <div className="p-5 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pageviewsData} margin={{ top: 10, bottom: 0, left: -10, right: 10 }}>
              <defs>
                <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BRAND_BLUE} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={BRAND_BLUE} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BRAND_PURPLE} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={BRAND_PURPLE} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val} />
              <Tooltip />
              <Area type="monotone" dataKey="pageviews" stroke={BRAND_BLUE} strokeWidth={2.5} fillOpacity={1} fill="url(#colorPageviews)" name="Total Pageviews" />
              <Area type="monotone" dataKey="unique" stroke={BRAND_PURPLE} strokeWidth={2} fillOpacity={1} fill="url(#colorUnique)" name="Unique Pageviews" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Pages Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-[#003B73] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src="/images/icons/viewbypage.png" className="w-4 h-4 object-contain" alt="Performance" />
            <h3 className="text-sm font-bold text-white">Pages and Screens Performance</h3>
          </div>
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search page path or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-full bg-white/10 text-xs font-semibold text-white placeholder-blue-200 border border-white/10 focus:bg-white/20 focus:outline-none transition-all"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200" />
          </div>
        </div>
        <div className="p-5 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
                <th className="pb-3">Page Path & Title</th>
                <th className="pb-3 text-right">Pageviews</th>
                <th className="pb-3 text-right">Unique Pageviews</th>
                <th className="pb-3 text-right">Avg. Time on Page</th>
                <th className="pb-3 text-right">Bounce Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
              {filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-slate-400 font-semibold">
                    No pages matching your search query
                  </td>
                </tr>
              ) : (
                filteredPages.map((page: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3">
                      <div className="text-[#005AA9] hover:underline cursor-pointer">{page.path}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{page.title}</div>
                    </td>
                    <td className="py-3 text-right font-bold text-slate-800">{page.views}</td>
                    <td className="py-3 text-right font-medium text-slate-500">{page.unique}</td>
                    <td className="py-3 text-right font-medium text-slate-600">{page.time}</td>
                    <td className="py-3 text-right font-bold text-slate-700">{page.bounce}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
