import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trollfit.pk";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/studio/", "/checkout/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
