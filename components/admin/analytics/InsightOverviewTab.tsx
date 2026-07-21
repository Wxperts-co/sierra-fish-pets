"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Globe,
  Mail,
  Share2,
  MousePointerClick,
} from "lucide-react";

const FacebookIconComponent = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const YoutubeIconComponent = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.526 3.5 12 3.5 12 3.5s-7.526 0-9.388.555A3.002 3.002 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108c1.862.555 9.388.555 9.388.555s7.526 0 9.388-.555a3.002 3.002 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const channelGrowthByTimeframe: Record<string, Record<string, { value: string; isPositive: boolean }>> = {
  "7days": {
    "Direct": { value: "↓ 1.2%", isPositive: false },
    "Organic Search": { value: "↑ 8.2%", isPositive: true },
    "Facebook": { value: "↑ 3.8%", isPositive: true },
    "YouTube": { value: "↑ 2.4%", isPositive: true },
    "Referral": { value: "↑ 1.1%", isPositive: true },
    "Email": { value: "↑ 3.5%", isPositive: true }
  },
  "30days": {
    "Direct": { value: "↑ 5.2%", isPositive: true },
    "Organic Search": { value: "↑ 29.9%", isPositive: true },
    "Facebook": { value: "↑ 14.5%", isPositive: true },
    "YouTube": { value: "↑ 9.2%", isPositive: true },
    "Referral": { value: "↓ 2.4%", isPositive: false },
    "Email": { value: "↑ 8.7%", isPositive: true }
  },
  "1year": {
    "Direct": { value: "↑ 12.4%", isPositive: true },
    "Organic Search": { value: "↑ 45.1%", isPositive: true },
    "Facebook": { value: "↑ 32.8%", isPositive: true },
    "YouTube": { value: "↑ 20.4%", isPositive: true },
    "Referral": { value: "↑ 4.2%", isPositive: true },
    "Email": { value: "↑ 22.1%", isPositive: true }
  }
};

const INSIGHTS_COLORS = ["#3b82f6", "#06b6d4", "#1877F2", "#FF0000", "#f59e0b", "#64748b"];

const metricsByTimeframe: Record<string, {
  bestChannelGrowth: string;
  bounceRateChange: string;
  totalSessions: string;
  avgSession: string;
  newUsers: string;
}> = {
  "7days": { bestChannelGrowth: "↑ 8.2%", bounceRateChange: "↓ 4.5%", totalSessions: "18,700", avgSession: "2m 14s", newUsers: "8,120" },
  "30days": { bestChannelGrowth: "↑ 29.9%", bounceRateChange: "↓ 8.4%", totalSessions: "56,900", avgSession: "2m 18s", newUsers: "32,985" },
  "1year": { bestChannelGrowth: "↑ 45.1%", bounceRateChange: "↓ 2.1%", totalSessions: "1,298,000", avgSession: "2m 28s", newUsers: "345,230" },
};

const channelIcons: Record<string, React.ReactNode> = {
  "Direct": <MousePointerClick className="w-4 h-4" />,
  "Organic Search": <Globe className="w-4 h-4" />,
  "Facebook": <img src="/images/icons/facebook.png" className="w-4 h-4 object-contain" alt="Facebook" />,
  "YouTube": <img src="/images/icons/youtube.png" className="w-4 h-4 object-contain" alt="YouTube" />,
  "Referral": <TrendingUp className="w-4 h-4" />,
  "Email": <Mail className="w-4 h-4" />,
};

const miniTrends: Record<string, { v: number }[]> = {
  "Direct": [{ v: 3 }, { v: 5 }, { v: 4 }, { v: 7 }, { v: 9 }],
  "Organic Search": [{ v: 2 }, { v: 4 }, { v: 3 }, { v: 5 }, { v: 6 }],
  "Facebook": [{ v: 4 }, { v: 6 }, { v: 5 }, { v: 7 }, { v: 8 }],
  "YouTube": [{ v: 3 }, { v: 4 }, { v: 3 }, { v: 5 }, { v: 6 }],
  "Referral": [{ v: 2 }, { v: 3 }, { v: 2 }, { v: 4 }, { v: 3 }],
  "Email": [{ v: 1 }, { v: 2 }, { v: 1 }, { v: 2 }, { v: 3 }],
};

interface InsightOverviewTabProps {
  timeframe: "7days" | "30days" | "1year";
}

