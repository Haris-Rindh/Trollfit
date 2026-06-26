import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
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

  // TODO: Add dynamic product pages from database
  // const products = await db.product.findMany({ select: { slug: true, updatedAt: true } });

  return [...staticPages, ...collections];
}
