import { siteUrl } from "@/lib/site";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/conta", "/admin"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
