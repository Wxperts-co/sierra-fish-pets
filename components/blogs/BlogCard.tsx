"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock } from "lucide-react";

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  thumbnailAlt: string;
  author: string;
  authorRole: string;
  authorImage: string;
  category: string;
  categorySlug: string;
  tags: string[];
  featured: boolean;
  isArrival: boolean;
  status: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  relatedIds: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  specialistQuote?: {
    quote: string;
    author: string;
  };
  galleryImages?: string[];
}

interface BlogCardProps {
  post: BlogItem;
}

export default function BlogCard({ post }: BlogCardProps) {
  // Get date pieces
  const dateObj = new Date(post.publishedAt);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase();

  // Combine category and tags for the category category line
  const categoryLine = [post.category, ...post.tags.slice(0, 2)].join(", ").toUpperCase();

  return (
    <article className="flex flex-col-reverse md:flex-row gap-6 bg-white border-b border-slate-200/80 p-4 last:border-b-0 last:pb-0">
      {/* Content Columns: Date box on left, details on right */}
      <div className="flex-1 flex gap-5">
        {/* Date Box: Border box with day over month */}
        <div className="flex flex-col items-center justify-center shrink-0 border border-slate-800 w-[55px] h-[65px] bg-white self-start mt-1 shadow-sm">
          <span className="text-xl font-bold text-slate-800 leading-none tracking-tight">{day}</span>
          <span className="w-8 border-t border-slate-300 my-1"></span>
          <span className="text-[9px] font-bold tracking-widest leading-none text-slate-600 uppercase">{month}</span>
        </div>

        {/* Text Details */}
        <div className="space-y-3 flex-1 min-w-0">
          {/* Category Line */}
          <span className="block text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            {categoryLine}
          </span>

          {/* Title */}
          <Link href={`/blogs/${post.slug}`} className="block group/title">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug group-hover/title:text-[#005AA9] transition-colors duration-200">
              {post.title}
            </h3>
          </Link>

          {/* Author/Read Meta */}
          <div className="text-xs text-slate-500 font-medium">
            By : <span className="font-bold text-slate-700">{post.author}</span> | {post.readingTime} min read
          </div>

          {/* Excerpt */}
          <p className="text-sm text-slate-500 leading-relaxed font-medium line-clamp-3 md:line-clamp-2">
            {post.excerpt}
          </p>

          {/* Continue Reading Button */}
          <div className="pt-2">
            <Link
              href={`/blogs/${post.slug}`}
              className="inline-block bg-black text-white text-[10px] font-bold tracking-widest px-6 py-3 hover:bg-[#005AA9] transition-all duration-300 rounded-none uppercase shadow-sm active:scale-95"
            >
              Continue Reading
            </Link>
          </div>
        </div>
      </div>

      {/* Cover Image on the right side */}
      <Link
        href={`/blogs/${post.slug}`}
        className="relative block shrink-0 w-full md:w-[350px] aspect-[1.6] overflow-hidden rounded-2xl bg-slate-100 group shadow-sm border border-slate-100"
      >
        <Image
          src={post.coverImage}
          alt={post.thumbnailAlt || post.title}
          fill
          sizes="(max-width: 768px) 100vw, 350px"
          className="object-cover transition-transform duration-500 group-hover:scale-105 animate-fade-in"
        />
      </Link>
    </article>
  );
}
