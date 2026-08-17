import { redirect } from "next/navigation";

export function generateStaticParams() {
  return [];
}

export default async function SlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/education/${slug}`);
}
