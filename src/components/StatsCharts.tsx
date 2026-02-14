"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface WorkLog {
  id: string;
  hours: number;
  date: Date;
  notes: string | null;
  actor: {
    id: string;
    name: string;
    label: string;
  };
  project: {
    id: string;
    name: string;
  } | null;
}

interface MoneyEntry {
  id: string;
  amount: number;
  description: string | null;
  date: Date;
  project: {
    id: string;
    name: string;
  } | null;
}

interface StatsChartsProps {
  workLogs: WorkLog[];
  moneyEntries: MoneyEntry[];
}

// Helper pour grouper par jour
function groupByDay<T extends { date: Date }>(
  items: T[],
  valueExtractor: (item: T) => number
): { date: string; value: number }[] {
  const grouped = new Map<string, number>();

  items.forEach((item) => {
    const date = new Date(item.date);
    const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

    const current = grouped.get(dateKey) || 0;
    grouped.set(dateKey, current + valueExtractor(item));
  });

  // Convertir en array et trier par date
  return Array.from(grouped.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export default function StatsCharts({ workLogs, moneyEntries }: StatsChartsProps) {
  // Préparer les données pour heures par jour
  const hoursData = groupByDay(workLogs, (log) => log.hours);

  // Préparer les données pour argent par jour
  const moneyData = groupByDay(moneyEntries, (entry) => entry.amount);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Heures par jour */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-4">
          Heures travaillées par jour
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hoursData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8" }}
              tickFormatter={(date) => {
                const d = new Date(date);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }}
            />
            <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "0.5rem",
                color: "#fff",
              }}
              labelFormatter={(date) => {
                const d = new Date(date);
                return d.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
              }}
              formatter={(value: number) => [`${value.toFixed(1)}h`, "Heures"]}
            />
            <Legend wrapperStyle={{ color: "#94a3b8" }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 6 }}
              name="Heures"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Argent par jour */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-4">
          Revenus par jour
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={moneyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8" }}
              tickFormatter={(date) => {
                const d = new Date(date);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }}
            />
            <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "0.5rem",
                color: "#fff",
              }}
              labelFormatter={(date) => {
                const d = new Date(date);
                return d.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
              }}
              formatter={(value: number) => [`${value.toFixed(2)} CHF`, "Revenus"]}
            />
            <Legend wrapperStyle={{ color: "#94a3b8" }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 4 }}
              activeDot={{ r: 6 }}
              name="Revenus (CHF)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
