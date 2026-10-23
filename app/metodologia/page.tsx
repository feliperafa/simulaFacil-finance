import type { Metadata } from "next";

const title = "Cada número tem uma explicação";
const description =
  "Conheça as fórmulas e premissas do motor financeiro do SimulaFácil.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/metodologia" },
  openGraph: { title, description, url: "/metodologia" },
};

export default function Page() {
  return (
    <div className="container info-page">
      <span className="overline">SIMULAFÁCIL · CLAREZA EM CADA ESCOLHA</span>
      <h1>{title}</h1>
      <p className="lead">{description}</p>
      <article className="prose">
        <h2>Motor determinístico e independente</h2>
        <p>
          Todos os resultados são calculados por funções TypeScript separadas da
          interface. As análises usam regras e valores calculados, sem um modelo
          de IA criando números. Os cálculos usam precisão completa, com
          arredondamento apenas na exibição.
        </p>
        <h2>Taxas efetivas</h2>
        <p>
          Conversão anual para mensal: iₘ = (1 + iₐ)^(1/12) − 1. As taxas
          informadas são percentuais efetivos, e não taxas nominais divididas
          por 12.
        </p>
        <h2>SAC e Price</h2>
        <p>
          No SAC sem correção, A = principal / meses. Em cada mês, juros = saldo
          anterior × taxa mensal. Na Price, P = principal × i / [1 − (1+i)^−n].
          Para juros zero, P = principal / meses.
        </p>
        <p>
          Referência para prestações fixas:{" "}
          <a href="https://www3.bcb.gov.br/CALCIDADAO/publico/exibirMetodologiaFinanciamentoPrestacoesFixas.do?method=exibirMetodologiaFinanciamentoPrestacoesFixas">
            metodologia da Calculadora do Cidadão, Banco Central do Brasil
          </a>
          .
        </p>
        <h2>Amortização e quitação</h2>
        <p>
          Amortizações extras reduzem o saldo antes dos juros do mês. Na
          quitação, atualizamos o saldo pela taxa composta proporcional aos
          dias, com mês de 30 dias, e adicionamos os encargos declarados. O
          contrato pode exigir outro critério.
        </p>
        <h2>Custos equivalentes</h2>
        <p>
          Calculamos uma taxa interna de retorno a partir do valor líquido
          disponibilizado e das prestações mensais. O resultado é um custo anual
          equivalente estimado. O CET oficial depende das datas e de todos os
          custos do contrato e deve ser confirmado com a instituição.
        </p>
        <h2>Consórcio e investimentos</h2>
        <p>
          O consórcio usa taxas totais do plano e uma hipótese anual explícita
          de reajuste. O lance é condicional à aceitação. Investimentos
          consideram aportes ao final do mês, taxa constante, tributação única
          sobre o ganho final e desconto pela inflação informada. Todas as
          premissas estão junto aos resultados.
        </p>
        <h2>Limitações</h2>
        <p>
          Não consultamos ofertas bancárias, índices ao vivo, histórico de
          assembleias ou regras tributárias de produtos específicos. Tarifas e
          índices não informados não são inventados.
        </p>
      </article>
    </div>
  );
}
