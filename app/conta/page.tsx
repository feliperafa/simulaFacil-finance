import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";

const title = "Sua área pessoal está a caminho";
const description =
  "Contas, histórico e simulações salvas serão disponibilizados na próxima etapa.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/conta" },
  openGraph: { title, description, url: "/conta" },
};

export default function Page() {
  return (
    <div className="container info-page">
      <span className="overline">SIMULAFÁCIL · CLAREZA EM CADA ESCOLHA</span>
      <h1>{title}</h1>
      <p className="lead">{description}</p>
      <div className="info-callout">
        <LockKeyhole size={30} />
        <div>
          <h2>Você já pode simular sem cadastro.</h2>
          <p>
            Login, recuperação de senha, histórico sincronizado e exclusão de
            conta fazem parte da Fase 2. Não coletamos credenciais nesta versão.
          </p>
          <Link className="button" href="/#simuladores">
            Fazer uma simulação <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
