import type { Metadata } from "next";

const title = "Cookies e preferências";
const description =
  "Entenda as preferências locais e o estado dos anúncios e rastreamento.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/cookies" },
  openGraph: { title, description, url: "/cookies" },
};

export default function Page() {
  return (
    <div className="container info-page">
      <span className="overline">SIMULAFÁCIL · CLAREZA EM CADA ESCOLHA</span>
      <h1>{title}</h1>
      <p className="lead">{description}</p>
      <article className="prose">
        <p>Versão inicial — 21/10/2026.</p>

        <h2>Preferências essenciais</h2>
        <p>
          Utilizamos localStorage para lembrar o tema e a escolha de
          privacidade. Não são carregados cookies de anúncios, Google AdSense ou
          analytics nesta versão. Nenhum identificador publicitário é criado.
        </p>
        <h2>Controle no navegador</h2>
        <p>
          Use “Preferências de cookies” no rodapé para reabrir o aviso. Para
          remover as preferências, limpe os dados locais do site nas
          configurações do navegador.
        </p>
      </article>
    </div>
  );
}
