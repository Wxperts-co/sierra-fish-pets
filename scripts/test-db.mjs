import mongoose from "mongoose";
import dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
console.log("Connecting using MONGODB_URI from .env.local:", MONGODB_URI);

try {
  await mongoose.connect(MONGODB_URI);
  console.log("SUCCESS: Connected to database using .env.local URI!");
  process.exit(0);
} catch (error) {
  console.error("FAILED to connect using .env.local URI:", error);
  process.exit(1);
}
