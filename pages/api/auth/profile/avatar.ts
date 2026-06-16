import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
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

// Setup Multer to store files in memory as buffer streams
const storage = multer.memoryStorage();
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

    // 4. Validate Cloudinary Configuration
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(400).json({
        success: false,
        message: "Cloudinary credentials are not configured in your .env.local file. Please define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      });
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // 5. Upload buffer to Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "sierra_pets_avatars",
          public_id: `avatar_${decoded.id}`,
          overwrite: true,
          invalidate: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    // Delete old avatar from Cloudinary if existed (optional, handled by overwrite since public_id matches)

    // 6. Update user's avatar in MongoDB
    user.avatar = {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
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
