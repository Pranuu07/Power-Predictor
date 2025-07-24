import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, mockDashboardData } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // Get user data for context
    let userData = mockDashboardData
    try {
      const { db } = await connectToDatabase()
      const dbData = await db.collection("dashboard").findOne({})
      if (dbData) userData = dbData
    } catch (dbError) {
      console.warn("Using mock data for chat context:", dbError)
    }

    // Simple keyword-based responses with real data
    const lowerMessage = message.toLowerCase()
    let response = ""

    if (lowerMessage.includes("usage") || lowerMessage.includes("consumption")) {
      response = `Your current energy usage is ${userData.currentUsage} kWh this month. This is ${userData.efficiency}% efficient compared to similar households.`
    } else if (lowerMessage.includes("bill") || lowerMessage.includes("cost")) {
      response = `Your estimated monthly bill is ₹${userData.monthlyBill}. You've saved ₹${userData.savings} compared to last month!`
    } else if (lowerMessage.includes("save") || lowerMessage.includes("reduce")) {
      response = `Here are some ways to save energy: 1) Set AC to 24°C instead of 22°C, 2) Use LED bulbs, 3) Unplug devices when not in use. You could save up to ₹200 monthly!`
    } else if (lowerMessage.includes("prediction") || lowerMessage.includes("forecast")) {
      response = `Based on your usage pattern, I predict you'll use around 265 kWh next month, costing approximately ₹1,325. Consider reducing cooling usage during peak hours.`
    } else if (lowerMessage.includes("efficiency") || lowerMessage.includes("score")) {
      response = `Your energy efficiency score is ${userData.efficiency}%. This is good! You can improve by using appliances during off-peak hours and maintaining your AC regularly.`
    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      response = `Hello! I'm your energy assistant. I can help you with your current usage (${userData.currentUsage} kWh), bill estimates (₹${userData.monthlyBill}), and energy-saving tips. What would you like to know?`
    } else {
      response = `I can help you with energy usage, bill calculations, predictions, and saving tips. Your current usage is ${userData.currentUsage} kWh with a monthly bill of ₹${userData.monthlyBill}. What specific information do you need?`
    }

    // Save the conversation
    try {
      const { db } = await connectToDatabase()
      await db.collection("chatMessages").insertMany([
        {
          id: Date.now().toString(),
          message,
          sender: "user",
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 1).toString(),
          message: response,
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    } catch (dbError) {
      console.warn("Could not save chat to database:", dbError)
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        response: "I'm having trouble processing your request right now. Please try again later.",
      },
      { status: 500 },
    )
  }
}
