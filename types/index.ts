// ─── CATEGORY ───────────────────────────────────────────────────────────────

export type CategorySlug =
  | "dog"
  | "cat"
  | "aquatic"
  | "reptile"
  | "bird"
  | "small-animal";

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  image: string;
  icon: string;
  subcategories: SubCategory[];
  productCount: number;
}

// ─── PRODUCT ────────────────────────────────────────────────────────────────

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1–5
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categorySlug: CategorySlug;
  subcategorySlug: string;
  brand: string;
  price: number;
  compareAtPrice?: number;   // original price if on sale
  images: string[];          // first image is the thumbnail
  description: string;
  shortDescription: string;
  features: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  stockStatus: StockStatus;
  stockCount: number;
  isNewArrival: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  weight?: string;
  dimensions?: string;
  createdAt: string;
}

// ─── CART ───────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
}

// ─── ORDER ──────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type PaymentMethod = "credit_card" | "debit_card" | "paypal" | "cash_on_delivery";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  couponCode?: string;
  notes?: string;
  placedAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

// ─── USER ───────────────────────────────────────────────────────────────────

export interface Address extends ShippingAddress {
  id: string;
  isDefault: boolean;
  label: string; // "Home", "Office", etc.
}

export interface UserAddress {
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

export interface User {
  id: string;
  _id?: string;
  role: "user" | "admin";
  name: string;
  email: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  wishlist?: string[];
  isEmailVerified: boolean;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  addresses?: UserAddress[];
  createdAt?: string;
  updatedAt?: string;
}

// ─── BRAND ──────────────────────────────────────────────────────────────────

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  categories: CategorySlug[];
  featured: boolean;
  website?: string;
}

// ─── BLOG ───────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  author: string;
  categorySlug: CategorySlug | "general";
  tags: string[];
  isArrival: boolean;      // true = store arrival post
  publishedAt: string;
  readingTime: number;     // minutes
}

// ─── EVENT ──────────────────────────────────────────────────────────────────

export type EventType =
  | "adoption"
  | "vaccination"
  | "workshop"
  | "sale"
  | "tour"
  | "other";

export interface StoreEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  image?: string;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  recurrenceNote?: string; // e.g. "Every 2nd & 4th weekend"
}

// ─── SERVICE ────────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: "aquarium" | "in-store" | "adoption";
  shortDescription: string;
  description: string;
  image: string;
  price?: string;          // e.g. "Starting at $50" or null if free
  features: string[];
}

// ─── EDU ARTICLE ─────────────────────────────────────────────────────────────

export interface EduArticle {
  id: string;
  title: string;
  slug: string;
  categorySlug: CategorySlug;
  subcategory: string;     // e.g. "Care", "Training", "Feeding"
  excerpt: string;
  body: string;
  coverImage: string;
  readingTime: number;
  publishedAt: string;
}

// ─── BANNER / SLIDER ────────────────────────────────────────────────────────

export interface Banner {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaLink?: string;
  order: number;
}

// ─── GALLERY ────────────────────────────────────────────────────────────────

export interface GalleryItem {
  id: string;
  image: string;
  caption?: string;
  categorySlug?: CategorySlug;
}

// ─── COUPON ─────────────────────────────────────────────────────────────────

export type DiscountType = "percentage" | "flat";

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  applicableCategories: CategorySlug[] | "all";
}