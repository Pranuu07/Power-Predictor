import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Try to get existing tips
    let tips = await db.collection("energyTips").find({}).toArray()

    // If no tips exist, create sample data
    if (tips.length === 0) {
      const sampleTips = [
        {
          category: "Lighting",
          title: "Switch to LED Bulbs",
          description: "Replace incandescent bulbs with LED bulbs. They use 75% less energy and last 25 times longer.",
          savings: "₹200/month",
          icon: "lightbulb",
        },
        {
          category: "Lighting",
          title: "Use Natural Light",
          description: "Open curtains and blinds during the day to reduce the need for artificial lighting.",
          savings: "₹150/month",
          icon: "sun",
        },
        {
          category: "Cooling",
          title: "Optimal AC Temperature",
          description: "Set your air conditioner to 24°C or higher. Each degree lower increases consumption by 6%.",
          savings: "₹300/month",
          icon: "thermometer",
        },
        {
          category: "Cooling",
          title: "Regular AC Maintenance",
          description: "Clean AC filters monthly and service annually to maintain efficiency.",
          savings: "₹250/month",
          icon: "zap",
        },
        {
          category: "Heating",
          title: "Water Heater Timer",
          description: "Use a timer for your water heater to heat water only when needed.",
          savings: "₹180/month",
          icon: "droplets",
        },
        {
          category: "Appliances",
          title: "Unplug Devices",
          description: "Unplug electronics when not in use to avoid phantom power consumption.",
          savings: "₹100/month",
          icon: "zap",
        },
        {
          category: "Appliances",
          title: "Energy Star Appliances",
          description: "Choose energy-efficient appliances with 5-star ratings when replacing old ones.",
          savings: "₹400/month",
          icon: "zap",
        },
        {
          category: "General",
          title: "Off-Peak Usage",
          description: "Use high-power appliances during off-peak hours (11 PM - 6 AM) for lower rates.",
          savings: "₹200/month",
          icon: "lightbulb",
        },
      ]

      await db.collection("energyTips").insertMany(sampleTips)
      tips = sampleTips
    }

    return NextResponse.json({ tips })
  } catch (error) {
    console.error("Tips API error:", error)
    return NextResponse.json({ tips: [] })
  }
}
