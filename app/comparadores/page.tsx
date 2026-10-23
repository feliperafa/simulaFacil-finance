import type { Metadata } from "next";
import { Layers } from "lucide-react";
import { SimulatorCards } from "@/components/simulator-cards";

const title = "Compare cenários financeiros";
const description =
  "Compare sistemas de amortização, propostas e taxas com premissas explícitas.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/comparadores" },
  openGraph: { title, description, url: "/comparadores" },
};

export default function Page() {
  return (
    <div className="container info-page">
      <span className="overline">SIMULAFÁCIL · CLAREZA EM CADA ESCOLHA</span>
      <h1>{title}</h1>
      <p className="lead">{description}</p>

      <div className="info-callout">
        <Layers />
        <div>
          <h2>Altere uma hipótese. Veja a diferença.</h2>
          <p>
            Em cada simulador, calcule seu cenário e clique em “Comparar outro
            cenário”. O resultado atual será fixado para você comparar com novos
            valores. A comparação permanece apenas enquanto a página estiver
            aberta.
          </p>
        </div>
      </div>
      <SimulatorCards />
    </div>
  );
}
