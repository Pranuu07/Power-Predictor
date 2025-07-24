// Local storage utility functions for data persistence

export interface DashboardData {
  currentUsage: number
  currentBill: number
  aiPrediction: number
  savingsPotential: number
  monthlyData: Array<{ month: string; usage: number; cost: number }>
  usageBreakdown: Array<{ category: string; usage: number; color: string }>
  lastUpdated: string
}

export interface BillCalculation {
  id: string
  previousReading: number
  currentReading: number
  unitsConsumed: number
  energyCharges: number
  fixedCharges: number
  taxes: number
  totalBill: number
  timestamp: string
}

export interface ChatMessage {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: string
}

export interface Prediction {
  nextMonthUsage: number
  nextMonthCost: number
  efficiencyScore: number
  trend: string
  confidence: number
  recommendations: string[]
  lastUpdated: string
}

export interface EnergyTip {
  id: string
  category: string
  title: string
  description: string
  savings: string
  difficulty: string
  priority: string
}

// Initial empty data structure
export const initialDashboardData: DashboardData = {
  currentUsage: 0,
  currentBill: 0,
  aiPrediction: 0,
  savingsPotential: 0,
  monthlyData: [
    { month: "Jan", usage: 0, cost: 0 },
    { month: "Feb", usage: 0, cost: 0 },
    { month: "Mar", usage: 0, cost: 0 },
    { month: "Apr", usage: 0, cost: 0 },
    { month: "May", usage: 0, cost: 0 },
    { month: "Jun", usage: 0, cost: 0 },
  ],
  usageBreakdown: [
    { category: "Air Conditioning", usage: 0, color: "#3b82f6" },
    { category: "Lighting", usage: 0, color: "#10b981" },
    { category: "Water Heating", usage: 0, color: "#f59e0b" },
    { category: "Refrigerator", usage: 0, color: "#ef4444" },
    { category: "Others", usage: 0, color: "#8b5cf6" },
  ],
  lastUpdated: new Date().toISOString(),
}

// Generic storage functions (missing exports that were referenced)
export const getStoredData = <T>(key: string, defaultValue: T): T => {\
  if (typeof window === "undefined") return defaultValue

  try {\
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error)\
    return defaultValue
  }
}

export const saveStoredData = <T>(key: string, data: T): void => {\
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error)
  }
}

// Dashboard data functions
export const getDashboardData = (): DashboardData => {\
  if (typeof window === "undefined") return initialDashboardData

  const stored = localStorage.getItem("powertracker_dashboard")
  if (!stored) {
    localStorage.setItem("powertracker_dashboard", JSON.stringify(initialDashboardData))\
    return initialDashboardData
  }
  return JSON.parse(stored)
}

export const saveDashboardData = (data: Partial<DashboardData>): void => {\
  if (typeof window === "undefined") return

  const current = getDashboardData()\
  const updated = { ...current, ...data, lastUpdated: new Date().toISOString() }
  localStorage.setItem("powertracker_dashboard", JSON.stringify(updated))

  // Trigger custom event for real-time updates
  window.dispatchEvent(new CustomEvent("dashboardUpdate"))
}

