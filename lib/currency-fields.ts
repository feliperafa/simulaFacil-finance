import { parseBR } from "./finance.ts";
import type { Values } from "./finance";
import type { Field } from "../data/simulators";

export function isCurrencyField(field: Field, values: Values): boolean {
  return (
    field.format === "currency" &&
    (!field.currencyUnit || values[field.currencyUnit] !== "percentual")
  );
}

/** Atualiza o campo e preserva o valor ao alternar entre reais e percentual. */
export function updateFieldValue(
  fields: Field[],
  values: Values,
  key: string,
  value: string,
): Values {
  const next = { ...values, [key]: value };
  if (values[key] === value) return next;
  const field = fields.find((f) => f.currencyUnit === key);
  if (!field || !field.currencyBase) return next;
  const amount = parseBR(values[field.key] ?? "");
  const base = parseBR(values[field.currencyBase] ?? "");
  if (!Number.isFinite(amount) || !Number.isFinite(base) || base <= 0) {
    next[field.key] = "";
    return next;
  }
  const converted =
    value === "percentual" ? (amount / base) * 100 : (amount * base) / 100;
  next[field.key] = new Intl.NumberFormat("pt-BR", {
    useGrouping: false,
    maximumFractionDigits: value === "percentual" ? 8 : 2,
  }).format(converted);
  return next;
}
