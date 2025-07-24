"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Lightbulb, Zap, Thermometer, Droplets, Sun } from "lucide-react"

interface Tip {
  _id?: string
  category: string
  title: string
  description: string
  savings: string
  icon: string
}

export default function SmartTips() {
  const [tips, setTips] = useState<Tip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTips()
  }, [])

  const fetchTips = async () => {
    try {
      const response = await fetch("/api/tips")
      const data = await response.json()
      setTips(data.tips || [])
    } catch (error) {
      console.error("Failed to fetch tips:", error)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "lightbulb":
        return <Lightbulb className="h-6 w-6" />
      case "zap":
        return <Zap className="h-6 w-6" />
      case "thermometer":
        return <Thermometer className="h-6 w-6" />
      case "droplets":
        return <Droplets className="h-6 w-6" />
      case "sun":
        return <Sun className="h-6 w-6" />
      default:
        return <Lightbulb className="h-6 w-6" />
    }
  }

  const getIconColor = (category: string) => {
    switch (category) {
      case "Lighting":
        return "text-yellow-600"
      case "Cooling":
        return "text-blue-600"
      case "Heating":
        return "text-red-600"
      case "Appliances":
        return "text-green-600"
      case "General":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tips...</p>
          </div>
        </div>
      </div>
    )
  }

  const categories = [...new Set(tips.map((tip) => tip.category))]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Energy Tips</h1>
          <p className="text-gray-600">Practical ways to reduce your energy consumption and save money</p>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tips
                .filter((tip) => tip.category === category)
                .map((tip, index) => (
                  <Card key={tip._id || index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={getIconColor(category)}>{getIcon(tip.icon)}</div>
                        <div>
                          <CardTitle className="text-lg">{tip.title}</CardTitle>
                          <CardDescription className="text-green-600 font-medium">Save {tip.savings}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{tip.description}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
