import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    const { db } = await connectToDatabase()

    // Save user message
    const userMessage = {
      type: "user",
      content: message,
      timestamp: new Date(),
    }
    await db.collection("chatMessages").insertOne(userMessage)

    // Generate bot response with access to real data
    const botResponse = await generateResponseWithData(message.toLowerCase(), db)

    // Save bot message
    const botMessage = {
      type: "bot",
      content: botResponse,
      timestamp: new Date(),
    }
    await db.collection("chatMessages").insertOne(botMessage)

    return NextResponse.json({ response: botResponse })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ response: "Sorry, I'm having trouble right now. Please try again." }, { status: 500 })
  }
}

async function generateResponseWithData(message: string, db: any): Promise<string> {
  try {
    // Get real data from MongoDB
    const dashboardData = await db.collection("dashboard").findOne({ type: "main" })
    const predictions = await db.collection("predictions").findOne({ type: "monthly" })
    const recentCalculation = await db.collection("billCalculations").findOne({}, { sort: { timestamp: -1 } })

    // Enhanced responses with real data
    if (message.includes("usage") || message.includes("consumption")) {
      const currentUsage = dashboardData?.currentUsage || 245
      return `Your current monthly usage is ${currentUsage} kWh. Based on your usage pattern:\n\n• Air conditioning: 40% (${Math.round(currentUsage * 0.4)} kWh)\n• Lighting: 25% (${Math.round(currentUsage * 0.25)} kWh)\n• Water heating: 15% (${Math.round(currentUsage * 0.15)} kWh)\n• Other appliances: 20% (${Math.round(currentUsage * 0.2)} kWh)\n\nWould you like tips to reduce any specific category?`
    }

    if (message.includes("bill") || message.includes("cost")) {
      const currentBill = dashboardData?.currentBill || 1850
      const lastCalculation = recentCalculation?.totalBill
      let response = `Your estimated current bill is ₹${currentBill}.`

      if (lastCalculation) {
        response += ` Your last calculated bill was ₹${lastCalculation}.`
      }

      response += `\n\nBill breakdown:\n• Energy charges: ~₹${Math.round(currentBill * 0.8)}\n• Fixed charges: ₹50\n• Taxes: ~₹${Math.round(currentBill * 0.1)}\n\nUse the Bill Calculator for exact calculations with your meter readings.`
      return response
    }

    if (message.includes("prediction") || message.includes("forecast")) {
      const nextMonthUsage = predictions?.nextMonthUsage || 280
      const nextMonthCost = predictions?.nextMonthCost || 2100
      const efficiencyScore = predictions?.efficiencyScore || 78

      return `AI Predictions for next month:\n\n📊 Expected usage: ${nextMonthUsage} kWh\n💰 Estimated cost: ₹${nextMonthCost}\n⚡ Efficiency score: ${efficiencyScore}%\n\nBased on your patterns, your usage typically increases by 15% during summer months. Consider using appliances during off-peak hours to save costs.`
    }

    if (message.includes("save") || message.includes("tip") || message.includes("reduce")) {
      const savingsPotential = dashboardData?.savingsPotential || 320
      return `You can potentially save ₹${savingsPotential}/month! Here are top recommendations:\n\n💡 Switch to LED bulbs: Save ₹200/month\n❄️ Set AC to 24°C: Save ₹300/month\n🔌 Unplug devices: Save ₹150/month\n☀️ Use natural light: Save ₹100/month\n\nCheck the Smart Tips section for more detailed advice!`
    }

    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      const currentUsage = dashboardData?.currentUsage || 245
      const currentBill = dashboardData?.currentBill || 1850
      return `Hello! 👋 Here's your quick energy summary:\n\n⚡ Current usage: ${currentUsage} kWh\n💰 Estimated bill: ₹${currentBill}\n📈 Savings potential: ₹${dashboardData?.savingsPotential || 320}/month\n\nI can help you with bill calculations, energy tips, usage analysis, and predictions. What would you like to explore?`
    }

    if (message.includes("help")) {
      return `I can help you with:\n\n📊 **Usage Analysis**\n• Current consumption: ${dashboardData?.currentUsage || 245} kWh\n• Usage breakdown by appliances\n\n💰 **Bill Information**\n• Current estimated bill: ₹${dashboardData?.currentBill || 1850}\n• Slab-wise calculations\n\n🔮 **AI Predictions**\n• Next month forecast: ${predictions?.nextMonthUsage || 280} kWh\n• Cost predictions and trends\n\n💡 **Energy Tips**\n• Personalized saving recommendations\n• Appliance efficiency advice\n\nJust ask me anything about your energy consumption!`
    }

    if (message.includes("appliance") || message.includes("device")) {
      return `Your appliance breakdown:\n\n❄️ **Air Conditioning (40%)**\n• Biggest energy consumer\n• Tip: Set to 24°C or higher\n\n💡 **Lighting (25%)**\n• Switch to LED bulbs\n• Use natural light during day\n\n🚿 **Water Heating (15%)**\n• Use timer for water heater\n• Consider solar heating\n\n❄️ **Refrigerator (12%)**\n• Keep at optimal temperature\n• Regular defrosting\n\n🔌 **Others (8%)**\n• Unplug when not in use\n• Use power strips\n\nWhich appliance would you like specific tips for?`
    }

    // Default response with current data
    const currentUsage = dashboardData?.currentUsage || 245
    const currentBill = dashboardData?.currentBill || 1850
    return `I'm here to help with your energy management! 🔋\n\nCurrent Status:\n• Usage: ${currentUsage} kWh\n• Bill: ₹${currentBill}\n\nI can help you with:\n• Bill calculations and explanations\n• Energy-saving tips and advice\n• Usage analysis and trends\n• AI predictions and insights\n• Appliance efficiency tips\n\nWhat specific topic interests you?`
  } catch (error) {
    console.error("Error generating response with data:", error)
    return "I can help you with bill calculations, energy-saving tips, usage analysis, and AI predictions. What would you like to know?"
  }
}
