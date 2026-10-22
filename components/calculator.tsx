"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Calculator as CalculatorIcon,
  ChartNoAxesCombined,
  Download,
  Info,
  RotateCcw,
  Sparkles,
  Check,
  ChevronDown,
  CircleHelp,
  Layers,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/currency-input";
import { changeField, isCurrencyField } from "@/lib/currency-fields";
import {
  calculate,
  money,
  percent,
  parseBR,
  type Result,
  type Values,
} from "@/lib/finance";
import { defaults, type Simulator } from "@/lib/simulators";
const colors = ["#2563eb", "#10b981", "#a78bfa", "#f59e0b"];
function Chart({
  result,
  type,
}: {
  result: Result;
  type: "balance" | "composition" | "payments";
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted)
    return <div className="chart-skeleton" aria-label="Carregando gráfico" />;
  const format = (v: unknown) => money(Number(v));
  return (
    <ResponsiveContainer width="100%" height={270}>
      {type === "composition" ? (
        <PieChart>
          <Pie
            data={result.composition.filter((x) => x.value > 0)}
            dataKey="value"
            nameKey="name"
            innerRadius={68}
            outerRadius={100}
            paddingAngle={3}
          >
            {result.composition.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={format} />
          <Legend />
        </PieChart>
      ) : type === "payments" ? (
        <BarChart
          data={result.rows.filter(
            (_, i) =>
              i % Math.max(1, Math.floor(result.rows.length / 25)) === 0,
          )}
        >
          <CartesianGrid stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis
            tickFormatter={(v) =>
              new Intl.NumberFormat("pt-BR", { notation: "compact" }).format(v)
            }
            width={55}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip formatter={format} labelFormatter={(x) => "Mês " + x} />
          <Bar
            dataKey="amortization"
            name="Amortização / aporte"
            stackId="a"
            fill="#2563eb"
          />
          <Bar
            dataKey="interest"
            name="Juros / encargos"
            stackId="a"
            fill="#10b981"
          />
          <Legend />
        </BarChart>
      ) : (
        <AreaChart data={result.rows}>
          <defs>
            <linearGradient id="balance-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="var(--border)"
            vertical={false}
            strokeDasharray="3 4"
          />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis
            tickFormatter={(v) =>
              new Intl.NumberFormat("pt-BR", { notation: "compact" }).format(v)
            }
            width={55}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip formatter={format} labelFormatter={(x) => "Mês " + x} />
          <Area
            type="monotone"
            dataKey="comparison"
            name="Cenário de comparação"
            stroke="#10b981"
            fill="none"
            strokeDasharray="5 4"
          />
          <Area
            type="monotone"
            dataKey="balance"
            name={result.chartLabel}
            stroke="#2563eb"
            fill="url(#balance-fill)"
            strokeWidth={2}
          />
          <Legend />
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
}
export default function Calculator({ sim }: { sim: Simulator }) {
  const [values, setValues] = useState<Values>(() => defaults(sim));
  const [snapshot, setSnapshot] = useState<Values>(() => defaults(sim));
  const [result, setResult] = useState<Result>(() =>
    calculate(sim.kind, defaults(sim)),
  );
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [tab, setTab] = useState<"balance" | "composition" | "payments">("balance"),
    [page, setPage] = useState(0),
    [saved, setSaved] = useState<Result | null>(null),
    [notice, setNotice] = useState(""),
    [report, setReport] = useState(false);
  const output = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    if (!report) return;
    const previous = document.activeElement as HTMLElement | null;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setReport(false);
      if (e.key === "Tab") {
        const nodes = Array.from(
          document.querySelectorAll<HTMLElement>(
            ".modal button, .modal a[href], .modal input, .modal select",
          ),
        );
        const first = nodes[0],
          last = nodes.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [report]);
  const simulate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const next = calculate(sim.kind, values);
      setBusy(true);
      timer.current = setTimeout(() => {
        setResult(next);
        setSnapshot({ ...values });
        setBusy(false);
        setPage(0);
        setNotice("Simulação atualizada.");
        output.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 180);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Revise os dados informados.");
    }
  };
  const dirty = JSON.stringify(values) !== JSON.stringify(snapshot);
  const exportCSV = () => {
    const csv =
      "\uFEFFMês;Prestação;Juros ou encargos;Amortização ou aporte;Extra;Saldo\n" +
      result.rows
        .map((r) =>
          [
            r.month,
            ...[
              r.payment,
              r.interest,
              r.amortization,
              r.extra ?? 0,
              r.balance,
            ].map((x) => x.toFixed(2).replace(".", ",")),
          ].join(";"),
        )
        .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = sim.slug + ".csv";
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Tabela exportada.");
  };
  const funded =
    sim.kind === "imobiliario" || sim.kind === "veiculo"
      ? parseBR(values.valor) -
        parseBR(values.entrada) *
          (values.unidadeEntrada === "percentual"
            ? parseBR(values.valor) / 100
            : 1)
      : null;
  return (
    <div className="container calculator-page">
      <Link href="/#simuladores" className="breadcrumb">
        <ArrowLeft size={15} /> Todos os simuladores
      </Link>
      <div className="calculator-title">
        <span className="overline">PLANEJE COM CLAREZA</span>
        <h1>Simulador de {sim.name}</h1>
        <p>{sim.description}</p>
        <div className="inline-benefits">
          <span>
            <Check size={14} /> Sem cadastro
          </span>
          <span>
            <Check size={14} /> Cálculos reais
          </span>
          <span>
            <Check size={14} /> Resultados gratuitos
          </span>
        </div>
      </div>
      <div className="calculator-layout">
        <form className="form-panel panel" onSubmit={simulate} noValidate>
          <div className="panel-heading">
            <span className={"sim-icon " + sim.color}>
              <CalculatorIcon size={22} />
            </span>
            <div>
              <h2>Seu cenário</h2>
              <p>Preencha os dados para simular.</p>
            </div>
          </div>
          <div className="fields">
            {sim.fields
              .filter((f) => !f.when || values[f.when[0]] === f.when[1])
              .map((f) => (
                <div
                  className={"field " + (f.hint ? "with-hint" : "")}
                  key={f.key}
                >
                  <label htmlFor={f.key}>{f.label}</label>
                  {f.options ? (
                    <select
                      id={f.key}
                      value={values[f.key]}
                      onChange={(e) =>
                        setValues((current) =>
                          changeField(
                            sim.fields,
                            current,
                            f.key,
                            e.target.value,
                          ),
                        )
                      }
                    >
                      {f.options.map(([val, name]) => (
                        <option key={val} value={val}>
                          {name}
                        </option>
                      ))}
                    </select>
                  ) : isCurrencyField(f, values) ? (
                    <CurrencyInput
                      id={f.key}
                      value={values[f.key]}
                      onValueChange={(value) =>
                        setValues((current) => ({ ...current, [f.key]: value }))
                      }
                      aria-describedby={f.hint ? f.key + "-hint" : undefined}
                      autoComplete="off"
                    />
                  ) : (
                    <input
                      id={f.key}
                      type={f.type ?? "text"}
                      inputMode={f.type ? "none" : "decimal"}
                      value={values[f.key]}
                      onChange={(e) =>
                        setValues({ ...values, [f.key]: e.target.value })
                      }
                      aria-describedby={f.hint ? f.key + "-hint" : undefined}
                      autoComplete="off"
                    />
                  )}
                  {f.hint && <small id={f.key + "-hint"}>{f.hint}</small>}
                </div>
              ))}
          </div>
          {funded !== null && Number.isFinite(funded) && (
            <div className="funded-line">
              <span>Valor financiado</span>
              <strong>{money(funded)}</strong>
            </div>
          )}
          {error && (
            <div role="alert" className="form-error">
              {error}
            </div>
          )}
          <Button
            className="button calculate-button"
            size="lg"
            disabled={busy}
            type="submit"
          >
            {busy ? "Calculando…" : "Calcular simulação"}{" "}
            <ArrowRight size={18} />
          </Button>
          <button
            type="button"
            className="reset-button"
            onClick={() => {
              setValues(defaults(sim));
              setError("");
              setNotice(
                "Campos restaurados. Calcule para atualizar o resultado.",
              );
            }}
          >
            <RotateCcw size={14} /> Restaurar valores de exemplo
          </button>
          <p className="field-note">
            <Info size={14} /> Valores iniciais são exemplos editáveis, sem
            vínculo com ofertas de instituições.
          </p>
        </form>
        <div className="results" ref={output} aria-busy={busy}>
          <div className="result-heading">
            <div>
              <span className="overline">SEU PLANEJAMENTO EM NÚMEROS</span>
              <h2>Resultado da simulação</h2>
            </div>
            <span className="estimate-badge">Estimativa</span>
          </div>
          {dirty && (
            <div className="dirty-note">
              <Info size={16} /> Os campos foram alterados. Clique em calcular
              para atualizar os resultados.
            </div>
          )}
          <div className={busy ? "metrics-grid loading" : "metrics-grid"}>
            {result.metrics.map((m, i) => (
              <div
                key={m.label}
                className={"metric " + (i === 0 ? "primary-metric" : "")}
              >
                <span>{m.label}</span>
                <strong>
                  {typeof m.value === "string"
                    ? m.value
                    : m.format === "percent"
                      ? percent(m.value)
                      : money(m.value)}
                </strong>
                {i === 0 && <small>Conforme as premissas informadas</small>}
              </div>
            ))}
          </div>
          <section className="insight">
            <span className="insight-icon">
              <Sparkles size={21} />
            </span>
            <div>
              <h3>Uma leitura do seu cenário</h3>
              {result.insights.map((x, i) => (
                <p key={i}>{x}</p>
              ))}
              <small>
                Análise por regras determinísticas, a partir dos cálculos acima.
              </small>
            </div>
          </section>
          <section className="panel chart-panel">
            <div className="chart-title">
              <h3>Veja o cenário ao longo do tempo</h3>
              <ChartNoAxesCombined size={19} />
            </div>
            <div className="chart-tabs" role="tablist" aria-label="Gráficos">
              {(
                [
                  ["balance", result.chartLabel],
                  ["payments", "Juros e amortização"],
                  ["composition", "Composição"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={tab === key}
                  onClick={() => setTab(key)}
                  className={tab === key ? "active" : ""}
                >
                  {label}
                </button>
              ))}
            </div>
            <Chart result={result} type={tab} />
            <p className="chart-caption">
              Eixo horizontal em meses. Passe sobre o gráfico para ver os
              valores. A tabela completa está abaixo.
            </p>
          </section>
          <section className="panel comparison-panel">
            <div className="chart-title">
              <h3>Compare as possibilidades</h3>
              <Layers size={19} />
            </div>
            <div className="comparison-grid">
              {result.comparison.map((c, i) => (
                <div key={c.name} className={i === 1 ? "comparison-alt" : ""}>
                  <span>{c.name}</span>
                  <strong>{money(c.total)}</strong>
                  <small>
                    {sim.kind === "investimentos"
                      ? "Patrimônio líquido final"
                      : "Total de desembolsos"}
                  </small>
                  <dl>
                    <div>
                      <dt>Prazo</dt>
                      <dd>{c.months} meses</dd>
                    </div>
                    <div>
                      <dt>
                        {sim.kind === "investimentos"
                          ? "Rendimento líquido"
                          : "Juros / encargos"}
                      </dt>
                      <dd>{money(c.interest)}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
            <button
              className="text-link"
              onClick={() => {
                setSaved(result);
                document.getElementById(sim.fields[0].key)?.focus();
                setNotice(
                  "Cenário A fixado. Altere os campos e calcule o cenário B.",
                );
              }}
            >
              Comparar outro cenário <ArrowRight size={16} />
            </button>
            {saved && (
              <div className="saved-comparison">
                <button
                  className="icon-button"
                  aria-label="Remover cenário fixado"
                  onClick={() => setSaved(null)}
                >
                  <X size={16} />
                </button>
                <strong>Cenário A fixado × resultado atual</strong>
                <p>
                  {saved.metrics[0].label}:{" "}
                  {typeof saved.metrics[0].value === "number"
                    ? money(saved.metrics[0].value)
                    : saved.metrics[0].value}{" "}
                  →{" "}
                  {typeof result.metrics[0].value === "number"
                    ? money(result.metrics[0].value)
                    : result.metrics[0].value}
                </p>
                <p>
                  Total do cenário principal: {money(saved.comparison[0].total)}{" "}
                  → {money(result.comparison[0].total)}.
                </p>
                <small>
                  Comparação temporária nesta página. Alterações só entram após
                  calcular.
                </small>
              </div>
            )}
          </section>
          <section className="panel table-panel">
            <div className="chart-title">
              <h3>Evolução mensal completa</h3>
              <button className="text-link" onClick={exportCSV}>
                <Download size={15} /> CSV gratuito
              </button>
            </div>
            <div
              className="table-scroll"
              tabIndex={0}
              role="region"
              aria-label="Tabela mensal de cálculo"
            >
              <table>
                <thead>
                  <tr>
                    <th>Mês</th>
                    <th>
                      {sim.kind === "investimentos" ? "Aporte" : "Prestação"}
                    </th>
                    <th>Juros / encargos</th>
                    <th>
                      {sim.kind === "investimentos" ? "Aporte" : "Amortização"}
                    </th>
                    <th>Extra</th>
                    <th>{result.chartLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.slice(page * 12, page * 12 + 12).map((r) => (
                    <tr key={r.month}>
                      <td>{r.month}</td>
                      <td>{money(r.payment)}</td>
                      <td>{money(r.interest)}</td>
                      <td>{money(r.amortization)}</td>
                      <td>{money(r.extra ?? 0)}</td>
                      <td>{money(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <button
                className="button secondary small"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </button>
              <span>
                Página {page + 1} de {Math.ceil(result.rows.length / 12)}
              </span>
              <button
                className="button secondary small"
                disabled={(page + 1) * 12 >= result.rows.length}
                onClick={() => setPage(page + 1)}
              >
                Próxima
              </button>
            </div>
          </section>
          <details className="panel assumptions" open>
            <summary>
              <Info size={18} /> Premissas e limites deste cálculo{" "}
              <ChevronDown size={17} />
            </summary>
            <ul>
              {result.assumptions.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p>
              Esta simulação não constitui proposta de crédito, garantia de
              contemplação ou recomendação individualizada de investimento.
            </p>
          </details>
          <div className="report-prompt">
            <div>
              <strong>Seu planejamento merece continuidade.</strong>
              <p>
                Consulte o resumo gratuito. Contas e relatórios pagos estão em
                desenvolvimento.
              </p>
            </div>
            <button
              className="button secondary small"
              onClick={() => setReport(true)}
            >
              Ver resumo <ArrowRight size={16} />
            </button>
          </div>
          <div className="sr-only" role="status" aria-live="polite">
            {notice}
          </div>
        </div>
      </div>
      <section className="faq-section">
        <span className="overline">PARA ENTENDER MELHOR</span>
        <h2>Perguntas frequentes</h2>
        {sim.faqs.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <CircleHelp size={18} />
            </summary>
            <p>{a}</p>
          </details>
        ))}
        <Link href="/metodologia" className="text-link">
          Conheça a metodologia <ArrowRight size={16} />
        </Link>
      </section>
      {report && (
        <div className="modal-backdrop" onClick={() => setReport(false)}>
          <section
            className="modal panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              autoFocus
              className="icon-button modal-close"
              aria-label="Fechar resumo"
              onClick={() => setReport(false)}
            >
              <X />
            </button>
            <span className="overline">RESUMO GRATUITO</span>
            <h2 id="report-title">{sim.name}</h2>
            <p>
              Gerado em{" "}
              {new Date().toLocaleDateString("pt-BR", {
                timeZone: "America/Sao_Paulo",
              })}
              .
            </p>
            {result.metrics.map((m) => (
              <p key={m.label}>
                <strong>{m.label}:</strong>{" "}
                {typeof m.value === "string"
                  ? m.value
                  : m.format === "percent"
                    ? percent(m.value)
                    : money(m.value)}
              </p>
            ))}
            <h3>Parâmetros utilizados</h3>
            <div className="report-params">
              {sim.fields
                .filter((f) => !f.when || snapshot[f.when[0]] === f.when[1])
                .map((f) => (
                  <p key={f.key}>
                    {f.label}:{" "}
                    {f.options
                      ? f.options.find((o) => o[0] === snapshot[f.key])?.[1]
                      : f.type === "date"
                        ? snapshot[f.key].split("-").reverse().join("/")
                        : snapshot[f.key]}
                  </p>
                ))}
            </div>
            <p className="field-note">
              Os gráficos, tabelas e premissas completos estão na página de
              resultado. Relatórios PDF profissionais pagos serão implementados
              na Fase 2.
            </p>
            <button className="button" onClick={() => setReport(false)}>
              Voltar à simulação
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
