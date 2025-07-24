"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { UsageChart } from "@/components/usage-chart"
import { CostChart } from "@/components/cost-chart"
import { UsageBreakdown } from "@/components/usage-breakdown"
import { ChatBot } from "@/components/chatbot"
import { Zap, TrendingUp, DollarSign, Brain } from "lucide-react"

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
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard")
      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
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
          <p className="text-gray-600">Monitor your power consumption and optimize energy usage</p>
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
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Bill</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data.currentBill}</div>
              <p className="text-xs text-muted-foreground">Estimated</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Prediction</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.aiPrediction} kWh</div>
              <p className="text-xs text-muted-foreground">Next month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings Potential</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data.savingsPotential}</div>
              <p className="text-xs text-muted-foreground">Per month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Usage Trend</CardTitle>
              <CardDescription>Monthly power consumption over time</CardDescription>
            </CardHeader>
            <CardContent>
              <UsageChart data={data.monthlyData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
              <CardDescription>Monthly electricity costs</CardDescription>
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
            <CardDescription>Power consumption by appliance category</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageBreakdown data={data.usageBreakdown} />
          </CardContent>
        </Card>
      </main>

      <ChatBot />
    </div>
  )
}
