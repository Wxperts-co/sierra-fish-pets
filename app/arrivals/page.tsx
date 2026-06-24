import ArrivalsContainer from "@/components/arrivals/ArrivalsContainer";
import NewArrivalModel from "@/models/NewArrival";
import { connectDB } from "@/lib/mongodb";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export default async function ArrivalsPage() {
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
      console.error("Seeding failed in ArrivalsPage:", error);
    }
  }

  const rawArrivals = await NewArrivalModel.find().sort({ createdAt: -1 }).lean();
  const arrivals = JSON.parse(JSON.stringify(rawArrivals));

  return <ArrivalsContainer initialArrivals={arrivals} />;
}