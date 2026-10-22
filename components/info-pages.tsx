import Link from "next/link";
import { ArrowRight, Check, Layers, BookOpen, LockKeyhole } from "lucide-react";
import { SimulatorCards } from "./home";
export const infoPages: Record<string, { title: string; description: string }> =
  {
    comparadores: {
      title: "Compare cenários financeiros",
      description:
        "Compare sistemas de amortização, propostas e taxas com premissas explícitas.",
    },
    conteudos: {
      title: "Conhecimento também rende",
      description:
        "Educação financeira para entender juros, financiamentos e planejamento.",
    },
    planos: {
      title: "Um plano para cada próximo passo",
      description:
        "Conheça o acesso gratuito e os recursos planejados para as próximas fases.",
    },
    conta: {
      title: "Sua área pessoal está a caminho",
      description:
        "Contas, histórico e simulações salvas serão disponibilizados na próxima etapa.",
    },
    metodologia: {
      title: "Cada número tem uma explicação",
      description:
        "Conheça as fórmulas e premissas do motor financeiro do SimulaFácil.",
    },
    privacidade: {
      title: "Política de privacidade",
      description:
        "Saiba como os dados são tratados nesta versão do SimulaFácil.",
    },
    termos: {
      title: "Termos de uso",
      description: "Condições de uso das ferramentas educativas SimulaFácil.",
    },
    cookies: {
      title: "Cookies e preferências",
      description:
        "Entenda as preferências locais e o estado dos anúncios e rastreamento.",
    },
  };
export function InfoPage({ slug }: { slug: string }) {
  const page = infoPages[slug];
  return (
    <div className="container info-page">
      <span className="overline">SIMULAFÁCIL · CLAREZA EM CADA ESCOLHA</span>
      <h1>{page.title}</h1>
      <p className="lead">{page.description}</p>
      {slug === "comparadores" ? (
        <>
          <div className="info-callout">
            <Layers />
            <div>
              <h2>Altere uma hipótese. Veja a diferença.</h2>
              <p>
                Em cada simulador, calcule seu cenário e clique em “Comparar
                outro cenário”. O resultado atual será fixado para você comparar
                com novos valores. A comparação permanece apenas enquanto a
                página estiver aberta.
              </p>
            </div>
          </div>
          <SimulatorCards />
        </>
      ) : slug === "conteudos" ? (
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
      ) : slug === "planos" ? (
        <>
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
            Nenhuma assinatura ou cobrança está ativa. Preços, limites e
            condições serão definidos antes do lançamento comercial.
          </p>
        </>
      ) : slug === "conta" ? (
        <div className="info-callout">
          <LockKeyhole size={30} />
          <div>
            <h2>Você já pode simular sem cadastro.</h2>
            <p>
              Login, recuperação de senha, histórico sincronizado e exclusão de
              conta fazem parte da Fase 2. Não coletamos credenciais nesta
              versão.
            </p>
            <Link className="button" href="/#simuladores">
              Fazer uma simulação <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ) : slug === "metodologia" ? (
        <article className="prose">
          <h2>Motor determinístico e independente</h2>
          <p>
            Todos os resultados são calculados por funções TypeScript separadas
            da interface. As análises usam regras e valores calculados, sem um
            modelo de IA criando números. Os cálculos usam precisão completa,
            com arredondamento apenas na exibição.
          </p>
          <h2>Taxas efetivas</h2>
          <p>
            Conversão anual para mensal: iₘ = (1 + iₐ)^(1/12) − 1. As taxas
            informadas são percentuais efetivos, e não taxas nominais divididas
            por 12.
          </p>
          <h2>SAC e Price</h2>
          <p>
            No SAC sem correção, A = principal / meses. Em cada mês, juros =
            saldo anterior × taxa mensal. Na Price, P = principal × i / [1 −
            (1+i)^−n]. Para juros zero, P = principal / meses.
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
            disponibilizado e das prestações mensais. O resultado é um custo
            anual equivalente estimado. O CET oficial depende das datas e de
            todos os custos do contrato e deve ser confirmado com a instituição.
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
      ) : (
        <article className="prose">
          <p>Versão inicial — 21/10/2026.</p>
          {slug === "privacidade" ? (
            <>
              <h2>Dados das simulações</h2>
              <p>
                Os valores são calculados no navegador após o carregamento. Não
                há cadastro, envio de formulários financeiros a um banco de
                dados, armazenamento de histórico no servidor ou venda de dados
                nesta versão. Evite inserir informações que identifiquem outras
                pessoas.
              </p>
              <h2>Armazenamento local</h2>
              <p>
                O navegador armazena apenas o tema e sua preferência de
                privacidade nas chaves sf-theme e sf-consent. Você pode
                removê-las nas configurações do navegador ou alterar o
                consentimento pelo rodapé.
              </p>
              <h2>Hospedagem e seus direitos</h2>
              <p>
                O provedor de hospedagem pode processar dados técnicos
                necessários para entregar e proteger o site, como endereço IP e
                requisições. Não temos um painel de contas ou base de dados
                pessoais nesta fase. A identificação do controlador e o canal
                para exercício de direitos deverão ser publicados antes do
                lançamento público e da coleta de dados de contas.
              </p>
              <h2>Publicidade e integrações</h2>
              <p>
                Anúncios, analytics, checkout e serviços de IA estão
                desativados. Novos tratamentos de dados exigirão atualização
                desta política e mecanismos apropriados de consentimento quando
                aplicável.
              </p>
            </>
          ) : slug === "cookies" ? (
            <>
              <h2>Preferências essenciais</h2>
              <p>
                Utilizamos localStorage para lembrar o tema e a escolha de
                privacidade. Não são carregados cookies de anúncios, Google
                AdSense ou analytics nesta versão. Nenhum identificador
                publicitário é criado.
              </p>
              <h2>Controle no navegador</h2>
              <p>
                Use “Preferências de cookies” no rodapé para reabrir o aviso.
                Para remover as preferências, limpe os dados locais do site nas
                configurações do navegador.
              </p>
            </>
          ) : (
            <>
              <h2>Finalidade educativa</h2>
              <p>
                As ferramentas apresentam estimativas baseadas nas hipóteses
                informadas. Os resultados não constituem proposta de crédito,
                garantia de rentabilidade, previsão de contemplação ou
                recomendação individualizada de investimento.
              </p>
              <h2>Uso dos resultados</h2>
              <p>
                Confirme os termos do contrato, índices, tarifas e datas com a
                instituição responsável antes de tomar uma decisão. O
                arredondamento exibido pode criar pequenas diferenças na soma
                visual das parcelas.
              </p>
              <h2>Serviços comerciais</h2>
              <p>
                Não há cobrança, assinatura ou compra de relatórios nesta
                versão. Recursos futuros dependerão de condições comerciais,
                política de privacidade e integrações configuradas e testadas.
              </p>
            </>
          )}
        </article>
      )}
    </div>
  );
}
