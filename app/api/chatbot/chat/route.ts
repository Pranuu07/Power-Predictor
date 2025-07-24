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

    // Get current dashboard data for context
    const dashboardData = await db.collection("dashboard").findOne({ type: "main" })
    const recentCalculation = await db.collection("billCalculations").findOne({}, { sort: { timestamp: -1 } })
    const predictions = await db.collection("predictions").findOne({ type: "monthly" })

    // Generate response using Gemini AI
    const botResponse = await generateGeminiResponse(message, {
      dashboardData,
      recentCalculation,
      predictions,
    })

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

async function generateGeminiResponse(message: string, context: any): Promise<string> {
  try {
    const { dashboardData, recentCalculation, predictions } = context

    // Prepare context for Gemini
    const systemContext = `You are an energy management assistant. Here's the current user data:
    
Current Usage: ${dashboardData?.currentUsage || 0} kWh
Current Bill: ₹${dashboardData?.currentBill || 0}
Last Calculation: ${recentCalculation ? `${recentCalculation.unitsConsumed} units, ₹${recentCalculation.totalBill}` : "No calculations yet"}
Predictions: ${predictions ? `Next month: ${predictions.nextMonthUsage} kWh` : "No predictions available"}

Provide helpful, personalized advice about energy consumption, bill calculations, and energy-saving tips. Keep responses concise and practical.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemContext}\n\nUser message: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error("Gemini API request failed")
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (generatedText) {
      return generatedText
    } else {
      throw new Error("No response from Gemini")
    }
  } catch (error) {
    console.error("Gemini API error:", error)

    // Fallback to rule-based responses if Gemini fails
    return generateFallbackResponse(message, context)
  }
}

function generateFallbackResponse(message: string, context: any): string {
  const { dashboardData, recentCalculation } = context
  const lowerMessage = message.toLowerCase()

  const currentUsage = dashboardData?.currentUsage || 0
  const currentBill = dashboardData?.currentBill || 0

  if (lowerMessage.includes("usage") || lowerMessage.includes("consumption")) {
    if (currentUsage === 0) {
      return "You haven't recorded any energy usage yet. Use the Bill Calculator to enter your meter readings and start tracking your consumption!"
    }
    return `Your current energy usage is ${currentUsage} kWh this month. ${currentUsage > 200 ? "This is quite high - consider reducing AC usage and switching to LED bulbs." : currentUsage > 100 ? "This is moderate usage. You can still save by optimizing appliance usage." : "Great! Your usage is quite low. Keep up the good energy-saving habits!"}`
  }

  if (lowerMessage.includes("bill") || lowerMessage.includes("cost")) {
    if (currentBill === 0) {
      return "You haven't calculated your bill yet. Go to the Bill Calculator and enter your previous and current meter readings to see your electricity bill breakdown!"
    }
    return `Your current estimated bill is ₹${currentBill}. ${recentCalculation ? `Your last calculation showed ${recentCalculation.unitsConsumed} units consumed.` : ""} Use the calculator regularly to track your monthly expenses.`
  }

  if (lowerMessage.includes("save") || lowerMessage.includes("reduce") || lowerMessage.includes("tips")) {
    return `Here are some energy-saving tips:
• Set AC temperature to 24°C or higher
• Use LED bulbs instead of incandescent
• Unplug devices when not in use
• Use natural light during daytime
• Regular maintenance of appliances
${currentUsage > 0 ? `\nBased on your ${currentUsage} kWh usage, focus on reducing cooling and lighting consumption.` : ""}`
  }

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return `Hello! I'm your energy assistant. ${currentUsage > 0 ? `Your current usage is ${currentUsage} kWh with an estimated bill of ₹${currentBill}.` : "Start by using the Bill Calculator to track your energy consumption."} I can help you with usage analysis, bill calculations, and energy-saving tips. What would you like to know?`
  }

  if (lowerMessage.includes("prediction") || lowerMessage.includes("forecast")) {
    if (currentUsage === 0) {
      return "I need some usage data to make predictions. Please use the Bill Calculator first to enter your meter readings, then I can forecast your future consumption."
    }
    return `Based on your current usage of ${currentUsage} kWh, I predict your next month's consumption could be around ${Math.round(currentUsage * 1.1)} kWh. Check the AI Predictions page for detailed forecasts.`
  }

  return `I'm here to help with your energy management! ${currentUsage > 0 ? `Current status: ${currentUsage} kWh usage, ₹${currentBill} estimated bill.` : "Start by calculating your first bill to begin tracking."} I can help with:
• Usage analysis and tracking
• Bill calculations and breakdowns
• Energy-saving tips and advice
• Consumption predictions
What would you like to know?`
}
