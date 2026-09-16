import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICE_AREAS, getServiceAreaBySlug } from "@/data/serviceAreas";
import ServiceAreaDetailClient from "@/components/service-areas/ServiceAreaDetailClient";

export async function generateStaticParams() {
  return SERVICE_AREAS.map((area) => ({
    city: area.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const area = getServiceAreaBySlug(city);

  if (!area) {
    return {
      title: "Service Area Not Found | Sierra Fish & Pets",
      description: "Service area page not found at Sierra Fish & Pets.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sierrafishandpets.com";
  const canonicalUrl = `${baseUrl}/service-areas/${area.slug}`;

  return {
    title: area.metaTitle,
    description: area.metaDescription,
    keywords: area.keywords.join(", "),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: area.metaTitle,
      description: area.metaDescription,
      url: canonicalUrl,
      siteName: "Sierra Fish & Pets",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${baseUrl}/images/logo/logo3.png`,
          width: 800,
          height: 600,
          alt: `Sierra Fish & Pets - ${area.name}, WA`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: area.metaTitle,
      description: area.metaDescription,
    },
  };
}

export default async function ServiceAreaPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const area = getServiceAreaBySlug(city);

  if (!area) {
    notFound();
  }

  return <ServiceAreaDetailClient area={area} />;
}
