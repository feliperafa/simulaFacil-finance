"use client";

import type { ComponentProps } from "react";
import { NumericFormat } from "react-number-format";
import { parseBR } from "@/lib/finance";

type CurrencyInputProps = Omit<
  ComponentProps<"input">,
  "value" | "defaultValue" | "onChange" | "type" | "inputMode"
> & {
  value: string;
  onValueChange: (value: string) => void;
};

export function CurrencyInput({
  value,
  onValueChange,
  ...props
}: CurrencyInputProps) {
  const parsed = parseBR(value);
  return (
    <NumericFormat
      {...props}
      type="text"
      inputMode="decimal"
      data-currency-input="BRL"
      value={
        value.trim() === "" ? "" : Number.isFinite(parsed) ? parsed : value
      }
      thousandSeparator="."
      decimalSeparator=","
      allowedDecimalSeparators={[","]}
      decimalScale={2}
      fixedDecimalScale
      prefix="R$ "
      allowNegative={false}
      placeholder="R$ 0,00"
      onValueChange={({ formattedValue }, sourceInfo) => {
        if (sourceInfo.source === "event") onValueChange(formattedValue);
      }}
    />
  );
}
