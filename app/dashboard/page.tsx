"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Zap,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Lightbulb,
  AlertTriangle,
  BarChart3,
  Calculator,
  History,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { CostChart } from "@/components/cost-chart"
import { UsageChart } from "@/components/usage-chart"
import { UsageBreakdown } from "@/components/usage-breakdown"
import { Chatbot } from "@/components/chatbot"
import { getStoredData, clearAllData } from "@/lib/localStorage"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState({
    currentUsage: 0,
    monthlyBill: 0,
    savings: 0,
    efficiency: 0,
    lastCalculation: null as any,
    totalCalculations: 0,
    averageDaily: 0,
    peakUsage: 0,
    trend: "up" as "up" | "down",
    trendPercentage: 0,
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = () => {
      try {
        const data = getStoredData()
        const calculations = data.billCalculations || []

        if (calculations.length > 0) {
          const latest = calculations[calculations.length - 1]
          const totalUsage = calculations.reduce((sum, calc) => sum + calc.totalUsage, 0)
          const totalCost = calculations.reduce((sum, calc) => sum + calc.totalCost, 0)
          const avgDaily = totalUsage / Math.max(calculations.length * 30, 1)

          // Calculate trend
          let trend = "up"
          let trendPercentage = 0
          if (calculations.length >= 2) {
            const current = calculations[calculations.length - 1].totalUsage
            const previous = calculations[calculations.length - 2].totalUsage
            const change = ((current - previous) / previous) * 100
            trend = change > 0 ? "up" : "down"
            trendPercentage = Math.abs(change)
          }

          setDashboardData({
            currentUsage: latest.totalUsage,
            monthlyBill: latest.totalCost,
            savings: Math.max(0, 150 - latest.totalCost), // Assuming $150 baseline
            efficiency: Math.min(100, Math.max(0, 100 - (latest.totalUsage / 1000) * 10)),
            lastCalculation: latest,
            totalCalculations: calculations.length,
            averageDaily: avgDaily,
            peakUsage: Math.max(...calculations.map((c) => c.totalUsage)),
            trend,
            trendPercentage,
          })
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
      clearAllData()
      setDashboardData({
        currentUsage: 0,
        monthlyBill: 0,
        savings: 0,
        efficiency: 0,
        lastCalculation: null,
        totalCalculations: 0,
        averageDaily: 0,
        peakUsage: 0,
        trend: "up",
        trendPercentage: 0,
      })
    }
  }

  const quickActions = [
    {
      title: "Calculate Bill",
      description: "Calculate your electricity bill",
      icon: Calculator,
      href: "/calculator",
      color: "bg-blue-500",
    },
    {
      title: "View Predictions",
      description: "See AI-powered usage forecasts",
      icon: TrendingUp,
      href: "/predictions",
      color: "bg-green-500",
    },
    {
      title: "Energy Tips",
      description: "Get personalized saving tips",
      icon: Lightbulb,
      href: "/tips",
      color: "bg-yellow-500",
    },
    {
      title: "Usage History",
      description: "View your calculation history",
      icon: History,
      href: "/history",
      color: "bg-purple-500",
    },
  ]

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
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
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(" ")[0] || "User"}!</h1>
            <p className="text-gray-600 mt-2">Here's your energy usage overview and insights.</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Usage</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.currentUsage.toFixed(0)} kWh</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {dashboardData.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-red-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                  )}
                  {dashboardData.trendPercentage.toFixed(1)}% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Bill</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${dashboardData.monthlyBill.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Based on latest calculation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${dashboardData.savings.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Compared to average household</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.efficiency.toFixed(0)}%</div>
                <Progress value={dashboardData.efficiency} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to manage your energy usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link key={index} href={action.href}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${action.color}`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-medium">{action.title}</h3>
                              <p className="text-sm text-gray-600">{action.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Usage Trends</CardTitle>
                <CardDescription>Your energy consumption over time</CardDescription>
              </CardHeader>
              <CardContent>
                <UsageChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
                <CardDescription>Monthly cost breakdown and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <CostChart />
              </CardContent>
            </Card>
          </div>

          {/* Usage Breakdown */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Usage Breakdown</CardTitle>
              <CardDescription>Detailed breakdown of your energy consumption by appliance</CardDescription>
            </CardHeader>
            <CardContent>
              <UsageBreakdown />
            </CardContent>
          </Card>

          {/* Recent Activity & Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest energy tracking activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.lastCalculation ? (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Calculator className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Bill Calculated</p>
                        <p className="text-sm text-gray-600">
                          ${dashboardData.lastCalculation.totalCost.toFixed(2)} for{" "}
                          {dashboardData.lastCalculation.totalUsage.toFixed(0)} kWh
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(dashboardData.lastCalculation.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No calculations yet</p>
                      <Link href="/calculator">
                        <Button className="mt-2">Calculate Your First Bill</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Energy Insights</CardTitle>
                <CardDescription>AI-powered recommendations for you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.efficiency < 70 && (
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">Efficiency Alert</p>
                        <p className="text-sm text-yellow-700">
                          Your efficiency score is below average. Consider checking our energy tips.
                        </p>
                      </div>
                    </div>
                  )}

                  {dashboardData.trend === "up" && dashboardData.trendPercentage > 10 && (
                    <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <TrendingUp className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800">Usage Increase</p>
                        <p className="text-sm text-red-700">
                          Your usage increased by {dashboardData.trendPercentage.toFixed(1)}% this month.
                        </p>
                      </div>
                    </div>
                  )}

                  {dashboardData.efficiency >= 80 && (
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Lightbulb className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">Great Job!</p>
                        <p className="text-sm text-green-700">
                          Your energy efficiency is excellent. Keep up the good work!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>Summary of your energy tracking data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{dashboardData.totalCalculations}</div>
                  <p className="text-sm text-gray-600">Total Calculations</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{dashboardData.averageDaily.toFixed(1)} kWh</div>
                  <p className="text-sm text-gray-600">Average Daily Usage</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{dashboardData.peakUsage.toFixed(0)} kWh</div>
                  <p className="text-sm text-gray-600">Peak Monthly Usage</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your stored energy data and calculations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Reset All Data</p>
                  <p className="text-sm text-gray-600">Clear all calculations, usage data, and chat history</p>
                </div>
                <Button variant="destructive" onClick={handleResetData}>
                  Reset Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Chatbot */}
        <Chatbot />
      </div>
    </ProtectedRoute>
  )
}
