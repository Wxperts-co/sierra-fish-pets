import type { Metadata } from "next";
import BlogsContainer from "@/components/blogs/BlogsContainer";
import blogsData from "@/data/blogs.json";
import { BlogItem } from "@/components/blogs/BlogCard";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

const CATEGORY_BLOG_META: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  dog: {
    title: "Dogs Service SeaTac, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides expert dog services, premium nutritional food, durable toys, and essential grooming supplies for SeaTac area pet owners.",
    keywords: [
      "Dogs Services SeaTac, WA",
      "Best Dogs Services SeaTac, WA",
      "Bird shop SeaTac, WA",
      "pet food store SeaTac, WA",
      "pet food supplies SeaTac, WA",
    ],
  },
  cat: {
    title: "Cats Service SeaTac, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides expert cat services, premium natural foods, litter solutions, and quality play accessories for SeaTac area cat owners.",
    keywords: [
      "Cats Service SeaTac, WA",
      "Best Cats Service SeaTac, WA",
      "Bird shop SeaTac, WA",
      "pet food store SeaTac, WA",
      "pet food supplies SeaTac, WA",
    ],
  },
  aquatic: {
    title: "Aquatic Service SeaTac, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides expert aquatic services, custom aquarium installations, water testing, and healthy fish livestock for SeaTac area hobbyists.",
    keywords: [
      "Aquatic Service SeaTac, WA",
      "Best Aquatic Service SeaTac, WA",
      "Bird shop SeaTac, WA",
      "pet food store SeaTac, WA",
      "pet food supplies SeaTac, WA",
    ],
  },
  fish: {
    title: "Aquatic Service SeaTac, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides expert aquatic services, custom aquarium installations, water testing, and healthy fish livestock for SeaTac area hobbyists.",
    keywords: [
      "Aquatic Service SeaTac, WA",
      "Best Aquatic Service SeaTac, WA",
      "Bird shop SeaTac, WA",
      "pet food store SeaTac, WA",
      "pet food supplies SeaTac, WA",
    ],
  },
  reptile: {
    title: "Reptile Service SeaTac, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides expert reptile services, habitat heating solutions, live feeders, and specialized care advice for SeaTac area reptile enthusiasts.",
    keywords: [
      "Reptile Service SeaTac, WA",
      "Best Reptile Service SeaTac, WA",
      "Bird shop SeaTac, WA",
      "pet food store SeaTac, WA",
      "pet food supplies SeaTac, WA",
    ],
  },
  bird: {
    title: "Birds Service SeaTac, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets in Renton, WA hosts community dog adoption and rescue events to help local shelter animals find loving homes.",
    keywords: [
      "Birds Service SeaTac, WA",
      "Best Birds Service SeaTac, WA",
      "Bird shop SeaTac, WA",
      "pet food store SeaTac, WA",
      "pet food supplies SeaTac, WA",
    ],
  },
  "small-animal": {
    title: "Small Animals Service SeaTac, WA | Sierra Fish & Pets",
    description:
      "Sierra Fish and Pets provides expert bird services, nutritional avian diets, spacious cages, and gentle grooming care for SeaTac area pet owners.",
    keywords: [
      "Small Animals Service SeaTac, WA",
      "Best Small Animals Service SeaTac, WA",
      "Bird shop SeaTac, WA",
      "pet food store SeaTac, WA",
      "pet food supplies SeaTac, WA",
    ],
  },
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const canonicalUrl = `https://sierrafishandpets.com/blogs/category/${category}`;
  const config = CATEGORY_BLOG_META[category.toLowerCase()];

  if (config) {
    return {
      title: config.title,
      description: config.description,
      keywords: config.keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: config.title,
        description: config.description,
        url: canonicalUrl,
        siteName: "Sierra Fish & Pets",
        images: ["https://sierrafishandpets.com/images/banner/shophero3.png"],
      },
    };
  }

  const formatted = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ");
  const fallbackTitle = `${formatted} Pet Care Articles | Sierra Fish & Pets`.length <= 60
    ? `${formatted} Pet Care Articles | Sierra Fish & Pets`
    : `${formatted} Blog | Sierra Fish & Pets`;

  const fallbackDesc = `Explore expert ${formatted} care tips, guides, and nutrition advice from Sierra Fish & Pets in Renton, WA.`;

  return {
    title: fallbackTitle,
    description: fallbackDesc,
    keywords: [`${category} blog`, `${category} pet care`, "sierra fish and pets blog"],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fallbackTitle,
      description: fallbackDesc,
      url: canonicalUrl,
      siteName: "Sierra Fish & Pets",
      images: ["https://sierrafishandpets.com/images/banner/shophero3.png"],
    },
  };
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
