import { Suspense } from "react";
import { GalleryContent } from "../../page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const formatted = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${formatted} Gallery | Sierra Fish & Pets`,
    description: `Browse ${slug} photos in Sierra Fish & Pets photo gallery.`,
  };
}

export default async function GalleryCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 pt-24 text-center">
          Loading Gallery...
        </div>
      }
    >
      <GalleryContent initialCat={slug} />
    </Suspense>
  );
}
