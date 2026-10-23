import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

const title = "Conhecimento também rende";
const description =
  "Educação financeira para entender juros, financiamentos e planejamento.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/conteudos" },
  openGraph: { title, description, url: "/conteudos" },
};

export default function Page() {
  return (
    <div className="container info-page">
      <span className="overline">SIMULAFÁCIL · CLAREZA EM CADA ESCOLHA</span>
      <h1>{title}</h1>
      <p className="lead">{description}</p>
      <div className="content-links">
        <Link href="/conteudos/sac-ou-price">
          <BookOpen />
          <h2>SAC ou Price?</h2>
          <p>Amortização, parcelas e custo total: entenda as diferenças.</p>
          <span className="text-link">
            Ler conteúdo <ArrowRight size={16} />
          </span>
        </Link>
        <Link href="/conteudos/juros-compostos">
          <BookOpen />
          <h2>O efeito dos juros compostos</h2>
          <p>Tempo, aportes e inflação no planejamento financeiro.</p>
          <span className="text-link">
            Ler conteúdo <ArrowRight size={16} />
          </span>
        </Link>
      </div>
    </div>
  );
}
