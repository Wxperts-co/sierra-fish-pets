import type { Metadata } from "next";
import BlogsContainer from "@/components/blogs/BlogsContainer";
import blogsData from "@/data/blogs.json";
import { BlogItem } from "@/components/blogs/BlogCard";

export const metadata: Metadata = {
  title: "Pet & Aquarium Care Blog | Sierra Fish & Pets",
  description:
    "Expert pet care guides, aquarium tips, fish keeping advice, and reptile nutrition articles from Pacific Northwest specialists at Sierra Fish & Pets.",
  keywords: [
    "pet care blog renton wa",
    "aquarium care tips",
    "fish keeping guide",
    "reptile care articles",
    "dog cat pet advice",
    "sierra fish and pets blog",
  ],
  alternates: {
    canonical: "https://sierrafishandpets.com/blogs",
  },
  openGraph: {
    title: "Pet & Aquarium Care Blog | Sierra Fish & Pets",
    description:
      "Expert pet care guides, aquarium tips, fish keeping advice, and reptile nutrition articles from Pacific Northwest specialists at Sierra Fish & Pets.",
    url: "https://sierrafishandpets.com/blogs",
    siteName: "Sierra Fish & Pets",
    images: [
      {
        url: "https://sierrafishandpets.com/images/banner/shophero3.png",
        width: 1200,
        height: 630,
        alt: "Pet & Aquarium Care Blog - Sierra Fish & Pets",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet & Aquarium Care Blog | Sierra Fish & Pets",
    description:
      "Expert pet care guides, aquarium tips, fish keeping advice, and reptile nutrition articles from Pacific Northwest specialists at Sierra Fish & Pets.",
    images: ["https://sierrafishandpets.com/images/banner/shophero3.png"],
  },
};

export default function BlogsPage() {
  return <BlogsContainer posts={blogsData as BlogItem[]} />;
}

