import ProductCard from "./ProductCard";

import { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  cardClassName?: string;
}

export default function ProductGrid({
  products,
  cardClassName,
}: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-lg border">
        <p className="text-muted-foreground">
          No products found.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          className={cardClassName}
        />
      ))}
    </div>
  );
}
