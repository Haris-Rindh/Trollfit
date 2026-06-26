import { ProductCard } from "@/components/shared/ProductCard";
import { type Product } from "@/types";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-xl font-bold">No drops found</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          We couldn't find any products matching your current filters. Try removing some filters to see more drops.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
