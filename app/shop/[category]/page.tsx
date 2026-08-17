import type { Metadata } from "next";
import ShopPageClient from "@/components/shop/ShopPageClient";
import { getCategoryMetadata } from "@/lib/categoryMetadata";

interface ShopCategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({
  params,
}: ShopCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = getCategoryMetadata(category);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
  };
}

export default async function ShopCategoryPage({
  params,
}: ShopCategoryPageProps) {
  const { category } = await params;
  return <ShopPageClient initialCategory={category} />;
}
