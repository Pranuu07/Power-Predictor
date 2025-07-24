"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, TrendingDown, Minus, Lightbulb, AlertTriangle } from "lucide-react"
import { generatePredictions, getDashboardData, getBillCalculations } from "@/lib/localStorage"

interface Prediction {
  nextMonthUsage: number
  nextMonthCost: number
  efficiencyScore: number
  trend: string
  confidence: number
  recommendations: string[]
  lastUpdated: string
}

export default function Predictions() {
  const [predictions, setPredictions] = useState<Prediction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPredictions()

    // Listen for dashboard updates to refresh predictions
    const handleUpdate = () => {
      loadPredictions()
    }

    window.addEventListener("dashboardUpdate", handleUpdate)
    return () => window.removeEventListener("dashboardUpdate", handleUpdate)
  }, [])

  const loadPredictions = () => {
    try {
      const dashboardData = getDashboardData()
      const bills = getBillCalculations()

      // Generate fresh predictions based on current data
      const freshPredictions = generatePredictions(dashboardData)
      setPredictions(freshPredictions)
    } catch (error) {
      console.error("Failed to load predictions:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "text-red-600 bg-red-50"
      case "decreasing":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getEfficiencyColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-500"
    if (confidence >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading predictions...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!predictions) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <p className="text-red-600">Failed to load predictions</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Predictions</h1>
          <p className="text-gray-600">
            {predictions.nextMonthUsage === 0
              ? "Start tracking your usage to get AI-powered predictions"
              : "AI-powered insights and forecasts for your energy consumption"}
          </p>
        </div>

        {predictions.nextMonthUsage === 0 ? (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Ready for AI Predictions?</h3>
                <p className="text-blue-700 mb-4">
                  Use the Bill Calculator to enter your meter readings. After a few calculations, our AI will provide
                  personalized predictions and insights about your energy consumption patterns.
                </p>
                <div className="bg-white rounded-lg p-4 mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">What you'll get:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Next month's usage predictions</li>
                    <li>• Cost forecasts and trends</li>
                    <li>• Energy efficiency scoring</li>
                    <li>• Personalized recommendations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Prediction Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Month Usage</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{predictions.nextMonthUsage} kWh</div>
                  <div className="flex items-center space-x-2 mt-2">
                    {getTrendIcon(predictions.trend)}
                    <span className={`text-xs px-2 py-1 rounded-full ${getTrendColor(predictions.trend)}`}>
                      {predictions.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Predicted Cost</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{predictions.nextMonthCost}</div>
                  <p className="text-xs text-muted-foreground mt-2">Estimated bill amount</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getEfficiencyColor(predictions.efficiencyScore)}`}>
                    {predictions.efficiencyScore}/100
                  </div>
                  <Progress value={predictions.efficiencyScore} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Confidence</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{predictions.confidence}%</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getConfidenceColor(predictions.confidence)}`}
                        style={{ width: `${predictions.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>AI Recommendations</span>
                </CardTitle>
                <CardDescription>Personalized tips to optimize your energy consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {predictions.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prediction Details */}
            <Card>
              <CardHeader>
                <CardTitle>Prediction Details</CardTitle>
                <CardDescription>How we calculate your energy forecasts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Methodology</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Historical usage pattern analysis</li>
                      <li>• Seasonal consumption trends</li>
                      <li>• Appliance efficiency scoring</li>
                      <li>• Cost optimization algorithms</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Accuracy Factors</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Number of historical data points</li>
                      <li>• Consistency in usage patterns</li>
                      <li>• External factors (weather, etc.)</li>
                      <li>• Appliance changes or upgrades</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Predictions improve with more data. Keep tracking your usage regularly for
                    better accuracy. Last updated: {new Date(predictions.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
