import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { articles } from "@/data/articles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ article: string }>;
}): Promise<Metadata> {
  const { article } = await params;
  const articleData = Object.hasOwn(articles, article)
    ? articles[article]
    : undefined;
  return {
    title: articleData?.title,
    description: articleData?.intro,
    alternates: { canonical: "/conteudos/" + article },
    openGraph: {
      type: "article",
      title: articleData?.title,
      description: articleData?.intro,
    },
  };
}
export default async function Article({
  params,
}: {
  params: Promise<{ article: string }>;
}) {
  const { article } = await params;
  const articleData = Object.hasOwn(articles, article)
    ? articles[article]
    : undefined;
  if (!articleData) notFound();
  return (
    <article className="container info-page article-page">
      <Link href="/conteudos" className="breadcrumb">
        ← Todos os conteúdos
      </Link>
      <span className="overline">EDUCAÇÃO FINANCEIRA</span>
      <h1>{articleData.title}</h1>
      <p className="lead">{articleData.intro}</p>
      <div className="prose">
        {articleData.sections.map(([title, text]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
        <p>
          Referência conceitual:{" "}
          <a href="https://www.bcb.gov.br/meubc/faqs/p/qual-o-objetivo-do-calculo-do-financiamento-com-prestacoes-fixas">
            Calculadora do Cidadão — Banco Central do Brasil
          </a>
          . Conteúdo educativo, sem recomendação individualizada.
        </p>
      </div>
      <Link href={"/" + articleData.link} className="button">
        Explorar o simulador →
      </Link>
    </article>
  );
}
