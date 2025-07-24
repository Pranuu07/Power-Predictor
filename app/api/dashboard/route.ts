import { NextResponse } from "next/server"
import { connectToDatabase, initialDashboardData } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Try to get existing dashboard data
    let dashboardData = await db.collection("dashboard").findOne({ type: "main" })

    // If no data exists, create initial data with all zeros
    if (!dashboardData) {
      dashboardData = {
        type: "main",
        ...initialDashboardData,
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

// POST method to update dashboard data dynamically
export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const updateData = await request.json()

    // Update the dashboard data
    await db.collection("dashboard").updateOne(
      { type: "main" },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ success: true, message: "Dashboard updated successfully" })
  } catch (error) {
    console.error("Dashboard update error:", error)
    return NextResponse.json({ message: "Failed to update dashboard data" }, { status: 500 })
  }
}
