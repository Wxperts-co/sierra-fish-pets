import mongoose, { Document, Model } from "mongoose";
import type { CategorySlug } from "@/types";

export interface ISubCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ICategory extends Document {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  image: string;
  icon: string;
  productCount: number;
  subcategories: ISubCategory[];
}

const subCategorySchema = new mongoose.Schema<ISubCategory>(
  {
    id: { type: String, required: [true, "Subcategory ID is required"], trim: true },
    name: { type: String, required: [true, "Subcategory name is required"], trim: true },
    slug: { type: String, required: [true, "Subcategory slug is required"], trim: true },
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema<ICategory>(
  {
    id: {
      type: String,
      required: [true, "Category ID is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, "Category icon is required"],
      trim: true,
    },
    productCount: {
      type: Number,
      default: 0,
    },
    subcategories: {
      type: [subCategorySchema],
      default: [],
    },
  },
  {
    versionKey: false,
  }
);

const CategoryModel: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);

export default CategoryModel;
