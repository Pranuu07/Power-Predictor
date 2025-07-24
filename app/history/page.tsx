"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, Download, Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { getStoredData, saveStoredData } from "@/lib/localStorage"

interface BillCalculation {
  id: string
  date: string
  totalUsage: number
  totalCost: number
  appliances: Array<{
    name: string
    wattage: number
    hoursPerDay: number
    daysPerMonth: number
    monthlyCost: number
  }>
  rateStructure: string
  notes?: string
}

export default function HistoryPage() {
  const [calculations, setCalculations] = useState<BillCalculation[]>([])
  const [filteredCalculations, setFilteredCalculations] = useState<BillCalculation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterPeriod, setFilterPeriod] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCalculations = () => {
      try {
        const data = getStoredData()
        const billCalculations = data.billCalculations || []
        setCalculations(billCalculations)
        setFilteredCalculations(billCalculations)
      } catch (error) {
        console.error("Error loading calculations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCalculations()
  }, [])

  useEffect(() => {
    let filtered = [...calculations]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (calc) =>
          calc.appliances.some((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          calc.rateStructure.toLowerCase().includes(searchTerm.toLowerCase()) ||
          calc.notes?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply period filter
    if (filterPeriod !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (filterPeriod) {
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3)
          break
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }

      filtered = filtered.filter((calc) => new Date(calc.date) >= filterDate)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "date":
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
        case "usage":
          aValue = a.totalUsage
          bValue = b.totalUsage
          break
        case "cost":
          aValue = a.totalCost
          bValue = b.totalCost
          break
        default:
          aValue = new Date(a.date)
          bValue = new Date(b.date)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredCalculations(filtered)
  }, [calculations, searchTerm, sortBy, sortOrder, filterPeriod])

  const deleteCalculation = (id: string) => {
    if (confirm("Are you sure you want to delete this calculation?")) {
      const updatedCalculations = calculations.filter((calc) => calc.id !== id)
      setCalculations(updatedCalculations)

      const data = getStoredData()
      saveStoredData({ ...data, billCalculations: updatedCalculations })
    }
  }

  const exportToCSV = () => {
    const headers = ["Date", "Total Usage (kWh)", "Total Cost ($)", "Rate Structure", "Appliances", "Notes"]
    const csvContent = [
      headers.join(","),
      ...filteredCalculations.map((calc) =>
        [
          calc.date,
          calc.totalUsage.toFixed(2),
          calc.totalCost.toFixed(2),
          calc.rateStructure,
          calc.appliances.map((app) => `${app.name} (${app.wattage}W)`).join("; "),
          calc.notes || "",
        ]
          .map((field) => `"${field}"`)
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `power-tracker-history-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getUsageTrend = (currentUsage: number, previousUsage?: number) => {
    if (!previousUsage) return null

    const change = ((currentUsage - previousUsage) / previousUsage) * 100
    return {
      direction: change > 0 ? "up" : "down",
      percentage: Math.abs(change),
    }
  }

  const calculateStats = () => {
    if (filteredCalculations.length === 0) {
      return {
        totalCalculations: 0,
        averageUsage: 0,
        averageCost: 0,
        totalUsage: 0,
        totalCost: 0,
      }
    }

    const totalUsage = filteredCalculations.reduce((sum, calc) => sum + calc.totalUsage, 0)
    const totalCost = filteredCalculations.reduce((sum, calc) => sum + calc.totalCost, 0)

    return {
      totalCalculations: filteredCalculations.length,
      averageUsage: totalUsage / filteredCalculations.length,
      averageCost: totalCost / filteredCalculations.length,
      totalUsage,
      totalCost,
    }
  }

  const stats = calculateStats()

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading history...</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Calculation History</h1>
            <p className="text-gray-600 mt-2">View and manage your electricity bill calculations and usage history.</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Calculations</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCalculations}</div>
                <p className="text-xs text-muted-foreground">
                  {filterPeriod === "all" ? "All time" : `Last ${filterPeriod}`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Usage</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageUsage.toFixed(0)} kWh</div>
                <p className="text-xs text-muted-foreground">Per calculation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Cost</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.averageCost.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Per calculation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  {filterPeriod === "all" ? "All time" : `Last ${filterPeriod}`}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter & Search</CardTitle>
              <CardDescription>
                Filter your calculations by date, search by appliance, or sort by different criteria.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search appliances, notes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Time Period</Label>
                  <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="week">Last Week</SelectItem>
                      <SelectItem value="month">Last Month</SelectItem>
                      <SelectItem value="quarter">Last 3 Months</SelectItem>
                      <SelectItem value="year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="usage">Usage</SelectItem>
                      <SelectItem value="cost">Cost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Order</Label>
                  <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Newest First</SelectItem>
                      <SelectItem value="asc">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredCalculations.length} of {calculations.length} calculations
                </p>
                <Button onClick={exportToCSV} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* History Table */}
          <Card>
            <CardHeader>
              <CardTitle>Calculation History</CardTitle>
              <CardDescription>Detailed view of all your electricity bill calculations.</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCalculations.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No calculations found</h3>
                  <p className="text-gray-600 mb-4">
                    {calculations.length === 0
                      ? "You haven't made any bill calculations yet."
                      : "No calculations match your current filters."}
                  </p>
                  {calculations.length === 0 && (
                    <Button asChild>
                      <a href="/calculator">Calculate Your First Bill</a>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Usage (kWh)</TableHead>
                        <TableHead>Cost ($)</TableHead>
                        <TableHead>Rate Structure</TableHead>
                        <TableHead>Appliances</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCalculations.map((calculation, index) => {
                        const previousCalculation = filteredCalculations[index + 1]
                        const trend = getUsageTrend(calculation.totalUsage, previousCalculation?.totalUsage)

                        return (
                          <TableRow key={calculation.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{new Date(calculation.date).toLocaleDateString()}</div>
                                <div className="text-sm text-gray-500">
                                  {new Date(calculation.date).toLocaleTimeString()}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{calculation.totalUsage.toFixed(0)} kWh</div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">${calculation.totalCost.toFixed(2)}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{calculation.rateStructure}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <div className="text-sm">
                                  {calculation.appliances
                                    .slice(0, 2)
                                    .map((app) => app.name)
                                    .join(", ")}
                                  {calculation.appliances.length > 2 && (
                                    <span className="text-gray-500"> +{calculation.appliances.length - 2} more</span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {trend && (
                                <div className="flex items-center space-x-1">
                                  {trend.direction === "up" ? (
                                    <TrendingUp className="h-4 w-4 text-red-500" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 text-green-500" />
                                  )}
                                  <span
                                    className={`text-sm ${
                                      trend.direction === "up" ? "text-red-600" : "text-green-600"
                                    }`}
                                  >
                                    {trend.percentage.toFixed(1)}%
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteCalculation(calculation.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
