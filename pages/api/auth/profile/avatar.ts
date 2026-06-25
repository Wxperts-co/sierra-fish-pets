import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import UserModel from "@/models/User";
import { connectDB } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY || "your-fallback-jwt-secret";

// Disable Next.js default bodyParser to let Multer parse the multi-part data stream
export const config = {
  api: {
    bodyParser: false,
  },
};

// Setup Multer to store files on disk in public/uploads/avatars
const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // Limit size to 3MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

// Helper to run express middleware inside Next.js Pages API routes
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(451).json({ success: false, message: "Method not allowed" });
  }

  try {
    await connectDB();

    // 1. Authenticate user from JWT cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json({ success: false, message: "Not authenticated" });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(200).json({ success: false, message: "Invalid or expired token" });
    }

    // 2. Parse multi-part form data with multer
    try {
      await runMiddleware(req, res, upload.single("avatar"));
    } catch (multerErr: any) {
      return res.status(400).json({ success: false, message: multerErr.message || "File upload parsing failed." });
    }

    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No avatar image file received." });
    }

    // 3. Fetch user
    const user = await UserModel.findOne({ _id: decoded.id, deletedAt: null });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete old avatar from disk if it exists locally
    if (user.avatar?.url && user.avatar.url.startsWith("/uploads/avatars/")) {
      const oldPath = path.join(process.cwd(), "public", user.avatar.url);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (unlinkErr) {
          console.error("Failed to delete old avatar file:", unlinkErr);
        }
      }
    }

    // 4. Update user's avatar in MongoDB with the local path
    user.avatar = {
      url: `/uploads/avatars/${file.filename}`,
      public_id: file.filename,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        wishlist: user.wishlist || [],
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        country: user.country || "",
        addresses: user.addresses || [],
      },
    });
  } catch (error: any) {
    console.error("Avatar Upload API Error:", error);
    const errorMessage =
      error?.message ||
      (typeof error === "string" ? error : JSON.stringify(error)) ||
      "An error occurred during avatar upload.";
    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
}
