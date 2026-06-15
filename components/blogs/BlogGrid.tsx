"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BlogCard, { BlogItem } from "./BlogCard";
import BlogSidebar from "./BlogSidebar";

interface BlogGridProps {
  posts: BlogItem[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const ITEMS_PER_PAGE = 5;

const categories = [
  { id: "all", label: "All Articles" },
  { id: "dog", label: "Dogs" },
  { id: "cat", label: "Cats" },
  { id: "aquatic", label: "Aquatic" },
  { id: "reptile", label: "Reptiles" },
  { id: "bird", label: "Birds" },
  { id: "small-animal", label: "Small Animals" },
];

export default function BlogGrid({ posts, activeCategory, onCategoryChange }: BlogGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeArchive, setActiveArchive] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Load initial filters from URL parameters on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tag = params.get("tag");
      const archive = params.get("archive");
      const search = params.get("search");

      if (tag) setActiveTag(tag);
      if (archive) setActiveArchive(archive);
      if (search) setSearchQuery(search);
    }
  }, []);

  // Reset page when any filter updates
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, activeTag, activeArchive]);

  // Archive MonthYear generator helper
  const getPostMonthYear = (post: BlogItem) => {
    const date = new Date(post.publishedAt);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // 1. Filter by category (from prop)
  let filtered = activeCategory === "all"
    ? posts
    : posts.filter((post) => post.categorySlug === activeCategory);

  // 2. Filter by local active tag
  if (activeTag) {
    filtered = filtered.filter((post) => post.tags.includes(activeTag));
  }

  // 3. Filter by local active archive
  if (activeArchive) {
    filtered = filtered.filter((post) => getPostMonthYear(post) === activeArchive);
  }

  // 4. Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedPosts = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="pb-24 pt-10 bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* SIDEBAR (Left on desktop: spans 4 columns) */}
          <div className="lg:col-span-4">
            {/* Desktop View: Show all widgets */}
            <div className="hidden lg:block">
              <BlogSidebar
                posts={posts}
                activeCategory={activeCategory}
                activeTag={activeTag}
                activeArchive={activeArchive}
                searchQuery={searchQuery}
                onCategoryChange={onCategoryChange}
                onTagChange={setActiveTag}
                onArchiveChange={setActiveArchive}
                onSearchChange={setSearchQuery}
              />
            </div>
            {/* Mobile View: Show only Search and Categories at the top */}
            <div className="block lg:hidden">
              <BlogSidebar
                posts={posts}
                activeCategory={activeCategory}
                activeTag={activeTag}
                activeArchive={activeArchive}
                searchQuery={searchQuery}
                onCategoryChange={onCategoryChange}
                onTagChange={setActiveTag}
                onArchiveChange={setActiveArchive}
                onSearchChange={setSearchQuery}
                showSearchAndCategoriesOnly={true}
              />
            </div>
          </div>

          {/* LIST SECTION (Right on desktop: spans 8 columns) */}
          <main className="lg:col-span-8">
            
            {/* Active Filters Summary Header */}
            {(activeTag || activeArchive || activeCategory !== "all" || searchQuery) && (
              <div className="mb-8 flex flex-wrap items-center gap-2 bg-blue-50/50 border border-blue-100/60 rounded-2xl p-4 text-xs text-[#005AA9] font-bold shadow-inner">
                <span className="text-slate-500 uppercase tracking-wider">Active Filters:</span>
                {activeCategory !== "all" && (
                  <span className="bg-white border border-blue-200 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-sm">
                    Category: {categories.find((c) => c.id === activeCategory)?.label || activeCategory}
                    <button onClick={() => onCategoryChange("all")} className="hover:text-red-500 font-bold ml-1 cursor-pointer">×</button>
                  </span>
                )}
                {activeTag && (
                  <span className="bg-white border border-blue-200 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-sm">
                    Tag: #{activeTag}
                    <button onClick={() => setActiveTag(null)} className="hover:text-red-500 font-bold ml-1 cursor-pointer">×</button>
                  </span>
                )}
                {activeArchive && (
                  <span className="bg-white border border-blue-200 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-sm">
                    Archive: {activeArchive}
                    <button onClick={() => setActiveArchive(null)} className="hover:text-red-500 font-bold ml-1 cursor-pointer">×</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="bg-white border border-blue-200 px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-sm">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="hover:text-red-500 font-bold ml-1 cursor-pointer">×</button>
                  </span>
                )}
                <button
                  onClick={() => {
                    onCategoryChange("all");
                    setActiveTag(null);
                    setActiveArchive(null);
                    setSearchQuery("");
                  }}
                  className="ml-auto text-xs text-[#005AA9] hover:text-[#002244] font-extrabold uppercase tracking-widest cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Results Info */}
            <div className="mb-8 flex items-center justify-between border-b border-slate-200/80 pb-4">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#005AA9]" />
                Latest Articles
              </h2>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                {filtered.length} {filtered.length === 1 ? "Article" : "Articles"} Found
              </span>
            </div>

            {/* Posts Horizontal List */}
            {paginatedPosts.length > 0 ? (
              <div className="space-y-12">
                {paginatedPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-16 pt-8 border-t border-slate-200/50 flex items-center justify-center gap-2">
                    {/* Prev Button */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-[#005AA9] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Page Indexes */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      const isActive = page === currentPage;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer active:scale-95 ${
                            isActive
                              ? "bg-[#005AA9] text-white"
                              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#005AA9]"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-[#005AA9] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-95"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-16 text-center max-w-md mx-auto shadow-sm">
                <h3 className="text-xl font-bold text-slate-800">No Articles Found</h3>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed font-medium">
                  We couldn't find any articles matching your search criteria or filters. Try adjusting your query or resetting filters.
                </p>
              </div>
            )}

          </main>

          {/* Mobile View Bottom Sidebar: Show only Recent Posts, Archives, and Tags at the bottom */}
          <div className="block lg:hidden lg:col-span-4">
            <BlogSidebar
              posts={posts}
              activeCategory={activeCategory}
              activeTag={activeTag}
              activeArchive={activeArchive}
              searchQuery={searchQuery}
              onCategoryChange={onCategoryChange}
              onTagChange={setActiveTag}
              onArchiveChange={setActiveArchive}
              onSearchChange={setSearchQuery}
              showRecentArchivesTagsOnly={true}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
