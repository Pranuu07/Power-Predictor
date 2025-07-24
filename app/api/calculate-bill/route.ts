import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { previousReading, currentReading } = await request.json()

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
      timestamp: new Date().toISOString(),
      slabBreakdown: [
        { range: "0-100 units", rate: 3, amount: Math.min(unitsConsumed, 100) * 3 },
        { range: "101-200 units", rate: 4.5, amount: Math.max(0, Math.min(unitsConsumed - 100, 100)) * 4.5 },
        { range: "201-300 units", rate: 6, amount: Math.max(0, Math.min(unitsConsumed - 200, 100)) * 6 },
        { range: "Above 300 units", rate: 7.5, amount: Math.max(0, unitsConsumed - 300) * 7.5 },
      ].filter((slab) => slab.amount > 0),
    }

    return NextResponse.json(billData)
  } catch (error) {
    console.error("Bill calculation error:", error)
    return NextResponse.json({ message: "Failed to calculate bill" }, { status: 500 })
  }
}
