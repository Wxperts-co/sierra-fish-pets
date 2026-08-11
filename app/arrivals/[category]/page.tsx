import ArrivalsContainer from "@/components/arrivals/ArrivalsContainer";
import NewArrivalModel from "@/models/NewArrival";
import { connectDB } from "@/lib/mongodb";


export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function ArrivalsCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  await connectDB();

  const rawArrivals = await NewArrivalModel.find().sort({ createdAt: -1 }).lean();
  const arrivals = JSON.parse(JSON.stringify(rawArrivals));

  return <ArrivalsContainer initialCategory={category} initialArrivals={arrivals} />;
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
