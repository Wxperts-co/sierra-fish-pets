import BlogsContainer from "@/components/blogs/BlogsContainer";
import blogsData from "@/data/blogs.json";
import { BlogItem } from "@/components/blogs/BlogCard";

export default function BlogsPage() {
  return <BlogsContainer posts={blogsData as BlogItem[]} />;
}

