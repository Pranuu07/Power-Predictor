"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calculator, Zap, DollarSign, TrendingUp } from "lucide-react"
import { saveBillCalculation, updateDashboardData } from "@/lib/localStorage"
import { ProtectedRoute } from "@/components/protected-route"

interface BillResult {
  unitsConsumed: number
  energyCharges: number
  fixedCharges: number
  taxes: number
  totalBill: number
}

export default function CalculatorPage() {
  const [previousReading, setPreviousReading] = useState("")
  const [currentReading, setCurrentReading] = useState("")
  const [result, setResult] = useState<BillResult | null>(null)
  const [error, setError] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateBill = () => {
    setError("")
    setIsCalculating(true)

    const prev = Number.parseFloat(previousReading)
    const curr = Number.parseFloat(currentReading)

    if (isNaN(prev) || isNaN(curr)) {
      setError("Please enter valid meter readings")
      setIsCalculating(false)
      return
    }

    if (curr <= prev) {
      setError("Current reading must be greater than previous reading")
      setIsCalculating(false)
      return
    }

    const unitsConsumed = curr - prev

    // Tiered pricing structure (example rates)
    let energyCharges = 0
    if (unitsConsumed <= 100) {
      energyCharges = unitsConsumed * 3.5
    } else if (unitsConsumed <= 200) {
      energyCharges = 100 * 3.5 + (unitsConsumed - 100) * 4.5
    } else if (unitsConsumed <= 300) {
      energyCharges = 100 * 3.5 + 100 * 4.5 + (unitsConsumed - 200) * 6.0
    } else {
      energyCharges = 100 * 3.5 + 100 * 4.5 + 100 * 6.0 + (unitsConsumed - 300) * 7.5
    }

    const fixedCharges = 50 // Fixed monthly charge
    const taxes = (energyCharges + fixedCharges) * 0.18 // 18% tax
    const totalBill = energyCharges + fixedCharges + taxes

    const billResult: BillResult = {
      unitsConsumed,
      energyCharges,
      fixedCharges,
      taxes,
      totalBill,
    }

    setResult(billResult)

    // Save to localStorage
    saveBillCalculation({
      previousReading: prev,
      currentReading: curr,
      unitsConsumed,
      energyCharges,
      fixedCharges,
      taxes,
      totalBill,
    })

    // Update dashboard data
    updateDashboardData({
      currentUsage: unitsConsumed,
      currentBill: totalBill,
      savingsPotential: Math.max(0, totalBill * 0.15), // 15% potential savings
      aiPrediction: unitsConsumed * 1.1, // 10% increase prediction
    })

    setIsCalculating(false)
  }

  const resetForm = () => {
    setPreviousReading("")
    setCurrentReading("")
    setResult(null)
    setError("")
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bill Calculator</h1>
          <p className="text-gray-600 mt-2">Calculate your electricity bill based on meter readings</p>
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
                Enter your previous and current meter readings to calculate your electricity bill
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="previous">Previous Meter Reading (kWh)</Label>
                  <Input
                    id="previous"
                    type="number"
                    value={previousReading}
                    onChange={(e) => setPreviousReading(e.target.value)}
                    placeholder="Enter previous reading"
                    min="0"
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current">Current Meter Reading (kWh)</Label>
                  <Input
                    id="current"
                    type="number"
                    value={currentReading}
                    onChange={(e) => setCurrentReading(e.target.value)}
                    placeholder="Enter current reading"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={calculateBill}
                  disabled={isCalculating || !previousReading || !currentReading}
                  className="flex-1"
                >
                  {isCalculating ? "Calculating..." : "Calculate Bill"}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Bill Breakdown
              </CardTitle>
              <CardDescription>
                {result ? "Your calculated electricity bill" : "Results will appear here after calculation"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">Units Consumed</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-700">{result.unitsConsumed.toFixed(1)} kWh</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Total Bill</span>
                      </div>
                      <div className="text-2xl font-bold text-green-700">₹{result.totalBill.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Energy Charges</span>
                      <span className="font-medium">₹{result.energyCharges.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Fixed Charges</span>
                      <span className="font-medium">₹{result.fixedCharges.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Taxes (18%)</span>
                      <span className="font-medium">₹{result.taxes.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-gray-50 px-4 rounded-lg">
                      <span className="font-semibold text-lg">Total Amount</span>
                      <span className="font-bold text-xl text-green-600">₹{result.totalBill.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Rate Structure</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>0-100 kWh: ₹3.50 per unit</div>
                      <div>101-200 kWh: ₹4.50 per unit</div>
                      <div>201-300 kWh: ₹6.00 per unit</div>
                      <div>Above 300 kWh: ₹7.50 per unit</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Enter your meter readings to calculate your bill</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Read Your Meter</CardTitle>
            <CardDescription>Tips for accurate meter reading</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Digital Meters</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Read the numbers from left to right</li>
                  <li>• Include decimal places if shown</li>
                  <li>• Note the reading at the same time each month</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Analog Meters</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Read dials from left to right</li>
                  <li>• If pointer is between numbers, use the lower number</li>
                  <li>• Double-check by reading again</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
