import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Get current dashboard data to base predictions on
    const dashboardData = await db.collection("dashboard").findOne({ type: "main" })
    const recentCalculations = await db
      .collection("billCalculations")
      .find({})
      .sort({ timestamp: -1 })
      .limit(6)
      .toArray()

    let predictions

    if (!dashboardData || dashboardData.currentUsage === 0) {
      // No data yet - return zero predictions
      predictions = {
        type: "monthly",
        nextMonthUsage: 0,
        nextMonthCost: 0,
        efficiencyScore: 0,
        trend: "stable",
        confidence: 0,
        recommendations: [
          "Start tracking your energy usage with the Bill Calculator",
          "Enter your meter readings to get personalized predictions",
          "Check back after a few calculations for AI insights",
        ],
        createdAt: new Date(),
      }
    } else {
      // Calculate predictions based on current data
      const currentUsage = dashboardData.currentUsage
      const currentBill = dashboardData.currentBill

      // Simple prediction algorithm (can be enhanced with ML)
      const avgUsage =
        recentCalculations.length > 0
          ? recentCalculations.reduce((sum, calc) => sum + calc.unitsConsumed, 0) / recentCalculations.length
          : currentUsage

      const nextMonthUsage = Math.round(avgUsage * 1.05) // 5% increase prediction
      const nextMonthCost = Math.round(nextMonthUsage * 5.5) // Average rate

      // Calculate efficiency score
      const efficiencyScore = Math.max(0, Math.min(100, 100 - currentUsage / 10))

      predictions = {
        type: "monthly",
        nextMonthUsage,
        nextMonthCost,
        efficiencyScore: Math.round(efficiencyScore),
        trend: nextMonthUsage > currentUsage ? "increasing" : nextMonthUsage < currentUsage ? "decreasing" : "stable",
        confidence: recentCalculations.length > 2 ? 85 : 60,
        recommendations: generateRecommendations(currentUsage, efficiencyScore),
        createdAt: new Date(),
      }
    }

    // Save/update predictions
    await db.collection("predictions").updateOne({ type: "monthly" }, { $set: predictions }, { upsert: true })

    return NextResponse.json(predictions)
  } catch (error) {
    console.error("Predictions API error:", error)
    return NextResponse.json({ message: "Failed to generate predictions" }, { status: 500 })
  }
}

function generateRecommendations(usage: number, efficiency: number): string[] {
  const recommendations = []

  if (usage === 0) {
    return [
      "Start tracking your energy usage with the Bill Calculator",
      "Enter your meter readings to get personalized predictions",
      "Check back after a few calculations for AI insights",
    ]
  }

  if (usage > 300) {
    recommendations.push("Your usage is quite high. Consider reducing AC usage during peak hours")
    recommendations.push("Switch to energy-efficient appliances to reduce consumption")
  } else if (usage > 200) {
    recommendations.push("Moderate usage detected. Optimize appliance usage timing")
    recommendations.push("Consider using natural lighting during daytime")
  } else {
    recommendations.push("Good energy usage! Maintain current consumption patterns")
  }

  if (efficiency < 50) {
    recommendations.push("Focus on improving energy efficiency with LED bulbs")
    recommendations.push("Unplug devices when not in use to reduce phantom loads")
  } else if (efficiency < 75) {
    recommendations.push("Regular maintenance of appliances can improve efficiency")
    recommendations.push("Use programmable thermostats for better control")
  }

  recommendations.push("Monitor your usage regularly for better energy management")

  return recommendations.slice(0, 4) // Return max 4 recommendations
}
