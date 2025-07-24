"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Calculator, Zap, DollarSign } from "lucide-react"
import { saveBillCalculation, generatePredictions, getDashboardData, updateMonthlyHistory } from "@/lib/localStorage"

interface BillResult {
  previousReading: number
  currentReading: number
  unitsConsumed: number
  energyCharges: number
  fixedCharges: number
  taxes: number
  totalBill: number
  slabBreakdown: Array<{ range: string; rate: number; amount: number }>
}

export default function BillCalculator() {
  const [previousReading, setPreviousReading] = useState("")
  const [currentReading, setCurrentReading] = useState("")
  const [result, setResult] = useState<BillResult | null>(null)
  const [loading, setLoading] = useState(false)

  const calculateBill = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/calculate-bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          previousReading: Number.parseFloat(previousReading),
          currentReading: Number.parseFloat(currentReading),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)

        // Save to local storage and update history
        saveBillCalculation({
          previousReading: data.previousReading,
          currentReading: data.currentReading,
          unitsConsumed: data.unitsConsumed,
          energyCharges: data.energyCharges,
          fixedCharges: data.fixedCharges,
          taxes: data.taxes,
          totalBill: data.totalBill,
        })

        // Update monthly history
        updateMonthlyHistory(data.unitsConsumed, data.totalBill)

        // Update predictions with new data
        const dashboardData = getDashboardData()
        generatePredictions(dashboardData)

        // Trigger dashboard update
        window.dispatchEvent(new Event("dashboardUpdate"))
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to calculate bill")
      }
    } catch (error) {
      console.error("Calculation failed:", error)
      alert("Failed to calculate bill. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bill Calculator</h1>
          <p className="text-gray-600">Enter your meter readings to calculate your electricity bill</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculate Your Bill
              </CardTitle>
              <CardDescription>
                Enter your previous and current meter readings to get an accurate bill calculation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={calculateBill} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="previous">Previous Reading (kWh)</Label>
                  <Input
                    id="previous"
                    type="number"
                    value={previousReading}
                    onChange={(e) => setPreviousReading(e.target.value)}
                    placeholder="Enter previous meter reading"
                    required
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current">Current Reading (kWh)</Label>
                  <Input
                    id="current"
                    type="number"
                    value={currentReading}
                    onChange={(e) => setCurrentReading(e.target.value)}
                    placeholder="Enter current meter reading"
                    required
                    min="0"
                    step="0.1"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate Bill
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Bill Calculation Result
                </CardTitle>
                <CardDescription>Your electricity bill breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Units Consumed</p>
                    <p className="text-2xl font-bold text-blue-600">{result.unitsConsumed}</p>
                    <p className="text-xs text-gray-500">kWh</p>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Total Bill</p>
                    <p className="text-2xl font-bold text-green-600">₹{result.totalBill}</p>
                    <p className="text-xs text-gray-500">Including all charges</p>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Bill Breakdown</h4>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Energy Charges</span>
                      <span className="font-medium">₹{result.energyCharges.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fixed Charges</span>
                      <span className="font-medium">₹{result.fixedCharges}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes (10%)</span>
                      <span className="font-medium">₹{result.taxes.toFixed(2)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-green-600">₹{result.totalBill}</span>
                    </div>
                  </div>

                  {/* Slab Breakdown */}
                  {result.slabBreakdown && result.slabBreakdown.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Slab-wise Charges</h4>
                      {result.slabBreakdown.map((slab, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {slab.range} @ ₹{slab.rate}/unit
                          </span>
                          <span className="font-medium">₹{slab.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This calculation is based on standard tariff rates. Actual rates may vary by
                    state and electricity board.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          {!result && (
            <Card>
              <CardHeader>
                <CardTitle>How to Use</CardTitle>
                <CardDescription>Follow these steps to calculate your electricity bill</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Find Your Meter Reading</h4>
                    <p className="text-sm text-gray-600">
                      Check your electricity meter and note down the current reading in kWh
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Enter Previous Reading</h4>
                    <p className="text-sm text-gray-600">Input the meter reading from your last electricity bill</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Calculate Bill</h4>
                    <p className="text-sm text-gray-600">
                      Click calculate to get your detailed bill breakdown with slab-wise charges
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> Regular tracking helps you monitor your energy consumption patterns and
                    identify opportunities to save money.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
