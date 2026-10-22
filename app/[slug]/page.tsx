import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Calculator from "@/components/calculator";
import { simulators } from "@/lib/simulators";
import { InfoPage, infoPages } from "@/components/info-pages";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sim = simulators.find((s) => s.slug === slug);
  const page = Object.hasOwn(infoPages, slug) ? infoPages[slug] : undefined;
  return {
    title: sim
      ? `Simulador de ${sim.name}`
      : (page?.title ?? "Página não encontrada"),
    description: sim?.description ?? page?.description,
    alternates: { canonical: "/" + slug },
    openGraph: {
      title: sim?.name ?? page?.title,
      description: sim?.description ?? page?.description,
      url: "/" + slug,
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sim = simulators.find((s) => s.slug === slug);
  if (sim)
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: `Simulador de ${sim.name}`,
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              inLanguage: "pt-BR",
              offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: sim.faqs.map(([q, a]) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: { "@type": "Answer", text: a },
              })),
            }),
          }}
        />
        <Calculator key={sim.kind} sim={sim} />
      </>
    );
  if (Object.hasOwn(infoPages, slug)) return <InfoPage slug={slug} />;
  notFound();
}
