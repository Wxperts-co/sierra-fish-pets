"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BlogItem } from "./BlogCard";

interface BlogSidebarProps {
  posts: BlogItem[];
  activeCategory?: string;
  activeTag?: string | null;
  activeArchive?: string | null;
  searchQuery?: string;
  onCategoryChange?: (category: string) => void;
  onTagChange?: (tag: string | null) => void;
  onArchiveChange?: (archive: string | null) => void;
  onSearchChange?: (query: string) => void;
  showSearchAndCategoriesOnly?: boolean;
  showRecentArchivesTagsOnly?: boolean;
}

const categories = [
  { id: "all", label: "All Articles" },
  { id: "dog", label: "Dogs" },
  { id: "cat", label: "Cats" },
  { id: "aquatic", label: "Aquatic" },
  { id: "reptile", label: "Reptiles" },
  { id: "bird", label: "Birds" },
  { id: "small-animal", label: "Small Animals" },
];

export default function BlogSidebar({
  posts,
  activeCategory = "all",
  activeTag = null,
  activeArchive = null,
  searchQuery = "",
  onCategoryChange,
  onTagChange,
  onArchiveChange,
  onSearchChange,
  showSearchAndCategoriesOnly = false,
  showRecentArchivesTagsOnly = false,
}: BlogSidebarProps) {
  const router = useRouter();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync local search input with prop updates
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(localSearch);
    } else {
      router.push(`/blogs?search=${encodeURIComponent(localSearch)}`);
    }
  };

  const handleCategoryClick = (catId: string) => {
    if (onCategoryChange) {
      onCategoryChange(catId);
    } else {
      if (catId === "all") {
        router.push("/blogs");
      } else {
        router.push(`/blogs/category/${catId}`);
      }
    }
  };

  const handleTagClick = (tag: string) => {
    if (onTagChange) {
      onTagChange(activeTag === tag ? null : tag);
    } else {
      router.push(`/blogs?tag=${encodeURIComponent(tag)}`);
    }
  };

  const handleArchiveClick = (archive: string) => {
    if (onArchiveChange) {
      onArchiveChange(activeArchive === archive ? null : archive);
    } else {
      router.push(`/blogs?archive=${encodeURIComponent(archive)}`);
    }
  };

  // Archive MonthYear generator helper
  const getPostMonthYear = (post: BlogItem) => {
    const date = new Date(post.publishedAt);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Extract all unique tags
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  // Group archives dynamically
  const archiveGroups = posts.reduce((acc, post) => {
    const monthYear = getPostMonthYear(post);
    acc[monthYear] = (acc[monthYear] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const archives = Object.entries(archiveGroups)
    .map(([monthYear, count]) => ({
      label: monthYear,
      count,
      date: new Date(monthYear),
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // Recent posts list (latest 3)
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  return (
    <aside className="space-y-8 shrink-0">
      {!showRecentArchivesTagsOnly && (
        <>
          {/* Search Widget */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
          Search
        </h3>
        <form onSubmit={handleSearchSubmit} className="relative flex overflow-hidden rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-[#005AA9] focus-within:border-transparent transition-all">
          <input
            type="text"
            placeholder="Search..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-4 pr-12 py-3 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none text-sm font-medium"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 bottom-0 bg-black hover:bg-[#005AA9] text-white px-4 transition-colors duration-200 flex items-center justify-center cursor-pointer"
          >
            <Search size={16} />
          </button>
        </form>
      </div>

      {/* Categories Widget */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
          Categories
        </h3>
        <div className="space-y-1">
          {categories.map((cat) => {
            const count = cat.id === "all" ? posts.length : posts.filter((p) => p.categorySlug === cat.id).length;
            const isActive = activeCategory === cat.id && !activeTag && !activeArchive;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center justify-between w-full py-2.5 text-[11px] font-extrabold uppercase tracking-wider transition-colors duration-200 text-left border-b border-dashed border-slate-100 last:border-b-0 cursor-pointer group ${
                  isActive ? "text-[#005AA9]" : "text-slate-600 hover:text-[#005AA9]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`transition-transform duration-200 group-hover:translate-x-1 ${isActive ? "text-[#005AA9] scale-110" : "text-slate-400"}`}>
                    &gt;
                  </span>
                  {cat.label}
                </span>
                <span className={isActive ? "text-[#005AA9]" : "text-slate-400"}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  )}

      {!showSearchAndCategoriesOnly && (
        <>
          {/* Recent Posts Widget */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
          Recent Posts
        </h3>
        <div className="space-y-4">
          {recentPosts.map((rp) => {
            const rpDate = new Date(rp.publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }).toUpperCase();

            return (
              <Link
                key={rp.id}
                href={`/blogs/${rp.slug}`}
                className="flex gap-4 items-center group py-1 border-b border-dashed border-slate-100 last:border-b-0 last:pb-0 cursor-pointer"
              >
                <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
                  <Image
                    src={rp.coverImage}
                    alt={rp.title}
                    fill
                    sizes="56px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[9px] font-bold text-slate-400 tracking-widest uppercase mb-1">
                    {rpDate}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-[#005AA9] transition-colors duration-150">
                    {rp.title}
                  </h4>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Archives Widget */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
          Archives
        </h3>
        <div className="space-y-1">
          {archives.map((archive) => {
            const isActive = activeArchive === archive.label;

            return (
              <button
                key={archive.label}
                onClick={() => handleArchiveClick(archive.label)}
                className={`flex items-center justify-between w-full py-2.5 text-[11px] font-extrabold uppercase tracking-wider transition-colors duration-200 text-left border-b border-dashed border-slate-100 last:border-b-0 cursor-pointer group ${
                  isActive ? "text-[#005AA9]" : "text-slate-600 hover:text-[#005AA9]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`transition-transform duration-200 group-hover:translate-x-1 ${isActive ? "text-[#005AA9] scale-110" : "text-slate-400"}`}>
                    &gt;
                  </span>
                  {archive.label}
                </span>
                <span className={isActive ? "text-[#005AA9]" : "text-slate-400"}>
                  ({archive.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags Widget */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
          Tags
        </h3>
        <div className="flex flex-wrap gap-2 pt-1">
          {allTags.map((tag) => {
            const isActive = activeTag === tag;

            return (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1.5 text-[10px] font-extrabold tracking-wider uppercase rounded-xl border transition-all duration-200 cursor-pointer active:scale-95 ${
                  isActive
                    ? "bg-[#005AA9] border-[#005AA9] text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </>
  )}
    </aside>
  );
}
