import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Get current usage data for personalized tips
    const dashboardData = await db.collection("dashboard").findOne({ type: "main" })
    const currentUsage = dashboardData?.currentUsage || 0

    // Generate personalized tips based on usage
    const tips = generatePersonalizedTips(currentUsage)

    // Save tips to database
    await db.collection("energyTips").updateOne(
      { type: "current" },
      {
        $set: {
          tips,
          generatedFor: currentUsage,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ tips })
  } catch (error) {
    console.error("Tips API error:", error)
    return NextResponse.json({ message: "Failed to fetch tips" }, { status: 500 })
  }
}

function generatePersonalizedTips(usage: number) {
  const baseTips = [
    {
      id: "1",
      category: "Lighting",
      title: "Switch to LED Bulbs",
      description: "LED bulbs use 75% less energy than incandescent bulbs and last 25 times longer",
      savings: "₹200/month",
      difficulty: "Easy",
      priority: usage > 100 ? "High" : "Medium",
    },
    {
      id: "2",
      category: "Cooling",
      title: "Optimize AC Temperature",
      description: "Set your AC to 24°C instead of 22°C. Each degree higher can save 6% energy",
      savings: "₹300/month",
      difficulty: "Easy",
      priority: usage > 200 ? "High" : "Medium",
    },
    {
      id: "3",
      category: "Appliances",
      title: "Unplug Devices When Not in Use",
      description: "Electronics consume power even when turned off. Unplug to avoid phantom loads",
      savings: "₹150/month",
      difficulty: "Easy",
      priority: "Medium",
    },
    {
      id: "4",
      category: "Water Heating",
      title: "Use Timer for Water Heater",
      description: "Heat water only when needed. Use a timer to automatically turn off the heater",
      savings: "₹250/month",
      difficulty: "Medium",
      priority: usage > 150 ? "High" : "Low",
    },
    {
      id: "5",
      category: "Lighting",
      title: "Use Natural Light",
      description: "Open curtains and blinds during daytime to reduce artificial lighting needs",
      savings: "₹100/month",
      difficulty: "Easy",
      priority: "Medium",
    },
    {
      id: "6",
      category: "Appliances",
      title: "Regular Appliance Maintenance",
      description: "Clean AC filters, defrost refrigerator, and service appliances regularly",
      savings: "₹180/month",
      difficulty: "Medium",
      priority: usage > 250 ? "High" : "Medium",
    },
  ]

  // Add usage-specific tips
  if (usage === 0) {
    return [
      {
        id: "start",
        category: "Getting Started",
        title: "Start Tracking Your Usage",
        description:
          "Use the Bill Calculator to enter your meter readings and begin monitoring your energy consumption",
        savings: "Track to save",
        difficulty: "Easy",
        priority: "High",
      },
      ...baseTips.slice(0, 3),
    ]
  }

  if (usage > 300) {
    baseTips.unshift({
      id: "high-usage",
      category: "Urgent",
      title: "High Usage Alert",
      description:
        "Your usage is quite high. Focus on reducing AC usage and switching to efficient appliances immediately",
      savings: "₹500/month",
      difficulty: "Medium",
      priority: "Critical",
    })
  }

  return baseTips
}
