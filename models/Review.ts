import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReview extends Document {
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment: string;
  images: string[];
  verifiedPurchase: boolean;
  helpfulCount: number;
  helpfulVotes: string[]; // Stores userIds to prevent duplicate helpful voting
  status: "published" | "hidden" | "reported";
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: "" },
    productId: { type: String, required: true, index: true },
    orderId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, default: "" },
    comment: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    verifiedPurchase: { type: Boolean, default: true },
    helpfulCount: { type: Number, default: 0 },
    helpfulVotes: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["published", "hidden", "reported"],
      default: "published",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Enforce unique review per user per product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

const ReviewModel: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);

export default ReviewModel;
