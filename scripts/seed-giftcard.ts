import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import GiftCardInstanceModel from "../models/GiftCardInstance";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

async function run() {
  try {
    console.log("🔌 Connecting to database...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected!");

    const testCode = "SFP-TEST-9999";
    
    // Check if test gift card already exists
    const existing = await GiftCardInstanceModel.findOne({ code: testCode });
    if (existing) {
      console.log(`⚠️ Gift card ${testCode} already exists with balance $${existing.currentBalance}.`);
      await mongoose.disconnect();
      return;
    }

    // Create the test gift card
    await GiftCardInstanceModel.create({
      code: testCode,
      initialBalance: 150.00,
      currentBalance: 150.00,
      recipientEmail: "testrecipient@example.com",
      recipientName: "Test Recipient",
      senderName: "Test Sender",
      message: "Here is process test gift card message! Enjoy your shopping!",
      isActive: true,
    });

    console.log(`✅ Test Gift Card created successfully!`);
    console.log(`   Code:    ${testCode}`);
    console.log(`   Balance: $150.00`);
    console.log(`   Status:  Active`);
  } catch (error) {
    console.error("❌ Seeder error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from database.");
  }
}

run();
