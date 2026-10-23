export type Kind =
  | "imobiliario"
  | "amortizacao"
  | "consorcio"
  | "veiculo"
  | "quitacao"
  | "investimentos";
export type Values = Record<string, string>;
export type Row = {
  month: number;
  payment: number;
  interest: number;
  amortization: number;
  balance: number;
  extra?: number;
  invested?: number;
  comparison?: number;
};
export type Metric = {
  label: string;
  value: number | string;
  format?: "money" | "percent" | "text";
};
export type Result = {
  metrics: Metric[];
  rows: Row[];
  comparison: {
    name: string;
    total: number;
    interest: number;
    months: number;
    first: number;
  }[];
  insights: string[];
  assumptions: string[];
  composition: { name: string; value: number }[];
  chartLabel: string;
};
export const money = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    n,
  );
export const percent = (n: number) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(n) + "%";
export function parseBR(value: string): number {
  const raw = value.trim().replace(/R\$|\s|%/g, "");
  if (!raw || !/^[+-]?[\d.,]+$/.test(raw)) return NaN;
  if (raw.includes(",")) {
    if (!/^[+-]?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(raw)) return NaN;
    return Number(raw.replace(/\./g, "").replace(",", "."));
  }
  return Number(
    /^[+-]?\d{1,3}(?:\.\d{3})+$/.test(raw) ? raw.replace(/\./g, "") : raw,
  );
}
function readNumber(values: Values, key: string, min = 0, max = 1e10) {
  const value = parseBR(values[key] ?? "");
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(
      `Revise o campo “${key}”: informe um número entre ${min} e ${max}, no formato brasileiro.`,
    );
  }
  return value;
}
function readTermMonths(values: Values) {
  const n =
    readNumber(values, "prazo", 1, 1200) *
    (values.unidadePrazo === "anos" ? 12 : 1);
  if (!Number.isInteger(n) || n > 1200)
    throw new Error("O prazo deve ser um número inteiro de meses, até 1.200.");
  return n;
}
export function monthly(rate: number, unit: string) {
  return unit === "anual"
    ? Math.expm1(Math.log1p(rate / 100) / 12)
    : rate / 100;
}
export function installment(p: number, r: number, n: number) {
  if (n <= 0) throw new Error("Prazo inválido.");
  return r === 0 ? p / n : (p * r) / -Math.expm1(-n * Math.log1p(r));
}
export function loan(
  p: number,
  r: number,
  n: number,
  system: string,
  monthlyFees = 0,
  index = 0,
): Row[] {
  let balance = p;
  const rows: Row[] = [];
  for (let m = 1; m <= n; m++) {
    balance *= 1 + index;
    const interest = balance * r;
    const factor = Math.pow(1 + index, m);
    const stablePrice =
      r === 0
        ? p / n
        : (p * r * Math.exp((m - 1 - n) * Math.log1p(r))) /
          -Math.expm1(-n * Math.log1p(r));
    const a = Math.min(
      balance,
      m === n ? balance : (system === "SAC" ? p / n : stablePrice) * factor,
    );
    if (a < 0) throw new Error("As condições geram amortização negativa.");
    balance = Math.max(0, balance - a);
    rows.push({
      month: m,
      payment: a + interest + monthlyFees,
      interest,
      amortization: a,
      balance,
    });
  }
  return rows;
}
const sum = (
  rows: Row[],
  key: "payment" | "interest" | "amortization" | "extra",
) => rows.reduce((s, r) => s + (r[key] ?? 0), 0);
const scenario = (name: string, rows: Row[], upfront = 0) => ({
  name,
  total: sum(rows, "payment") + sum(rows, "extra") + upfront,
  interest: sum(rows, "interest"),
  months: rows.length,
  first: rows[0]?.payment ?? 0,
});
export function cashflowRate(net: number, payments: number[]): number | null {
  if (net <= 0) return null;
  const pv = (r: number) =>
    payments.reduce((s, p, i) => s + p / Math.pow(1 + r, i + 1), 0);
  if (pv(0) < net - 0.01) return null;
  let low = 0,
    high = 1;
  while (pv(high) > net && high < 1e6) high *= 2;
  for (let i = 0; i < 150; i++) {
    const mid = (low + high) / 2;
    if (pv(mid) > net) low = mid;
    else high = mid;
  }
  return (Math.pow(1 + (low + high) / 2, 12) - 1) * 100;
}
function dateValue(s: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s))
    throw new Error("Informe uma data válida.");
  const d = new Date(s + "T12:00:00Z");
  if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0, 10) !== s)
    throw new Error("Data inválida.");
  return d;
}
export function addMonths(s: string, n: number) {
  const d = dateValue(s),
    day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + n);
  d.setUTCDate(
    Math.min(
      day,
      new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0),
      ).getUTCDate(),
    ),
  );
  return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}
