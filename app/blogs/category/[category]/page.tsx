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
    title: "Dog Care & Nutrition Articles | Sierra Fish & Pets",
    description:
      "Expert dog care advice, puppy training tips, canine nutrition guides, and health essentials from Sierra Fish & Pets in Renton, WA.",
    keywords: [
      "dog care blog renton wa",
      "canine nutrition tips",
      "puppy training advice",
      "dog health guides",
    ],
  },
  cat: {
    title: "Cat Care & Health Guides | Sierra Fish & Pets Renton",
    description:
      "Discover feline wellness tips, cat nutrition advice, behavior guides, and indoor cat care articles from Sierra Fish & Pets in Renton, WA.",
    keywords: [
      "cat care blog renton",
      "feline health guides",
      "cat nutrition advice",
      "indoor cat wellness",
    ],
  },
  aquatic: {
    title: "Aquarium & Fish Care Guides | Sierra Fish & Pets",
    description:
      "Master freshwater & marine tank maintenance, water chemistry, aquascaping, and fish health with guides from Sierra Fish & Pets Renton.",
    keywords: [
      "aquarium blog renton wa",
      "fish care guides",
      "tank water chemistry tips",
      "aquascaping articles",
    ],
  },
  fish: {
    title: "Aquarium & Fish Care Guides | Sierra Fish & Pets",
    description:
      "Master freshwater & marine tank maintenance, water chemistry, aquascaping, and fish health with guides from Sierra Fish & Pets Renton.",
    keywords: [
      "fish care blog renton",
      "aquarium guides",
      "tropical fish care",
    ],
  },
  reptile: {
    title: "Reptile Habitat & Care Blog | Sierra Fish & Pets",
    description:
      "Explore expert reptile care guides, terrarium setup advice, lighting, and nutrition tips for geckos, dragons, and snakes at Sierra Fish & Pets.",
    keywords: [
      "reptile care blog renton",
      "terrarium setup advice",
      "bearded dragon care",
      "gecko care guides",
    ],
  },
  bird: {
    title: "Pet Bird Care & Avian Health | Sierra Fish & Pets",
    description:
      "Avian nutrition, cage setup, foraging, and pet bird wellness advice from certified pet care specialists at Sierra Fish & Pets in Renton, WA.",
    keywords: [
      "bird care blog renton",
      "pet bird health",
      "parrot care tips",
      "avian nutrition",
    ],
  },
  "small-animal": {
    title: "Small Animal Pet Care Guides | Sierra Fish & Pets",
    description:
      "Care tips, diet advice, and habitat essentials for rabbits, guinea pigs, hamsters, and small pets in Renton, WA at Sierra Fish & Pets.",
    keywords: [
      "small animal blog renton",
      "rabbit care tips",
      "guinea pig diet",
      "hamster care guide",
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
