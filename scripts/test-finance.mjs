import assert from "node:assert/strict";
import { build } from "esbuild";
import { pathToFileURL } from "node:url";
await build({
  entryPoints: ["lib/finance.ts", "lib/simulators.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  outdir: ".sites-runtime/tests",
});
const {
  monthly,
  installment,
  loan,
  amortize,
  calculate,
  parseBR,
  cashflowRate,
  addMonths,
} = await import(
  pathToFileURL(process.cwd() + "/.sites-runtime/tests/finance.js")
);
const { simulators, defaults } = await import(
  pathToFileURL(process.cwd() + "/.sites-runtime/tests/simulators.js")
);
let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("✓ " + name);
};
const near = (a, b, e = 0.01) => assert.ok(Math.abs(a - b) < e, `${a} ≠ ${b}`);
const total = (r, key) => r.reduce((s, x) => s + (x[key] ?? 0), 0);
test("Números brasileiros, decimais e entradas inválidas", () => {
  assert.equal(parseBR("R$ 1.234,56"), 1234.56);
  assert.equal(parseBR("500.000"), 500000);
  assert.equal(parseBR("0,85"), 0.85);
  assert.equal(parseBR("0.85"), 0.85);
  assert.ok(Number.isNaN(parseBR("1,2,3")));
  assert.ok(Number.isNaN(parseBR("")));
});
test("Taxas anuais equivalentes, sem divisão nominal por 12", () =>
  near(monthly(12.68250301319698, "anual"), 0.01, 1e-12));
test("Caso de referência BCB: R$ 1.290, 4 meses, 1,99% a.m.", () =>
  near(installment(1290, 0.0199, 4), 338.7024, 0.001));
test("Price com taxa zero e saldo final zerado", () => {
  const rows = loan(12000, 0, 12, "Price");
  near(rows[0].payment, 1000);
  near(total(rows, "interest"), 0);
  near(rows.at(-1).balance, 0);
  near(total(rows, "amortization"), 12000);
});
test("SAC: amortização constante e juros conhecidos", () => {
  const r = loan(12000, 0.01, 12, "SAC");
  near(r[0].payment, 1120);
  near(r.at(-1).payment, 1010);
  near(total(r, "interest"), 780);
  r.forEach((x) => near(x.amortization, 1000));
});
test("Price: parcela constante e principal conservado", () => {
  const r = loan(100000, 0.01, 360, "Price");
  r.forEach((x) => near(x.payment, r[0].payment, 0.00001));
  near(total(r, "amortization"), 100000);
  near(r.at(-1).balance, 0);
});
test("Antecipação nunca excede o saldo devedor", () => {
  for (const system of ["SAC", "Price"]) {
    const r = amortize(10000, 0.01, 12, system, 20000, 1, "unica", "prazo");
    assert.equal(r.length, 1);
    near(r[0].extra, 10000);
    near(r[0].balance, 0);
    near(r[0].payment, 0);
  }
});
test("Redução de prazo e prestação conservam principal", () => {
  for (const system of ["SAC", "Price"])
    for (const strategy of ["prazo", "prestacao"])
      for (const frequency of ["unica", "mensal", "anual"]) {
        const r = amortize(
          100000,
          0.01,
          120,
          system,
          5000,
          2,
          frequency,
          strategy,
        );
        near(total(r, "amortization") + total(r, "extra"), 100000);
        assert.ok(r.every((x) => x.balance >= 0));
        assert.ok(
          total(r, "interest") <
            total(loan(100000, 0.01, 120, system), "interest"),
        );
        if (strategy === "prestacao" && frequency === "unica")
          assert.equal(r.length, 120);
      }
});
test("Amortização sem extra equivale ao cenário original", () => {
  for (const system of ["SAC", "Price"])
    near(
      total(
        amortize(100000, 0.01, 120, system, 0, 1, "unica", "prazo"),
        "payment",
      ),
      total(loan(100000, 0.01, 120, system), "payment"),
    );
});
test("Custo anual equivalente recupera taxa sem encargos", () =>
  near(
    cashflowRate(
      10000,
      loan(10000, 0.01, 12, "Price").map((r) => r.payment),
    ),
    (1.01 ** 12 - 1) * 100,
    0.00001,
  ));
