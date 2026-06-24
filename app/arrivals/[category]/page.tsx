import ArrivalsContainer from "@/components/arrivals/ArrivalsContainer";
import NewArrivalModel from "@/models/NewArrival";
import { connectDB } from "@/lib/mongodb";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function ArrivalsCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  await connectDB();

  // Auto-seed if the collection is empty, reading the file dynamically at runtime
  const count = await NewArrivalModel.countDocuments();
  if (count === 0) {
    try {
      const filePath = path.join(process.cwd(), "data", "newarrivals.json");
      const fileContent = await fs.readFile(filePath, "utf-8");
      const initialData = JSON.parse(fileContent);
      await NewArrivalModel.insertMany(initialData);
    } catch (error) {
      console.error("Seeding failed in ArrivalsCategoryPage:", error);
    }
  }

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
