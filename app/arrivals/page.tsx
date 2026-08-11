import ArrivalsContainer from "@/components/arrivals/ArrivalsContainer";
import NewArrivalModel from "@/models/NewArrival";
import { connectDB } from "@/lib/mongodb";


export const dynamic = "force-dynamic";

export default async function ArrivalsPage() {
  await connectDB();

  const rawArrivals = await NewArrivalModel.find().sort({ createdAt: -1 }).lean();
  const arrivals = JSON.parse(JSON.stringify(rawArrivals));

  return <ArrivalsContainer initialArrivals={arrivals} />;
}