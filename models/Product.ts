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
  upc: string;
  imageStatus: "pending" | "processing" | "completed" | "failed";
  imageSource: string;
  imageLastChecked: Date | null;
  imageRetryCount: number;
  imageFailureType: string;
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
      index: true,
    },
    subcategorySlug: {
      type: String,
      required: [true, "Subcategory slug is required"],
      trim: true,
      index: true,
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
    upc: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    imageStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
      index: true,
    },
    imageSource: {
      type: String,
      default: "",
    },
    imageLastChecked: {
      type: Date,
      default: null,
    },
    imageRetryCount: {
      type: Number,
      default: 0,
    },
    imageFailureType: {
      type: String,
      default: "",
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
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },
    dimensions: {
      type: String,
      default: "",
    },
    createdAt: {
      type: String,
      required: [true, "Created date is required"],
      index: true,
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

productSchema.pre("save", function (this: any) {
  const count = Number(this.stockCount);
  if (isNaN(count) || count <= 0) {
    this.stockStatus = "out_of_stock";
    this.stockCount = 0;
  } else if (count <= 5) {
    this.stockStatus = "low_stock";
  } else {
    this.stockStatus = "in_stock";
  }
});


// Compound Text Index for fast full-text searching
productSchema.index(
  {
    name: "text",
    brand: "text",
    categorySlug: "text",
    shortDescription: "text",
    description: "text"
  },
  {
    weights: {
      name: 10,
      brand: 5,
      categorySlug: 3,
      shortDescription: 2,
      description: 1
    },
    name: "ProductTextIndex",
    background: true
  }
);

// Compound Indexes for Category Queries + Common Sort Options
productSchema.index({ categorySlug: 1, createdAt: -1 }, { background: true });
productSchema.index({ categorySlug: 1, price: 1 }, { background: true });
productSchema.index({ categorySlug: 1, price: -1 }, { background: true });

// Compound Indexes for Subcategory Queries + Common Sort Options
productSchema.index({ subcategorySlug: 1, createdAt: -1 }, { background: true });
productSchema.index({ subcategorySlug: 1, price: 1 }, { background: true });
productSchema.index({ subcategorySlug: 1, price: -1 }, { background: true });

// Compound Indexes for Brand Queries + Common Sort Options
productSchema.index({ brand: 1, createdAt: -1 }, { background: true });
productSchema.index({ brand: 1, price: 1 }, { background: true });
productSchema.index({ brand: 1, price: -1 }, { background: true });

// Global Sort Indexes
productSchema.index({ price: 1 }, { background: true });
productSchema.index({ price: -1 }, { background: true });
productSchema.index({ rating: -1 }, { background: true });
productSchema.index({ isBestSeller: -1, reviewCount: -1 }, { background: true });
productSchema.index({ isFeatured: -1, rating: -1 }, { background: true });

const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default ProductModel;
