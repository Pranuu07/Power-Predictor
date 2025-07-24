import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return basic prediction structure - client will handle local storage
    const predictions = {
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
    }

    return NextResponse.json(predictions)
  } catch (error) {
    console.error("Predictions API error:", error)
    return NextResponse.json({ message: "Failed to generate predictions" }, { status: 500 })
  }
}
