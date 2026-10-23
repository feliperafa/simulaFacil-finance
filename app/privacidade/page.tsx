import type { Metadata } from "next";

const title = "Política de privacidade";
const description =
  "Saiba como os dados são tratados nesta versão do SimulaFácil.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacidade" },
  openGraph: { title, description, url: "/privacidade" },
};

export default function Page() {
  return (
    <div className="container info-page">
      <span className="overline">SIMULAFÁCIL · CLAREZA EM CADA ESCOLHA</span>
      <h1>{title}</h1>
      <p className="lead">{description}</p>
      <article className="prose">
        <p>Versão inicial — 21/10/2026.</p>

        <h2>Dados das simulações</h2>
        <p>
          Os valores são calculados no navegador após o carregamento. Não há
          cadastro, envio de formulários financeiros a um banco de dados,
          armazenamento de histórico no servidor ou venda de dados nesta versão.
          Evite inserir informações que identifiquem outras pessoas.
        </p>
        <h2>Armazenamento local</h2>
        <p>
          O navegador armazena apenas o tema e sua preferência de privacidade
          nas chaves sf-theme e sf-consent. Você pode removê-las nas
          configurações do navegador ou alterar o consentimento pelo rodapé.
        </p>
        <h2>Hospedagem e seus direitos</h2>
        <p>
          O provedor de hospedagem pode processar dados técnicos necessários
          para entregar e proteger o site, como endereço IP e requisições. Não
          temos um painel de contas ou base de dados pessoais nesta fase. A
          identificação do controlador e o canal para exercício de direitos
          deverão ser publicados antes do lançamento público e da coleta de
          dados de contas.
        </p>
        <h2>Publicidade e integrações</h2>
        <p>
          Anúncios, analytics, checkout e serviços de IA estão desativados.
          Novos tratamentos de dados exigirão atualização desta política e
          mecanismos apropriados de consentimento quando aplicável.
        </p>
      </article>
    </div>
  );
}
