import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trollfit.pk";

  // Static pages
  const staticPages = [
    "",
    "/shop",
    "/collections",
    "/about",
    "/contact",
    "/faq",
    "/size-guide",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  // Collection pages
  const collections = [
    "meme",
    "anime",
    "oversized",
    "trending",
    "limited",
  ].map((slug) => ({
    url: `${baseUrl}/collections/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Dynamic product pages from database
  let productsSitemap: MetadataRoute.Sitemap = [];
  try {
    const products = await db.product.findMany({
      select: { slug: true, updatedAt: true },
    });
    
    productsSitemap = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Error generating product sitemap:", error);
  }

  return [...staticPages, ...collections, ...productsSitemap];
}
