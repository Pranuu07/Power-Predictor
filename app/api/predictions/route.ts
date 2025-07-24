import { NextResponse } from "next/server"
import { connectToDatabase, mockPredictions } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    let predictions = await db.collection("predictions").findOne({})

    if (!predictions) {
      // Create sample predictions
      const samplePredictions = {
        ...mockPredictions,
        lastUpdated: new Date(),
      }

      await db.collection("predictions").insertOne(samplePredictions)
      predictions = samplePredictions
    }

    return NextResponse.json(predictions)
  } catch (error) {
    console.error("Predictions API error:", error)
    return NextResponse.json({
      ...mockPredictions,
      lastUpdated: new Date(),
    })
  }
}
