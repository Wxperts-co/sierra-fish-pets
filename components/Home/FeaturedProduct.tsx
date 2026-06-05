import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ProductCard from "@/components/shop/ProductCard";
import { allProducts } from "@/data/products";

const CATEGORY_SLUGS = ["dog", "cat", "aquatic", "reptile", "bird", "small-animal"];

export default function FeaturedProducts() {
  // Fetch the latest 2 products for each category, ordered so that all #1 latest are in row 1, and all #2 latest are in row 2
  const latestProductsByCategory = (() => {
    const row1 = CATEGORY_SLUGS.map((slug) => {
      const catProducts = allProducts.filter((p) => p.categorySlug === slug);
      const sorted = [...catProducts].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      return sorted[0];
    }).filter(Boolean);

    const row2 = CATEGORY_SLUGS.map((slug) => {
      const catProducts = allProducts.filter((p) => p.categorySlug === slug);
      const sorted = [...catProducts].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      return sorted[1];
    }).filter(Boolean);

    return [...row1, ...row2];
  })();

  if (!latestProductsByCategory.length) {
    return null;
  }

  return (
    <section className="py-16 bg-[#fafbfd]/50">
      <div className="container mx-auto px-4">

        {/* ── Section Header ── */}
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <div>
            {/* Eyebrow label */}
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#005AA9]">
              Freshly Stocked
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight font-lato text-[#002244]">
              New Arrivals by <span className="text-[#005AA9]">Category</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-gray-500">
              Explore the latest additions to our store, hand-picked for your pets' comfort and happiness.
            </p>
          </div>
        </div>

        {/* ── Products Grid (6 columns on desktop, responsive) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {latestProductsByCategory.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="border border-[#b8dfff]/40 shadow-[0_8px_30px_rgba(0,90,169,0.05)] hover:border-[#7fc4ff] hover:shadow-[0_16px_36px_rgba(0,90,169,0.12)] transition-all duration-300"
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/shop"
            className="flex items-center gap-2 rounded-full border-2 border-[#005AA9] px-6 py-3 text-sm font-bold text-[#005AA9] transition-all duration-200 hover:bg-[#005AA9] hover:text-white hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
