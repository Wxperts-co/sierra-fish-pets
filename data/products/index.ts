import dogProducts from "./dog.json";
import catProducts from "./cat.json";
import aquaticProducts from "./aquatic.json";
import reptileProducts from "./reptile.json";
import birdProducts from "./bird.json";
import smallAnimalProducts from "./small-animal.json";
import type { Product } from "../../types";

export { dogProducts, catProducts, aquaticProducts, reptileProducts, birdProducts, smallAnimalProducts };

export const allProducts: Product[] = [
  ...dogProducts,
  ...catProducts,
  ...aquaticProducts,
  ...reptileProducts,
  ...birdProducts,
  ...smallAnimalProducts,
] as Product[];

export const getFeaturedProducts = (): Product[] =>
  allProducts.filter((p) => p.isFeatured);

export const getBestSellers = (): Product[] =>
  allProducts.filter((p) => p.isBestSeller);

export const getNewArrivals = (): Product[] =>
  allProducts.filter((p) => p.isNewArrival);

export const getProductBySlug = (slug: string): Product | undefined =>
  allProducts.find((p) => p.slug === slug);

export const getProductById = (id: string): Product | undefined =>
  allProducts.find((p) => p.id === id);

export const getProductsByCategory = (categorySlug: string): Product[] =>
  allProducts.filter((p) => p.categorySlug === categorySlug);

export const getProductsByBrand = (brand: string): Product[] =>
  allProducts.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());