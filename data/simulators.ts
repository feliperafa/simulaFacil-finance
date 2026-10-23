import type { Kind, Values } from "../lib/finance";
export type Field = {
  key: string;
  label: string;
  value: string;
  options?: [string, string][];
  type?: "date";
  format?: "currency";
  currencyUnit?: string;
  currencyBase?: string;
  hint?: string;
  when?: [string, string];
};
export type Simulator = {
  kind: Kind;
  slug: string;
  name: string;
  description: string;
  benefit: string;
  color: string;
  icon: "home" | "chart" | "users" | "car" | "wallet" | "sprout";
  fields: Field[];
  faqs: [string, string][];
};
const numberField = (
  key: string,
  label: string,
  value: string,
  hint?: string,
): Field => ({ key, label, value, hint });
const currencyField = (
  key: string,
  label: string,
  value: string,
  hint?: string,
): Field => ({ key, label, value, hint, format: "currency" });
const selectField = (
  key: string,
  label: string,
  value: string,
  options: [string, string][],
): Field => ({ key, label, value, options });
const termFields = (months = "360"): Field[] => [
  numberField("prazo", "Prazo", months),
  selectField("unidadePrazo", "Unidade do prazo", "meses", [
    ["meses", "Meses"],
    ["anos", "Anos"],
  ]),
];
const rateFields = (annualRate = "10"): Field[] => [
  numberField("taxa", "Taxa de juros efetiva (%)", annualRate),
  selectField("unidadeTaxa", "Período da taxa", "anual", [
    ["anual", "Ao ano (efetiva)"],
    ["mensal", "Ao mês (efetiva)"],
  ]),
];
const amortizationSystemField = selectField(
  "sistema",
  "Sistema de amortização",
  "SAC",
  [
    ["SAC", "SAC — amortização constante"],
    ["Price", "Price — parcela constante"],
  ],
);
const dateField = (key: string, label: string): Field => ({
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
    description:
      "Descubra o valor das parcelas e compare SAC e Price antes de dar o próximo passo.",
    benefit: "Encontre o melhor cenário para seu imóvel",
    color: "blue",
    icon: "home",
    fields: [
      currencyField("valor", "Valor do imóvel (R$)", "500.000"),
      {
        ...currencyField("entrada", "Entrada", "100.000"),
        currencyUnit: "unidadeEntrada",
        currencyBase: "valor",
      },
      selectField("unidadeEntrada", "Formato da entrada", "reais", [
        ["reais", "Reais (R$)"],
        ["percentual", "Percentual (%)"],
      ]),
      ...termFields(),
      ...rateFields(),
      amortizationSystemField,
      selectField("indexador", "Regra de correção do saldo", "nenhum", [
        ["nenhum", "Sem indexador"],
        ["fixo", "Correção fixa mensal informada"],
      ]),
      {
        ...numberField("correcao", "Correção mensal hipotética (%)", "0"),
        when: ["indexador", "fixo"],
      },
      currencyField("seguro", "Seguros mensais (R$)", "0"),
      currencyField("tarifas", "Tarifas à vista (R$)", "0"),
      currencyField("custos", "Custos adicionais à vista (R$)", "0"),
      currencyField(
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
    description:
      "Veja o impacto de antecipar pagamentos e escolha entre reduzir o prazo ou a prestação.",
    benefit: "Descubra quanto você pode economizar",
    color: "green",
    icon: "chart",
    fields: [
      currencyField("saldo", "Saldo devedor atual (R$)", "300.000"),
      ...termFields(),
      ...rateFields(),
      amortizationSystemField,
      currencyField("prestacao", "Prestação atual, se conhecida (R$)", "0"),
      currencyField("extra", "Amortização extraordinária (R$)", "20.000"),
      dateField("dataSaldo", "Data do saldo informado"),
      dateField("dataExtra", "Data prevista da amortização"),
      selectField("periodicidade", "Periodicidade", "unica", [
        ["unica", "Única"],
        ["mensal", "Mensal"],
        ["anual", "Anual"],
      ]),
      selectField("estrategia", "Objetivo", "prazo", [
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
    description:
      "Avalie parcelas, taxas e lances com uma visão clara do crédito que chega até você.",
    benefit: "Conheça o custo além da parcela",
    color: "purple",
    icon: "users",
    fields: [
      currencyField("carta", "Carta de crédito (R$)", "300.000"),
      ...termFields("180"),
      numberField("administracao", "Administração total do plano (%)", "20"),
      numberField("reserva", "Fundo de reserva total (%)", "2"),
      currencyField("seguro", "Seguro mensal (R$)", "0"),
      currencyField("prestacao", "Parcela atual, se conhecida (R$)", "0"),
      {
        ...currencyField("lanceProprio", "Lance próprio", "30.000"),
        currencyUnit: "unidadeLanceProprio",
        currencyBase: "carta",
      },
      selectField("unidadeLanceProprio", "Formato do lance próprio", "reais", [
        ["reais", "Reais (R$)"],
        ["percentual", "Percentual da carta (%)"],
      ]),
      {
        ...currencyField("lanceEmbutido", "Lance embutido", "30.000"),
        currencyUnit: "unidadeLanceEmbutido",
        currencyBase: "carta",
      },
      selectField(
        "unidadeLanceEmbutido",
        "Formato do lance embutido",
        "reais",
        [
          ["reais", "Reais (R$)"],
          ["percentual", "Percentual da carta (%)"],
        ],
      ),
      numberField("reajuste", "Reajuste anual hipotético da carta (%)", "0"),
      numberField(
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
    description:
      "Calcule parcelas, compare propostas e entenda o custo total do seu veículo.",
    benefit: "Compare antes de fechar negócio",
    color: "orange",
    icon: "car",
    fields: [
      currencyField("valor", "Valor do veículo (R$)", "80.000"),
      currencyField("entrada", "Entrada (R$)", "20.000"),
      ...termFields("48"),
      ...rateFields("22"),
      { ...amortizationSystemField, value: "Price" },
      currencyField("tarifas", "Tarifas à vista (R$)", "0"),
      currencyField("custos", "Custos adicionais à vista (R$)", "0"),
      currencyField("seguro", "Seguro mensal (R$)", "0"),
      currencyField("antecipacao", "Antecipação no primeiro mês (R$)", "5.000"),
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
    description:
      "Estime o valor para quitar sua dívida e os juros futuros que você pode evitar.",
    benefit: "Visualize o impacto de sair da dívida",
    color: "red",
    icon: "wallet",
    fields: [
      selectField("tipo", "Tipo de dívida", "pessoal", [
        ["imovel", "Financiamento imobiliário"],
        ["veiculo", "Financiamento de veículo"],
        ["pessoal", "Empréstimo pessoal"],
        ["parcelado", "Crédito parcelado"],
      ]),
      currencyField("saldo", "Saldo devedor atual (R$)", "25.000"),
      ...termFields("24"),
      ...rateFields("18"),
      { ...amortizationSystemField, value: "Price" },
      dateField("dataSaldo", "Data de referência do saldo"),
      dateField("dataQuitacao", "Data prevista de quitação"),
      currencyField("encargos", "Encargos adicionais na quitação (R$)", "0"),
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
    description:
      "Acompanhe o efeito do tempo e dos aportes na construção do seu patrimônio.",
    benefit: "Dê forma aos seus objetivos",
    color: "teal",
    icon: "sprout",
    fields: [
      currencyField("inicial", "Valor inicial (R$)", "10.000"),
      currencyField("aporte", "Aporte mensal (R$)", "500"),
      ...rateFields(),
      ...termFields("120"),
      numberField("inflacao", "Inflação anual estimada (%)", "4"),
      numberField(
        "tributacao",
        "Alíquota sobre rendimentos ao final (%)",
        "15",
      ),
      numberField(
        "taxaComparacao",
        "Taxa alternativa, no mesmo período (%)",
        "8",
      ),
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
