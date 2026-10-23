import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

const title = "Um plano para cada próximo passo";
const description =
  "Conheça o acesso gratuito e os recursos planejados para as próximas fases.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/planos" },
  openGraph: { title, description, url: "/planos" },
};

export default function Page() {
  return (
    <div className="container info-page">
      <span className="overline">SIMULAFÁCIL · CLAREZA EM CADA ESCOLHA</span>
      <h1>{title}</h1>
      <p className="lead">{description}</p>

      <div className="plans-grid">
        {[
          {
            name: "Gratuito",
            tag: "DISPONÍVEL AGORA",
            price: "R$ 0",
            features: [
              "Seis simuladores sem cadastro",
              "Resultados, tabelas e gráficos",
              "Comparação de cenários na página",
              "Exportação CSV gratuita",
            ],
            active: true,
          },
          {
            name: "Premium",
            tag: "EM DESENVOLVIMENTO",
            price: "A definir",
            features: [
              "Simulações salvas e histórico",
              "Relatórios PDF completos",
              "Comparações avançadas",
              "Sem publicidade interna",
            ],
            active: false,
          },
          {
            name: "Premium Plus",
            tag: "EM PLANEJAMENTO",
            price: "A definir",
            features: [
              "Todos os recursos Premium",
              "Múltiplos cenários salvos",
              "Planejamento avançado de amortização",
              "Relatórios mais detalhados",
            ],
            active: false,
          },
        ].map((p) => (
          <div
            className={"plan panel " + (p.active ? "current-plan" : "")}
            key={p.name}
          >
            <span className="overline">{p.tag}</span>
            <h2>{p.name}</h2>
            <strong>{p.price}</strong>
            <ul>
              {p.features.map((x) => (
                <li key={x}>
                  <Check size={16} />
                  {x}
                </li>
              ))}
            </ul>
            {p.active ? (
              <Link href="/#simuladores" className="button">
                Começar gratuitamente
              </Link>
            ) : (
              <span className="unavailable">
                Disponível em uma próxima fase
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="field-note">
        Nenhuma assinatura ou cobrança está ativa. Preços, limites e condições
        serão definidos antes do lançamento comercial.
      </p>
    </div>
  );
}
