import Link from "next/link";

import ProductGrid from "@/components/shop/ProductGrid";

import { getFeaturedProducts } from "@/data/products";

import { Button } from "@/components/ui/button";

export default function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts().slice(0, 8);

  if (!featuredProducts.length) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row">

          <div>
            <h2 className="text-3xl font-bold">
              Featured Products
            </h2>

            <p className="mt-2 text-muted-foreground">
              Hand-picked products for your pets.
            </p>
          </div>

          <Button asChild variant="outline">
            <Link href="/shop">
              View All Products
            </Link>
          </Button>

        </div>

        {/* Products Grid */}
        <ProductGrid products={featuredProducts} />

      </div>
    </section>
  );
}