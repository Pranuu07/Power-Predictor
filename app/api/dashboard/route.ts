import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return initial empty data structure
    const dashboardData = {
      currentUsage: 0,
      currentBill: 0,
      aiPrediction: 0,
      savingsPotential: 0,
      monthlyData: [
        { month: "Jan", usage: 0, cost: 0 },
        { month: "Feb", usage: 0, cost: 0 },
        { month: "Mar", usage: 0, cost: 0 },
        { month: "Apr", usage: 0, cost: 0 },
        { month: "May", usage: 0, cost: 0 },
        { month: "Jun", usage: 0, cost: 0 },
      ],
      usageBreakdown: [
        { category: "Air Conditioning", usage: 0, color: "#3b82f6" },
        { category: "Lighting", usage: 0, color: "#10b981" },
        { category: "Water Heating", usage: 0, color: "#f59e0b" },
        { category: "Refrigerator", usage: 0, color: "#ef4444" },
        { category: "Others", usage: 0, color: "#8b5cf6" },
      ],
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ message: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
