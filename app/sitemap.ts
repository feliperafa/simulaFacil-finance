import { simulators } from "@/lib/simulators";
export default function sitemap() {
  const base = "https://simulafacil-felipe.spryhen2048.chatgpt.site";
  return [
    "/",
    ...simulators.map((x) => "/" + x.slug),
    "/comparadores",
    "/conteudos",
    "/conteudos/sac-ou-price",
    "/conteudos/juros-compostos",
    "/planos",
    "/metodologia",
    "/privacidade",
    "/termos",
    "/cookies",
  ].map((path) => ({
    url: base + path,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : path.startsWith("/simulador") ? 0.9 : 0.5,
  }));
}
