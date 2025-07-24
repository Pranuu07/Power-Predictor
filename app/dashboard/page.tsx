"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { UsageChart } from "@/components/usage-chart"
import { CostChart } from "@/components/cost-chart"
import { UsageBreakdown } from "@/components/usage-breakdown"
import { ChatBot } from "@/components/chatbot"
import { Zap, TrendingUp, DollarSign, Brain } from "lucide-react"
import { getDashboardData } from "@/lib/localStorage"

interface DashboardData {
  currentUsage: number
  currentBill: number
  aiPrediction: number
  savingsPotential: number
  monthlyData: Array<{ month: string; usage: number; cost: number }>
  usageBreakdown: Array<{ category: string; usage: number; color: string }>
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load data from localStorage
    const dashboardData = getDashboardData()
    setData(dashboardData)
    setLoading(false)

    // Listen for storage changes to update dashboard in real-time
    const handleStorageChange = () => {
      const updatedData = getDashboardData()
      setData(updatedData)
    }

    window.addEventListener("storage", handleStorageChange)

    // Custom event for same-tab updates
    window.addEventListener("dashboardUpdate", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("dashboardUpdate", handleStorageChange)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
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
          <p className="text-red-600">Failed to load dashboard data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Energy Dashboard</h1>
          <p className="text-gray-600">
            {data.currentUsage === 0
              ? "Start tracking your power consumption with the Bill Calculator"
              : "Monitor your power consumption and optimize energy usage"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Usage</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.currentUsage} kWh</div>
              <p className="text-xs text-muted-foreground">{data.currentUsage === 0 ? "No data yet" : "This month"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Bill</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data.currentBill}</div>
              <p className="text-xs text-muted-foreground">
                {data.currentBill === 0 ? "Calculate first bill" : "Estimated"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Prediction</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.aiPrediction} kWh</div>
              <p className="text-xs text-muted-foreground">
                {data.aiPrediction === 0 ? "Need more data" : "Next month"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings Potential</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data.savingsPotential}</div>
              <p className="text-xs text-muted-foreground">
                {data.savingsPotential === 0 ? "Start tracking" : "Per month"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Usage Trend</CardTitle>
              <CardDescription>
                {data.currentUsage === 0
                  ? "Chart will populate as you add bill calculations"
                  : "Monthly power consumption over time"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsageChart data={data.monthlyData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
              <CardDescription>
                {data.currentBill === 0
                  ? "Cost trends will appear after bill calculations"
                  : "Monthly electricity costs"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CostChart data={data.monthlyData} />
            </CardContent>
          </Card>
        </div>

        {/* Usage Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Breakdown</CardTitle>
            <CardDescription>
              {data.currentUsage === 0
                ? "Appliance breakdown will show after you start tracking usage"
                : "Power consumption by appliance category"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UsageBreakdown data={data.usageBreakdown} />
          </CardContent>
        </Card>

        {data.currentUsage === 0 && (
          <Card className="mt-8 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Start Tracking?</h3>
                <p className="text-blue-700 mb-4">
                  Use the Bill Calculator to enter your meter readings and begin monitoring your energy consumption.
                  Your dashboard will populate with real data as you track your usage!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <ChatBot />
    </div>
  )
}
