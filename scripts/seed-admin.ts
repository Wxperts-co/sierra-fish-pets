/**
 * Seed Admin Script
 * -----------------
 * Creates the first admin account in the database.
 * Run once with: npx tsx scripts/seed-admin.ts
 *
 * IMPORTANT: Do NOT run this if an admin with the same email already exists.
 */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

// ─── Admin credentials ───────────────────────────────────────────────────────
const ADMIN_EMAIL = "jonas@sierrafishandpets.net";
const ADMIN_PASSWORD = "Jonas@sierrafishandpets2026";
const ADMIN_NAME = "Admin";
// ─────────────────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "admin", "manager", "sales", "delivery boy"], default: "user", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive", "banned"], default: "active" },
    isEmailVerified: { type: Boolean, default: false },
    avatar: { url: { type: String, default: "" }, public_id: { type: String, default: "" } },
    wishlist: { type: [String], default: [] },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    country: { type: String, default: "" },
    addresses: { type: Array, default: [] },
    deletedAt: { type: Date, default: null },
  },
  { collection: "users", timestamps: true }
);

async function run() {
  try {
    console.log("🔌 Connecting to database...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected!");

    const UserModel =
      mongoose.models.User || mongoose.model("User", userSchema);

    // Check if admin already exists
    const existing = await UserModel.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log(`⚠️  A user with email "${ADMIN_EMAIL}" already exists (role: ${existing.role}).`);
      console.log("   No changes made. Exiting.");
      await mongoose.disconnect();
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create the admin user
    await UserModel.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      status: "active",
      isEmailVerified: true,
      deletedAt: null,
    });

    console.log(`✅ Admin account created successfully!`);
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Role:     admin`);
    console.log(`\n⚠️  Please change the password after first login for security.`);
  } catch (error) {
    console.error("❌ Seeder error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from database.");
  }
}

run();
