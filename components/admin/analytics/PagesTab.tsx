"use client";

import React, { useMemo, useState } from "react";
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

  // Pageviews trend data
  const pageviewsData = useMemo(() => {
    if (timeframe === "7days") {
      return [
        { name: "Mon", pageviews: 4200, unique: 3100 },
        { name: "Tue", pageviews: 5100, unique: 3900 },
        { name: "Wed", pageviews: 4800, unique: 3500 },
        { name: "Thu", pageviews: 6200, unique: 4800 },
        { name: "Fri", pageviews: 5900, unique: 4400 },
        { name: "Sat", pageviews: 7300, unique: 5700 },
        { name: "Sun", pageviews: 8120, unique: 6300 }
      ];
    } else if (timeframe === "1year") {
      return [
        { name: "Jul 25", pageviews: 210000, unique: 165000 },
        { name: "Aug 25", pageviews: 225000, unique: 178000 },
        { name: "Sep 25", pageviews: 240000, unique: 190000 },
        { name: "Oct 25", pageviews: 230000, unique: 182000 },
        { name: "Nov 25", pageviews: 250000, unique: 198000 },
        { name: "Dec 25", pageviews: 280000, unique: 220000 },
        { name: "Jan 26", pageviews: 260000, unique: 205000 },
        { name: "Feb 26", pageviews: 275000, unique: 215000 },
        { name: "Mar 26", pageviews: 290000, unique: 230000 },
        { name: "Apr 26", pageviews: 310000, unique: 245000 },
        { name: "May 26", pageviews: 305000, unique: 240000 },
        { name: "Jun 26", pageviews: 325000, unique: 255000 }
      ];
    } else {
      return [
        { name: "Week 1", pageviews: 28600, unique: 22100 },
        { name: "Week 2", pageviews: 34100, unique: 26400 },
        { name: "Week 3", pageviews: 30800, unique: 23800 },
        { name: "Week 4", pageviews: 38200, unique: 29800 }
      ];
    }
  }, [timeframe]);

  // Top Pages list including all routes in the application
  const topPages = [
    // Public Main Routes
    { path: "/", title: "Sierra Fish & Pets | Home", views: "14,850", unique: "11,200", time: "1m 45s", bounce: "38.2%" },
    { path: "/shop", title: "Shop Premium Pet Supplies", views: "12,430", unique: "9,150", time: "2m 10s", bounce: "40.5%" },
    { path: "/product/[id]", title: "Product Detail Page", views: "8,620", unique: "7,100", time: "3m 15s", bounce: "32.1%" },
    { path: "/cart", title: "Shopping Cart", views: "5,120", unique: "4,200", time: "1m 12s", bounce: "28.4%" },
    { path: "/checkout", title: "Secure Checkout", views: "3,850", unique: "2,400", time: "2m 55s", bounce: "24.6%" },
    { path: "/order-success", title: "Order Success Confirmation", views: "980", unique: "950", time: "0m 45s", bounce: "12.2%" },

    // Public Info/Services
    { path: "/sierra-edu", title: "Sierra Edu - Pet Care Articles", views: "2,980", unique: "2,150", time: "4m 20s", bounce: "52.4%" },
    { path: "/gallery", title: "Sierra In-Store Gallery", views: "1,850", unique: "1,400", time: "1m 30s", bounce: "45.8%" },
    { path: "/about", title: "About Us | Sierra Fish & Pets", views: "1,420", unique: "1,150", time: "1m 15s", bounce: "42.7%" },
    { path: "/contact-us", title: "Contact Us | Get in Touch", views: "1,250", unique: "980", time: "1m 05s", bounce: "39.4%" },
    { path: "/services", title: "Pet Services & Grooming", views: "1,180", unique: "910", time: "2m 02s", bounce: "35.6%" },
    { path: "/event-calendar", title: "Store Events Calendar", views: "1,050", unique: "820", time: "2m 40s", bounce: "31.8%" },
    { path: "/flyers", title: "Weekly Specials & Flyers", views: "950", unique: "750", time: "1m 50s", bounce: "29.1%" },
    { path: "/gift-cards", title: "Purchase Gift Cards", views: "820", unique: "680", time: "1m 18s", bounce: "36.2%" },
    { path: "/arrivals", title: "New Arrivals & Stock Updates", views: "780", unique: "610", time: "2m 15s", bounce: "28.5%" },
    { path: "/blogs", title: "Sierra Pet Blog", views: "710", unique: "540", time: "3m 10s", bounce: "48.2%" },
    { path: "/brands", title: "Shop by Pet Brand", views: "650", unique: "510", time: "1m 24s", bounce: "41.3%" },
    { path: "/account", title: "Customer Profile Account", views: "520", unique: "380", time: "2m 05s", bounce: "22.4%" },
    { path: "/reset-password", title: "Reset Account Password", views: "120", unique: "95", time: "1m 10s", bounce: "15.8%" },

    // Admin Routes
    { path: "/admin", title: "Admin Portal Dashboard", views: "850", unique: "150", time: "12m 45s", bounce: "18.2%" },
    { path: "/admin/products", title: "Admin | Products Inventory Management", views: "710", unique: "120", time: "8m 15s", bounce: "14.5%" },
    { path: "/admin/orders", title: "Admin | Customer Orders Processing", views: "650", unique: "110", time: "9m 30s", bounce: "11.2%" },
    { path: "/admin/categories", title: "Admin | Categories Configuration", views: "320", unique: "85", time: "4m 10s", bounce: "19.4%" },
    { path: "/admin/users", title: "Admin | Registered Users List", views: "280", unique: "80", time: "5m 25s", bounce: "16.8%" },
    { path: "/admin/profile", title: "Admin | Profile Settings", views: "190", unique: "65", time: "2m 15s", bounce: "15.2%" },
    { path: "/admin/reviews", title: "Admin | Product Reviews Management", views: "180", unique: "60", time: "3m 40s", bounce: "21.6%" },
    { path: "/admin/events", title: "Admin | Store Events Configuration", views: "160", unique: "55", time: "4m 50s", bounce: "24.3%" },
    { path: "/admin/dog-adoption", title: "Admin | Dog Adoption Listings", views: "150", unique: "50", time: "6m 12s", bounce: "22.5%" },
    { path: "/admin/new-arrivals", title: "Admin | New Arrivals Config", views: "140", unique: "48", time: "3m 50s", bounce: "25.1%" },
    { path: "/admin/brands", title: "Admin | Brands Directory Setup", views: "120", unique: "42", time: "2m 45s", bounce: "28.2%" },
    { path: "/admin/gift-cards", title: "Admin | Issued Gift Cards", views: "110", unique: "40", time: "3m 15s", bounce: "24.7%" },
    { path: "/admin/flyers", title: "Admin | Flyers Dashboard Setup", views: "95", unique: "35", time: "4m 05s", bounce: "20.1%" },
    { path: "/admin/blogs", title: "Admin | Blog Posts Publisher", views: "90", unique: "30", time: "7m 20s", bounce: "18.4%" },
    { path: "/admin/hero-slider", title: "Admin | Home Slider Management", views: "85", unique: "28", time: "5m 10s", bounce: "15.9%" }
  ];

  const filteredPages = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return topPages.filter(
      (page) =>
        page.path.toLowerCase().includes(query) ||
        page.title.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    if (timeframe === "7days") {
      return [
        { label: "Total Pageviews", value: "47,640", pct: "↑ 6.2%", pngIcon: "/images/icons/page-view.png", color: "bg-blue-50" },
        { label: "Unique Pageviews", opacity: true, value: "37,000", pct: "↑ 5.8%", pngIcon: "/images/icons/viewbypage.png", color: "bg-teal-50" },
        { label: "Avg. Time on Page", value: "2m 04s", pct: "↑ 1.5%", pngIcon: "/images/icons/web-session.png", color: "bg-violet-50" },
        { label: "Exit Rate", value: "31.2%", pct: "↘ 2.4%", pngIcon: "/images/icons/bounce-rate.png", color: "bg-rose-50" }
      ];
    } else if (timeframe === "1year") {
      return [
        { label: "Total Pageviews", value: "3,183,000", pct: "↑ 42.1%", pngIcon: "/images/icons/page-view.png", color: "bg-blue-50" },
        { label: "Unique Pageviews", value: "2,488,000", pct: "↑ 38.6%", pngIcon: "/images/icons/viewbypage.png", color: "bg-teal-50" },
        { label: "Avg. Time on Page", value: "2m 14s", pct: "↑ 8.6%", pngIcon: "/images/icons/web-session.png", color: "bg-violet-50" },
        { label: "Exit Rate", value: "29.8%", pct: "↘ 6.4%", pngIcon: "/images/icons/bounce-rate.png", color: "bg-rose-50" }
      ];
    } else {
      return [
        { label: "Total Pageviews", value: "131,700", pct: "↑ 14.5%", pngIcon: "/images/icons/page-view.png", color: "bg-blue-50" },
        { label: "Unique Pageviews", value: "102,100", pct: "↑ 12.3%", pngIcon: "/images/icons/viewbypage.png", color: "bg-teal-50" },
        { label: "Avg. Time on Page", value: "2m 08s", pct: "↑ 2.1%", pngIcon: "/images/icons/web-session.png", color: "bg-violet-50" },
        { label: "Exit Rate", value: "30.9%", pct: "↘ 3.8%", pngIcon: "/images/icons/bounce-rate.png", color: "bg-rose-50" }
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
                filteredPages.map((page, idx) => (
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
