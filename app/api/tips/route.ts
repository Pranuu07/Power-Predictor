import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return basic tips - client will handle personalization based on local data
    const tips = [
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
      {
        id: "1",
        category: "Lighting",
        title: "Switch to LED Bulbs",
        description: "LED bulbs use 75% less energy than incandescent bulbs and last 25 times longer",
        savings: "₹200/month",
        difficulty: "Easy",
        priority: "Medium",
      },
      {
        id: "2",
        category: "Cooling",
        title: "Optimize AC Temperature",
        description: "Set your AC to 24°C instead of 22°C. Each degree higher can save 6% energy",
        savings: "₹300/month",
        difficulty: "Easy",
        priority: "Medium",
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
    ]

    return NextResponse.json({ tips })
  } catch (error) {
    console.error("Tips API error:", error)
    return NextResponse.json({ tips: [] })
  }
}
