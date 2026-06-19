import mongoose, { Document, Model } from "mongoose";

export interface IBrand extends Document {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  categories: string[];
  featured: boolean;
  website: string;
}

const brandSchema = new mongoose.Schema<IBrand>(
  {
    id: {
      type: String,
      required: [true, "Brand ID is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
    },
    logo: { type: String, default: "" },
    description: { type: String, default: "" },
    categories: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    website: { type: String, default: "" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

brandSchema.index({ id: 1 }, { unique: true });
brandSchema.index({ name: 1 });

const BrandModel: Model<IBrand> =
  mongoose.models.Brand || mongoose.model<IBrand>("Brand", brandSchema);

export default BrandModel;
