import mongoose, { Document, Model } from "mongoose";
import { OrderStatus, PaymentStatus, PaymentMethod } from "@/types";

export interface IOrderItem {
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IOrder extends Document {
  userId?: string | null;
  guestEmail: string;
  guestPhone?: string;
  orderNumber: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  couponCode?: string;
  notes?: string;
  placedAt: Date;
  updatedAt: Date;
  estimatedDelivery?: string;
  trackingNumber?: string;
  invoiceUrl?: string;
  invoiceGeneratedAt?: Date;
}

const orderItemSchema = new mongoose.Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema<IShippingAddress>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true, default: "United States" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema<IOrder>(
  {
    userId: { type: String, default: null, index: true },
    guestEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    guestPhone: { type: String, trim: true },
    orderNumber: { type: String, required: true, unique: true, index: true },
    items: { type: [orderItemSchema], required: true },
    shippingAddress: { type: shippingAddressSchema, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "paypal", "cash_on_delivery"],
      required: true,
    },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, default: 0, min: 0 },
    shippingCost: { type: Number, required: true, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    couponCode: { type: String },
    notes: { type: String },
    placedAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true },
    estimatedDelivery: { type: String },
    trackingNumber: { type: String },
    invoiceUrl: { type: String },
    invoiceGeneratedAt: { type: Date },
  },
  {
    timestamps: { createdAt: "placedAt", updatedAt: "updatedAt" },
    versionKey: false,
  }
);

const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default OrderModel;
