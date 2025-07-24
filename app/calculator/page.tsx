"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Calculator, Zap, TrendingUp, Save, AlertCircle } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { getStoredData, saveStoredData } from "@/lib/localStorage"

interface Appliance {
  id: string
  name: string
  wattage: number
  hoursPerDay: number
  daysPerMonth: number
  monthlyCost: number
}

interface RateStructure {
  name: string
  baseRate: number
  peakRate?: number
  offPeakRate?: number
  peakHours?: string
  fixedCharge: number
}

const commonAppliances = [
  { name: "LED Light Bulb", wattage: 10 },
  { name: "Incandescent Bulb", wattage: 60 },
  { name: "Ceiling Fan", wattage: 75 },
  { name: "Desktop Computer", wattage: 300 },
  { name: "Laptop", wattage: 65 },
  { name: 'TV (LED 32")', wattage: 100 },
  { name: 'TV (LED 55")', wattage: 150 },
  { name: "Refrigerator", wattage: 400 },
  { name: "Microwave", wattage: 1000 },
  { name: "Washing Machine", wattage: 500 },
  { name: "Dryer", wattage: 3000 },
  { name: "Dishwasher", wattage: 1800 },
  { name: "Air Conditioner (Window)", wattage: 1200 },
  { name: "Air Conditioner (Central)", wattage: 3500 },
  { name: "Space Heater", wattage: 1500 },
  { name: "Water Heater", wattage: 4000 },
]

const rateStructures: RateStructure[] = [
  {
    name: "Flat Rate",
    baseRate: 0.12,
    fixedCharge: 10,
  },
  {
    name: "Time of Use",
    baseRate: 0.1,
    peakRate: 0.18,
    offPeakRate: 0.08,
    peakHours: "4 PM - 9 PM",
    fixedCharge: 15,
  },
  {
    name: "Tiered Rate",
    baseRate: 0.11,
    peakRate: 0.15,
    offPeakRate: 0.09,
    peakHours: "Above 500 kWh",
    fixedCharge: 12,
  },
]

