import { notFound } from "next/navigation";
import { DEMO_PRODUCTS } from "@/lib/demo-data";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = DEMO_PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Product Gallery */}
        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]">
          <ProductGallery images={product.images} title={product.name} />
        </div>

        {/* Product Info & Actions */}
        <div className="flex flex-col">
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
}
