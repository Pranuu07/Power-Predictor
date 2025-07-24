"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface UsageChartProps {
  data: Array<{ month: string; usage: number; cost: number }>
}

export function UsageChart({ data }: UsageChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} kWh`, "Usage"]} labelStyle={{ color: "#374151" }} />
        <Line
          type="monotone"
          dataKey="usage"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
