import { redirect } from "next/navigation";

// Redirect any /sierra-edu/[slug] URLs to /sierra-edu?slug=[slug]
// so everything stays on the single Sierra Edu page.
export function generateStaticParams() {
  return [];
}

export default async function SlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/sierra-edu?slug=${slug}`);
}
