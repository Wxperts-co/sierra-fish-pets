import mongoose, { Document, Model } from "mongoose";

export interface ISEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface ISpecialistQuote {
  quote: string;
  author: string;
}

export interface IBlog extends Document {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  thumbnailAlt: string;
  author: string;
  authorRole: string;
  authorImage: string;
  category: string;
  categorySlug: string;
  tags: string[];
  featured: boolean;
  isArrival: boolean;
  status: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  relatedIds: string[];
  seo: ISEO;
  specialistQuote: ISpecialistQuote;
  galleryImages: string[];
}

const seoSchema = new mongoose.Schema<ISEO>(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    keywords: { type: [String], default: [] },
  },
  { _id: false }
);

const specialistQuoteSchema = new mongoose.Schema<ISpecialistQuote>(
  {
    quote: { type: String, default: "" },
    author: { type: String, default: "" },
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema<IBlog>(
  {
    id: {
      type: String,
      required: [true, "Blog ID is required"],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
    },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    thumbnailAlt: { type: String, default: "" },
    author: { type: String, default: "Sierra Team" },
    authorRole: { type: String, default: "Pet Specialist" },
    authorImage: { type: String, default: "/images/team/sierra-team.jpg" },
    category: { type: String, required: true },
    categorySlug: { type: String, required: true },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    isArrival: { type: Boolean, default: false },
    status: { type: String, default: "draft" },
    publishedAt: { type: String, default: "" },
    updatedAt: { type: String, default: "" },
    readingTime: { type: Number, default: 0 },
    relatedIds: { type: [String], default: [] },
    seo: {
      type: seoSchema,
      default: () => ({ title: "", description: "", keywords: [] }),
    },
    specialistQuote: {
      type: specialistQuoteSchema,
      default: () => ({ quote: "", author: "" }),
    },
    galleryImages: { type: [String], default: [] },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

blogSchema.index({ slug: 1 });

const BlogModel: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema);

export default BlogModel;