export default function InsightOverviewTab({ timeframe: externalTimeframe }: InsightOverviewTabProps) {
  const [timeframe, setTimeframe] = useState<"7days" | "30days" | "1year">(externalTimeframe);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/analytics?timeframe=${timeframe}`);
        const data = await res.json();
        setAnalyticsData(data);
      } catch (err) {
        console.error("Failed to load GA4 data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [timeframe]);

  React.useEffect(() => {
    setTimeframe(externalTimeframe);
  }, [externalTimeframe]);

  // Dynamic Acquisition Channel Split
  const insightsDonutData = useMemo(() => {
    if (!analyticsData?.sources?.length) return [];
    const total = analyticsData.sources.reduce((acc: number, s: any) => acc + s.users, 0) || 1;
    return analyticsData.sources.slice(0, 6).map((s: any) => {
      const pct = ((s.users / total) * 100).toFixed(1) + "%";
      return {
        name: s.source || "(direct)",
        value: s.users,
        percentage: pct,
      };
    });
  }, [analyticsData]);

  // Total Acquisitions sum
  const totalAcquisitions = useMemo(() => {
    return insightsDonutData.reduce((acc: number, d: any) => acc + d.value, 0);
  }, [insightsDonutData]);

  // Dynamic Trend Data for Charts
  const trendData = useMemo(() => {
    if (!analyticsData?.trend?.length) return [];
    return analyticsData.trend.map((t: any) => ({
      day: t.date,
      Direct: t.sessions || t.activeUsers,
      Organic: Math.round((t.sessions || t.activeUsers) * 0.4),
      Pageviews: t.pageViews,
    }));
  }, [analyticsData]);

  // Best Channel calculation
  const bestChannel = useMemo(() => {
    if (analyticsData?.sources?.length) {
      const top = analyticsData.sources[0];
      return {
        name: top.source || "(direct)",
        users: top.users || 0,
      };
    }
    return { name: "(direct)", users: 0 };
  }, [analyticsData]);

  // Bounce Rate calculation
  const currentBounceRate = useMemo(() => {
    return `${((analyticsData?.overview?.bounceRate || 0) * 100).toFixed(1)}%`;
  }, [analyticsData]);

  const metrics = metricsByTimeframe[timeframe];

  return (
    <div className="space-y-6">


      {/* Per-channel sparkline cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {insightsDonutData.map((item: any, idx: number) => (
          <div
            key={idx}
            onClick={() => {
              let targetId = "";
          
              if (item.name === "Facebook") targetId = "facebook-details";
              else if (item.name === "YouTube") targetId = "youtube-details";
              else targetId = "channel-performance-trends";
              
              const element = document.getElementById(targetId);
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
            className="bg-[#fafafa] rounded-2xl border border-slate-100 p-4 flex flex-col gap-2 transition-all hover:border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <span
                  className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: INSIGHTS_COLORS[idx % INSIGHTS_COLORS.length] + "22", color: INSIGHTS_COLORS[idx % INSIGHTS_COLORS.length] }}
                >
                  {channelIcons[item.name] || <Globe className="w-4 h-4" />}
                </span>
                <span className="text-slate-700 truncate max-w-[80px]">{item.name}</span>
              </div>
            </div>
            <div>
              <p className="text-xl font-black text-slate-800">{item.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main row: Donut + Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut + Channel Legend */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <h2 className="text-sm font-bold text-slate-700 mb-4">Acquisition Channel Split</h2>
          <div className="flex flex-col items-center flex-1">
            <div className="relative w-[190px] h-[190px]">
              <PieChart width={190} height={190}>
                <Tooltip
                  formatter={(value: any, name: any) => [Number(value).toLocaleString(), name]}
                  contentStyle={{ borderRadius: 12, fontSize: 11, border: "1px solid #e2e8f0" }}
                />
                <Pie
                  data={insightsDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {insightsDonutData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={INSIGHTS_COLORS[index % INSIGHTS_COLORS.length]}
                      className="outline-none"
                    />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[9px] text-slate-400 font-semibold">Total</p>
                <p className="text-base font-black text-slate-800">{totalAcquisitions.toLocaleString()}</p>
              </div>
            </div>
            <div className="w-full space-y-2 mt-4">
              {insightsDonutData.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: INSIGHTS_COLORS[idx % INSIGHTS_COLORS.length] }} />
                    <span className="font-semibold text-slate-600">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">{item.value.toLocaleString()}</span>
                    <span className="font-black text-slate-700 w-10 text-right">{item.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Channel Trend Line Chart */}
        <div id="channel-performance-trends" className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-[#003B73] px-6 py-4">
            <h2 className="text-sm font-bold text-white">Site Traffic Performance Over Time</h2>
          </div>
          <div className="p-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, bottom: 5, left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11, border: "1px solid #e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 600 }} />
                <Line type="monotone" dataKey="Direct" stroke={INSIGHTS_COLORS[0]} strokeWidth={2.5} dot={false} name="Active Users / Sessions" />
                <Line type="monotone" dataKey="Organic" stroke={INSIGHTS_COLORS[1]} strokeWidth={2} dot={false} name="Organic Search" />
                <Line type="monotone" dataKey="Pageviews" stroke={INSIGHTS_COLORS[2]} strokeWidth={2} dot={false} name="Total Pageviews" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>



      {/* Bottom row: Best Channel + Bounce Rate expanded */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Channel Detail */}
        <div id="organic-search-details" className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-[#003B73] px-6 py-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-white" />
            <h2 className="text-sm font-bold text-white">Best Channel — {bestChannel.name}</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-black text-slate-800">{bestChannel.users.toLocaleString()}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">users this period</p>
              </div>
              <span className="text-emerald-500 font-black text-sm mb-1">Live GA4 Data</span>
            </div>
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 5, bottom: 5, left: -20, right: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)} />
                  <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                  <Bar dataKey="Direct" fill={INSIGHTS_COLORS[0]} radius={[4, 4, 0, 0]} name={bestChannel.name} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bounce Rate Detail */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-[#003B73] px-6 py-4 flex items-center gap-2">
            <ArrowDownRight className="w-4 h-4 text-white" />
            <h2 className="text-sm font-bold text-white">Bounce Rate Analysis</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-black text-slate-800">{currentBounceRate}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">current bounce rate</p>
              </div>
              <span className="text-emerald-500 font-black text-sm mb-1">Live GA4 Data</span>
            </div>
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, bottom: 5, left: -20, right: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)} />
                  <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                  <Line type="monotone" dataKey="Direct" stroke="#ef4444" strokeWidth={2} dot={false} name="Sessions" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Facebook & YouTube Analytics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Facebook Channel Graph */}
        <div id="facebook-details" className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-[#003B73] px-6 py-4 flex items-center gap-2">
            <img src="/images/icons/facebook.png" className="w-4 h-4 object-contain" alt="Facebook" />
            <h2 className="text-sm font-bold text-white">Facebook Performance Overview</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-black text-slate-800">3,960</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">sessions from Facebook</p>
              </div>
              <span className="text-emerald-500 font-black text-sm mb-1">
                {timeframe === "1year" ? "↑ 32.8%" : timeframe === "7days" ? "↑ 3.8%" : "↑ 14.5%"} vs prev period
              </span>
            </div>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 5, bottom: 5, left: -20, right: 0 }}>
                  <defs>
                    <linearGradient id="colorFacebook" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1877F2" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1877F2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                  <Area type="monotone" dataKey="Facebook" stroke="#1877F2" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFacebook)" name="Sessions" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              {[
                { label: "Post Reach", value: timeframe === "1year" ? "245k" : timeframe === "7days" ? "4.8k" : "18.5k" },
                { label: "Engagement", value: "8.4%" },
                { label: "Link Clicks", value: timeframe === "1year" ? "9.2k" : timeframe === "7days" ? "180" : "850" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-base font-black text-slate-800">{s.value}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* YouTube Channel Graph */}
        <div id="youtube-details" className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-[#003B73] px-6 py-4 flex items-center gap-2">
            <img src="/images/icons/youtube.png" className="w-4 h-4 object-contain" alt="YouTube" />
            <h2 className="text-sm font-bold text-white">YouTube Performance Overview</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-black text-slate-800">2,583</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">sessions from YouTube</p>
              </div>
              <span className="text-emerald-500 font-black text-sm mb-1">
                {timeframe === "1year" ? "↑ 20.4%" : timeframe === "7days" ? "↑ 2.4%" : "↑ 9.2%"} vs prev period
              </span>
            </div>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 5, bottom: 5, left: -20, right: 0 }}>
                  <defs>
                    <linearGradient id="colorYouTube" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF0000" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                  <Area type="monotone" dataKey="YouTube" stroke="#FF0000" strokeWidth={2.5} fillOpacity={1} fill="url(#colorYouTube)" name="Sessions" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              {[
                { label: "Video Views", value: timeframe === "1year" ? "82k" : timeframe === "7days" ? "1.6k" : "6.8k" },
                { label: "Watch Time", value: timeframe === "1year" ? "4.1k hrs" : timeframe === "7days" ? "80 hrs" : "340 hrs" },
                { label: "Subscribers", value: timeframe === "1year" ? "+1,240" : timeframe === "7days" ? "+28" : "+104" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-base font-black text-slate-800">{s.value}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
