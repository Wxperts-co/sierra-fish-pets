import mongoose, { Document, Model } from "mongoose";

export interface IGiftCardInstance extends Document {
  code: string;
  initialBalance: number;
  currentBalance: number;
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  message?: string;
  orderId?: mongoose.Types.ObjectId | null;
  isActive: boolean;
  expiryDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const giftCardInstanceSchema = new mongoose.Schema<IGiftCardInstance>(
  {
    code: {
      type: String,
      required: [true, "Gift card code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    initialBalance: {
      type: Number,
      required: [true, "Initial balance is required"],
      min: [0, "Initial balance cannot be negative"],
    },
    currentBalance: {
      type: Number,
      required: [true, "Current balance is required"],
      min: [0, "Current balance cannot be negative"],
    },
    recipientEmail: {
      type: String,
      required: [true, "Recipient email is required"],
      lowercase: true,
      trim: true,
    },
    recipientName: {
      type: String,
      required: [true, "Recipient name is required"],
      trim: true,
    },
    senderName: {
      type: String,
      required: [true, "Sender name is required"],
      trim: true,
    },
    message: {
      type: String,
      default: "",
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const GiftCardInstanceModel: Model<IGiftCardInstance> =
  mongoose.models.GiftCardInstance ||
  mongoose.model<IGiftCardInstance>("GiftCardInstance", giftCardInstanceSchema);

export default GiftCardInstanceModel;
