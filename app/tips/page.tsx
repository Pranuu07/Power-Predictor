"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Lightbulb, Zap, Thermometer, Droplets, Home, AlertTriangle } from "lucide-react"
import { getEnergyTips, getDashboardData } from "@/lib/localStorage"

interface EnergyTip {
  id: string
  category: string
  title: string
  description: string
  savings: string
  difficulty: string
  priority: string
}

export default function Tips() {
  const [tips, setTips] = useState<EnergyTip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTips()

    // Listen for dashboard updates to refresh tips
    const handleUpdate = () => {
      loadTips()
    }

    window.addEventListener("dashboardUpdate", handleUpdate)
    return () => window.removeEventListener("dashboardUpdate", handleUpdate)
  }, [])

  const loadTips = () => {
    try {
      const energyTips = getEnergyTips()
      setTips(energyTips)
    } catch (error) {
      console.error("Failed to load tips:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "lighting":
        return <Lightbulb className="h-5 w-5" />
      case "cooling":
        return <Thermometer className="h-5 w-5" />
      case "water heating":
        return <Droplets className="h-5 w-5" />
      case "appliances":
        return <Zap className="h-5 w-5" />
      case "getting started":
        return <Home className="h-5 w-5" />
      case "urgent":
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading energy tips...</p>
          </div>
        </div>
      </div>
    )
  }

  const dashboardData = getDashboardData()
  const hasUsageData = dashboardData.currentUsage > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Energy Saving Tips</h1>
          <p className="text-gray-600">
            {hasUsageData
              ? `Personalized recommendations based on your ${dashboardData.currentUsage} kWh usage`
              : "Smart tips to help you reduce energy consumption and save money"}
          </p>
        </div>

        {!hasUsageData && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Lightbulb className="h-12 w-12 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-1">Get Personalized Tips</h3>
                  <p className="text-blue-700">
                    Use the Bill Calculator to track your usage and get customized energy-saving recommendations based
                    on your consumption patterns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {tips.map((tip) => (
            <Card key={tip.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">{getCategoryIcon(tip.category)}</div>
                    <div>
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">{tip.category}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Badge className={getPriorityColor(tip.priority)} variant="outline">
                      {tip.priority} Priority
                    </Badge>
                    <Badge className={getDifficultyColor(tip.difficulty)} variant="secondary">
                      {tip.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{tip.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="text-gray-500">Potential Savings:</span>
                      <span className="font-semibold text-green-600 ml-1">{tip.savings}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Tips Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Energy Saving Checklist</CardTitle>
            <CardDescription>Simple actions you can take right now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Immediate Actions</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Turn off lights when leaving rooms</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Unplug chargers and electronics not in use</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Set AC temperature to 24°C or higher</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Use fans along with AC to feel cooler</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Long-term Investments</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Replace old bulbs with LED lights</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Upgrade to energy-efficient appliances</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Install programmable thermostats</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Consider solar water heating</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
