"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface CostChartProps {
  data: Array<{ month: string; usage: number; cost: number }>
}

export function CostChart({ data }: CostChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => [`₹${value}`, "Cost"]} labelStyle={{ color: "#374151" }} />
        <Bar dataKey="cost" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
