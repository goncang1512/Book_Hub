import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/profil/dasboard", "/profil/author"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_API_URL}/sitemap.xml`,
  };
}
