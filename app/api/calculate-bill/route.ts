import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { previousReading, currentReading } = await request.json()

    const unitsConsumed = currentReading - previousReading

    // Electricity slab rates (example rates)
    const slabs = [
      { min: 0, max: 100, rate: 3.5 },
      { min: 101, max: 200, rate: 4.5 },
      { min: 201, max: 300, rate: 6.0 },
      { min: 301, max: Number.POSITIVE_INFINITY, rate: 7.5 },
    ]

    let totalBill = 0
    let remainingUnits = unitsConsumed
    const slabBreakdown = []

    for (const slab of slabs) {
      if (remainingUnits <= 0) break

      const slabUnits = Math.min(remainingUnits, slab.max - slab.min + 1)
      const slabAmount = slabUnits * slab.rate
      totalBill += slabAmount

      slabBreakdown.push({
        range: `${slab.min}-${slab.max === Number.POSITIVE_INFINITY ? "∞" : slab.max} units`,
        units: slabUnits,
        rate: slab.rate,
        amount: slabAmount.toFixed(2),
      })

      remainingUnits -= slabUnits
    }

    // Add fixed charges and taxes
    const fixedCharges = 50
    const taxes = totalBill * 0.1
    totalBill += fixedCharges + taxes

    const result = {
      unitsConsumed,
      totalBill: Math.round(totalBill),
      slabBreakdown,
      fixedCharges,
      taxes: Math.round(taxes),
      timestamp: new Date(),
    }

    // Try to save calculation to MongoDB
    try {
      const { db } = await connectToDatabase()
      await db.collection("billCalculations").insertOne({
        ...result,
        previousReading,
        currentReading,
      })
    } catch (dbError) {
      console.warn("Could not save to database:", dbError)
      // Continue without database - calculation still works
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Bill calculation error:", error)
    return NextResponse.json({ message: "Bill calculation failed" }, { status: 500 })
  }
}
