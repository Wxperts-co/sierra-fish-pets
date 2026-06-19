import mongoose, { Document, Model } from "mongoose";

export interface IGiftCard extends Document {
  id: string;
  type: string;
  name: string;
  tagline: string;
  image: string;
  shortDescription: string;
  description: string;
  priceOptions: string[];
  features: string[];
  terms: string;
}

const giftCardSchema = new mongoose.Schema<IGiftCard>(
  {
    id: {
      type: String,
      required: [true, "Gift card ID is required"],
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Gift card type is required"],
      trim: true,
      default: "egift",
    },
    name: {
      type: String,
      required: [true, "Gift card name is required"],
      trim: true,
    },
    tagline: { type: String, default: "" },
    image: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    priceOptions: { type: [String], default: [] },
    features: { type: [String], default: [] },
    terms: { type: String, default: "" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

giftCardSchema.index({ id: 1 }, { unique: true });

const GiftCardModel: Model<IGiftCard> =
  mongoose.models.GiftCard || mongoose.model<IGiftCard>("GiftCard", giftCardSchema);

export default GiftCardModel;
