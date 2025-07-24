import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Try to get existing dashboard data
    let dashboardData = await db.collection("dashboard").findOne({ type: "main" })

    // If no data exists, create sample data
    if (!dashboardData) {
      dashboardData = {
        type: "main",
        currentUsage: 245,
        currentBill: 1850,
        aiPrediction: 280,
        savingsPotential: 320,
        monthlyData: [
          { month: "Jan", usage: 220, cost: 1650 },
          { month: "Feb", usage: 180, cost: 1350 },
          { month: "Mar", usage: 240, cost: 1800 },
          { month: "Apr", usage: 280, cost: 2100 },
          { month: "May", usage: 320, cost: 2400 },
          { month: "Jun", usage: 300, cost: 2250 },
        ],
        usageBreakdown: [
          { category: "Air Conditioning", usage: 40, color: "#3b82f6" },
          { category: "Lighting", usage: 25, color: "#10b981" },
          { category: "Water Heating", usage: 15, color: "#f59e0b" },
          { category: "Refrigerator", usage: 12, color: "#ef4444" },
          { category: "Others", usage: 8, color: "#8b5cf6" },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await db.collection("dashboard").insertOne(dashboardData)
    }

    return NextResponse.json({
      currentUsage: dashboardData.currentUsage,
      currentBill: dashboardData.currentBill,
      aiPrediction: dashboardData.aiPrediction,
      savingsPotential: dashboardData.savingsPotential,
      monthlyData: dashboardData.monthlyData,
      usageBreakdown: dashboardData.usageBreakdown,
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ message: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
