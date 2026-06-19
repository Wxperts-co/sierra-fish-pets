import mongoose, { Document, Model } from "mongoose";

export interface IBanner extends Document {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaLink: string;
  order: number;
  status: string;
}

const bannerSchema = new mongoose.Schema<IBanner>(
  {
    id: {
      type: String,
      required: [true, "Banner ID is required"],
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    subtitle: { type: String, default: "" },
    ctaLabel: { type: String, default: "" },
    ctaLink: { type: String, default: "" },
    order: { type: Number, default: 0 },
    status: { type: String, default: "active" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

bannerSchema.index({ id: 1 }, { unique: true });
bannerSchema.index({ order: 1 });

const BannerModel: Model<IBanner> =
  mongoose.models.Banner || mongoose.model<IBanner>("Banner", bannerSchema);

export default BannerModel;
