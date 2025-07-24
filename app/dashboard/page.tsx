"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Zap, TrendingUp, DollarSign, Lightbulb, RotateCcw } from "lucide-react"
import { CostChart } from "@/components/cost-chart"
import { UsageChart } from "@/components/usage-chart"
import { UsageBreakdown } from "@/components/usage-breakdown"
import { ChatBot } from "@/components/chatbot"
import { getDashboardData, clearAllData } from "@/lib/localStorage"
import { ProtectedRoute } from "@/components/protected-route"

interface DashboardData {
  currentUsage: number
  currentBill: number
  savingsPotential: number
  aiPrediction: number
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    currentUsage: 0,
    currentBill: 0,
    savingsPotential: 0,
    aiPrediction: 0,
  })

  const [isResetting, setIsResetting] = useState(false)

  useEffect(() => {
    const dashboardData = getDashboardData()
    setData(dashboardData)
  }, [])

  const handleResetData = () => {
    setIsResetting(true)
    clearAllData()
    setData({
      currentUsage: 0,
      currentBill: 0,
      savingsPotential: 0,
      aiPrediction: 0,
    })
    setIsResetting(false)
    window.location.reload()
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor your electricity usage and costs</p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset All Data</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your bill calculations, usage history, and chat messages. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetData}
                  disabled={isResetting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isResetting ? "Resetting..." : "Reset All Data"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Key Metrics */}
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
              <CardTitle className="text-sm font-medium">Savings Potential</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data.savingsPotential}</div>
              <p className="text-xs text-muted-foreground">Per month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Prediction</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.aiPrediction} kWh</div>
              <p className="text-xs text-muted-foreground">Next month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Usage Trend</CardTitle>
              <CardDescription>Your electricity consumption over time</CardDescription>
            </CardHeader>
            <CardContent>
              <UsageChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
              <CardDescription>Monthly electricity costs breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <CostChart />
            </CardContent>
          </Card>
        </div>

        {/* Usage Breakdown and AI Assistant */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Breakdown</CardTitle>
              <CardDescription>How your electricity is being consumed</CardDescription>
            </CardHeader>
            <CardContent>
              <UsageBreakdown />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Energy Assistant</CardTitle>
              <CardDescription>Get personalized energy management advice</CardDescription>
            </CardHeader>
            <CardContent>
              <ChatBot />
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
