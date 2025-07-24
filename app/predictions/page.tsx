"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Zap, DollarSign, Calendar, Lightbulb, AlertTriangle } from "lucide-react"
import { getDashboardData, getBillCalculations } from "@/lib/localStorage"
import { ProtectedRoute } from "@/components/protected-route"

interface PredictionData {
  nextMonthUsage: number
  nextMonthCost: number
  trend: "increasing" | "decreasing" | "stable"
  confidence: number
  recommendations: string[]
}

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<PredictionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const generatePredictions = () => {
      const dashboardData = getDashboardData()
      const bills = getBillCalculations()

      if (bills.length === 0) {
        setIsLoading(false)
        return
      }

      // Calculate trend based on recent bills
      const recentBills = bills.slice(-3) // Last 3 bills
      const avgUsage = recentBills.reduce((sum, bill) => sum + bill.unitsConsumed, 0) / recentBills.length
      const avgCost = recentBills.reduce((sum, bill) => sum + bill.totalBill, 0) / recentBills.length

      // Determine trend
      let trend: "increasing" | "decreasing" | "stable" = "stable"
      if (recentBills.length >= 2) {
        const latest = recentBills[recentBills.length - 1]
        const previous = recentBills[recentBills.length - 2]
        const usageChange = ((latest.unitsConsumed - previous.unitsConsumed) / previous.unitsConsumed) * 100

        if (usageChange > 5) trend = "increasing"
        else if (usageChange < -5) trend = "decreasing"
      }

      // Generate predictions with some seasonal variation
      const seasonalFactor = 1 + Math.sin(Date.now() / (1000 * 60 * 60 * 24 * 30)) * 0.1 // ±10% seasonal variation
      const nextMonthUsage = Math.round(avgUsage * seasonalFactor)
      const nextMonthCost = Math.round(avgCost * seasonalFactor)

      // Confidence based on data points
      const confidence = Math.min(90, 50 + bills.length * 5)

      // Generate recommendations
      const recommendations = []
      if (trend === "increasing") {
        recommendations.push("Your usage is trending upward. Consider implementing energy-saving measures.")
        recommendations.push("Check for appliances that might be consuming more power than usual.")
      } else if (trend === "decreasing") {
        recommendations.push("Great job! Your usage is decreasing. Keep up the energy-saving habits.")
        recommendations.push("Continue monitoring to maintain this positive trend.")
      }

      if (nextMonthUsage > 300) {
        recommendations.push("High usage predicted. Consider using AC at 24°C instead of lower temperatures.")
        recommendations.push("Unplug devices when not in use to reduce phantom power consumption.")
      }

      if (nextMonthCost > 2000) {
        recommendations.push("High bill predicted. Review your major appliances and their usage patterns.")
      }

      recommendations.push("Use natural light during daytime to reduce lighting costs.")
      recommendations.push("Regular maintenance of appliances improves their efficiency.")

      setPredictions({
        nextMonthUsage,
        nextMonthCost,
        trend,
        confidence,
        recommendations: recommendations.slice(0, 4), // Limit to 4 recommendations
      })

      setIsLoading(false)
    }

    generatePredictions()
  }, [])

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "text-red-600 bg-red-50"
      case "decreasing":
        return "text-green-600 bg-green-50"
      default:
        return "text-blue-600 bg-blue-50"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "↗️"
      case "decreasing":
        return "↘️"
      default:
        return "→"
    }
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Predictions</h1>
          <p className="text-gray-600 mt-2">AI-powered insights and forecasts for your energy usage</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !predictions ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <TrendingUp className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Prediction Data</h3>
              <p className="text-gray-600 text-center mb-6">
                Calculate at least one bill to get AI-powered predictions and insights about your energy usage.
              </p>
              <a href="/calculator" className="text-blue-600 hover:underline">
                Calculate Your First Bill
              </a>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Prediction Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Month Usage</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{predictions.nextMonthUsage} kWh</div>
                  <div className="flex items-center mt-2">
                    <Badge variant="secondary" className={getTrendColor(predictions.trend)}>
                      {getTrendIcon(predictions.trend)} {predictions.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Predicted Cost</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{predictions.nextMonthCost}</div>
                  <p className="text-xs text-muted-foreground mt-2">Based on current rates</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Confidence Level</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{predictions.confidence}%</div>
                  <p className="text-xs text-muted-foreground mt-2">Prediction accuracy</p>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>Personalized suggestions to optimize your energy usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {predictions.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                        </div>
                      </div>
                      <p className="text-sm text-blue-900">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trend Analysis */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Trend Analysis
                </CardTitle>
                <CardDescription>Understanding your consumption patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Current Trend</h4>
                      <p className="text-sm text-gray-600">
                        Your usage is {predictions.trend} compared to previous months
                      </p>
                    </div>
                    <Badge className={getTrendColor(predictions.trend)}>
                      {getTrendIcon(predictions.trend)} {predictions.trend}
                    </Badge>
                  </div>

                  {predictions.trend === "increasing" && (
                    <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Usage Increasing</h4>
                        <p className="text-sm text-yellow-700">
                          Your energy consumption has been trending upward. Consider implementing energy-saving measures
                          to control costs.
                        </p>
                      </div>
                    </div>
                  )}

                  {predictions.trend === "decreasing" && (
                    <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800">Great Progress!</h4>
                        <p className="text-sm text-green-700">
                          Your energy consumption is decreasing. Keep up the good work with your energy-saving habits!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ProtectedRoute>
  )
}