export default function CalculatorPage() {
  const [appliances, setAppliances] = useState<Appliance[]>([])
  const [selectedRateStructure, setSelectedRateStructure] = useState<RateStructure>(rateStructures[0])
  const [newAppliance, setNewAppliance] = useState({
    name: "",
    wattage: "",
    hoursPerDay: "",
    daysPerMonth: "30",
  })
  const [totalUsage, setTotalUsage] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [savedMessage, setSavedMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    calculateBill()
  }, [appliances, selectedRateStructure])

  const addAppliance = () => {
    if (!newAppliance.name || !newAppliance.wattage || !newAppliance.hoursPerDay) {
      setError("Please fill in all appliance fields")
      return
    }

    const wattage = Number.parseFloat(newAppliance.wattage)
    const hoursPerDay = Number.parseFloat(newAppliance.hoursPerDay)
    const daysPerMonth = Number.parseFloat(newAppliance.daysPerMonth)

    if (wattage <= 0 || hoursPerDay <= 0 || daysPerMonth <= 0) {
      setError("All values must be greater than 0")
      return
    }

    if (hoursPerDay > 24) {
      setError("Hours per day cannot exceed 24")
      return
    }

    if (daysPerMonth > 31) {
      setError("Days per month cannot exceed 31")
      return
    }

    const monthlyUsage = (wattage * hoursPerDay * daysPerMonth) / 1000 // Convert to kWh
    const monthlyCost = monthlyUsage * selectedRateStructure.baseRate

    const appliance: Appliance = {
      id: Date.now().toString(),
      name: newAppliance.name,
      wattage,
      hoursPerDay,
      daysPerMonth,
      monthlyCost,
    }

    setAppliances([...appliances, appliance])
    setNewAppliance({
      name: "",
      wattage: "",
      hoursPerDay: "",
      daysPerMonth: "30",
    })
    setError("")
  }

  const removeAppliance = (id: string) => {
    setAppliances(appliances.filter((app) => app.id !== id))
  }

  const addCommonAppliance = (commonApp: { name: string; wattage: number }) => {
    setNewAppliance({
      ...newAppliance,
      name: commonApp.name,
      wattage: commonApp.wattage.toString(),
    })
  }

  const calculateBill = () => {
    if (appliances.length === 0) {
      setTotalUsage(0)
      setTotalCost(0)
      setShowResults(false)
      return
    }

    let usage = 0
    let cost = 0

    appliances.forEach((appliance) => {
      const monthlyUsage = (appliance.wattage * appliance.hoursPerDay * appliance.daysPerMonth) / 1000
      usage += monthlyUsage

      // Calculate cost based on rate structure
      let applianceCost = 0
      if (selectedRateStructure.name === "Time of Use") {
        // Assume 30% peak hours, 70% off-peak
        const peakUsage = monthlyUsage * 0.3
        const offPeakUsage = monthlyUsage * 0.7
        applianceCost =
          peakUsage * (selectedRateStructure.peakRate || selectedRateStructure.baseRate) +
          offPeakUsage * (selectedRateStructure.offPeakRate || selectedRateStructure.baseRate)
      } else if (selectedRateStructure.name === "Tiered Rate") {
        // Simple tiered calculation
        if (usage <= 500) {
          applianceCost = monthlyUsage * selectedRateStructure.baseRate
        } else {
          const baseUsage = Math.min(monthlyUsage, 500)
          const tierUsage = monthlyUsage - baseUsage
          applianceCost =
            baseUsage * selectedRateStructure.baseRate +
            tierUsage * (selectedRateStructure.peakRate || selectedRateStructure.baseRate)
        }
      } else {
        applianceCost = monthlyUsage * selectedRateStructure.baseRate
      }

      cost += applianceCost
    })

    // Add fixed charge
    cost += selectedRateStructure.fixedCharge

    setTotalUsage(usage)
    setTotalCost(cost)
    setShowResults(true)
  }

  const saveBillCalculation = () => {
    if (appliances.length === 0) {
      setError("Add at least one appliance before saving")
      return
    }

    const calculation = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      totalUsage,
      totalCost,
      appliances: appliances.map((app) => ({
        name: app.name,
        wattage: app.wattage,
        hoursPerDay: app.hoursPerDay,
        daysPerMonth: app.daysPerMonth,
        monthlyCost: ((app.wattage * app.hoursPerDay * app.daysPerMonth) / 1000) * selectedRateStructure.baseRate,
      })),
      rateStructure: selectedRateStructure.name,
      notes: `Calculated with ${appliances.length} appliances`,
    }

    const data = getStoredData()
    const billCalculations = data.billCalculations || []
    billCalculations.push(calculation)

    saveStoredData({ ...data, billCalculations })
    setSavedMessage("Bill calculation saved successfully!")
    setTimeout(() => setSavedMessage(""), 3000)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Bill Calculator</h1>
            <p className="text-gray-600 mt-2">
              Calculate your electricity bill by adding your appliances and their usage patterns.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {savedMessage && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <Save className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{savedMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Rate Structure Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Rate Structure</CardTitle>
                  <CardDescription>
                    Select your electricity rate structure to get accurate calculations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {rateStructures.map((rate) => (
                      <Card
                        key={rate.name}
                        className={`cursor-pointer transition-colors ${
                          selectedRateStructure.name === rate.name ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedRateStructure(rate)}
                      >
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2">{rate.name}</h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Base: ${rate.baseRate}/kWh</div>
                            {rate.peakRate && <div>Peak: ${rate.peakRate}/kWh</div>}
                            {rate.offPeakRate && <div>Off-peak: ${rate.offPeakRate}/kWh</div>}
                            <div>Fixed: ${rate.fixedCharge}/month</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add Appliances */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Appliances</CardTitle>
                  <CardDescription>Add your electrical appliances and specify their usage patterns.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="manual" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                      <TabsTrigger value="common">Common Appliances</TabsTrigger>
                    </TabsList>

                    <TabsContent value="manual" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="applianceName">Appliance Name</Label>
                          <Input
                            id="applianceName"
                            value={newAppliance.name}
                            onChange={(e) => setNewAppliance({ ...newAppliance, name: e.target.value })}
                            placeholder="e.g., LED Light Bulb"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="wattage">Wattage (W)</Label>
                          <Input
                            id="wattage"
                            type="number"
                            value={newAppliance.wattage}
                            onChange={(e) => setNewAppliance({ ...newAppliance, wattage: e.target.value })}
                            placeholder="e.g., 60"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="hoursPerDay">Hours per Day</Label>
                          <Input
                            id="hoursPerDay"
                            type="number"
                            step="0.5"
                            max="24"
                            value={newAppliance.hoursPerDay}
                            onChange={(e) => setNewAppliance({ ...newAppliance, hoursPerDay: e.target.value })}
                            placeholder="e.g., 8"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="daysPerMonth">Days per Month</Label>
                          <Input
                            id="daysPerMonth"
                            type="number"
                            max="31"
                            value={newAppliance.daysPerMonth}
                            onChange={(e) => setNewAppliance({ ...newAppliance, daysPerMonth: e.target.value })}
                            placeholder="e.g., 30"
                          />
                        </div>
                      </div>

                      <Button onClick={addAppliance} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Appliance
                      </Button>
                    </TabsContent>

                    <TabsContent value="common" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {commonAppliances.map((appliance) => (
                          <Button
                            key={appliance.name}
                            variant="outline"
                            size="sm"
                            onClick={() => addCommonAppliance(appliance)}
                            className="justify-start text-left h-auto p-3"
                          >
                            <div>
                              <div className="font-medium">{appliance.name}</div>
                              <div className="text-xs text-gray-500">{appliance.wattage}W</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        Click on an appliance to auto-fill the form, then adjust usage hours as needed.
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Current Appliances */}
              {appliances.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Appliances</CardTitle>
                    <CardDescription>Review and manage your added appliances.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {appliances.map((appliance) => {
                        const monthlyUsage = (appliance.wattage * appliance.hoursPerDay * appliance.daysPerMonth) / 1000
                        const monthlyCost = monthlyUsage * selectedRateStructure.baseRate

                        return (
                          <div
                            key={appliance.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{appliance.name}</h4>
                                <Badge variant="outline">{appliance.wattage}W</Badge>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {appliance.hoursPerDay}h/day × {appliance.daysPerMonth} days = {monthlyUsage.toFixed(1)}{" "}
                                kWh/month
                              </div>
                              <div className="text-sm font-medium text-green-600">${monthlyCost.toFixed(2)}/month</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAppliance(appliance.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {showResults && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Calculator className="h-5 w-5" />
                        <span>Bill Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">${totalCost.toFixed(2)}</div>
                        <p className="text-gray-600">Estimated Monthly Bill</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total Usage:</span>
                          <span className="font-medium">{totalUsage.toFixed(1)} kWh</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Energy Cost:</span>
                          <span className="font-medium">
                            ${(totalCost - selectedRateStructure.fixedCharge).toFixed(2)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Fixed Charge:</span>
                          <span className="font-medium">${selectedRateStructure.fixedCharge.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center border-t pt-2">
                          <span className="text-sm text-gray-600">Rate Structure:</span>
                          <Badge variant="outline">{selectedRateStructure.name}</Badge>
                        </div>
                      </div>

                      <Button onClick={saveBillCalculation} className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Save Calculation
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>Usage Insights</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between mb-2">
                          <span>Daily Average:</span>
                          <span className="font-medium">{(totalUsage / 30).toFixed(1)} kWh</span>
                        </div>

                        <div className="flex justify-between mb-2">
                          <span>Cost per kWh:</span>
                          <span className="font-medium">
                            ${((totalCost - selectedRateStructure.fixedCharge) / totalUsage).toFixed(3)}
                          </span>
                        </div>

                        <div className="flex justify-between mb-2">
                          <span>vs. US Average:</span>
                          <span className={`font-medium ${totalUsage > 877 ? "text-red-600" : "text-green-600"}`}>
                            {totalUsage > 877 ? "Above" : "Below"} ({((totalUsage / 877) * 100).toFixed(0)}%)
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t">
                        <h4 className="font-medium mb-2">Top Energy Users:</h4>
                        <div className="space-y-1">
                          {appliances
                            .sort((a, b) => {
                              const aUsage = (a.wattage * a.hoursPerDay * a.daysPerMonth) / 1000
                              const bUsage = (b.wattage * b.hoursPerDay * b.daysPerMonth) / 1000
                              return bUsage - aUsage
                            })
                            .slice(0, 3)
                            .map((appliance) => {
                              const usage = (appliance.wattage * appliance.hoursPerDay * appliance.daysPerMonth) / 1000
                              const percentage = (usage / totalUsage) * 100
                              return (
                                <div key={appliance.id} className="flex justify-between text-sm">
                                  <span className="truncate">{appliance.name}</span>
                                  <span className="font-medium">{percentage.toFixed(0)}%</span>
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {!showResults && appliances.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Start Calculating</h3>
                    <p className="text-gray-600 mb-4">Add your appliances to see your estimated electricity bill.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
