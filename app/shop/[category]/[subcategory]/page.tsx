import type { Metadata } from "next";
import ShopPageClient from "@/components/shop/ShopPageClient";
import { getCategoryMetadata } from "@/lib/categoryMetadata";

interface ShopSubcategoryPageProps {
  params: Promise<{ category: string; subcategory: string }>;
}

export async function generateMetadata({
  params,
}: ShopSubcategoryPageProps): Promise<Metadata> {
  const { category, subcategory } = await params;
  const meta = getCategoryMetadata(category);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `https://www.sierrafishandpets.com/shop/${category}/${subcategory}`,
    },
  };
}

export default async function ShopSubcategoryPage({
  params,
}: ShopSubcategoryPageProps) {
  const { category, subcategory } = await params;
  return (
    <ShopPageClient
      initialCategory={category}
      initialSubcategory={subcategory}
    />
  );
}
