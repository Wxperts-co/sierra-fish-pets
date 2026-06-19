import mongoose, { Document, Model } from "mongoose";

export interface IRecurrence {
  enabled: boolean;
  frequency: string | null;
  rule: string | null;
}

export interface IEvent extends Document {
  id: string;
  title: string;
  description: string;
  category: string;
  petType: string[];
  image: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  featured: boolean;
  ctaText: string;
  ctaLink: string;
  recurrence: IRecurrence;
}

const recurrenceSchema = new mongoose.Schema<IRecurrence>(
  {
    enabled: { type: Boolean, default: false },
    frequency: { type: String, default: null },
    rule: { type: String, default: null },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema<IEvent>(
  {
    id: {
      type: String,
      required: [true, "Event ID is required"],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    petType: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    startDate: {
      type: String,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: String,
      required: [true, "End date is required"],
    },
    status: {
      type: String,
      default: "upcoming",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    ctaText: {
      type: String,
      default: "View Details",
    },
    ctaLink: {
      type: String,
      default: "#",
    },
    recurrence: {
      type: recurrenceSchema,
      default: () => ({ enabled: false, frequency: null, rule: null }),
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Ensure index on id and startDate for efficient lookups
eventSchema.index({ id: 1 }, { unique: true });
eventSchema.index({ startDate: 1 });

const EventModel: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);

export default EventModel;
