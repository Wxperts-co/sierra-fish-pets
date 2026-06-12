"use client";

import React, { useState, useEffect } from "react";
import blogsData from "@/data/blogs.json";
import BlogHero from "./BlogHero";
import BlogGrid from "./BlogGrid";
import { BlogItem } from "./BlogCard";

interface BlogsContainerProps {
  initialCategory?: string;
}

const mapCategoryParam = (param: string): string => {
  const normalized = param.toLowerCase();
  if (normalized === "reptiles" || normalized === "reptile") {
    return "reptile";
  }
  if (normalized === "small-animals" || normalized === "small-animal" || normalized === "small-pets" || normalized === "small-pet") {
    return "small-animal";
  }
  if (normalized === "dog" || normalized === "dogs") {
    return "dog";
  }
  if (normalized === "cat" || normalized === "cats") {
    return "cat";
  }
  if (normalized === "bird" || normalized === "birds") {
    return "bird";
  }
  if (normalized === "aquatic" || normalized === "aquatics" || normalized === "fish" || normalized === "fishes") {
    return "aquatic";
  }
  return "all";
};

export default function BlogsContainer({ initialCategory }: BlogsContainerProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Sync state with dynamic route initial prop
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(mapCategoryParam(initialCategory));
    } else {
      setActiveCategory("all");
    }
  }, [initialCategory]);

  const posts = blogsData as BlogItem[];

  // Map active category to label string for breadcrumbs
  const getCategoryLabel = (catId: string) => {
    switch (catId) {
      case "dog": return "Dogs";
      case "cat": return "Cats";
      case "bird": return "Birds";
      case "aquatic": return "Aquatic";
      case "small-animal": return "Small Animals";
      case "reptile": return "Reptiles";
      default: return "All Articles";
    }
  };

  const currentCategoryLabel = getCategoryLabel(activeCategory);

  return (
    <main className="relative text-slate-800 min-h-screen overflow-x-hidden bg-slate-50">
      {/* Hero Header Section */}
      <BlogHero
        title={activeCategory === "all" ? "Sierra Pet Blog & News" : `${currentCategoryLabel} Blog & Guides`}
        subtitle="Expert pet care advice, health guides, news, and new arrivals directly from our Renton pet experts."
        image="/images/banner/shophero3.png"
        breadcrumbs={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Blog",
            href: activeCategory !== "all" ? "/blogs" : undefined,
          },
          ...(activeCategory !== "all"
            ? [
                {
                  label: currentCategoryLabel,
                },
              ]
            : []),
        ]}
      />

      {/* Articles list with sidebar filter widgets */}
      <BlogGrid
        posts={posts}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
    </main>
  );
}
