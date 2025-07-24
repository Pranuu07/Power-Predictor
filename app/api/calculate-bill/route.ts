import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { previousReading, currentReading } = await request.json()
    const { db } = await connectToDatabase()

    if (!previousReading || !currentReading) {
      return NextResponse.json({ message: "Previous and current readings are required" }, { status: 400 })
    }

    const unitsConsumed = currentReading - previousReading

    if (unitsConsumed < 0) {
      return NextResponse.json({ message: "Current reading cannot be less than previous reading" }, { status: 400 })
    }

    // Slab-based calculation (Indian electricity tariff structure)
    let totalCost = 0
    let remainingUnits = unitsConsumed

    // Slab 1: 0-100 units at ₹3 per unit
    if (remainingUnits > 0) {
      const slab1Units = Math.min(remainingUnits, 100)
      totalCost += slab1Units * 3
      remainingUnits -= slab1Units
    }

    // Slab 2: 101-200 units at ₹4.5 per unit
    if (remainingUnits > 0) {
      const slab2Units = Math.min(remainingUnits, 100)
      totalCost += slab2Units * 4.5
      remainingUnits -= slab2Units
    }

    // Slab 3: 201-300 units at ₹6 per unit
    if (remainingUnits > 0) {
      const slab3Units = Math.min(remainingUnits, 100)
      totalCost += slab3Units * 6
      remainingUnits -= slab3Units
    }

    // Slab 4: Above 300 units at ₹7.5 per unit
    if (remainingUnits > 0) {
      totalCost += remainingUnits * 7.5
    }

    // Add fixed charges and taxes
    const fixedCharges = 50
    const taxes = totalCost * 0.1 // 10% tax
    const totalBill = totalCost + fixedCharges + taxes

    const billData = {
      previousReading,
      currentReading,
      unitsConsumed,
      energyCharges: totalCost,
      fixedCharges,
      taxes,
      totalBill: Math.round(totalBill),
      timestamp: new Date(),
    }

    // Save calculation to database
    await db.collection("billCalculations").insertOne(billData)

    // Update dashboard with new usage data
    await db.collection("dashboard").updateOne(
      { type: "main" },
      {
        $set: {
          currentUsage: unitsConsumed,
          currentBill: Math.round(totalBill),
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json(billData)
  } catch (error) {
    console.error("Bill calculation error:", error)
    return NextResponse.json({ message: "Failed to calculate bill" }, { status: 500 })
  }
}
