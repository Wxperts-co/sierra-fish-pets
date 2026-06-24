import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import blogsData from "@/data/blogs.json";
import { BlogItem } from "@/components/blogs/BlogCard";
import BlogSidebar from "@/components/blogs/BlogSidebar";
import BlogComments from "@/components/blogs/BlogComments";

import BlogHero from "@/components/blogs/BlogHero";

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

const renderContent = (content: string, specialistQuote?: { quote: string; author: string }) => {
  let isFirstParagraph = true;
  let paragraphCount = 0;
  
  const blocks = content.split("\n\n");
  const renderedElements = [];
  
  for (let idx = 0; idx < blocks.length; idx++) {
    const trimmed = blocks[idx].trim();
    if (!trimmed) continue;
    
    if (trimmed.startsWith("# ")) {
      renderedElements.push(
        <h2 key={idx} className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-8 mb-4 border-b border-slate-100 pb-3 leading-tight tracking-tight">
          {trimmed.replace("# ", "")}
        </h2>
      );
    } else if (trimmed.startsWith("## ")) {
      renderedElements.push(
        <h3 key={idx} className="text-xl md:text-2xl font-bold text-slate-900 mt-6 mb-3 tracking-tight">
          {trimmed.replace("## ", "")}
        </h3>
      );
    } else if (trimmed.startsWith("### ")) {
      renderedElements.push(
        <h4 key={idx} className="text-lg md:text-xl font-bold text-slate-900 mt-5 mb-2">
          {trimmed.replace("### ", "")}
        </h4>
      );
    } else if (trimmed.startsWith("- ")) {
      renderedElements.push(
        <ul key={idx} className="list-disc pl-6 space-y-2.5 my-5 text-slate-650">
          {trimmed.split("\n").map((li, lIdx) => (
            <li key={lIdx} className="font-medium text-sm md:text-base leading-relaxed">
              {li.replace("- ", "")}
            </li>
          ))}
        </ul>
      );
    } else {
      // Regular paragraph
      paragraphCount++;
      
      if (isFirstParagraph) {
        isFirstParagraph = false;
        const firstLetter = trimmed.charAt(0);
        const restText = trimmed.slice(1);
        
        renderedElements.push(
          <p key={idx} className="text-slate-600 leading-relaxed font-medium mb-5 text-sm md:text-base whitespace-pre-line">
            <span className="float-left text-4xl md:text-5xl font-black text-slate-900 border border-slate-800 w-12 h-12 flex items-center justify-center mr-3.5 mt-1 bg-white select-none">
              {firstLetter}
            </span>
            {restText}
          </p>
        );
      } else {
        renderedElements.push(
          <p key={idx} className="text-slate-600 leading-relaxed font-medium mb-5 text-sm md:text-base whitespace-pre-line">
            {trimmed}
          </p>
        );
      }
      
      // Inject Blockquote after paragraph 2 if specialistQuote exists
      if (paragraphCount === 2 && specialistQuote) {
        renderedElements.push(
          <blockquote key={`quote-${idx}`} className="my-8 pl-6 border-l-2 border-slate-900 italic text-slate-800 text-base md:text-lg relative py-2 space-y-2">
            <span className="absolute -left-3 -top-3 text-5xl text-slate-200 font-serif leading-none select-none">“</span>
            <p className="leading-relaxed font-medium">"{specialistQuote.quote}"</p>
            <cite className="block text-xs font-bold tracking-widest text-slate-400 not-italic uppercase mt-2">
              — {specialistQuote.author}
            </cite>
          </blockquote>
        );
      }
    }
  }
  
  return renderedElements;
};

export default async function BlogPostDetailPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const posts = blogsData as BlogItem[];
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Find adjacent posts for navigation
  const currentIndex = posts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  // Format category name for tag layout
  const categoryHeader = [post.category, ...post.tags.slice(0, 2)].join(", ").toUpperCase();

  return (
    <main className="min-h-screen bg-slate-50 pb-24 text-slate-800">
      <BlogHero
        title={post.title}
        subtitle={`Expert pet care advice | By: ${post.author} | ${post.readingTime} min read`}
        image="/images/banner/shophero3.png"
        breadcrumbs={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Blog",
            href: "/blogs",
          },
          {
            label: post.title,
          },
        ]}
      />
      <div className="container mx-auto px-4 max-w-6xl py-12">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#005AA9] hover:border-[#005AA9] transition-all shadow-sm"
          >
            <ArrowLeft size={14} />
            Back to Articles
          </Link>
        </div>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <BlogSidebar posts={posts} />
          </div>

          {/* Detailed Content */}
          <article className="lg:col-span-8 min-w-0 space-y-6">
            {/* Cover Image */}
            <div className="relative w-full aspect-[1.7] overflow-hidden rounded-2xl bg-slate-100 border border-slate-100 shadow-sm">
              <Image
                src={post.coverImage}
                alt={post.thumbnailAlt || post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 750px"
              />
            </div>

            {/* Formatted body contents with Drop Caps and Specialist blockquotes */}
            <div className="prose max-w-none text-slate-600 font-medium leading-relaxed">
              {renderContent(post.content, post.specialistQuote)}
            </div>

            {/* Side-by-Side Content Image Gallery */}
            {post.galleryImages && post.galleryImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4 my-8 pt-2">
                {post.galleryImages.map((imgSrc, idx) => (
                  <div key={idx} className="relative aspect-[1.3] overflow-hidden rounded-xl bg-slate-100 border border-slate-100 shadow-sm group">
                    <Image
                      src={imgSrc}
                      alt="Article Gallery Image"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 370px"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Footer Tags & Mockup Share links */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-extrabold text-slate-400">
                <span className="uppercase tracking-widest">Tags:</span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blogs?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1.5 border border-slate-200 text-slate-500 rounded hover:bg-slate-100 transition-colors uppercase font-extrabold"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              
            </div>

          

            {/* Interactive/Mockup Comments Thread */}
            {/* <BlogComments postCategory={post.categorySlug} /> */}

          </article>
        </div>
      </div>
    </main>
  );
}

// Generate static routes for all posts in blogs.json
export async function generateStaticParams() {
  const posts = blogsData as BlogItem[];
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
