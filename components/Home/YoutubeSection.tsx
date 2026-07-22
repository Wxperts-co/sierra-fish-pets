"use client";

import React, { useState, useEffect } from "react";
import { Play, X, ArrowRight } from "lucide-react";
import { FaYoutube } from "react-icons/fa6";

interface VideoItem {
  id: string;
  title: string;
  description?: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  duration?: string;
  views?: string;
}

const FALLBACK_VIDEOS: VideoItem[] = [
  {
    id: "yvv6LBXX7-g",
    title: "How to Set Up a Freshwater Aquarium",
    publishedAt: "2026-07-18T21:27:05Z",
    thumbnail: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&h=340&fit=crop",
    url: "https://www.youtube.com/watch?v=yvv6LBXX7-g",
    duration: "8:45",
    views: "14.2K views"
  },
  {
    id: "m3OtulQxZws",
    title: "Dog Summer Care Tips & Hydration Guide",
    publishedAt: "2026-06-12T22:57:04Z",
    thumbnail: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=340&fit=crop",
    url: "https://www.youtube.com/watch?v=m3OtulQxZws",
    duration: "6:28",
    views: "9.8K views"
  },
  {
    id: "pW3AXboiPeA",
    title: "Pond Maintenance & Water Plant Care in Spring",
    publishedAt: "2026-06-04T21:38:21Z",
    thumbnail: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=600&h=340&fit=crop",
    url: "https://www.youtube.com/watch?v=pW3AXboiPeA",
    duration: "7:12",
    views: "7.1K views"
  },
  {
    id: "OxfU6RbQvg4",
    title: "Betta Fish Care Guide for Beginners",
    publishedAt: "2026-05-22T23:11:47Z",
    thumbnail: "https://images.unsplash.com/photo-1520301255226-bf5f144451c1?w=600&h=340&fit=crop",
    url: "https://www.youtube.com/watch?v=OxfU6RbQvg4",
    duration: "5:33",
    views: "12.6K views"
  }
];

export default function YoutubeSection() {
  const [videos, setVideos] = useState<VideoItem[]>(FALLBACK_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [channelUrl, setChannelUrl] = useState<string>("https://www.youtube.com/@sierrafishpetsrenton");

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/admin/youtube");
        const data = await res.json();
        if (data.success && data.recentVideos?.length > 0) {
          const apiVideos = data.recentVideos.slice(0, 4).map((v: any) => ({
            id: v.id,
            title: v.title,
            publishedAt: v.publishedAt,
            thumbnail: v.thumbnail,
            url: v.url,
            duration: v.duration || "0:00",
            views: v.views || "0 views"
          }));
          setVideos(apiVideos);
          if (data.customUrl) {
            setChannelUrl(`https://www.youtube.com/${data.customUrl}`);
          }
        }
      } catch (err) {
        console.error("Failed to load YouTube videos:", err);
      }
    }
    fetchVideos();
  }, []);

  const formatRelativeTime = (dateStr: string) => {
    try {
      const diffDays = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24));
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
      return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? "s" : ""} ago`;
    } catch {
      return "Recently";
    }
  };

  return (
    <section className="w-full bg-slate-50/60 py-8 lg:py-12 border-t border-slate-100">
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header with View All Videos button aligned at the end of the heading row */}
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 border-b border-slate-200/80 pb-5">
          <div className="space-y-1 text-center">
         
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-[#002244] font-lato">
              Latest Videos from Our <span className="text-[#005AA9]">YouTube</span>
            </h2>
          </div>

          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#005AA9] hover:bg-[#004583] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 active:scale-95 shrink-0 self-end sm:self-auto sm:absolute sm:right-0"
          >
            <FaYoutube className="w-4 h-4 text-white" />
            <span>View All Videos</span>
          </a>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-slate-300 cursor-pointer select-none"
            >
              {/* Thumbnail Container */}
              <div className="relative h-[190px] w-full overflow-hidden bg-slate-100">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Dark Hover Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-all duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                {video.duration && (
                  <span className="absolute bottom-3 right-3 bg-black/80 text-white text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {video.duration}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                <h3 className="text-sm font-bold text-[#002244] line-clamp-2 leading-snug group-hover:text-[#005AA9] transition-colors">
                  {video.title}
                </h3>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>{video.views}</span>
                  <span>{formatRelativeTime(video.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inline Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-white/10 flex flex-col">
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-white/10">
              <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1 pr-4">
                {selectedVideo.title}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                title={selectedVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