// Bill calculations functions
export const getBillCalculations = (): BillCalculation[] => {\
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("powertracker_bills")
  return stored ? JSON.parse(stored) : []
}
\
export const saveBillCalculation = (calculation: Omit<BillCalculation, "id" | "timestamp">): BillCalculation => {\
  if (typeof window === "undefined\") return { ...calculation, id: "", timestamp: "" }

  const bills = getBillCalculations()
  const newBill: BillCalculation = {
    ...calculation,\
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  }

  bills.push(newBill)
  localStorage.setItem("powertracker_bills", JSON.stringify(bills))

  // Update dashboard with new data
  saveDashboardData({\
    currentUsage: calculation.unitsConsumed,
    currentBill: calculation.totalBill,
  })

  updateMonthlyHistory(calculation.unitsConsumed, calculation.totalBill)
  generatePredictions(getDashboardData())

  return newBill
}

// Chat messages functions
export const getChatMessages = (): ChatMessage[] => {\
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("powertracker_chat")
  return stored ? JSON.parse(stored) : []
}

export const saveChatMessage = (type: "user" | "bot", content: string): ChatMessage => {\
  if (typeof window === "undefined\") return { id: "", type, content, timestamp: "" }

  const messages = getChatMessages()
  const newMessage: ChatMessage = {\
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    type,
    content,
    timestamp: new Date().toISOString(),
  }

  messages.push(newMessage)
  // Keep only last 100 messages
  if (messages.length > 100) {
    messages.splice(0, messages.length - 100)
  }

  localStorage.setItem("powertracker_chat", JSON.stringify(messages))
  return newMessage
}

export const clearChatMessages = (): void => {\
  if (typeof window === "undefined") return
  localStorage.removeItem("powertracker_chat")
}

// Predictions functions
export const getPredictions = (): Prediction => {\
  if (typeof window === "undefined") {\
    return {\
      nextMonthUsage: 0,
      nextMonthCost: 0,
      efficiencyScore: 0,
      trend: "stable",
      confidence: 0,
      recommendations: ["Start tracking your energy usage to get predictions"],
      lastUpdated: new Date().toISOString(),
    }
  }

  const stored = localStorage.getItem("powertracker_predictions")
  if (!stored) {\
    const dashboardData = getDashboardData()
    return generatePredictions(dashboardData)
  }
  return JSON.parse(stored)
}

// Update the generatePredictions function
export const generatePredictions = (dashboardData: DashboardData): Prediction => {\
  const bills = getBillCalculations()
  const currentUsage = dashboardData.currentUsage

  let predictions: Prediction

  if (currentUsage === 0 || bills.length === 0) {
    predictions = {
      nextMonthUsage: 0,
      nextMonthCost: 0,
      efficiencyScore: 0,
      trend: "stable",
      confidence: 0,
      recommendations: [
        "Start tracking your energy usage with the Bill Calculator",
        "Enter your meter readings to get personalized predictions",
        "Check back after a few calculations for AI insights",
      ],
      lastUpdated: new Date().toISOString(),
    }
  } else {
    // Calculate predictions based on historical data\
    const avgUsage =
      bills.length > 0 ? bills.reduce((sum, bill) => sum + bill.unitsConsumed, 0) / bills.length : currentUsage

    const nextMonthUsage = Math.round(avgUsage * 1.05) // 5% increase prediction
    const nextMonthCost = Math.round(nextMonthUsage * 5.5) // Average rate
    const efficiencyScore = Math.max(0, Math.min(100, 100 - currentUsage / 10))

    predictions = {
      nextMonthUsage,
      nextMonthCost,\
      efficiencyScore: Math.round(efficiencyScore),
      trend: nextMonthUsage > currentUsage ? "increasing\" : nextMonthUsage < currentUsage ? "decreasing" : "stable",\
      confidence: bills.length > 2 ? 85 : 60,
      recommendations: generateRecommendations(currentUsage, efficiencyScore),
      lastUpdated: new Date().toISOString(),
    }

    // Update dashboard with AI prediction
    saveDashboardData({\
      aiPrediction: nextMonthUsage,
      savingsPotential: Math.max(0, Math.round((currentUsage - nextMonthUsage) * 5.5)),
    })
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("powertracker_predictions", JSON.stringify(predictions))
  }

  return predictions
}

// Add function to update monthly data with history
export const updateMonthlyHistory = (unitsConsumed: number, totalBill: number): void => {\
  if (typeof window === "undefined") return

  const dashboardData = getDashboardData()
  const currentMonth = new Date().toLocaleDateString("en-US", { month: "short" })

  // Update monthly data
  const updatedMonthlyData = dashboardData.monthlyData.map((month) => {
    if (month.month === currentMonth) {
      return {
        ...month,
        usage: unitsConsumed,
        cost: totalBill,
      }
    }
    return month
  })

  // Update usage breakdown with realistic distribution
  const updatedUsageBreakdown = [
    { category: "Air Conditioning", usage: Math.round(unitsConsumed * 0.4), color: "#3b82f6" },
    { category: "Lighting", usage: Math.round(unitsConsumed * 0.2), color: "#10b981" },
    { category: "Water Heating", usage: Math.round(unitsConsumed * 0.15), color: "#f59e0b" },
    { category: "Refrigerator", usage: Math.round(unitsConsumed * 0.15), color: "#ef4444" },
    { category: "Others", usage: Math.round(unitsConsumed * 0.1), color: "#8b5cf6" },
  ]

  saveDashboardData({
    monthlyData: updatedMonthlyData,
    usageBreakdown: updatedUsageBreakdown,
  })
}

function generateRecommendations(usage: number, efficiency: number): string[] {
  const recommendations = []

  if (usage === 0) {
    return [
      "Start tracking your energy usage with the Bill Calculator",
      "Enter your meter readings to get personalized predictions",
      "Check back after a few calculations for AI insights",
    ]
  }

  if (usage > 300) {
    recommendations.push("Your usage is quite high. Consider reducing AC usage during peak hours")
    recommendations.push("Switch to energy-efficient appliances to reduce consumption")
  } else if (usage > 200) {
    recommendations.push("Moderate usage detected. Optimize appliance usage timing")
    recommendations.push("Consider using natural lighting during daytime")
  } else {
    recommendations.push("Good energy usage! Maintain current consumption patterns")
  }

  if (efficiency < 50) {
    recommendations.push("Focus on improving energy efficiency with LED bulbs")
    recommendations.push("Unplug devices when not in use to reduce phantom loads")
  } else if (efficiency < 75) {
    recommendations.push("Regular maintenance of appliances can improve efficiency")
    recommendations.push("Use programmable thermostats for better control")
  }

  recommendations.push("Monitor your usage regularly for better energy management")

  return recommendations.slice(0, 4)
}

// Energy tips functions
export const getEnergyTips = (): EnergyTip[] => {
  if (typeof window === "undefined") return []

  const dashboardData = getDashboardData()
  return generatePersonalizedTips(dashboardData.currentUsage)
}

function generatePersonalizedTips(usage: number): EnergyTip[] {
  const baseTips: EnergyTip[] = [
    {
      id: "1",
      category: "Lighting",
      title: "Switch to LED Bulbs",
      description: "LED bulbs use 75% less energy than incandescent bulbs and last 25 times longer",
      savings: "₹200/month",
      difficulty: "Easy",
      priority: usage > 100 ? "High" : "Medium",
    },
    {
      id: "2",
      category: "Cooling",
      title: "Optimize AC Temperature",
      description: "Set your AC to 24°C instead of 22°C. Each degree higher can save 6% energy",
      savings: "₹300/month",
      difficulty: "Easy",
      priority: usage > 200 ? "High" : "Medium",
    },
    {
      id: "3",
      category: "Appliances",
      title: "Unplug Devices When Not in Use",
      description: "Electronics consume power even when turned off. Unplug to avoid phantom loads",
      savings: "₹150/month",
      difficulty: "Easy",
      priority: "Medium",
    },
    {
      id: "4",
      category: "Water Heating",
      title: "Use Timer for Water Heater",
      description: "Heat water only when needed. Use a timer to automatically turn off the heater",
      savings: "₹250/month",
      difficulty: "Medium",
      priority: usage > 150 ? "High" : "Low",
    },
    {
      id: "5",
      category: "Lighting",
      title: "Use Natural Light",
      description: "Open curtains and blinds during daytime to reduce artificial lighting needs",
      savings: "₹100/month",
      difficulty: "Easy",
      priority: "Medium",
    },
    {
      id: "6",
      category: "Appliances",
      title: "Regular Appliance Maintenance",
      description: "Clean AC filters, defrost refrigerator, and service appliances regularly",
      savings: "₹180/month",
      difficulty: "Medium",
      priority: usage > 250 ? "High" : "Medium",
    },
  ]

  if (usage === 0) {
    return [
      {
        id: "start",
        category: "Getting Started",
        title: "Start Tracking Your Usage",
        description:
          "Use the Bill Calculator to enter your meter readings and begin monitoring your energy consumption",
        savings: "Track to save",
        difficulty: "Easy",
        priority: "High",
      },
      ...baseTips.slice(0, 3),
    ]
  }

  if (usage > 300) {
    baseTips.unshift({
      id: "high-usage",
      category: "Urgent",
      title: "High Usage Alert",
      description:
        "Your usage is quite high. Focus on reducing AC usage and switching to efficient appliances immediately",
      savings: "₹500/month",
      difficulty: "Medium",
      priority: "Critical",
    })
  }

  return baseTips
}

// Clear all data function (RESET FUNCTIONALITY)
export const clearAllData = (): void => {
  if (typeof window === "undefined") return

  // Clear all localStorage data
  localStorage.removeItem("powertracker_dashboard")
  localStorage.removeItem("powertracker_bills")
  localStorage.removeItem("powertracker_chat")
  localStorage.removeItem("powertracker_predictions")

  // Reset to initial state
  localStorage.setItem("powertracker_dashboard", JSON.stringify(initialDashboardData))

  // Trigger update event
  window.dispatchEvent(new CustomEvent("dashboardUpdate"))
}

// Delete specific bill calculation
export const deleteBillCalculation = (billId: string): void => {
  if (typeof window === "undefined") return

  const bills = getBillCalculations().filter((bill) => bill.id !== billId)
  localStorage.setItem("powertracker_bills", JSON.stringify(bills))

  // Recalculate dashboard data based on remaining bills
  if (bills.length > 0) {
    const latestBill = bills[bills.length - 1]
    saveDashboardData({
      currentUsage: latestBill.unitsConsumed,
      currentBill: latestBill.totalBill,
    })
    updateMonthlyHistory(latestBill.unitsConsumed, latestBill.totalBill)
  } else {
    // Reset to initial state if no bills remain
    saveDashboardData(initialDashboardData)
  }
}
