import mongoose, { Document, Model } from "mongoose";

export interface IDogAdoption extends Document {
  id: string;
  name: string;
  slug: string;
  image: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  color: string;
  vaccinated: boolean;
  neutered: boolean;
  goodWithKids: boolean;
  goodWithDogs: boolean;
  goodWithCats: boolean;
  adoptionStatus: string;
  featured: boolean;
  description: string;
  personality: string[];
  adoptionFee: string;
}

const dogAdoptionSchema = new mongoose.Schema<IDogAdoption>(
  {
    id: {
      type: String,
      required: [true, "Dog ID is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
    },
    image: { type: String, default: "" },
    breed: {
      type: String,
      required: [true, "Breed is required"],
      trim: true,
    },
    age: { type: String, default: "" },
    gender: { type: String, default: "Male" },
    size: { type: String, default: "Medium" },
    color: { type: String, default: "" },
    vaccinated: { type: Boolean, default: false },
    neutered: { type: Boolean, default: false },
    goodWithKids: { type: Boolean, default: false },
    goodWithDogs: { type: Boolean, default: false },
    goodWithCats: { type: Boolean, default: false },
    adoptionStatus: { type: String, default: "available" },
    featured: { type: Boolean, default: false },
    description: { type: String, default: "" },
    personality: { type: [String], default: [] },
    adoptionFee: { type: String, default: "$0" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

dogAdoptionSchema.index({ id: 1 }, { unique: true });
dogAdoptionSchema.index({ adoptionStatus: 1 });

const DogAdoptionModel: Model<IDogAdoption> =
  mongoose.models.DogAdoption ||
  mongoose.model<IDogAdoption>("DogAdoption", dogAdoptionSchema);

export default DogAdoptionModel;
