import ArrivalsContainer from "@/components/arrivals/ArrivalsContainer";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function ArrivalsCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  return <ArrivalsContainer initialCategory={category} />;
}

// Generate static params to enable static generation for all expected route categories
export async function generateStaticParams() {
  return [
    { category: "dogs" },
    { category: "cats" },
    { category: "birds" },
    { category: "fish" },
    { category: "small-pets" },
    { category: "exotic-pets" },
    { category: "reptiles" },
    { category: "small-animals" },
    { category: "freshwater" },
    { category: "saltwater" },
  ];
}
