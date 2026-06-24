import mongoose, { Document, Model, Schema } from "mongoose";

export interface INewArrival extends Document {
  id: string;
  name: string;
  slug: string;
  category: string;
  breed: string;
  gender: string;
  age: string;
  size: string;
  price: number;
  discountPrice?: number;
  arrivalDate: string;
  status: "available" | "adopted" | "unavailable";
  featured: boolean;
  vaccinated: boolean;
  dewormed: boolean;
  microchipped: boolean;
  description: string;
  highlights: string[];
  images: string[];
  location: string;
  stock: number;
  seo?: {
    title: string;
    description: string;
  };
}

const newArrivalSchema = new Schema<INewArrival>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    category: { type: String, required: true, index: true },
    breed: { type: String, required: true },
    gender: { type: String, default: "Unknown" },
    age: { type: String, default: "Unknown" },
    size: { type: String, default: "Medium" },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    arrivalDate: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "adopted", "unavailable"],
      default: "available",
      index: true,
    },
    featured: { type: Boolean, default: false },
    vaccinated: { type: Boolean, default: false },
    dewormed: { type: Boolean, default: false },
    microchipped: { type: Boolean, default: false },
    description: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    images: { type: [String], default: [] },
    location: { type: String, default: "Renton Store" },
    stock: { type: Number, default: 1 },
    seo: {
      title: { type: String },
      description: { type: String },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const NewArrivalModel: Model<INewArrival> =
  mongoose.models.NewArrival || mongoose.model<INewArrival>("NewArrival", newArrivalSchema);

export default NewArrivalModel;