test("Todos os seis simuladores têm resultados reais e finitos", () =>
  simulators.forEach((s) => {
    const r = calculate(s.kind, defaults(s));
    assert.ok(r.rows.length > 0);
    assert.ok(r.metrics.length >= 5);
    assert.ok(
      r.rows.every(
        (x) => Number.isFinite(x.payment) && Number.isFinite(x.balance),
      ),
    );
  }));
test("Investimentos: aporte no fim do mês e inflação", () => {
  const s = simulators.find((s) => s.kind === "investimentos");
  const r = calculate(s.kind, {
    ...defaults(s),
    inicial: "1.000",
    aporte: "100",
    taxa: "1",
    unidadeTaxa: "mensal",
    prazo: "2",
    inflacao: "0",
    tributacao: "0",
  });
  near(r.rows.at(-1).balance, 1221.1);
  near(r.metrics[1].value, 1200);
  near(r.metrics[5].value, 1221.1);
});
test("Investimentos: juros zero não divide por zero", () => {
  const s = simulators.find((s) => s.kind === "investimentos");
  const r = calculate(s.kind, {
    ...defaults(s),
    taxa: "0",
    prazo: "12",
    tributacao: "0",
    inflacao: "0",
  });
  near(r.metrics[0].value, 16000);
  near(r.metrics[2].value, 0);
});
test("Consórcio: lance embutido reduz o crédito líquido", () => {
  const s = simulators.find((s) => s.kind === "consorcio");
  const r = calculate(s.kind, defaults(s));
  near(r.metrics[2].value, 270000);
  near(r.metrics[1].value, 336000);
  near(r.metrics[5].value, 20);
});
test("Quitação usa saldo, não soma de parcelas", () => {
  const s = simulators.find((s) => s.kind === "quitacao");
  const r = calculate(s.kind, defaults(s));
  near(r.metrics[0].value, 25000);
  assert.ok(r.metrics[3].value > 25000);
});
test("Quitação aplica juros pro rata por dias", () => {
  const s = simulators.find((s) => s.kind === "quitacao");
  const r = calculate(s.kind, {
    ...defaults(s),
    saldo: "1.000",
    taxa: "1",
    unidadeTaxa: "mensal",
    dataSaldo: "2026-10-01",
    dataQuitacao: "2026-10-31",
  });
  near(r.metrics[0].value, 1010);
});
test("Rejeita entrada superior ao bem e prazos inválidos", () => {
  const s = simulators[0];
  assert.throws(() =>
    calculate(s.kind, { ...defaults(s), entrada: "600.000" }),
  );
  assert.throws(() => calculate(s.kind, { ...defaults(s), prazo: "0" }));
  assert.throws(() => calculate(s.kind, { ...defaults(s), prazo: "1,5" }));
  assert.throws(() => calculate(s.kind, { ...defaults(s), taxa: "-1" }));
});
test("Rejeita datas passadas e quitação além do saldo atualizado", () => {
  const s = simulators.find((s) => s.kind === "quitacao");
  assert.throws(() =>
    calculate(s.kind, { ...defaults(s), dataQuitacao: "2026-10-20" }),
  );
  assert.throws(() =>
    calculate(s.kind, { ...defaults(s), dataQuitacao: "2027-10-21" }),
  );
});
test("Data de quitação preserva fim de mês e ano bissexto", () => {
  assert.equal(addMonths("2028-01-31", 1), "29/02/2028");
  assert.equal(addMonths("2026-01-31", 1), "28/02/2026");
});
test("Prazos longos e taxas pequenas conservam principal", () => {
  for (const r of [0, 1e-10, 0.001, 0.03])
    for (const n of [1, 12, 360, 1200])
      for (const sys of ["SAC", "Price"]) {
        const rows = loan(500000, r, n, sys);
        near(total(rows, "amortization"), 500000, 0.05);
        near(rows.at(-1).balance, 0, 0.05);
        const amortized = amortize(500000, r, n, sys, 0, 1, "unica", "prazo");
        near(total(amortized, "amortization"), 500000, 0.05);
        near(total(amortized, "payment"), total(rows, "payment"), 0.05);
      }
});
console.log(`\n${passed} grupos de testes financeiros aprovados.`);
