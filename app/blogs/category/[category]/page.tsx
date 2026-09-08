import BlogsContainer from "@/components/blogs/BlogsContainer";
import blogsData from "@/data/blogs.json";
import { BlogItem } from "@/components/blogs/BlogCard";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  return <BlogsContainer initialCategory={category} posts={blogsData as BlogItem[]} />;
}

// Pre-render static pages for all category route slugs
export async function generateStaticParams() {
  return [
    { category: "dog" },
    { category: "cat" },
    { category: "bird" },
    { category: "aquatic" },
    { category: "reptile" },
    { category: "small-animal" },
  ];
}
