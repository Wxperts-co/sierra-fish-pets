"use client";

import React, { useState } from "react";
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

const insightsDonutData = [
  { name: "Direct", value: 12430, percentage: "36.5%" },
  { name: "Organic Search", value: 9856, percentage: "28.9%" },
  { name: "Facebook", value: 3960, percentage: "11.6%" },
  { name: "YouTube", value: 2583, percentage: "7.6%" },
  { name: "Referral", value: 3456, percentage: "10.1%" },
  { name: "Email", value: 1789, percentage: "5.3%" },
];

const channelTrendData: Record<string, any[]> = {
  "7days": [
    { day: "Mon", Direct: 1800, Organic: 1400, Facebook: 540, YouTube: 360, Referral: 480, Email: 260 },
    { day: "Tue", Direct: 2100, Organic: 1600, Facebook: 630, YouTube: 420, Referral: 520, Email: 290 },
    { day: "Wed", Direct: 1950, Organic: 1500, Facebook: 590, YouTube: 390, Referral: 500, Email: 270 },
    { day: "Thu", Direct: 2400, Organic: 1800, Facebook: 720, YouTube: 480, Referral: 600, Email: 310 },
    { day: "Fri", Direct: 2200, Organic: 1700, Facebook: 660, YouTube: 440, Referral: 560, Email: 300 },
    { day: "Sat", Direct: 2600, Organic: 1900, Facebook: 780, YouTube: 520, Referral: 620, Email: 340 },
    { day: "Sun", Direct: 2900, Organic: 2100, Facebook: 840, YouTube: 560, Referral: 680, Email: 360 },
  ],
  "30days": [
    { day: "Wk 1", Direct: 8200, Organic: 6100, Facebook: 2460, YouTube: 1640, Referral: 2200, Email: 1100 },
    { day: "Wk 2", Direct: 9100, Organic: 6800, Facebook: 2760, YouTube: 1840, Referral: 2450, Email: 1250 },
    { day: "Wk 3", Direct: 8700, Organic: 6500, Facebook: 2580, YouTube: 1720, Referral: 2300, Email: 1150 },
    { day: "Wk 4", Direct: 10200, Organic: 7500, Facebook: 3060, YouTube: 2040, Referral: 2700, Email: 1400 },
  ],
  "1year": [
    { day: "Jul", Direct: 35000, Organic: 28000, Facebook: 10800, YouTube: 7200, Referral: 9500, Email: 5000 },
    { day: "Aug", Direct: 38000, Organic: 30000, Facebook: 11700, YouTube: 7800, Referral: 10200, Email: 5400 },
    { day: "Sep", Direct: 36500, Organic: 29000, Facebook: 11280, YouTube: 7520, Referral: 9800, Email: 5200 },
    { day: "Oct", Direct: 40000, Organic: 32000, Facebook: 12600, YouTube: 8400, Referral: 11000, Email: 5800 },
    { day: "Nov", Direct: 42000, Organic: 33500, Facebook: 13200, YouTube: 8800, Referral: 11500, Email: 6000 },
    { day: "Dec", Direct: 48000, Organic: 38000, Facebook: 15000, YouTube: 10000, Referral: 13000, Email: 6800 },
    { day: "Jan", Direct: 44000, Organic: 35000, Facebook: 13800, YouTube: 9200, Referral: 12000, Email: 6200 },
    { day: "Feb", Direct: 46000, Organic: 36500, Facebook: 14400, YouTube: 9600, Referral: 12500, Email: 6500 },
    { day: "Mar", Direct: 49000, Organic: 39000, Facebook: 15600, YouTube: 10400, Referral: 13500, Email: 7000 },
    { day: "Apr", Direct: 52000, Organic: 41000, Facebook: 16500, YouTube: 11000, Referral: 14500, Email: 7500 },
    { day: "May", Direct: 50000, Organic: 40000, Facebook: 15900, YouTube: 10600, Referral: 14000, Email: 7200 },
    { day: "Jun", Direct: 54000, Organic: 43000, Facebook: 17100, YouTube: 11400, Referral: 15000, Email: 7800 },
  ],
};

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

  React.useEffect(() => {
    setTimeframe(externalTimeframe);
  }, [externalTimeframe]);

  const metrics = metricsByTimeframe[timeframe];
  const trendData = channelTrendData[timeframe];

  return (
    <div className="space-y-6">


      {/* Per-channel sparkline cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {insightsDonutData.map((item, idx) => (
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
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3 cursor-pointer hover:shadow-md hover:border-slate-200/80 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <span
                  className="w-7 h-7 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: INSIGHTS_COLORS[idx] + "22", color: INSIGHTS_COLORS[idx] }}
                >
                  {channelIcons[item.name]}
                </span>
                <span className="text-slate-700 truncate max-w-[80px]">{item.name}</span>
              </div>
              {(() => {
                const growth = channelGrowthByTimeframe[timeframe]?.[item.name];
                if (!growth) return null;
                return (
                  <span
                    className="text-[10px] font-black px-2 py-0.5 rounded-full text-white shrink-0"
                    style={{ backgroundColor: growth.isPositive ? "#10b981" : "#ef4444" }}
                  >
                    {growth.value}
                  </span>
                );
              })()}
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
                  {insightsDonutData.map((entry, index) => {
                    const isClickable = entry.name === "Facebook" || entry.name === "YouTube";
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={INSIGHTS_COLORS[index % INSIGHTS_COLORS.length]}
                        onClick={() => {
                          if (!isClickable) return;
                          const targetId = entry.name === "Facebook" ? "facebook-details" : "youtube-details";
                          const element = document.getElementById(targetId);
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth", block: "center" });
                          }
                        }}
                        className={isClickable ? "cursor-pointer" : "outline-none"}
                      />
                    );
                  })}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[9px] text-slate-400 font-semibold">Total</p>
                <p className="text-base font-black text-slate-800">34,074</p>
              </div>
            </div>
            <div className="w-full space-y-2 mt-4">
              {insightsDonutData.map((item, idx) => {
                const isClickable = item.name === "Facebook" || item.name === "YouTube";
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!isClickable) return;
                      const targetId = item.name === "Facebook" ? "facebook-details" : "youtube-details";
                      const element = document.getElementById(targetId);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }}
                    className={`flex items-center justify-between text-xs transition-all ${
                      isClickable ? "cursor-pointer hover:bg-slate-50 rounded p-1 -mx-1" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: INSIGHTS_COLORS[idx] }} />
                      <span className="font-semibold text-slate-600">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium">{item.value.toLocaleString()}</span>
                      <span className="font-black text-slate-700 w-10 text-right">{item.percentage}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Channel Trend Line Chart */}
        <div id="channel-performance-trends" className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-[#003B73] px-6 py-4">
            <h2 className="text-sm font-bold text-white">Channel Performance Over Time</h2>
          </div>
          <div className="p-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, bottom: 5, left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11, border: "1px solid #e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 600 }} />
                <Line type="monotone" dataKey="Direct" stroke={INSIGHTS_COLORS[0]} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Organic" stroke={INSIGHTS_COLORS[1]} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Facebook" stroke={INSIGHTS_COLORS[2]} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="YouTube" stroke={INSIGHTS_COLORS[3]} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Referral" stroke={INSIGHTS_COLORS[4]} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Email" stroke={INSIGHTS_COLORS[5]} strokeWidth={2} dot={false} />
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
            <h2 className="text-sm font-bold text-white">Best Channel — Organic Search</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-black text-slate-800">9,856</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">sessions this period</p>
              </div>
              <span className="text-emerald-500 font-black text-sm mb-1">{metrics.bestChannelGrowth} vs prev period</span>
            </div>
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 5, bottom: 5, left: -20, right: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)} />
                  <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                  <Bar dataKey="Organic" fill={INSIGHTS_COLORS[1]} radius={[4, 4, 0, 0]} name="Organic Search" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              {[
                { label: "Avg. Position", value: "#3.2" },
                { label: "CTR", value: "4.8%" },
                { label: "Impressions", value: "205k" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-base font-black text-slate-800">{s.value}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{s.label}</p>
                </div>
              ))}
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
                <p className="text-3xl font-black text-slate-800">42.6%</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">current bounce rate</p>
              </div>
              <span className="text-red-500 font-black text-sm mb-1">{metrics.bounceRateChange} vs prev period</span>
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
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              {[
                { label: "Industry Avg", value: "52.1%" },
                { label: "Vs Industry", value: "−9.5%" },
                { label: "Main Exit", value: "Cart" },
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
