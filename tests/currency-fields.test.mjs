import assert from "node:assert/strict";
import test from "node:test";
import { parseBR } from "../lib/finance.ts";
import { defaults, simulators } from "../data/simulators.ts";
import { isCurrencyField, updateFieldValue } from "../lib/currency-fields.ts";

test("Alternar entre reais e percentual preserva a entrada e os lances", () => {
  for (const simulator of simulators) {
    for (const field of simulator.fields.filter(
      (field) => field.currencyUnit,
    )) {
      const original = defaults(simulator);
      const amount = parseBR(original[field.key]);
      const base = parseBR(original[field.currencyBase]);
      const percentage = updateFieldValue(
        simulator.fields,
        original,
        field.currencyUnit,
        "percentual",
      );

      assert.equal(isCurrencyField(field, original), true);
      assert.equal(isCurrencyField(field, percentage), false);
      assert.ok(
        Math.abs(parseBR(percentage[field.key]) - (amount / base) * 100) < 1e-7,
      );

      const restored = updateFieldValue(
        simulator.fields,
        percentage,
        field.currencyUnit,
        "reais",
      );
      assert.ok(Math.abs(parseBR(restored[field.key]) - amount) < 0.01);
      assert.equal(isCurrencyField(field, restored), true);
      assert.deepEqual(
        original,
        defaults(simulator),
        "A edição não altera os valores anteriores",
      );
    }
  }
});

test("Mudar o formato com base inválida limpa o valor em vez de produzir NaN", () => {
  const simulator = simulators.find(
    (simulator) => simulator.kind === "imobiliario",
  );
  for (const base of ["0", "", "inválido"]) {
    const values = { ...defaults(simulator), valor: base };
    const updated = updateFieldValue(
      simulator.fields,
      values,
      "unidadeEntrada",
      "percentual",
    );
    assert.equal(updated.entrada, "");
  }
});

test("Editar valores comuns ou manter a unidade não dispara conversões", () => {
  const simulator = simulators.find(
    (simulator) => simulator.kind === "imobiliario",
  );
  const values = defaults(simulator);
  const updated = updateFieldValue(simulator.fields, values, "taxa", "12");
  assert.deepEqual(updated, { ...values, taxa: "12" });
  assert.deepEqual(
    updateFieldValue(simulator.fields, values, "unidadeEntrada", "reais"),
    values,
  );
});

test("Campos de taxa e data não recebem máscara monetária", () => {
  for (const simulator of simulators) {
    const values = defaults(simulator);
    for (const field of simulator.fields.filter(
      (field) => field.format !== "currency",
    )) {
      assert.equal(isCurrencyField(field, values), false, field.key);
    }
  }
});
