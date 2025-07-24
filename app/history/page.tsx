"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { Trash2, Calendar, TrendingUp, DollarSign, Zap } from "lucide-react"
import { getBillCalculations, deleteBillCalculation, clearAllBillCalculations } from "@/lib/localStorage"
import { ProtectedRoute } from "@/components/protected-route"

interface BillCalculation {
  id: string
  previousReading: number
  currentReading: number
  unitsConsumed: number
  energyCharges: number
  fixedCharges: number
  taxes: number
  totalBill: number
  calculatedAt: string
}

export default function HistoryPage() {
  const [bills, setBills] = useState<BillCalculation[]>([])
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isClearing, setIsClearing] = useState(false)

  useEffect(() => {
    const billHistory = getBillCalculations()
    setBills(billHistory.sort((a, b) => new Date(b.calculatedAt).getTime() - new Date(a.calculatedAt).getTime()))
  }, [])

  const handleDeleteBill = (billId: string) => {
    setIsDeleting(billId)
    deleteBillCalculation(billId)
    setBills(bills.filter((bill) => bill.id !== billId))
    setIsDeleting(null)
  }

  const handleClearHistory = () => {
    setIsClearing(true)
    clearAllBillCalculations()
    setBills([])
    setIsClearing(false)
  }

  const totalUnits = bills.reduce((sum, bill) => sum + bill.unitsConsumed, 0)
  const totalAmount = bills.reduce((sum, bill) => sum + bill.totalBill, 0)
  const averageBill = bills.length > 0 ? totalAmount / bills.length : 0

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bill History</h1>
            <p className="text-gray-600 mt-2">View and manage your electricity bill calculations</p>
          </div>

          {bills.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All History</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your bill calculation history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearHistory}
                    disabled={isClearing}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isClearing ? "Clearing..." : "Clear History"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {bills.length > 0 && (
          <>
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Calculations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bills.length}</div>
                  <p className="text-xs text-muted-foreground">Bill calculations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUnits.toFixed(0)} kWh</div>
                  <p className="text-xs text-muted-foreground">Consumed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Bill</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{averageBill.toFixed(0)}</div>
                  <p className="text-xs text-muted-foreground">Per calculation</p>
                </CardContent>
              </Card>
            </div>

            {/* Bills Table */}
            <Card>
              <CardHeader>
                <CardTitle>Bill Calculations</CardTitle>
                <CardDescription>Detailed history of your electricity bill calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
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
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{new Date(bill.calculatedAt).toLocaleDateString()}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(bill.calculatedAt).toLocaleTimeString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{bill.previousReading}</TableCell>
                          <TableCell>{bill.currentReading}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{bill.unitsConsumed} kWh</Badge>
                          </TableCell>
                          <TableCell>₹{bill.energyCharges.toFixed(2)}</TableCell>
                          <TableCell>₹{bill.fixedCharges.toFixed(2)}</TableCell>
                          <TableCell>₹{bill.taxes.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="default">₹{bill.totalBill.toFixed(2)}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  disabled={isDeleting === bill.id}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Bill Calculation</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this bill calculation? This action cannot be undone.
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
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <TrendingUp className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bill History</h3>
              <p className="text-gray-600 text-center mb-6">
                You haven't calculated any bills yet. Start by using the Bill Calculator to track your electricity
                usage.
              </p>
              <Button asChild>
                <a href="/calculator">Calculate Your First Bill</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}
