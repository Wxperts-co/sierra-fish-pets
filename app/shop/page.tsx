import type { Metadata } from "next";
import ShopPageClient from "@/components/shop/ShopPageClient";
import { getCategoryMetadata } from "@/lib/categoryMetadata";

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: ShopPageProps): Promise<Metadata> {
  const sParams = await searchParams;
  const categoryRaw = sParams?.category;
  const category = Array.isArray(categoryRaw) ? categoryRaw[0] : categoryRaw;
  const meta = getCategoryMetadata(category);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
  };
}

export default function ShopPage() {
  return <ShopPageClient />;
}