function dateOffset(start: string, target: string) {
  const a = dateValue(start),
    b = dateValue(target);
  if (b < a)
    throw new Error(
      "A data prevista não pode ser anterior à data do saldo informado.",
    );
  return {
    months:
      (b.getUTCFullYear() - a.getUTCFullYear()) * 12 +
      b.getUTCMonth() -
      a.getUTCMonth(),
    days: (b.getTime() - a.getTime()) / 86400000,
  };
}
export function amortize(
  p: number,
  r: number,
  n: number,
  system: string,
  extra: number,
  first: number,
  frequency: string,
  strategy: string,
): Row[] {
  let balance = p,
    a = p / n,
    pmt = installment(p, r, n);
  const rows: Row[] = [];
  for (let m = 1; m <= n && balance > 1e-7; m++) {
    const due =
      m >= first &&
      (frequency === "mensal" ||
        (frequency === "anual" && (m - first) % 12 === 0) ||
        (frequency === "unica" && m === first));
    const paid = due ? Math.min(balance, extra) : 0;
    balance -= paid;
    if (strategy === "prestacao" && paid > 0) {
      a = balance / (n - m + 1);
      pmt = installment(balance, r, n - m + 1);
    }
    const interest = balance * r,
      remaining = n - m + 1,
      stable =
        r === 0
          ? balance / remaining
          : (balance * r * Math.exp(-remaining * Math.log1p(r))) /
            -Math.expm1(-remaining * Math.log1p(r));
    const amortization = Math.min(
      balance,
      m === n
        ? balance
        : system === "SAC"
          ? a
          : Math.max(stable, pmt - interest),
    );
    balance = Math.max(0, balance - amortization);
    rows.push({
      month: m,
      payment: interest + amortization,
      interest,
      amortization,
      balance,
      extra: paid,
    });
  }
  return rows;
}
export function calculate(kind: Kind, values: Values): Result {
  const metrics: Metric[] = [],
    insights: string[] = [],
    assumptions: string[] = [],
    composition: { name: string; value: number }[] = [];
  let rows: Row[] = [],
    comparison: Result["comparison"] = [],
    chartLabel = "Saldo devedor";
  const addMetric = (
    label: string,
    value: number | string,
    format: Metric["format"] = "money",
  ) => metrics.push({ label, value, format });
  if (kind === "imobiliario" || kind === "veiculo") {
    const value = readNumber(values, "valor", 0.01),
      entry = readNumber(values, "entrada"),
      down =
        values.unidadeEntrada === "percentual" ? (value * entry) / 100 : entry;
    if (down >= value)
      throw new Error("A entrada deve ser menor que o valor do bem.");
    const p = value - down,
      n = readTermMonths(values),
      r = monthly(readNumber(values, "taxa", 0, 100), values.unidadeTaxa),
      fees = readNumber(values, "tarifas"),
      costs = readNumber(values, "custos"),
      insurance = readNumber(values, "seguro"),
      index =
        values.indexador === "fixo"
          ? monthly(readNumber(values, "correcao", 0, 10), "mensal")
          : 0;
    const system = values.sistema ?? "Price";
    rows = loan(p, r, n, system, insurance, index);
    const other = loan(
      p,
      r,
      n,
      system === "SAC" ? "Price" : "SAC",
      insurance,
      index,
    );
    const total = sum(rows, "payment") + down + fees + costs,
      interest = sum(rows, "interest");
    addMetric("Primeira prestação", rows[0].payment);
    addMetric("Última prestação", rows.at(-1)!.payment);
    addMetric("Total de juros", interest);
    addMetric("Total pago com entrada e custos", total);
    addMetric("Valor financiado", p);
    const cet = cashflowRate(
      p - fees - costs,
      rows.map((x) => x.payment),
    );
    addMetric(
      "Custo anual equivalente estimado",
      cet === null ? "Dados insuficientes" : cet,
      cet === null ? "text" : "percent",
    );
    if (kind === "imobiliario") {
      const income = readNumber(values, "renda");
      addMetric(
        "Comprometimento inicial da renda",
        income > 0 ? (rows[0].payment / income) * 100 : "Renda não informada",
        income > 0 ? "percent" : "text",
      );
    }
    if (kind === "veiculo") {
      const antecipacao = readNumber(values, "antecipacao");
      const advanced = amortize(
        p,
        r,
        n,
        system,
        antecipacao,
        1,
        "unica",
        "prazo",
      );
      addMetric(
        "Juros evitados com antecipação",
        interest - sum(advanced, "interest"),
      );
      assumptions.push(
        "Antecipação aplicada no início do primeiro mês, antes dos juros, sem cobrança de novos encargos.",
      );
    }
    comparison = [
      scenario(system, rows, down + fees + costs),
      scenario(system === "SAC" ? "Price" : "SAC", other, down + fees + costs),
    ];
    rows = rows.map((x, i) => ({ ...x, comparison: other[i]?.balance ?? 0 }));
    const correction = sum(rows, "amortization") - p;
    composition.push(
      { name: "Principal", value: p },
      { name: "Juros", value: interest },
      { name: "Correção", value: Math.max(0, correction) },
      { name: "Seguros e custos", value: insurance * n + fees + costs },
    );
    insights.push(
      `Neste cenário, ${comparison[0].interest <= comparison[1].interest ? system : comparison[1].name} apresenta o menor total de juros. A diferença é ${money(Math.abs(comparison[0].interest - comparison[1].interest))}.`,
    );
    assumptions.push(
      "Prestações mensais, com a primeira após um mês. Tarifas e custos pagos à vista; seguro mensal constante. Não são acrescentados encargos não informados.",
      "O custo anual equivalente é uma TIR com intervalos mensais regulares; não é o CET oficial, que exige todos os fluxos e datas contratuais.",
      index > 0
        ? "Correção fixa mensal informada: o saldo é corrigido antes dos juros e a amortização é atualizada pelo mesmo fator. Não representa projeção de TR, IPCA ou outro índice."
        : "Taxa fixa, sem indexador. A taxa anual informada é efetiva e convertida por equivalência composta.",
    );
  } else if (kind === "amortizacao") {
    const p = readNumber(values, "saldo", 0.01),
      n = readTermMonths(values),
      r = monthly(readNumber(values, "taxa", 0, 100), values.unidadeTaxa),
      extra = readNumber(values, "extra", 0.01),
      offset = dateOffset(values.dataSaldo, values.dataExtra),
      first = offset.months + 1;
    if (first > n)
      throw new Error("A amortização deve ocorrer dentro do prazo restante.");
    const base = loan(p, r, n, values.sistema);
    rows = amortize(
      p,
      r,
      n,
      values.sistema,
      extra,
      first,
      values.periodicidade,
      values.estrategia,
    );
    const saving = sum(base, "interest") - sum(rows, "interest");
    addMetric("Juros economizados", saving);
    addMetric("Novo prazo estimado", `${rows.length} meses`, "text");
    addMetric(
      "Prestação após a amortização",
      rows.find((x) => (x.extra ?? 0) > 0)?.payment ?? rows[0].payment,
    );
    addMetric(
      "Quitação estimada",
      addMonths(values.dataSaldo, rows.length),
      "text",
    );
    addMetric("Economia total estimada", saving);
    addMetric("Amortizações extras", sum(rows, "extra"));
    comparison = [
      scenario("Cenário atual", base),
      scenario("Com amortização", rows),
    ];
    rows = base.map((x, i) => ({
      ...(rows[i] ?? {
        ...x,
        payment: 0,
        interest: 0,
        amortization: 0,
        balance: 0,
      }),
      comparison: x.balance,
    }));
    const current = readNumber(values, "prestacao");
    if (current > 0)
      insights.push(
        `A prestação teórica atual é ${money(base[0].payment)}. A informada é ${money(current)}; diferenças podem decorrer de seguros, correção e regras do contrato.`,
      );
    insights.push(
      `Ao amortizar ${money(extra)} com periodicidade ${values.periodicidade}, a economia de juros é ${money(saving)}, pelas premissas informadas.`,
    );
    assumptions.push(
      "Estimativa sem indexadores, seguros ou tarifas. Datas da amortização são agrupadas por mês: o mês da data do saldo é o primeiro ciclo; o dia exato não produz juros pro rata. O extra é aplicado antes dos juros e da parcela desse ciclo.",
      "Reduzir prazo mantém a amortização SAC original ou a parcela Price original. Reduzir prestação recalcula o valor para os meses restantes.",
      "A data de quitação usa a data do saldo como referência mensal. O contrato pode adotar datas e encargos diferentes.",
    );
    composition.push(
      { name: "Principal", value: p },
      { name: "Juros após amortização", value: comparison[1].interest },
    );
  } else if (kind === "consorcio") {
    const credit = readNumber(values, "carta", 0.01),
      n = readTermMonths(values),
      admin = readNumber(values, "administracao", 0, 100) / 100,
      reserve = readNumber(values, "reserva", 0, 100) / 100,
      insurance = readNumber(values, "seguro"),
      own =
        readNumber(values, "lanceProprio") *
        (values.unidadeLanceProprio === "percentual" ? credit / 100 : 1),
      embedded =
        readNumber(values, "lanceEmbutido") *
        (values.unidadeLanceEmbutido === "percentual" ? credit / 100 : 1),
      adjust = readNumber(values, "reajuste", 0, 100) / 100;
    if (own + embedded > credit)
      throw new Error(
        "A soma dos lances não pode ultrapassar a carta de crédito.",
      );
    const remaining = credit - own - embedded;
    let balance = remaining;
    for (let m = 1; m <= n; m++) {
      const factor = Math.pow(1 + adjust, Math.floor((m - 1) / 12));
      if (m > 1 && (m - 1) % 12 === 0) balance *= 1 + adjust;
      const a = (remaining / n) * factor,
        cost = ((credit * (admin + reserve)) / n) * factor + insurance;
      balance = Math.max(0, balance - a);
      rows.push({
        month: m,
        payment: a + cost,
        interest: cost,
        amortization: a,
        balance,
      });
    }
    const total = sum(rows, "payment") + own,
      fees = sum(rows, "interest");
    addMetric("Parcela inicial estimada", rows[0].payment);
    addMetric("Desembolso total estimado", total);
    addMetric("Crédito líquido após lance embutido", credit - embedded);
    addMetric("Recursos próprios para o lance", own);
    addMetric("Saldo inicial após os lances", remaining);
    addMetric(
      "Percentual total de lance",
      ((own + embedded) / credit) * 100,
      "percent",
    );
    const fin = loan(
      credit - embedded - own,
      monthly(readNumber(values, "taxaComparacao", 0, 100), "anual"),
      n,
      "Price",
    );
    comparison = [
      scenario("Consórcio", rows, own),
      scenario("Financiamento Price", fin, own),
    ];
    const current = readNumber(values, "prestacao");
    if (current > 0)
      insights.push(
        `Sua parcela informada de ${money(current)} deve ser conferida com a estimativa inicial de ${money(rows[0].payment)}.`,
      );
    insights.push(
      `O lance embutido reduz o crédito utilizável para ${money(credit - embedded)}. Não há garantia de contemplação nem previsão de quando ela ocorrerá.`,
    );
    assumptions.push(
      "Cenário condicional a um lance aceito no início: os lances reduzem o fundo comum, mantendo o prazo; administração e reserva incidem sobre a carta cheia.",
      "Reajuste anual hipotético a cada 12 meses, a partir do mês 13, aplicado à carta, ao saldo e às contribuições. Seguro mensal constante.",
      "A comparação usa o mesmo prazo e recurso líquido. Financiamento sem tarifas; consórcio sem valor do dinheiro no tempo, sem custo de espera e sem garantia de contemplação. Fundo de reserva tratado como desembolso, sem supor devolução.",
    );
    composition.push(
      { name: "Fundo comum após lances", value: sum(rows, "amortization") },
      { name: "Administração, reserva e seguro", value: fees },
      { name: "Lance próprio", value: own },
    );
  } else if (kind === "quitacao") {
    const p = readNumber(values, "saldo", 0.01),
      r = monthly(readNumber(values, "taxa", 0, 100), values.unidadeTaxa),
      n = readTermMonths(values),
      charges = readNumber(values, "encargos"),
      offset = dateOffset(values.dataSaldo, values.dataQuitacao);
    if (offset.days > 31)
      throw new Error(
        "Para quitação além de 31 dias, atualize primeiro o saldo devedor na instituição.",
      );
    const balance = p * Math.pow(1 + r, offset.days / 30),
      base = loan(p, r, n, values.sistema),
      settlement = balance + charges,
      saving = sum(base, "payment") - settlement;
    rows = base;
    addMetric("Quitação estimada na data", settlement);
    addMetric("Saldo atualizado estimado", balance);
    addMetric("Juros futuros evitados, líquidos de encargos", saving);
    addMetric("Continuar pagando", sum(base, "payment"));
    addMetric(
      "Data prevista",
      dateValue(values.dataQuitacao).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      }),
      "text",
    );
    comparison = [
      scenario("Continuar pagando", base),
      {
        name: "Quitar na data",
        total: settlement,
        interest: balance - p + charges,
        months: 0,
        first: settlement,
      },
    ];
    insights.push(
      `A estimativa de quitação é ${money(settlement)}. O saldo devedor é atualizado pela taxa contratual; não é calculado pela soma das parcelas futuras.`,
    );
    assumptions.push(
      "Saldo informado imediatamente após o último pagamento. Sem prestações intermediárias, indexador ou encargos além dos declarados.",
      "Juros pro rata por equivalência composta com mês de 30 dias. A comparação não desconta o custo de oportunidade.",
      "O valor oficial de quitação e o critério diário devem ser obtidos com a instituição financeira.",
    );
    composition.push(
      { name: "Saldo atual", value: p },
      { name: "Juros até a data e encargos", value: balance - p + charges },
    );
  } else {
    const initial = readNumber(values, "inicial"),
      deposit = readNumber(values, "aporte"),
      n = readTermMonths(values),
      r = monthly(readNumber(values, "taxa", 0, 100), values.unidadeTaxa),
      alternative = monthly(
        readNumber(values, "taxaComparacao", 0, 100),
        values.unidadeTaxa,
      ),
      inflation = monthly(readNumber(values, "inflacao", 0, 100), "anual"),
      tax = readNumber(values, "tributacao", 0, 100) / 100;
    let balance = initial,
      other = initial;
    chartLabel = "Patrimônio bruto";
    for (let m = 1; m <= n; m++) {
      const interest = balance * r;
      balance = balance + interest + deposit;
      other = other * (1 + alternative) + deposit;
      rows.push({
        month: m,
        payment: deposit,
        interest,
        amortization: deposit,
        balance,
        invested: initial + deposit * m,
        comparison: other,
      });
    }
    const invested = initial + deposit * n,
      gross = balance - invested,
      taxes = gross * tax,
      net = balance - taxes,
      netOther = other - (other - invested) * tax;
    addMetric("Patrimônio final líquido estimado", net);
    addMetric("Total investido", invested);
    addMetric("Rendimento bruto / ganho nominal", gross);
    addMetric("Tributação estimada", taxes);
    addMetric("Rendimento líquido", gross - taxes);
    addMetric(
      "Poder de compra em reais de hoje",
      net / Math.pow(1 + inflation, n),
    );
    comparison = [
      {
        name: "Taxa principal",
        total: net,
        interest: gross - taxes,
        months: n,
        first: deposit,
      },
      {
        name: "Taxa alternativa",
        total: netOther,
        interest: netOther - invested,
        months: n,
        first: deposit,
      },
    ];
    insights.push(
      `Dos ${money(net)} finais, ${money(invested)} vieram de recursos investidos e ${money(gross - taxes)} de rendimento líquido estimado.`,
    );
    assumptions.push(
      "Capitalização mensal e aportes no final de cada mês. Taxa anual efetiva convertida por equivalência composta.",
      "Alíquota única informada aplicada apenas aos rendimentos positivos ao final. Não reproduz tabelas regressivas, come-cotas, IOF ou regras de um produto específico.",
      "Inflação anual estimada constante. Taxas e resultados são hipóteses e não prometem rentabilidade futura.",
    );
    composition.push(
      { name: "Total investido", value: invested },
      { name: "Rendimento líquido", value: gross - taxes },
      { name: "Tributação", value: taxes },
    );
  }
  if (
    rows.some((x) => !Number.isFinite(x.balance) || !Number.isFinite(x.payment))
  )
    throw new Error(
      "As condições excedem os limites numéricos. Reduza a taxa ou o prazo.",
    );
  return {
    metrics,
    rows,
    comparison,
    insights,
    assumptions,
    composition,
    chartLabel,
  };
}
