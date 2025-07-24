"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { Calculator, Zap } from "lucide-react"

interface BillResult {
  unitsConsumed: number
  totalBill: number
  slabBreakdown: Array<{
    range: string
    units: number
    rate: number
    amount: string
  }>
  fixedCharges: number
  taxes: number
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          previousReading: Number.parseInt(previousReading),
          currentReading: Number.parseInt(currentReading),
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
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
          <p className="text-gray-600">Calculate your electricity bill with detailed slab breakdown</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Enter Meter Readings</span>
              </CardTitle>
              <CardDescription>Enter your previous and current meter readings to calculate your bill</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={calculateBill} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="previous">Previous Reading (kWh)</Label>
                  <Input
                    id="previous"
                    type="number"
                    value={previousReading}
                    onChange={(e) => setPreviousReading(e.target.value)}
                    placeholder="e.g., 1000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current">Current Reading (kWh)</Label>
                  <Input
                    id="current"
                    type="number"
                    value={currentReading}
                    onChange={(e) => setCurrentReading(e.target.value)}
                    placeholder="e.g., 1250"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Calculating..." : "Calculate Bill"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Bill Breakdown</span>
                </CardTitle>
                <CardDescription>Detailed calculation of your electricity bill</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">₹{result.totalBill}</div>
                    <div className="text-sm text-gray-600">Total Bill Amount</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Units Consumed:</span>
                    <span className="font-medium">{result.unitsConsumed} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fixed Charges:</span>
                    <span className="font-medium">₹{result.fixedCharges}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes:</span>
                    <span className="font-medium">₹{result.taxes}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Slab-wise Breakdown:</h4>
                  <div className="space-y-2">
                    {result.slabBreakdown.map((slab, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{slab.range}</span>
                          <span className="font-medium">₹{slab.amount}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {slab.units} units × ₹{slab.rate}/unit
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
