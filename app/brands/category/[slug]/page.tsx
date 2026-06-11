import { redirect } from "next/navigation";

export default async function BrandCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Redirect to the main brands page with the category filter applied
  redirect(`/brands?category=${slug}`);
}
