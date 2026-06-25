// Reference data
export { default as brands } from "./brands.json";
export { default as users } from "./users.json";
export { default as orders } from "./orders.json";
export { default as blogPosts } from "./blogs.json";

export { default as services } from "./services.json";
export { default as banners } from "./banners.json";
export { default as coupons } from "./coupons.json";
export { default as gallery } from "./gallery.json";
export { default as faq } from "./faq.json";

// Utility helpers
export const getCategoryBySlug = async (slug: string) => {
  // Categories are now fetched from DB via /api/categories
  // This helper is deprecated; use /api/categories directly in client components
  return null;
};

export const getBrandBySlug = (slug: string) => {
  const b = require("./brands.json");
  return b.find((brand: { slug: string }) => brand.slug === slug);
};

export const getOrdersByUserId = (userId: string) => {
  const o = require("./orders.json");
  return o.filter((order: { userId: string }) => order.userId === userId);
};

export const getBlogPostsByCategory = (categorySlug: string) => {
  const posts = require("./blogs.json");
  return posts.filter((p: { categorySlug: string }) => p.categorySlug === categorySlug);
};

export const getArrivals = (categorySlug?: string) => {
  const posts = require("./blogs.json");
  return posts.filter((p: { isArrival: boolean; categorySlug: string }) =>
    p.isArrival && (categorySlug ? p.categorySlug === categorySlug : true)
  );
};

export const validateCoupon = (code: string, orderTotal: number) => {
  const coupons = require("./coupons.json");
  const coupon = coupons.find(
    (c: { code: string; isActive: boolean }) =>
      c.code === code && c.isActive
  );
  if (!coupon) return { valid: false, message: "Invalid coupon code." };
  if (orderTotal < coupon.minOrderAmount)
    return {
      valid: false,
      message: `Minimum order of $${coupon.minOrderAmount} required.`,
    };
  const now = new Date();
  if (new Date(coupon.expiresAt) < now)
    return { valid: false, message: "This coupon has expired." };
  return { valid: true, coupon };
};