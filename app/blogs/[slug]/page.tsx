import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, User } from "lucide-react";
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

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const posts = blogsData as BlogItem[];
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Blog Post Not Found | Sierra Fish & Pets",
    };
  }

  const title = post.seo?.title || `${post.title} | Sierra Fish & Pets`;
  const description = post.seo?.description || post.excerpt;
  const keywords = post.seo?.keywords && post.seo.keywords.length > 0 ? post.seo.keywords : post.tags;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

const formatInlineMarkdown = (text: string) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const elements: React.ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      elements.push(text.substring(lastIdx, match.index));
    }
    const [_, linkText, url] = match;
    elements.push(
      <Link
        key={`link-${match.index}`}
        href={url}
        className="text-[#005AA9] hover:underline font-bold transition-colors"
      >
        {linkText}
      </Link>
    );
    lastIdx = linkRegex.lastIndex;
  }

  if (lastIdx < text.length) {
    elements.push(text.substring(lastIdx));
  }

  return elements.length > 0 ? elements : text;
};

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
              {formatInlineMarkdown(li.replace("- ", ""))}
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
            {formatInlineMarkdown(restText)}
          </p>
        );
      } else {
        renderedElements.push(
          <p key={idx} className="text-slate-600 leading-relaxed font-medium mb-5 text-sm md:text-base whitespace-pre-line">
            {formatInlineMarkdown(trimmed)}
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

  // Schema.org BlogPosting Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.seo?.description || post.excerpt,
    "image": post.coverImage ? [post.coverImage] : [],
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt || post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author,
      "jobTitle": post.authorRole || "Author"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sierra Fish & Pets",
      "url": "https://sierrafishandpets.com"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sierrafishandpets.com/blogs/${post.slug}`
    },
    "articleSection": post.category,
    "keywords": post.seo?.keywords && post.seo.keywords.length > 0 ? post.seo.keywords.join(", ") : post.tags.join(", "),
    "wordCount": post.content ? post.content.split(/\s+/).length : undefined,
    "timeRequired": post.readingTime ? `PT${post.readingTime}M` : undefined,
    ...(post.semanticKeynotes && post.semanticKeynotes.length > 0 && {
      "about": post.semanticKeynotes.map((kn) => ({
        "@type": "Thing",
        "name": kn.title,
        "description": kn.description
      }))
    }),
    ...(post.nerTags?.productOrService && post.nerTags.productOrService.length > 0 && {
      "mentions": post.nerTags.productOrService.map((item) => ({
        "@type": "Thing",
        "name": item
      }))
    })
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-24 text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogHero
        title="Blog Details"
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
            <div className="relative w-full aspect-[1.7] overflow-hidden rounded-2xl bg-slate-100 border border-slate-100 shadow-sm group">
              <Image
                src={post.coverImage}
                alt={post.thumbnailAlt || post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 750px"
              />
              {/* Overlay with Author & Read Time */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs md:text-sm font-bold z-10">
                <span className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 shadow-sm">
                  <User size={14} className="text-white/80 shrink-0" />
                  <span>By {post.author}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 shadow-sm shrink-0">
                  <Clock size={14} className="text-white/80 shrink-0" />
                  <span>{post.readingTime || 5} min read</span>
                </span>
              </div>
            </div>

            {/* Formatted body contents with Drop Caps and Specialist blockquotes */}
            <div className="prose max-w-none text-slate-600 font-medium leading-relaxed">
              {renderContent(post.content, post.specialistQuote)}
            </div>

            {/* Semantic Keynotes & NER Tags Accordion */}
            {((post.semanticKeynotes && post.semanticKeynotes.length > 0) || post.nerTags) && (
              <details className="group my-8 text-slate-800">
                <summary className="cursor-pointer font-bold text-base md:text-lg text-slate-900  rounded px-3 py-2 flex items-center justify-between select-none bg-white hover:bg-slate-50 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-black transition-transform duration-200 group-open:rotate-90">▶</span>
                    Semantic Keynotes & Named Entity Recognition (NER) Tags
                  </span>
                </summary>

                <div className="mt-6 space-y-6 text-sm md:text-base leading-relaxed px-1">
                  {/* Semantic Keynotes Section */}
                  {post.semanticKeynotes && post.semanticKeynotes.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                        Semantic Keynotes
                      </h3>
                      <ul className="space-y-3.5 pl-2">
                        {post.semanticKeynotes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                            <span className="text-slate-900 font-bold leading-none mt-1.5">•</span>
                            <div>
                              <strong className="font-bold text-slate-900">{item.title}:</strong>{" "}
                              <span>{item.description}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* NER Tags Section */}
                  {post.nerTags && (
                    <div className="space-y-3 pt-2">
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                        NER Tags
                      </h3>
                      <ul className="space-y-3.5 pl-2">
                        {post.nerTags.organization && post.nerTags.organization.length > 0 && (
                          <li className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                            <span className="text-slate-900 font-bold leading-none mt-1.5">•</span>
                            <div>
                              <strong className="font-bold text-slate-900">ORGANIZATION (ORG):</strong>{" "}
                              <span>{post.nerTags.organization.join(", ")}</span>
                            </div>
                          </li>
                        )}
                        {post.author && (
                          <li className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                            <span className="text-slate-900 font-bold leading-none mt-1.5">•</span>
                            <div>
                              <strong className="font-bold text-slate-900">PERSON (PER):</strong>{" "}
                              <span>{post.author} (Author)</span>
                            </div>
                          </li>
                        )}
                        {post.nerTags.productOrService && post.nerTags.productOrService.length > 0 && (
                          <li className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                            <span className="text-slate-900 font-bold leading-none mt-1.5">•</span>
                            <div>
                              <strong className="font-bold text-slate-900">PRODUCT / SERVICE (PRODUCT):</strong>{" "}
                              <span>{post.nerTags.productOrService.join(", ")}</span>
                            </div>
                          </li>
                        )}
                        {post.nerTags.conceptOrTheme && post.nerTags.conceptOrTheme.length > 0 && (
                          <li className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                            <span className="text-slate-900 font-bold leading-none mt-1.5">•</span>
                            <div>
                              <strong className="font-bold text-slate-900">CONCEPT / THEME (MISC):</strong>{" "}
                              <span>{post.nerTags.conceptOrTheme.join(", ")}</span>
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </details>
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
