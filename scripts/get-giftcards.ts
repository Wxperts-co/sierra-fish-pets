import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import GiftCardModel from "../models/GiftCard";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;

async function run() {
  await mongoose.connect(MONGODB_URI);
  const giftCards = await GiftCardModel.find().lean();
  console.log("Gift cards in database:", JSON.stringify(giftCards, null, 2));
  await mongoose.disconnect();
}

run();
