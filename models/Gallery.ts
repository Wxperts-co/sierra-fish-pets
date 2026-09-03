import mongoose, { Document, Model } from "mongoose";

export interface IGallery extends Document {
  id: string;
  image: string;
  caption: string;
  categorySlug: string;
  order: number;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new mongoose.Schema<IGallery>(
  {
    id: {
      type: String,
      required: [true, "Gallery ID is required"],
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    caption: {
      type: String,
      required: [true, "Caption is required"],
      trim: true,
    },
    categorySlug: {
      type: String,
      default: "store",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

gallerySchema.index({ order: 1 });
gallerySchema.index({ categorySlug: 1 });

const GalleryModel: Model<IGallery> =
  mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", gallerySchema);

export default GalleryModel;
