import { NextResponse } from "next/server"
import { connectToDatabase, mockEnergyTips } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    let tips = await db.collection("energyTips").find({}).toArray()

    if (tips.length === 0) {
      // Create sample tips
      await db.collection("energyTips").insertMany(mockEnergyTips)
      tips = mockEnergyTips
    }

    return NextResponse.json(tips)
  } catch (error) {
    console.error("Tips API error:", error)
    return NextResponse.json(mockEnergyTips)
  }
}
