"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { MessageSquare, ThumbsUp, Play, Eye, MousePointerClick, Clock, Bell, Flame, MessageCircle, RefreshCw, BarChart2 } from "lucide-react";
import CustomTooltip from "./CustomTooltip";

interface SocialMediaTabProps {
  timeframe: "7days" | "30days" | "1year";
}

export default function SocialMediaTab({ timeframe }: SocialMediaTabProps) {
  // ────────────────────────────────────────────────────────
  // 1. DATA DEFINITIONS
  // ────────────────────────────────────────────────────────

  // Facebook
  const facebookData = useMemo(() => {
    if (timeframe === "7days") {
      return [
        { name: "Mon", Followers: 1210, Engagement: 160 },
        { name: "Tue", Followers: 1230, Engagement: 162 },
        { name: "Wed", Followers: 1250, Engagement: 165 },
        { name: "Thu", Followers: 1270, Engagement: 170 },
        { name: "Fri", Followers: 1290, Engagement: 172 },
        { name: "Sat", Followers: 1300, Engagement: 175 },
        { name: "Sun", Followers: 1310, Engagement: 178 }
      ];
    } else if (timeframe === "1year") {
      return [
        { name: "Jul", Followers: 900, Engagement: 110 },
        { name: "Aug", Followers: 950, Engagement: 120 },
        { name: "Sep", Followers: 1000, Engagement: 125 },
        { name: "Oct", Followers: 1050, Engagement: 130 },
        { name: "Nov", Followers: 1100, Engagement: 135 },
        { name: "Dec", Followers: 1150, Engagement: 140 },
        { name: "Jan", Followers: 1200, Engagement: 145 },
        { name: "Feb", Followers: 1230, Engagement: 150 },
        { name: "Mar", Followers: 1250, Engagement: 155 },
        { name: "Apr", Followers: 1270, Engagement: 160 },
        { name: "May", Followers: 1290, Engagement: 170 },
        { name: "Jun", Followers: 1310, Engagement: 178 }
      ];
    } else {
      return [
        { name: "W1", Followers: 950, Engagement: 150 },
        { name: "W2", Followers: 1100, Engagement: 160 },
        { name: "W3", Followers: 1250, Engagement: 170 },
        { name: "W4", Followers: 1310, Engagement: 178 }
      ];
    }
  }, [timeframe]);

  // Instagram
  const instagramData = useMemo(() => {
    if (timeframe === "7days") {
      return [
        { name: "Mon", Followers: 2760, Engagement: 295 },
        { name: "Tue", Followers: 2780, Engagement: 298 },
        { name: "Wed", Followers: 2795, Engagement: 302 },
        { name: "Thu", Followers: 2810, Engagement: 308 },
        { name: "Fri", Followers: 2830, Engagement: 312 },
        { name: "Sat", Followers: 2842, Engagement: 315 },
        { name: "Sun", Followers: 2850, Engagement: 320 }
      ];
    } else if (timeframe === "1year") {
      return [
        { name: "Jul", Followers: 1800, Engagement: 210 },
        { name: "Aug", Followers: 1920, Engagement: 220 },
        { name: "Sep", Followers: 2050, Engagement: 230 },
        { name: "Oct", Followers: 2180, Engagement: 240 },
        { name: "Nov", Followers: 2300, Engagement: 250 },
        { name: "Dec", Followers: 2420, Engagement: 265 },
        { name: "Jan", Followers: 2530, Engagement: 275 },
        { name: "Feb", Followers: 2610, Engagement: 280 },
        { name: "Mar", Followers: 2690, Engagement: 290 },
        { name: "Apr", Followers: 2750, Engagement: 300 },
        { name: "May", Followers: 2810, Engagement: 310 },
        { name: "Jun", Followers: 2850, Engagement: 320 }
      ];
    } else {
      return [
        { name: "W1", Followers: 1950, Engagement: 220 },
        { name: "W2", Followers: 2200, Engagement: 250 },
        { name: "W3", Followers: 2550, Engagement: 280 },
        { name: "W4", Followers: 2850, Engagement: 320 }
      ];
    }
  }, [timeframe]);

  // YouTube
  const youtubeData = useMemo(() => {
    if (timeframe === "7days") {
      return [
        { name: "Mon", Views: 350, "New Subs": 25 },
        { name: "Tue", Views: 410, "New Subs": 28 },
        { name: "Wed", Views: 480, "New Subs": 32 },
        { name: "Thu", Views: 550, "New Subs": 36 },
        { name: "Fri", Views: 620, "New Subs": 41 },
        { name: "Sat", Views: 740, "New Subs": 48 },
        { name: "Sun", Views: 850, "New Subs": 54 }
      ];
    } else if (timeframe === "1year") {
      return [
        { name: "Jul", Views: 150, "New Subs": 10 },
        { name: "Aug", Views: 210, "New Subs": 15 },
        { name: "Sep", Views: 280, "New Subs": 20 },
        { name: "Oct", Views: 340, "New Subs": 25 },
        { name: "Nov", Views: 410, "New Subs": 30 },
        { name: "Dec", Views: 490, "New Subs": 36 },
        { name: "Jan", Views: 560, "New Subs": 42 },
        { name: "Feb", Views: 630, "New Subs": 48 },
        { name: "Mar", Views: 710, "New Subs": 55 },
        { name: "Apr", Views: 770, "New Subs": 62 },
        { name: "May", Views: 810, "New Subs": 68 },
        { name: "Jun", Views: 850, "New Subs": 74 }
      ];
    } else {
      return [
        { name: "Week 1", Views: 250, "New Subs": 50 },
        { name: "Week 2", Views: 450, "New Subs": 65 },
        { name: "Week 3", Views: 650, "New Subs": 80 },
        { name: "Week 4", Views: 850, "New Subs": 95 }
      ];
    }
  }, [timeframe]);

 
  // Scale utility
  const scale = useMemo(() => {
    return timeframe === "1year" ? 12 : timeframe === "7days" ? 0.25 : 1;
  }, [timeframe]);

  // Facebook post performance
  const fbPerformance = useMemo(() => {
    return [
      { type: "Photo", icon: ThumbsUp, likes: Math.round(78 * scale), comments: Math.round(92 * scale), score: Math.round(560 * scale), subLabel1: "Comments", subLabel2: "Likes" },
      { type: "Video", icon: Play, likes: Math.round(245 * scale), comments: Math.round(188 * scale), score: Math.round(1120 * scale), subLabel1: "Views", subLabel2: "Likes" },
      { type: "Link", icon: MousePointerClick, likes: Math.round(31 * scale), comments: Math.round(42 * scale), score: Math.round(240 * scale), subLabel1: "Clicks", subLabel2: "Likes" },
      { type: "Story", icon: Eye, likes: Math.round(112 * scale), comments: Math.round(140 * scale), score: Math.round(790 * scale), subLabel1: "Views", subLabel2: "Likes" }
    ];
  }, [scale]);

  // Instagram performance
  const igPerformance = useMemo(() => {
    return [
      { type: "Reel", icon: Play, likes: Math.round(412 * scale), comments: Math.round(320 * scale), score: Math.round(1840 * scale), subLabel1: "Comments", subLabel2: "Likes" },
      { type: "Story", icon: Eye, likes: Math.round(195 * scale), comments: Math.round(140 * scale), score: Math.round(960 * scale), subLabel1: "Views", subLabel2: "Likes" },
      { type: "Post", icon: ThumbsUp, likes: Math.round(98 * scale), comments: Math.round(112 * scale), score: Math.round(670 * scale), subLabel1: "Comments", subLabel2: "Likes" },
      { type: "IGTV/Video", icon: Play, likes: Math.round(64 * scale), comments: Math.round(78 * scale), score: Math.round(320 * scale), subLabel1: "Views", subLabel2: "Likes" }
    ];
  }, [scale]);

  // Twitter performance
  const twPerformance = useMemo(() => {
    return [
      { type: "Text Tweet", icon: MessageCircle, likes: Math.round(56 * scale), comments: Math.round(34 * scale), score: Math.round(420 * scale), subLabel1: "Replies", subLabel2: "Likes" },
      { type: "Media Tweet", icon: Eye, likes: Math.round(182 * scale), comments: Math.round(240 * scale), score: Math.round(980 * scale), subLabel1: "Views", subLabel2: "Likes" },
      { type: "Link Tweet", icon: MousePointerClick, likes: Math.round(48 * scale), comments: Math.round(72 * scale), score: Math.round(310 * scale), subLabel1: "Clicks", subLabel2: "Likes" },
      { type: "Poll", icon: BarChart2, likes: Math.round(89 * scale), comments: Math.round(190 * scale), score: Math.round(540 * scale), subLabel1: "Votes", subLabel2: "Likes" }
    ];
  }, [scale]);

  // YouTube numbers
  const youtubeMetrics = useMemo(() => {
    if (timeframe === "7days") {
      return { views: "5,840", watchTime: "24.5K", subscribers: "120" };
    } else if (timeframe === "1year") {
      return { views: "312,000", watchTime: "1.2M", subscribers: "6,400" };
    } else {
      return { views: "25,200", watchTime: "108K", subscribers: "540" };
    }
  }, [timeframe]);

  return (
    <div className="space-y-6">
      
      {/* ── 1. FACEBOOK ── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="bg-[#003B73] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#1877F2]">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-black text-white tracking-widest">Facebook Page Analytics</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/10">
                @SierraFishPets
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-white">1,310</span>
            <span className="text-[10px] text-blue-100/70 font-semibold block uppercase">followers</span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={facebookData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs font-semibold text-slate-500">{value}</span>} />
                  <Line type="monotone" dataKey="Followers" stroke="#3b82f6" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Engagement" stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
            <h4 className="text-[11px] text-slate-400 font-extrabold tracking-widest uppercase mb-2">
              Post Performance
            </h4>
            <div className="space-y-4">
              {fbPerformance.map((post, idx) => {
                const Icon = post.icon;
                return (
                  <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex-1">
                      <span className="font-bold text-slate-800 block text-xs">{post.type}</span>
                      <div className="flex items-center gap-3 text-slate-400 text-[11px] font-medium mt-1">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-slate-300" />
                          {post.comments} {post.subLabel1}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 text-slate-300" />
                          {post.likes} {post.subLabel2}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100 font-extrabold shrink-0">
                      <Flame className="w-3.5 h-3.5 fill-orange-500" />
                      <span>{post.score}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. INSTAGRAM ── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="bg-[#003B73] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#E1306C]">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-black text-white tracking-widest">Instagram Page Analytics</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/10">
                @SierraFishPets
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-white">2,850</span>
            <span className="text-[10px] text-blue-100/70 font-semibold block uppercase">followers</span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={instagramData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs font-semibold text-slate-500">{value}</span>} />
                  <Line type="monotone" dataKey="Followers" stroke="#e1306c" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Engagement" stroke="#fccc63" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
            <h4 className="text-[11px] text-slate-400 font-extrabold tracking-widest uppercase mb-2">
              Media Performance
            </h4>
            <div className="space-y-4">
              {igPerformance.map((post, idx) => {
                const Icon = post.icon;
                return (
                  <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex-1">
                      <span className="font-bold text-slate-800 block text-xs">{post.type}</span>
                      <div className="flex items-center gap-3 text-slate-400 text-[11px] font-medium mt-1">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-slate-300" />
                          {post.comments} {post.subLabel1}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 text-slate-300" />
                          {post.likes} {post.subLabel2}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-pink-500 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100 font-extrabold shrink-0">
                      <Flame className="w-3.5 h-3.5 fill-pink-500" />
                      <span>{post.score}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. YOUTUBE ── */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="bg-[#003B73] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#FF0000]">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.51A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108c1.863.51 9.388.51 9.388.51s7.524 0 9.388-.51a3.003 3.003 0 0 0 2.11-2.108c.502-1.907.502-5.837.502-5.837s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-black text-white tracking-widest">YouTube Channel Analytics</span>
              <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/10">
                Sierra Fish & Pets
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-white">410</span>
            <span className="text-[10px] text-blue-100/70 font-semibold block uppercase">subscribers</span>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={youtubeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight={600} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-xs font-semibold text-slate-500">{value}</span>} />
                <Line type="monotone" dataKey="Views" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: "#ef4444" }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="New Subs" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-100 pt-6">
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
              <div className="p-2.5 rounded-full bg-rose-50 text-rose-600 mb-2.5">
                <Play className="w-5 h-5 fill-rose-600" />
              </div>
              <span className="text-xl font-black text-slate-800">{youtubeMetrics.views}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Total Views</span>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
              <div className="p-2.5 rounded-full bg-amber-50 text-amber-600 mb-2.5">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-slate-800">{youtubeMetrics.watchTime}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Watch Time (Hrs)</span>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
              <div className="p-2.5 rounded-full bg-blue-50 text-blue-600 mb-2.5">
                <Bell className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-slate-800">{youtubeMetrics.subscribers}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">New Subscribers</span>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
