"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { History, Trash2, Calendar, Zap, DollarSign, ArrowLeft } from "lucide-react"
import { getBillCalculations, deleteBillCalculation, clearAllData, type BillCalculation } from "@/lib/localStorage"
import { useRouter } from "next/navigation"

export default function HistoryPage() {
  const [bills, setBills] = useState<BillCalculation[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const billData = getBillCalculations()
    setBills(billData.reverse()) // Show latest first
    setLoading(false)

    // Listen for updates
    const handleUpdate = () => {
      const updatedBills = getBillCalculations()
      setBills(updatedBills.reverse())
    }

    window.addEventListener("dashboardUpdate", handleUpdate)
    return () => window.removeEventListener("dashboardUpdate", handleUpdate)
  }, [])

  const handleDeleteBill = (billId: string) => {
    deleteBillCalculation(billId)
    const updatedBills = getBillCalculations()
    setBills(updatedBills.reverse())
  }

  const handleClearAllHistory = () => {
    clearAllData()
    setBills([])
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTotalStats = () => {
    const totalUnits = bills.reduce((sum, bill) => sum + bill.unitsConsumed, 0)
    const totalAmount = bills.reduce((sum, bill) => sum + bill.totalBill, 0)
    const avgUnits = bills.length > 0 ? Math.round(totalUnits / bills.length) : 0
    const avgAmount = bills.length > 0 ? Math.round(totalAmount / bills.length) : 0

    return { totalUnits, totalAmount, avgUnits, avgAmount }
  }

  const stats = getTotalStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading history...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button onClick={() => router.back()} variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <History className="h-8 w-8" />
                Bill History
              </h1>
              <p className="text-gray-600">
                {bills.length === 0
                  ? "No bill calculations yet. Start with the Bill Calculator!"
                  : `${bills.length} bill calculation${bills.length !== 1 ? "s" : ""} recorded`}
              </p>
            </div>
          </div>

          {bills.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear All History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All History</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your bill calculations and reset your dashboard. This action cannot
                    be undone. Are you sure?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAllHistory} className="bg-red-600 hover:bg-red-700">
                    Yes, Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {bills.length > 0 && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Calculations</CardTitle>
                  <History className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bills.length}</div>
                  <p className="text-xs text-muted-foreground">Bill records</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUnits} kWh</div>
                  <p className="text-xs text-muted-foreground">Avg: {stats.avgUnits} kWh</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.totalAmount}</div>
                  <p className="text-xs text-muted-foreground">Avg: ₹{stats.avgAmount}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Latest Bill</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{bills[0]?.totalBill || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {bills[0] ? formatDate(bills[0].timestamp).split(",")[0] : "No data"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Bills Table */}
            <Card>
              <CardHeader>
                <CardTitle>Bill Calculations History</CardTitle>
                <CardDescription>Complete history of all your electricity bill calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Previous Reading</TableHead>
                        <TableHead>Current Reading</TableHead>
                        <TableHead>Units Consumed</TableHead>
                        <TableHead>Energy Charges</TableHead>
                        <TableHead>Fixed Charges</TableHead>
                        <TableHead>Taxes</TableHead>
                        <TableHead>Total Bill</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bills.map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{formatDate(bill.timestamp).split(",")[0]}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(bill.timestamp).split(",")[1]}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{bill.previousReading}</TableCell>
                          <TableCell>{bill.currentReading}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {bill.unitsConsumed} kWh
                            </Badge>
                          </TableCell>
                          <TableCell>₹{bill.energyCharges}</TableCell>
                          <TableCell>₹{bill.fixedCharges}</TableCell>
                          <TableCell>₹{bill.taxes}</TableCell>
                          <TableCell>
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              ₹{bill.totalBill}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Bill Calculation</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete this bill calculation from your history. This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteBill(bill.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {bills.length === 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <History className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">No History Yet</h3>
                <p className="text-blue-700 mb-4">
                  Start calculating your electricity bills to see your history here. All your calculations will be saved
                  and you can track your usage patterns over time.
                </p>
                <Button onClick={() => router.push("/calculator")} className="bg-blue-600 hover:bg-blue-700">
                  Go to Bill Calculator
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
