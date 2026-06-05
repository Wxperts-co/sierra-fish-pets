import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ProductGrid from "@/components/shop/ProductGrid";
import { getFeaturedProducts } from "@/data/products";

export default function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts().slice(0, 8);

  if (!featuredProducts.length) {
    return null;
  }

  return (
    <section className="py-12 bg-[#fafbfd]">
      <div className="container mx-auto px-4">

        {/* ── Section Header ── */}
        <div className="mb-12 flex flex-col items-center gap-4 text-center">

          <div>
            {/* Eyebrow label */}
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#8B6B61]">
              Curated for you
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight font-lato">
              <span className="text-[#FF5A36]">Featured</span>{" "}
              <span className="text-[#002244]">Products</span>
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Hand-picked essentials for your beloved pets.
            </p>
          </div>

        </div>

        {/* ── Products Grid ── */}
        <ProductGrid
          products={featuredProducts}
          cardClassName="border-1 border-[#b8dfff] shadow-[0_16px_38px_rgba(0,90,169,0.13)] ring-1 ring-[#005AA9]/10 hover:border-[#7fc4ff] hover:shadow-[0_22px_48px_rgba(0,90,169,0.2)]"
        />

        <div className="mt-10 flex justify-center">
          <Link
            href="/shop"
            className="flex items-center gap-2 rounded-full border border-[#005AA9] px-5 py-2.5 text-sm font-semibold text-[#005AA9] transition-all duration-200 hover:bg-[#005AA9] hover:text-white"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
