"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { Calculator, Zap, DollarSign, FileText, CheckCircle } from "lucide-react"
import { saveBillCalculation } from "@/lib/localStorage"
import { useRouter } from "next/navigation"

export default function BillCalculator() {
  const [previousReading, setPreviousReading] = useState("")
  const [currentReading, setCurrentReading] = useState("")
  const [result, setResult] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const calculateBill = () => {
    const prev = Number.parseFloat(previousReading)
    const current = Number.parseFloat(currentReading)

    if (isNaN(prev) || isNaN(current) || current <= prev) {
      alert("Please enter valid meter readings. Current reading must be greater than previous reading.")
      return
    }

    setIsCalculating(true)

    // Simulate calculation delay
    setTimeout(() => {
      const unitsConsumed = current - prev

      // Indian electricity tariff calculation (simplified)
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
      const taxes = Math.round((energyCharges + fixedCharges) * 0.18) // 18% GST
      const totalBill = Math.round(energyCharges + fixedCharges + taxes)

      const calculation = {
        previousReading: prev,
        currentReading: current,
        unitsConsumed,
        energyCharges: Math.round(energyCharges),
        fixedCharges,
        taxes,
        totalBill,
      }

      // Save to localStorage
      saveBillCalculation(calculation)

      setResult(calculation)
      setIsCalculating(false)
      setShowSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1000)
  }

  const handleReset = () => {
    setPreviousReading("")
    setCurrentReading("")
    setResult(null)
    setShowSuccess(false)
  }

  const handleViewDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Calculator className="h-8 w-8" />
            Bill Calculator
          </h1>
          <p className="text-gray-600">Calculate your electricity bill based on meter readings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Enter Meter Readings
              </CardTitle>
              <CardDescription>
                Enter your previous and current electricity meter readings to calculate your bill
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="previous">Previous Reading (kWh)</Label>
                <Input
                  id="previous"
                  type="number"
                  placeholder="Enter previous meter reading"
                  value={previousReading}
                  onChange={(e) => setPreviousReading(e.target.value)}
                  disabled={isCalculating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current">Current Reading (kWh)</Label>
                <Input
                  id="current"
                  type="number"
                  placeholder="Enter current meter reading"
                  value={currentReading}
                  onChange={(e) => setCurrentReading(e.target.value)}
                  disabled={isCalculating}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={calculateBill}
                  disabled={!previousReading || !currentReading || isCalculating}
                  className="flex-1"
                >
                  {isCalculating ? (
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

                <Button onClick={handleReset} variant="outline">
                  Reset
                </Button>
              </div>

              {showSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-medium">Bill calculated and saved successfully!</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Bill Calculation Result
              </CardTitle>
              <CardDescription>
                {result ? "Your electricity bill breakdown" : "Results will appear here after calculation"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Units Consumed</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-900">{result.unitsConsumed} kWh</div>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Total Bill</span>
                      </div>
                      <div className="text-2xl font-bold text-green-900">₹{result.totalBill}</div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-semibold text-gray-900">Bill Breakdown:</h4>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Previous Reading:</span>
                        <span className="font-medium">{result.previousReading} kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Reading:</span>
                        <span className="font-medium">{result.currentReading} kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Energy Charges:</span>
                        <span className="font-medium">₹{result.energyCharges}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fixed Charges:</span>
                        <span className="font-medium">₹{result.fixedCharges}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxes (18% GST):</span>
                        <span className="font-medium">₹{result.taxes}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t font-semibold">
                        <span>Total Amount:</span>
                        <span className="text-green-600">₹{result.totalBill}</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleViewDashboard} className="w-full mt-4">
                    View Updated Dashboard
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Enter your meter readings and click calculate to see your bill</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How the Calculation Works</CardTitle>
            <CardDescription>Understanding your electricity bill calculation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Tariff Slabs (per kWh):</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>0-100 units:</span>
                    <span className="font-medium">₹3.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>101-200 units:</span>
                    <span className="font-medium">₹4.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>201-300 units:</span>
                    <span className="font-medium">₹6.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Above 300 units:</span>
                    <span className="font-medium">₹7.50</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Additional Charges:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Fixed Charges:</span>
                    <span className="font-medium">₹50/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST:</span>
                    <span className="font-medium">18%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
