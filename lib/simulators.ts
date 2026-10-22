import type { Kind, Values } from "./finance";
export type Field = {
  key: string;
  label: string;
  value: string;
  options?: [string, string][];
  type?: "date";
  hint?: string;
  when?: [string, string];
};
export type Simulator = {
  kind: Kind;
  slug: string;
  name: string;
  short: string;
  description: string;
  benefit: string;
  color: string;
  icon: string;
  fields: Field[];
  faqs: [string, string][];
};
const f = (
  key: string,
  label: string,
  value: string,
  hint?: string,
): Field => ({ key, label, value, hint });
const s = (
  key: string,
  label: string,
  value: string,
  options: [string, string][],
): Field => ({ key, label, value, options });
const term = [
  f("prazo", "Prazo", "360"),
  s("unidadePrazo", "Unidade do prazo", "meses", [
    ["meses", "Meses"],
    ["anos", "Anos"],
  ]),
];
const rate = [
  f("taxa", "Taxa de juros efetiva (%)", "10"),
  s("unidadeTaxa", "Período da taxa", "anual", [
    ["anual", "Ao ano (efetiva)"],
    ["mensal", "Ao mês (efetiva)"],
  ]),
];
const system = s("sistema", "Sistema de amortização", "SAC", [
  ["SAC", "SAC — amortização constante"],
  ["Price", "Price — parcela constante"],
]);
const date = (key: string, label: string): Field => ({
  key,
  label,
  value: "2026-10-21",
  type: "date",
});
export const simulators: Simulator[] = [
  {
    kind: "imobiliario",
    slug: "simulador-financiamento-imobiliario",
    name: "Financiamento Imobiliário",
    short: "Sua casa, no seu planejamento.",
    description:
      "Descubra o valor das parcelas e compare SAC e Price antes de dar o próximo passo.",
    benefit: "Encontre o melhor cenário para seu imóvel",
    color: "blue",
    icon: "home",
    fields: [
      f("valor", "Valor do imóvel (R$)", "500.000"),
      f("entrada", "Entrada", "100.000"),
      s("unidadeEntrada", "Formato da entrada", "reais", [
        ["reais", "Reais (R$)"],
        ["percentual", "Percentual (%)"],
      ]),
      ...term,
      ...rate,
      system,
      s("indexador", "Regra de correção do saldo", "nenhum", [
        ["nenhum", "Sem indexador"],
        ["fixo", "Correção fixa mensal informada"],
      ]),
      {
        ...f("correcao", "Correção mensal hipotética (%)", "0"),
        when: ["indexador", "fixo"],
      },
      f("seguro", "Seguros mensais (R$)", "0"),
      f("tarifas", "Tarifas à vista (R$)", "0"),
      f("custos", "Custos adicionais à vista (R$)", "0"),
      f(
        "renda",
        "Renda familiar mensal (R$)",
        "12.000",
        "Informe 0 para não calcular comprometimento.",
      ),
    ],
    faqs: [
      [
        "Qual a diferença entre SAC e Price?",
        "No SAC, a amortização do principal é constante quando não há correção. Na Price, a prestação de principal e juros é constante sob taxa fixa. Os custos totais podem ser diferentes.",
      ],
      [
        "O resultado é uma proposta de banco?",
        "Não. É uma estimativa educativa baseada exclusivamente nos dados informados. Seguros, indexadores, tarifas e datas contratuais podem alterar o resultado.",
      ],
    ],
  },
  {
    kind: "amortizacao",
    slug: "simulador-amortizacao",
    name: "Amortização de Financiamento",
    short: "Menos juros. Mais possibilidades.",
    description:
      "Veja o impacto de antecipar pagamentos e escolha entre reduzir o prazo ou a prestação.",
    benefit: "Descubra quanto você pode economizar",
    color: "green",
    icon: "chart",
    fields: [
      f("saldo", "Saldo devedor atual (R$)", "300.000"),
      ...term,
      ...rate,
      system,
      f("prestacao", "Prestação atual, se conhecida (R$)", "0"),
      f("extra", "Amortização extraordinária (R$)", "20.000"),
      date("dataSaldo", "Data do saldo informado"),
      date("dataExtra", "Data prevista da amortização"),
      s("periodicidade", "Periodicidade", "unica", [
        ["unica", "Única"],
        ["mensal", "Mensal"],
        ["anual", "Anual"],
      ]),
      s("estrategia", "Objetivo", "prazo", [
        ["prazo", "Reduzir prazo"],
        ["prestacao", "Reduzir prestação"],
      ]),
    ],
    faqs: [
      [
        "É melhor reduzir prazo ou prestação?",
        "Depende do objetivo. Reduzir prazo costuma evitar mais juros no modelo de taxa fixa. Reduzir prestação pode aliviar o orçamento mensal. Compare os cenários e confirme as regras do seu contrato.",
      ],
      [
        "Posso simular aportes recorrentes?",
        "Sim. Escolha amortização única, mensal ou anual. As contribuições são limitadas ao saldo devedor, sem gerar saldo negativo.",
      ],
    ],
  },
  {
    kind: "consorcio",
    slug: "simulador-consorcio",
    name: "Consórcio Inteligente",
    short: "Entenda cada parte da sua carta.",
    description:
      "Avalie parcelas, taxas e lances com uma visão clara do crédito que chega até você.",
    benefit: "Conheça o custo além da parcela",
    color: "purple",
    icon: "users",
    fields: [
      f("carta", "Carta de crédito (R$)", "300.000"),
      ...term.map((x) => (x.key === "prazo" ? { ...x, value: "180" } : x)),
      f("administracao", "Administração total do plano (%)", "20"),
      f("reserva", "Fundo de reserva total (%)", "2"),
      f("seguro", "Seguro mensal (R$)", "0"),
      f("prestacao", "Parcela atual, se conhecida (R$)", "0"),
      f("lanceProprio", "Lance próprio", "30.000"),
      s("unidadeLanceProprio", "Formato do lance próprio", "reais", [
        ["reais", "Reais (R$)"],
        ["percentual", "Percentual da carta (%)"],
      ]),
      f("lanceEmbutido", "Lance embutido", "30.000"),
      s("unidadeLanceEmbutido", "Formato do lance embutido", "reais", [
        ["reais", "Reais (R$)"],
        ["percentual", "Percentual da carta (%)"],
      ]),
      f("reajuste", "Reajuste anual hipotético da carta (%)", "0"),
      f(
        "taxaComparacao",
        "Financiamento comparado: taxa anual efetiva (%)",
        "10",
      ),
    ],
    faqs: [
      [
        "O simulador prevê a contemplação?",
        "Não. Os resultados são condicionais à aceitação do lance no início. A contemplação depende das regras do grupo e das assembleias.",
      ],
      [
        "Como funciona o lance embutido?",
        "Ele utiliza parte da própria carta para amortizar o saldo, reduzindo o crédito disponível para a compra. A administradora define as condições aplicáveis.",
      ],
    ],
  },
  {
    kind: "veiculo",
    slug: "simulador-financiamento-veiculo",
    name: "Financiamento de Veículos",
    short: "O próximo carro começa na conta.",
    description:
      "Calcule parcelas, compare propostas e entenda o custo total do seu veículo.",
    benefit: "Compare antes de fechar negócio",
    color: "orange",
    icon: "car",
    fields: [
      f("valor", "Valor do veículo (R$)", "80.000"),
      f("entrada", "Entrada (R$)", "20.000"),
      ...term.map((x) => (x.key === "prazo" ? { ...x, value: "48" } : x)),
      ...rate.map((x) => (x.key === "taxa" ? { ...x, value: "22" } : x)),
      { ...system, value: "Price" },
      f("tarifas", "Tarifas à vista (R$)", "0"),
      f("custos", "Custos adicionais à vista (R$)", "0"),
      f("seguro", "Seguro mensal (R$)", "0"),
      f("antecipacao", "Antecipação no primeiro mês (R$)", "5.000"),
    ],
    faqs: [
      [
        "Como comparar duas propostas?",
        "Calcule a primeira proposta e use “Comparar outro cenário”. Altere a taxa, prazo ou encargos e compare os totais calculados.",
      ],
      [
        "A parcela inclui todos os custos?",
        "Inclui o principal, juros e seguro mensal informado. Tarifas e custos adicionais são tratados à vista. Custos não informados não são presumidos.",
      ],
    ],
  },
  {
    kind: "quitacao",
    slug: "simulador-quitacao-antecipada",
    name: "Quitação Antecipada de Dívidas",
    short: "Um novo começo para seu dinheiro.",
    description:
      "Estime o valor para quitar sua dívida e os juros futuros que você pode evitar.",
    benefit: "Visualize o impacto de sair da dívida",
    color: "red",
    icon: "wallet",
    fields: [
      s("tipo", "Tipo de dívida", "pessoal", [
        ["imovel", "Financiamento imobiliário"],
        ["veiculo", "Financiamento de veículo"],
        ["pessoal", "Empréstimo pessoal"],
        ["parcelado", "Crédito parcelado"],
      ]),
      f("saldo", "Saldo devedor atual (R$)", "25.000"),
      ...term.map((x) => (x.key === "prazo" ? { ...x, value: "24" } : x)),
      ...rate.map((x) => (x.key === "taxa" ? { ...x, value: "18" } : x)),
      { ...system, value: "Price" },
      date("dataSaldo", "Data de referência do saldo"),
      date("dataQuitacao", "Data prevista de quitação"),
      f("encargos", "Encargos adicionais na quitação (R$)", "0"),
    ],
    faqs: [
      [
        "Por que não somar as parcelas restantes?",
        "As parcelas incluem juros futuros. O saldo para quitação parte do principal ainda devido, atualizado até a data e acrescido apenas dos encargos aplicáveis.",
      ],
      [
        "Onde consigo o valor oficial?",
        "Solicite à instituição financeira o demonstrativo de quitação na data desejada. O resultado aqui é uma estimativa sem acesso ao contrato.",
      ],
    ],
  },
  {
    kind: "investimentos",
    slug: "simulador-juros-compostos",
    name: "Juros Compostos e Investimentos",
    short: "Pequenos passos, novos futuros.",
    description:
      "Acompanhe o efeito do tempo e dos aportes na construção do seu patrimônio.",
    benefit: "Dê forma aos seus objetivos",
    color: "teal",
    icon: "sprout",
    fields: [
      f("inicial", "Valor inicial (R$)", "10.000"),
      f("aporte", "Aporte mensal (R$)", "500"),
      ...rate,
      ...term.map((x) => (x.key === "prazo" ? { ...x, value: "120" } : x)),
      f("inflacao", "Inflação anual estimada (%)", "4"),
      f("tributacao", "Alíquota sobre rendimentos ao final (%)", "15"),
      f("taxaComparacao", "Taxa alternativa, no mesmo período (%)", "8"),
    ],
    faqs: [
      [
        "Os aportes rendem desde o início do mês?",
        "Não. Neste modelo, os aportes entram ao final de cada mês. O saldo anterior rende à taxa mensal equivalente.",
      ],
      [
        "O resultado considera impostos e inflação?",
        "Sim, conforme as hipóteses informadas. A tributação usa uma alíquota única sobre o ganho ao final, e a inflação ajusta o poder de compra. Não representa regras tributárias de um investimento específico.",
      ],
    ],
  },
];
export const defaults = (sim: Simulator): Values =>
  Object.fromEntries(sim.fields.map((x) => [x.key, x.value]));
export const additional = [
  "Salário líquido",
  "Férias e 13º salário",
  "FGTS",
  "Reserva de emergência",
  "Aluguel versus compra",
  "Aposentadoria",
  "Empréstimo pessoal",
  "Portabilidade de crédito",
  "Taxa efetiva de juros",
  "Inflação e poder de compra",
  "Financiamento de energia solar",
  "Planejamento de metas financeiras",
];
