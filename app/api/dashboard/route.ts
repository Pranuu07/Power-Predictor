import { NextResponse } from "next/server"
import { connectToDatabase, mockDashboardData } from "@/lib/mongodb"

export async function GET() {
  try {
    // Try to connect to database
    const { db } = await connectToDatabase()

    // Check if data exists, if not create sample data
    let dashboardData = await db.collection("dashboard").findOne({})

    if (!dashboardData) {
      // Create sample data
      const sampleData = {
        ...mockDashboardData,
        lastUpdated: new Date(),
      }

      await db.collection("dashboard").insertOne(sampleData)
      dashboardData = sampleData
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Dashboard API error:", error)
    // Return mock data if database is not available
    return NextResponse.json({
      ...mockDashboardData,
      lastUpdated: new Date(),
    })
  }
}
