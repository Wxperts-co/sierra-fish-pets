import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUserAddress {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  label: string;
}

// Interface for User Document
export interface IUser extends Document {
  role: "user" | "admin" | "manager" | "sales" | "delivery boy";
  name: string;
  email: string;
  status: "active" | "inactive" | "banned";
  password: string;
  avatar: {
    url: string;
    public_id: string;
  };
  wishlist: string[];
  isEmailVerified: boolean;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addresses: IUserAddress[];
  deletedAt: Date | null;

  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    role: {
      type: String,
      enum: ["user", "admin", "manager", "sales", "delivery boy"],
      default: "user",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        "Please enter a valid email",
      ],
    },

  

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    avatar: {
      url: {
        type: String,
        default: "",
        trim: true,
      },
      public_id: {
        type: String,
        default: "",
        trim: true,
      },
    },

    wishlist: {
      type: [String],
      default: [],
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    zipCode: {
      type: String,
      default: "",
      trim: true,
    },

    country: {
      type: String,
      default: "",
      trim: true,
    },

    addresses: {
      type: [
        {
          id: { type: String, required: true },
          fullName: { type: String, required: true },
          phone: { type: String, required: true },
          address: { type: String, required: true },
          city: { type: String, required: true },
          state: { type: String, required: true },
          zipCode: { type: String, required: true },
          country: { type: String, required: true, default: "United States" },
          isDefault: { type: Boolean, default: false },
          label: { type: String, default: "Home" },
        },
      ],
      default: [],
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default UserModel;