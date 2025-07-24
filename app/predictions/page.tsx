"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Brain, TrendingUp, Lightbulb, Target } from "lucide-react"

interface PredictionData {
  nextMonthUsage: number
  nextMonthCost: number
  efficiencyScore: number
  insights: string[]
  trends: {
    usage: number[]
    cost: number[]
  }
}

export default function Predictions() {
  const [data, setData] = useState<PredictionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPredictions()
  }, [])

  const fetchPredictions = async () => {
    try {
      const response = await fetch("/api/predictions")
      const predictionData = await response.json()
      setData(predictionData)
    } catch (error) {
      console.error("Failed to fetch predictions:", error)
    } finally {
      setLoading(false)
    }
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

  if (!data) {
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
          <p className="text-gray-600">Intelligent forecasts for your energy consumption</p>
        </div>

        {/* Prediction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Month Usage</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.nextMonthUsage} kWh</div>
              <p className="text-xs text-muted-foreground">Predicted consumption</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expected Cost</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data.nextMonthCost}</div>
              <p className="text-xs text-muted-foreground">Estimated bill</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.efficiencyScore}%</div>
              <p className="text-xs text-muted-foreground">Energy efficiency</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5" />
              <span>AI Insights</span>
            </CardTitle>
            <CardDescription>Personalized recommendations based on your usage patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
