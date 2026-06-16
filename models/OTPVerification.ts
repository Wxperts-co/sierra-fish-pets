import mongoose, { Document, Model } from "mongoose";

export interface IOTPVerification extends Document {
  userId: mongoose.Types.ObjectId;
  otp: string;
  expiresAt: Date;
}

const otpVerificationSchema =
  new mongoose.Schema<IOTPVerification>(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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