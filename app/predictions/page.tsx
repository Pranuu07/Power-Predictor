"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Zap, DollarSign, Target, AlertTriangle, Lightbulb, BarChart3 } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { getStoredData } from "@/lib/localStorage"

interface Prediction {
  month: string
  usage: number
  cost: number
  confidence: number
  trend: "up" | "down" | "stable"
  factors: string[]
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [currentUsage, setCurrentUsage] = useState(0)
  const [averageUsage, setAverageUsage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const generatePredictions = () => {
      try {
        const data = getStoredData()
        const calculations = data.billCalculations || []

        if (calculations.length === 0) {
          setIsLoading(false)
          return
        }

        // Calculate current and average usage
        const totalUsage = calculations.reduce((sum, calc) => sum + calc.totalUsage, 0)
        const avgUsage = totalUsage / calculations.length
        const latest = calculations[calculations.length - 1]

        setCurrentUsage(latest.totalUsage)
        setAverageUsage(avgUsage)

        // Generate predictions for next 6 months
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]

        const currentMonth = new Date().getMonth()
        const generatedPredictions: Prediction[] = []

        for (let i = 1; i <= 6; i++) {
          const monthIndex = (currentMonth + i) % 12
          const monthName = months[monthIndex]

          // Seasonal adjustments
          let seasonalMultiplier = 1
          if (monthIndex >= 5 && monthIndex <= 8) {
            // Summer months
            seasonalMultiplier = 1.3 // Higher AC usage
          } else if (monthIndex >= 11 || monthIndex <= 2) {
            // Winter months
            seasonalMultiplier = 1.2 // Higher heating usage
          }

          // Trend calculation based on historical data
          let trendMultiplier = 1
          if (calculations.length >= 2) {
            const recent = calculations.slice(-2)
            const change = (recent[1].totalUsage - recent[0].totalUsage) / recent[0].totalUsage
            trendMultiplier = 1 + change * 0.5 // Moderate the trend
          }

          const baseUsage = avgUsage * seasonalMultiplier * trendMultiplier
          const variance = baseUsage * 0.1 * (Math.random() - 0.5) // ±5% variance
          const predictedUsage = Math.max(0, baseUsage + variance)

          const predictedCost = predictedUsage * 0.12 + 15 // Assuming $0.12/kWh + $15 fixed

          // Determine trend
          let trend: "up" | "down" | "stable" = "stable"
          if (predictedUsage > avgUsage * 1.05) trend = "up"
          else if (predictedUsage < avgUsage * 0.95) trend = "down"

          // Generate factors
          const factors = []
          if (seasonalMultiplier > 1.1) {
            factors.push(monthIndex >= 5 && monthIndex <= 8 ? "Summer cooling" : "Winter heating")
          }
          if (trendMultiplier > 1.05) {
            factors.push("Increasing usage trend")
          } else if (trendMultiplier < 0.95) {
            factors.push("Decreasing usage trend")
          }
          if (Math.random() > 0.5) {
            factors.push("Historical patterns")
          }

          generatedPredictions.push({
            month: monthName,
            usage: predictedUsage,
            cost: predictedCost,
            confidence: Math.min(95, Math.max(70, 85 - i * 3)), // Decreasing confidence over time
            trend,
            factors: factors.length > 0 ? factors : ["Seasonal patterns"],
          })
        }

        setPredictions(generatedPredictions)
      } catch (error) {
        console.error("Error generating predictions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    generatePredictions()
  }, [])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      default:
        return <BarChart3 className="h-4 w-4 text-blue-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-red-600"
      case "down":
        return "text-green-600"
      default:
        return "text-blue-600"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "text-green-600"
    if (confidence >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const calculateYearlyProjection = () => {
    const totalUsage = predictions.reduce((sum, pred) => sum + pred.usage, 0)
    const totalCost = predictions.reduce((sum, pred) => sum + pred.cost, 0)
    return { usage: totalUsage, cost: totalCost }
  }

  const yearlyProjection = calculateYearlyProjection()

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating predictions...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">AI Predictions</h1>
            <p className="text-gray-600 mt-2">
              AI-powered forecasts for your future energy usage and costs based on your historical data.
            </p>
          </div>

          {predictions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Data for Predictions</h3>
                <p className="text-gray-600 mb-4">
                  We need at least one bill calculation to generate AI predictions for your energy usage.
                </p>
                <Button asChild>
                  <a href="/calculator">Calculate Your First Bill</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Usage</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentUsage.toFixed(0)} kWh</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Usage</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{averageUsage.toFixed(0)} kWh</div>
                    <p className="text-xs text-muted-foreground">Historical average</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">6-Month Projection</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{yearlyProjection.usage.toFixed(0)} kWh</div>
                    <p className="text-xs text-muted-foreground">Next 6 months</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projected Cost</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${yearlyProjection.cost.toFixed(0)}</div>
                    <p className="text-xs text-muted-foreground">Next 6 months</p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="monthly" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="monthly">Monthly Predictions</TabsTrigger>
                  <TabsTrigger value="insights">AI Insights</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>

                <TabsContent value="monthly" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {predictions.map((prediction, index) => (
                      <Card key={prediction.month}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{prediction.month}</CardTitle>
                            {getTrendIcon(prediction.trend)}
                          </div>
                          <CardDescription>{index === 0 ? "Next month" : `${index + 1} months ahead`}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Usage:</span>
                              <span className="font-medium">{prediction.usage.toFixed(0)} kWh</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Cost:</span>
                              <span className="font-medium">${prediction.cost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Trend:</span>
                              <span className={`font-medium ${getTrendColor(prediction.trend)}`}>
                                {prediction.trend.charAt(0).toUpperCase() + prediction.trend.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Confidence:</span>
                              <span className={`font-medium ${getConfidenceColor(prediction.confidence)}`}>
                                {prediction.confidence}%
                              </span>
                            </div>
                            <Progress value={prediction.confidence} className="h-2" />
                          </div>

                          <div className="space-y-2">
                            <span className="text-sm font-medium text-gray-700">Key Factors:</span>
                            <div className="flex flex-wrap gap-1">
                              {prediction.factors.map((factor, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {factor}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5" />
                          <span>Usage Trends</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          {predictions.slice(0, 3).map((pred, index) => {
                            const change = ((pred.usage - averageUsage) / averageUsage) * 100
                            return (
                              <div
                                key={pred.month}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <div className="font-medium">{pred.month}</div>
                                  <div className="text-sm text-gray-600">
                                    {change > 0 ? "+" : ""}
                                    {change.toFixed(1)}% vs average
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">{pred.usage.toFixed(0)} kWh</div>
                                  <div className={`text-sm ${change > 0 ? "text-red-600" : "text-green-600"}`}>
                                    {change > 0 ? "Above" : "Below"} average
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <DollarSign className="h-5 w-5" />
                          <span>Cost Analysis</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                            <span className="font-medium">Next Month</span>
                            <span className="text-lg font-bold text-blue-600">${predictions[0]?.cost.toFixed(2)}</span>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">6-Month Average</span>
                            <span className="text-lg font-bold">${(yearlyProjection.cost / 6).toFixed(2)}</span>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <span className="font-medium">Potential Savings</span>
                            <span className="text-lg font-bold text-green-600">
                              ${Math.max(0, yearlyProjection.cost * 0.15).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Seasonal Patterns</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">High Usage Periods</h4>
                          <div className="space-y-2">
                            {predictions
                              .filter((p) => p.usage > averageUsage * 1.1)
                              .map((pred) => (
                                <div
                                  key={pred.month}
                                  className="flex items-center justify-between p-2 bg-red-50 rounded"
                                >
                                  <span className="text-sm font-medium">{pred.month}</span>
                                  <Badge variant="destructive" className="text-xs">
                                    {(((pred.usage - averageUsage) / averageUsage) * 100).toFixed(0)}% above avg
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Low Usage Periods</h4>
                          <div className="space-y-2">
                            {predictions
                              .filter((p) => p.usage < averageUsage * 0.9)
                              .map((pred) => (
                                <div
                                  key={pred.month}
                                  className="flex items-center justify-between p-2 bg-green-50 rounded"
                                >
                                  <span className="text-sm font-medium">{pred.month}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {(((averageUsage - pred.usage) / averageUsage) * 100).toFixed(0)}% below avg
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Lightbulb className="h-5 w-5" />
                          <span>Energy Saving Tips</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <h4 className="font-medium text-yellow-800 mb-1">Peak Season Preparation</h4>
                            <p className="text-sm text-yellow-700">
                              Your usage is predicted to increase during summer months. Consider upgrading to
                              energy-efficient AC units.
                            </p>
                          </div>

                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-medium text-blue-800 mb-1">Smart Thermostat</h4>
                            <p className="text-sm text-blue-700">
                              Installing a programmable thermostat could save you up to 10% on heating and cooling
                              costs.
                            </p>
                          </div>

                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-medium text-green-800 mb-1">LED Lighting</h4>
                            <p className="text-sm text-green-700">
                              Switching to LED bulbs can reduce lighting costs by up to 75% compared to incandescent
                              bulbs.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Target className="h-5 w-5" />
                          <span>Optimization Goals</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Reduce Peak Usage</span>
                              <Badge variant="outline">High Impact</Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Target: Reduce summer usage by 15% through efficient cooling strategies.
                            </p>
                            <div className="mt-2">
                              <div className="text-xs text-gray-500 mb-1">Potential Savings</div>
                              <div className="font-medium text-green-600">
                                ${(yearlyProjection.cost * 0.15).toFixed(2)} over 6 months
                              </div>
                            </div>
                          </div>

                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Consistent Usage</span>
                              <Badge variant="outline">Medium Impact</Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Target: Maintain usage within 10% of your average throughout the year.
                            </p>
                            <div className="mt-2">
                              <div className="text-xs text-gray-500 mb-1">Potential Savings</div>
                              <div className="font-medium text-green-600">
                                ${(yearlyProjection.cost * 0.08).toFixed(2)} over 6 months
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Action Plan</CardTitle>
                      <CardDescription>
                        Recommended steps to optimize your energy usage based on predictions.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                1
                              </div>
                              <span className="font-medium">Immediate Actions</span>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Audit current appliances</li>
                              <li>• Check insulation quality</li>
                              <li>• Review rate structure</li>
                            </ul>
                          </div>

                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                2
                              </div>
                              <span className="font-medium">Short-term (1-3 months)</span>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Install smart thermostat</li>
                              <li>• Replace old bulbs with LEDs</li>
                              <li>• Seal air leaks</li>
                            </ul>
                          </div>

                          <div className="p-4 border rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                3
                              </div>
                              <span className="font-medium">Long-term (3-12 months)</span>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Upgrade to efficient appliances</li>
                              <li>• Consider solar panels</li>
                              <li>• Improve home insulation</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
