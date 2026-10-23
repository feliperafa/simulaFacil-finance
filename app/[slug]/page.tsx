import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Calculator from "@/components/calculator";
import { simulators } from "@/data/simulators";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sim = simulators.find((s) => s.slug === slug);
  return {
    title: sim ? `Simulador de ${sim.name}` : "Página não encontrada",
    description: sim?.description,
    alternates: { canonical: "/" + slug },
    openGraph: {
      title: sim?.name,
      description: sim?.description,
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
  notFound();
}
