"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus, Brain, Lightbulb, Target, AlertTriangle } from "lucide-react"
import { generatePredictions, getDashboardData, type Prediction } from "@/lib/localStorage"

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load predictions from localStorage
    const dashboardData = getDashboardData()
    const predictionData = generatePredictions(dashboardData)
    setPredictions(predictionData)
    setLoading(false)

    // Listen for updates
    const handleUpdate = () => {
      const updatedDashboard = getDashboardData()
      const updatedPredictions = generatePredictions(updatedDashboard)
      setPredictions(updatedPredictions)
    }

    window.addEventListener("dashboardUpdate", handleUpdate)
    return () => window.removeEventListener("dashboardUpdate", handleUpdate)
  }, [])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      default:
        return <Minus className="h-4 w-4 text-blue-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "text-red-600 bg-red-50 border-red-200"
      case "decreasing":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-blue-600 bg-blue-50 border-blue-200"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Brain className="h-8 w-8" />
            AI Predictions
          </h1>
          <p className="text-gray-600">
            {predictions.nextMonthUsage === 0
              ? "Start tracking your usage to get AI-powered predictions and insights"
              : "AI-powered insights and predictions based on your energy usage patterns"}
          </p>
        </div>

        {predictions.nextMonthUsage === 0 ? (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">No Data for Predictions</h3>
                <p className="text-blue-700 mb-4">
                  Start using the Bill Calculator to track your energy consumption. Once you have some data, AI will
                  analyze your patterns and provide predictions.
                </p>
                <div className="space-y-2">
                  {predictions.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-center gap-2 text-blue-800">
                      <Lightbulb className="h-4 w-4" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Prediction Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Month Usage</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{predictions.nextMonthUsage} kWh</div>
                  <div className="flex items-center gap-2 mt-1">
                    {getTrendIcon(predictions.trend)}
                    <span className="text-xs text-muted-foreground capitalize">{predictions.trend}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Predicted Cost</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{predictions.nextMonthCost}</div>
                  <p className="text-xs text-muted-foreground">Estimated bill</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getEfficiencyColor(predictions.efficiencyScore)}`}>
                    {predictions.efficiencyScore}%
                  </div>
                  <Progress value={predictions.efficiencyScore} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Confidence Level</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{predictions.confidence}%</div>
                  <div className="flex items-center gap-2 mt-2">
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

            {/* Trend Analysis */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
                <CardDescription>Understanding your energy consumption patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg border ${getTrendColor(predictions.trend)}`}>
                  <div className="flex items-center gap-3 mb-3">
                    {getTrendIcon(predictions.trend)}
                    <h3 className="font-semibold capitalize">{predictions.trend} Trend Detected</h3>
                  </div>
                  <p className="text-sm">
                    {predictions.trend === "increasing" &&
                      "Your energy consumption is trending upward. Consider implementing energy-saving measures to control costs."}
                    {predictions.trend === "decreasing" &&
                      "Great! Your energy consumption is decreasing. Keep up the good energy-saving habits."}
                    {predictions.trend === "stable" &&
                      "Your energy consumption is stable. This consistency makes it easier to budget and plan."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>Personalized suggestions to optimize your energy usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictions.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prediction Accuracy */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>About These Predictions</CardTitle>
                <CardDescription>How we calculate your energy forecasts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Prediction Method:</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Historical usage pattern analysis</p>
                      <p>• Seasonal trend consideration</p>
                      <p>• Appliance efficiency scoring</p>
                      <p>• Cost optimization algorithms</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Confidence Factors:</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Amount of historical data</p>
                      <p>• Consistency in usage patterns</p>
                      <p>• Seasonal variations</p>
                      <p>• Recent calculation frequency</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Predictions become more accurate as you add more bill calculations. Regular
                    tracking helps our AI understand your consumption patterns better.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
