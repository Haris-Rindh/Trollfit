import { notFound } from "next/navigation";
import { DEMO_PRODUCTS } from "@/lib/demo-data";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { db } from "@/lib/db";
import { type Product } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Helper to race a promise against a timeout to prevent slow DB connections from freezing page loads
async function runWithTimeout<T>(promise: Promise<T>, ms = 800): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Database timeout")), ms);
  });
  
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

// Generate static routes for the dynamic product pages
export async function generateStaticParams() {
  return DEMO_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

// SEO Metadata Generator
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  let product: Product | null | undefined = null;

  try {
    const dbProduct = await runWithTimeout(
      db.product.findUnique({
        where: { slug },
      }),
      800
    );
    if (dbProduct) {
      product = {
        ...dbProduct,
        price: Number(dbProduct.price),
        salePrice: dbProduct.salePrice ? Number(dbProduct.salePrice) : undefined,
      } as any;
    }
  } catch (error) {
    console.warn("Metadata DB fetch failed or timed out, using demo fallback");
  }

  if (!product) {
    product = DEMO_PRODUCTS.find((p) => p.slug === slug);
  }

  if (!product) {
    return {
      title: "Product Not Found | TrollFit",
      description: "The requested apparel collection could not be found.",
    };
  }

  return {
    title: `${product.name} | TrollFit Premium Drops`,
    description: product.description || `Get your hands on the premium ${product.name} from TrollFit. Limited stock available.`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  let product: Product | null | undefined = null;

  try {
    const dbProduct = await runWithTimeout(
      db.product.findUnique({
        where: { slug },
      }),
      800
    );
    if (dbProduct) {
      product = {
        ...dbProduct,
        price: Number(dbProduct.price),
        salePrice: dbProduct.salePrice ? Number(dbProduct.salePrice) : undefined,
      } as any;
    }
  } catch (error) {
    console.warn("Product Detail DB fetch failed or timed out, using demo fallback");
  }

  // 2. Fall back to static mock data
  if (!product) {
    product = DEMO_PRODUCTS.find((p) => p.slug === slug);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Product Gallery */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
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
