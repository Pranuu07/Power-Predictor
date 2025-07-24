"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, Zap, DollarSign, Home, Thermometer, Cpu, RefreshCw } from "lucide-react"
import { getDashboardData } from "@/lib/localStorage"
import { ProtectedRoute } from "@/components/protected-route"

interface Tip {
  id: string
  title: string
  description: string
  category: "cooling" | "lighting" | "appliances" | "general"
  savings: string
  difficulty: "easy" | "medium" | "hard"
  icon: React.ReactNode
}

const allTips: Tip[] = [
  {
    id: "1",
    title: "Optimize AC Temperature",
    description: "Set your air conditioner to 24°C instead of 22°C. Each degree higher can save 6% energy.",
    category: "cooling",
    savings: "₹200-400/month",
    difficulty: "easy",
    icon: <Thermometer className="h-4 w-4" />,
  },
  {
    id: "2",
    title: "Switch to LED Bulbs",
    description: "Replace incandescent bulbs with LED bulbs. They use 75% less energy and last 25 times longer.",
    category: "lighting",
    savings: "₹100-200/month",
    difficulty: "easy",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    id: "3",
    title: "Unplug Devices When Not in Use",
    description: "Many devices consume power even when turned off. Unplug chargers, TVs, and other electronics.",
    category: "appliances",
    savings: "₹50-150/month",
    difficulty: "easy",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: "4",
    title: "Use Natural Light",
    description: "Open curtains and blinds during daytime to reduce the need for artificial lighting.",
    category: "lighting",
    savings: "₹30-80/month",
    difficulty: "easy",
    icon: <Home className="h-4 w-4" />,
  },
  {
    id: "5",
    title: "Regular AC Maintenance",
    description: "Clean AC filters monthly and service annually. Dirty filters make AC work harder.",
    category: "cooling",
    savings: "₹150-300/month",
    difficulty: "medium",
    icon: <RefreshCw className="h-4 w-4" />,
  },
  {
    id: "6",
    title: "Use Ceiling Fans with AC",
    description: "Ceiling fans help circulate cool air, allowing you to set AC temperature 2-3°C higher.",
    category: "cooling",
    savings: "₹100-250/month",
    difficulty: "easy",
    icon: <Thermometer className="h-4 w-4" />,
  },
  {
    id: "7",
    title: "Upgrade to Energy-Efficient Appliances",
    description: "Choose 5-star rated appliances when replacing old ones. They consume significantly less power.",
    category: "appliances",
    savings: "₹300-600/month",
    difficulty: "hard",
    icon: <Cpu className="h-4 w-4" />,
  },
  {
    id: "8",
    title: "Optimize Refrigerator Settings",
    description: "Set refrigerator temperature to 3-4°C and freezer to -18°C. Avoid keeping doors open.",
    category: "appliances",
    savings: "₹80-150/month",
    difficulty: "easy",
    icon: <Thermometer className="h-4 w-4" />,
  },
  {
    id: "9",
    title: "Use Timer Functions",
    description: "Use timer functions on AC, water heater, and other appliances to avoid unnecessary usage.",
    category: "general",
    savings: "₹100-200/month",
    difficulty: "easy",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    id: "10",
    title: "Seal Air Leaks",
    description: "Seal gaps around doors and windows to prevent cool air from escaping and reduce AC load.",
    category: "cooling",
    savings: "₹150-300/month",
    difficulty: "medium",
    icon: <Home className="h-4 w-4" />,
  },
]

export default function TipsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [personalizedTips, setPersonalizedTips] = useState<Tip[]>([])
  const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    const data = getDashboardData()
    setDashboardData(data)

    // Generate personalized tips based on usage
    let tips = [...allTips]

    if (data.currentUsage > 300) {
      // High usage - prioritize cooling and appliance tips
      tips = tips.sort((a, b) => {
        if (a.category === "cooling" || a.category === "appliances") return -1
        if (b.category === "cooling" || b.category === "appliances") return 1
        return 0
      })
    } else if (data.currentUsage < 100) {
      // Low usage - focus on general and lighting tips
      tips = tips.sort((a, b) => {
        if (a.category === "general" || a.category === "lighting") return -1
        if (b.category === "general" || b.category === "lighting") return 1
        return 0
      })
    }

    setPersonalizedTips(tips)
  }, [])

  const categories = [
    { id: "all", name: "All Tips", count: allTips.length },
    { id: "cooling", name: "Cooling", count: allTips.filter((tip) => tip.category === "cooling").length },
    { id: "lighting", name: "Lighting", count: allTips.filter((tip) => tip.category === "lighting").length },
    { id: "appliances", name: "Appliances", count: allTips.filter((tip) => tip.category === "appliances").length },
    { id: "general", name: "General", count: allTips.filter((tip) => tip.category === "general").length },
  ]

  const filteredTips =
    selectedCategory === "all" ? personalizedTips : personalizedTips.filter((tip) => tip.category === selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "cooling":
        return "bg-blue-100 text-blue-800"
      case "lighting":
        return "bg-yellow-100 text-yellow-800"
      case "appliances":
        return "bg-purple-100 text-purple-800"
      case "general":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Energy Saving Tips</h1>
          <p className="text-gray-600 mt-2">Personalized recommendations to reduce your electricity consumption</p>
        </div>

        {/* Usage Summary */}
        {dashboardData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Your Energy Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{dashboardData.currentUsage} kWh</div>
                  <div className="text-sm text-gray-600">Current Usage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹{dashboardData.savingsPotential}</div>
                  <div className="text-sm text-gray-600">Potential Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {dashboardData.currentUsage > 300 ? "High" : dashboardData.currentUsage > 150 ? "Medium" : "Low"}
                  </div>
                  <div className="text-sm text-gray-600">Usage Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              {category.name}
              <Badge variant="secondary" className="ml-1">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map((tip) => (
            <Card key={tip.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {tip.icon}
                    <CardTitle className="text-lg">{tip.title}</CardTitle>
                  </div>
                  <Badge className={getCategoryColor(tip.category)}>{tip.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm mb-4">{tip.description}</CardDescription>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(tip.difficulty)}>{tip.difficulty}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">{tip.savings}</div>
                    <div className="text-xs text-gray-500">potential savings</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTips.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Lightbulb className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tips Found</h3>
              <p className="text-gray-600 text-center">
                No tips available for the selected category. Try selecting a different category.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
