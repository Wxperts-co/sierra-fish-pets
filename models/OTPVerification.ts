import mongoose, { Document, Model } from "mongoose";

export interface IOTPVerification extends Document {
  userId?: mongoose.Types.ObjectId;
  otp: string;
  expiresAt: Date;
  signupData?: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    role?: "user" | "admin";
  };
}

const otpVerificationSchema =
  new mongoose.Schema<IOTPVerification>(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },

      otp: {
        type: String,
        required: true,
      },

      expiresAt: {
        type: Date,
        required: true,
        expires: 0, // Automatically deletes the document when it expires
      },

      signupData: {
        name: { type: String },
        email: { type: String },
        password: { type: String },
        phone: { type: String },
        role: { type: String },
      },
    },
    {
      timestamps: true,
    }
  );

const OTPVerificationModel: Model<IOTPVerification> =
  mongoose.models.OTPVerification ||
  mongoose.model<IOTPVerification>(
    "OTPVerification",
    otpVerificationSchema
  );

export default OTPVerificationModel;