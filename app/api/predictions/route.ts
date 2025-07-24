import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Try to get existing predictions
    let predictions = await db.collection("predictions").findOne({ type: "monthly" })

    // If no predictions exist, create sample data
    if (!predictions) {
      predictions = {
        type: "monthly",
        nextMonthUsage: 280,
        nextMonthCost: 2100,
        efficiencyScore: 78,
        insights: [
          "Your usage typically increases by 15% during summer months",
          "Consider using appliances during off-peak hours (11 PM - 6 AM) to save costs",
          "Your air conditioning accounts for 40% of your electricity consumption",
          "Switching to LED bulbs could save you ₹200 per month",
          "Regular maintenance of your AC can reduce consumption by 10%",
        ],
        trends: {
          usage: [220, 180, 240, 280, 320, 300],
          cost: [1650, 1350, 1800, 2100, 2400, 2250],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await db.collection("predictions").insertOne(predictions)
    }

    return NextResponse.json({
      nextMonthUsage: predictions.nextMonthUsage,
      nextMonthCost: predictions.nextMonthCost,
      efficiencyScore: predictions.efficiencyScore,
      insights: predictions.insights,
      trends: predictions.trends,
    })
  } catch (error) {
    console.error("Predictions API error:", error)
    return NextResponse.json({ message: "Failed to fetch predictions" }, { status: 500 })
  }
}
