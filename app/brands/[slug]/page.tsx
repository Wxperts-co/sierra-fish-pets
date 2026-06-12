import { notFound } from "next/navigation";
import type { Metadata } from "next";
import brands from "@/data/brands.json";
import BrandHero from "@/components/brands/BrandsHero";
import BrandDetail from "@/components/brands/BrandDetails";
import BrandCTA from "@/components/brands/BrandCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = brands.find((item) => item.slug === slug);

  if (!brand) {
    return { title: "Brand Not Found | Sierra Fish & Pets" };
  }

  return {
    title: `${brand.name} | Brands | Sierra Fish & Pets`,
    description: brand.description,
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const brand = brands.find((item) => item.slug === slug);

  if (!brand) {
    notFound();
  }

  const relatedBrands = brands
    .filter(
      (item) =>
        item.slug !== slug &&
        item.categories.some((c) => brand.categories.includes(c))
    )
    .slice(0, 4);

  return (
    <>
      <BrandHero
        title={brand.name}
        subtitle={`Trusted ${brand.categories.join(" & ")} brand available at Sierra Fish & Pets`}
        image="/images/banner/shophero3.png"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Brands", href: "/brands" },
          { label: brand.name },
        ]}
      />

      <BrandDetail brand={brand} relatedBrands={relatedBrands} />

      <BrandCTA />
    </>
  );
}