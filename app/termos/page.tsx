import type { Metadata } from "next";

const title = "Termos de uso";
const description = "Condições de uso das ferramentas educativas SimulaFácil.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/termos" },
  openGraph: { title, description, url: "/termos" },
};

export default function Page() {
  return (
    <div className="container info-page">
      <span className="overline">SIMULAFÁCIL · CLAREZA EM CADA ESCOLHA</span>
      <h1>{title}</h1>
      <p className="lead">{description}</p>
      <article className="prose">
        <p>Versão inicial — 21/10/2026.</p>

        <h2>Finalidade educativa</h2>
        <p>
          As ferramentas apresentam estimativas baseadas nas hipóteses
          informadas. Os resultados não constituem proposta de crédito, garantia
          de rentabilidade, previsão de contemplação ou recomendação
          individualizada de investimento.
        </p>
        <h2>Uso dos resultados</h2>
        <p>
          Confirme os termos do contrato, índices, tarifas e datas com a
          instituição responsável antes de tomar uma decisão. O arredondamento
          exibido pode criar pequenas diferenças na soma visual das parcelas.
        </p>
        <h2>Serviços comerciais</h2>
        <p>
          Não há cobrança, assinatura ou compra de relatórios nesta versão.
          Recursos futuros dependerão de condições comerciais, política de
          privacidade e integrações configuradas e testadas.
        </p>
      </article>
    </div>
  );
}
