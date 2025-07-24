"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, Zap, DollarSign, Clock, AlertCircle, CheckCircle, Star } from "lucide-react"
import { getEnergyTips, getDashboardData, type EnergyTip } from "@/lib/localStorage"

export default function TipsPage() {
  const [tips, setTips] = useState<EnergyTip[]>([])
  const [loading, setLoading] = useState(true)
  const [implementedTips, setImplementedTips] = useState<string[]>([])

  useEffect(() => {
    const energyTips = getEnergyTips()
    setTips(energyTips)
    setLoading(false)

    // Load implemented tips from localStorage
    const implemented = localStorage.getItem("powertracker_implemented_tips")
    if (implemented) {
      setImplementedTips(JSON.parse(implemented))
    }

    // Listen for updates
    const handleUpdate = () => {
      const updatedTips = getEnergyTips()
      setTips(updatedTips)
    }

    window.addEventListener("dashboardUpdate", handleUpdate)
    return () => window.removeEventListener("dashboardUpdate", handleUpdate)
  }, [])

  const toggleTipImplementation = (tipId: string) => {
    const newImplemented = implementedTips.includes(tipId)
      ? implementedTips.filter((id) => id !== tipId)
      : [...implementedTips, tipId]

    setImplementedTips(newImplemented)
    localStorage.setItem("powertracker_implemented_tips", JSON.stringify(newImplemented))
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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "lighting":
        return <Lightbulb className="h-4 w-4" />
      case "cooling":
      case "appliances":
        return <Zap className="h-4 w-4" />
      case "water heating":
        return <Clock className="h-4 w-4" />
      case "urgent":
        return <AlertCircle className="h-4 w-4" />
      case "getting started":
        return <Star className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const dashboardData = getDashboardData()
  const implementedCount = implementedTips.length
  const totalSavings = tips
    .filter((tip) => implementedTips.includes(tip.id))
    .reduce((sum, tip) => {
      const savings = tip.savings.match(/₹(\d+)/)
      return sum + (savings ? Number.parseInt(savings[1]) : 0)
    }, 0)

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Lightbulb className="h-8 w-8" />
            Energy Saving Tips
          </h1>
          <p className="text-gray-600">
            {dashboardData.currentUsage === 0
              ? "Personalized tips to help you save energy and reduce costs"
              : "Personalized recommendations based on your energy usage patterns"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Tips</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tips.length}</div>
              <p className="text-xs text-muted-foreground">Personalized for you</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Implemented</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{implementedCount}</div>
              <p className="text-xs text-muted-foreground">Tips you're using</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{totalSavings}</div>
              <p className="text-xs text-muted-foreground">Per month</p>
            </CardContent>
          </Card>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => {
            const isImplemented = implementedTips.includes(tip.id)

            return (
              <Card key={tip.id} className={`relative ${isImplemented ? "ring-2 ring-green-500 bg-green-50" : ""}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(tip.category)}
                      <Badge variant="outline" className="text-xs">
                        {tip.category}
                      </Badge>
                    </div>
                    <Badge className={getPriorityColor(tip.priority)}>{tip.priority}</Badge>
                  </div>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{tip.description}</CardDescription>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Potential Savings:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {tip.savings}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Difficulty:</span>
                      <Badge className={getDifficultyColor(tip.difficulty)}>{tip.difficulty}</Badge>
                    </div>
                  </div>

                  <Button
                    onClick={() => toggleTipImplementation(tip.id)}
                    className={`w-full mt-4 ${
                      isImplemented ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isImplemented ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Implemented
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4 mr-2" />
                        Mark as Implemented
                      </>
                    )}
                  </Button>
                </CardContent>

                {isImplemented && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Implementation Progress */}
        {implementedCount > 0 && (
          <Card className="mt-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Great Progress!
              </CardTitle>
              <CardDescription className="text-green-700">
                You've implemented {implementedCount} energy-saving tip{implementedCount !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-green-800">Implementation Progress:</span>
                  <span className="font-medium text-green-800">
                    {implementedCount}/{tips.length} tips
                  </span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(implementedCount / tips.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-green-700">
                  Potential monthly savings: <strong>₹{totalSavings}</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Getting Started */}
        {dashboardData.currentUsage === 0 && (
          <Card className="mt-8 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <Lightbulb className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Start Your Energy Journey</h3>
                <p className="text-blue-700 mb-4">
                  Begin tracking your energy usage with the Bill Calculator to get more personalized tips based on your
                  actual consumption patterns.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
