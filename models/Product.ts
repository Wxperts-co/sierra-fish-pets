import mongoose, { Document, Model } from "mongoose";

import {
  RETAILER_CSV_COLUMNS,
  mapRetailerCsvData,
  type IRetailerCsvData,
  type RetailerCsvColumn,
} from "@/lib/products/retailerCsvColumns";

export {
  RETAILER_CSV_COLUMNS,
  mapRetailerCsvData,
  type IRetailerCsvData,
  type RetailerCsvColumn,
};

const retailerCsvDataSchemaDefinition = Object.fromEntries(
  RETAILER_CSV_COLUMNS.map((column) => [column, { type: String, default: "" }])
);

export interface IProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

export interface IProduct extends Document {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categorySlug: string;
  subcategorySlug: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  shortDescription: string;
  description: string;
  features: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  reviews: IProductReview[];
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  stockCount: number;
  isNewArrival: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  dimensions?: string;
  createdAt: string;
  retailerCsvData: IRetailerCsvData;
}

const productReviewSchema = new mongoose.Schema<IProductReview>(
  {
    id: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    date: { type: String, required: true },
    verified: { type: Boolean, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema<IProduct>(
  {
    id: {
      type: String,
      required: [true, "Product ID is required"],
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
      unique: true,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      trim: true,
      unique: true,
    },
    categorySlug: {
      type: String,
      required: [true, "Category slug is required"],
      trim: true,
    },
    subcategorySlug: {
      type: String,
      required: [true, "Subcategory slug is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    compareAtPrice: {
      type: Number,
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    features: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: [productReviewSchema],
      default: [],
    },
    stockStatus: {
      type: String,
      enum: ["in_stock", "low_stock", "out_of_stock"],
      default: "in_stock",
    },
    stockCount: {
      type: Number,
      default: 0,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    dimensions: {
      type: String,
      default: "",
    },
    createdAt: {
      type: String,
      required: [true, "Created date is required"],
    },
    retailerCsvData: {
      type: new mongoose.Schema(retailerCsvDataSchemaDefinition, { _id: false }),
      default: () => ({}),
    },
  },
  {
    versionKey: false,
  }
);

const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default ProductModel;
