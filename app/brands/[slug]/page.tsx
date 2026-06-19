import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BrandHero from "@/components/brands/BrandsHero";
import BrandDetail from "@/components/brands/BrandDetails";
import BrandCTA from "@/components/brands/BrandCTA";
import { connectDB } from "@/lib/mongodb";
import BrandModel from "@/models/Brand";
import defaultBrands from "@/data/brands.json";

async function getAllBrands() {
  try {
    await connectDB();
    let brands = await BrandModel.find().sort({ name: 1 }).lean();
    if (brands.length === 0) {
      await BrandModel.insertMany(defaultBrands);
      brands = await BrandModel.find().sort({ name: 1 }).lean();
    }
    return JSON.parse(JSON.stringify(brands));
  } catch {
    return defaultBrands;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brands = await getAllBrands();
  const brand = brands.find((item: any) => item.slug === slug);

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
  const brands = await getAllBrands();

  const brand = brands.find((item: any) => item.slug === slug);

  if (!brand) {
    notFound();
  }

  const relatedBrands = brands
    .filter(
      (item: any) =>
        item.slug !== slug &&
        item.categories.some((c: string) => brand.categories.includes(c))
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