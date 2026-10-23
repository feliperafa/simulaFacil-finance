import { simulators } from "@/data/simulators";
import { articles } from "@/data/articles";
import { siteUrl } from "@/lib/site";

export default function sitemap() {
  return [
    "/",
    ...simulators.map((x) => "/" + x.slug),
    "/comparadores",
    "/conteudos",
    ...Object.keys(articles).map((slug) => `/conteudos/${slug}`),
    "/planos",
    "/metodologia",
    "/privacidade",
    "/termos",
    "/cookies",
  ].map((path) => ({
    url: siteUrl + path,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : path.startsWith("/simulador") ? 0.9 : 0.5,
  }));
}
