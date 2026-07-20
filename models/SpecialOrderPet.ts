import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISpecialOrderPet extends Document {
  id: string;
  name: string;
  category: "fish" | "reptile" | "bird";
  type: string;
  leadTime: string;
  image: string;
  description: string;
  careDetails?: string;
  status: "available" | "unavailable";
}

const specialOrderPetSchema = new Schema<ISpecialOrderPet>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, enum: ["fish", "reptile", "bird"], required: true, index: true },
    type: { type: String, required: true },
    leadTime: { type: String, default: "1-2 Weeks" },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    careDetails: { type: String, default: "" },
    status: { type: String, enum: ["available", "unavailable"], default: "available", index: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SpecialOrderPetModel: Model<ISpecialOrderPet> =
  mongoose.models.SpecialOrderPet ||
  mongoose.model<ISpecialOrderPet>("SpecialOrderPet", specialOrderPetSchema);

export default SpecialOrderPetModel;
