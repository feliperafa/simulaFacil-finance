"use client";

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
import { money, type Result } from "@/lib/finance";

const colors = ["#2563eb", "#10b981", "#a78bfa", "#f59e0b"];
export default function SimulationChart({
  result,
  type,
}: {
  result: Result;
  type: "balance" | "composition" | "payments";
}) {
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
