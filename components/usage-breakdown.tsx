"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface UsageBreakdownProps {
  data: Array<{ category: string; usage: number; color: string }>
}

export function UsageBreakdown({ data }: UsageBreakdownProps) {
  const chartData =
    data.length > 0
      ? data
      : [
          { category: "Air Conditioning", usage: 40, color: "#3b82f6" },
          { category: "Lighting", usage: 25, color: "#10b981" },
          { category: "Water Heating", usage: 15, color: "#f59e0b" },
          { category: "Refrigerator", usage: 12, color: "#ef4444" },
          { category: "Others", usage: 8, color: "#8b5cf6" },
        ]

  return (
    <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8">
      <div className="w-full lg:w-1/2">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="usage"
              label={({ category, usage }) => `${usage}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, "Usage"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full lg:w-1/2 space-y-3">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium">{item.category}</span>
            </div>
            <span className="text-sm font-bold">{item.usage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
