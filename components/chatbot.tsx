"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getChatMessages, saveChatMessage, getDashboardData, getBillCalculations } from "@/lib/localStorage"
import { MessageCircle, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: string
}

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load chat history
    const chatHistory = getChatMessages()
    setMessages(chatHistory)

    // Add welcome message if no messages exist
    if (chatHistory.length === 0) {
      const welcomeMessage = saveChatMessage(
        "bot",
        "Hello! I'm your AI energy assistant. I can help you understand your energy usage, provide saving tips, and answer questions about your electricity bills. How can I help you today?",
      )
      setMessages([welcomeMessage])
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when new messages are added
    scrollAreaRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const generateBotResponse = (userMessage: string): string => {
    const dashboardData = getDashboardData()
    const bills = getBillCalculations()
    const lowerMessage = userMessage.toLowerCase()

    // Greeting responses
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! I'm here to help you with your energy management. You can ask me about your usage, bills, or energy-saving tips."
    }

    // Usage-related questions
    if (lowerMessage.includes("usage") || lowerMessage.includes("consumption")) {
      if (dashboardData.currentUsage === 0) {
        return "You haven't recorded any energy usage yet. Use the Bill Calculator to enter your meter readings and start tracking your consumption!"
      }
      return `Your current monthly usage is ${dashboardData.currentUsage} kWh. ${dashboardData.currentUsage > 300 ? "This is quite high - consider implementing energy-saving measures." : dashboardData.currentUsage > 200 ? "This is moderate usage - there's room for optimization." : "Great! You're maintaining good energy efficiency."}`
    }

    // Bill-related questions
    if (lowerMessage.includes("bill") || lowerMessage.includes("cost") || lowerMessage.includes("money")) {
      if (dashboardData.currentBill === 0) {
        return "You haven't calculated any bills yet. Use the Bill Calculator to see your electricity costs and start tracking your expenses."
      }
      return `Your current monthly bill is ₹${dashboardData.currentBill}. ${bills.length > 1 ? `You've calculated ${bills.length} bills so far with an average of ₹${Math.round(bills.reduce((sum, bill) => sum + bill.totalBill, 0) / bills.length)}.` : "Calculate more bills to see trends and get better insights."}`
    }

    // Savings and tips
    if (
      lowerMessage.includes("save") ||
      lowerMessage.includes("reduce") ||
      lowerMessage.includes("tips") ||
      lowerMessage.includes("lower")
    ) {
      const tips = [
        "Set your AC to 24°C instead of lower temperatures - each degree can save 6% energy",
        "Switch to LED bulbs which use 75% less energy than traditional bulbs",
        "Unplug devices when not in use to avoid phantom power consumption",
        "Use natural light during daytime to reduce artificial lighting needs",
        "Regular maintenance of appliances improves their efficiency",
      ]
      const randomTip = tips[Math.floor(Math.random() * tips.length)]
      return `Here's a great energy-saving tip: ${randomTip}. Check out the Tips page for more personalized recommendations!`
    }

    // Predictions
    if (lowerMessage.includes("predict") || lowerMessage.includes("forecast") || lowerMessage.includes("next month")) {
      if (dashboardData.aiPrediction === 0) {
        return "I need more data to make accurate predictions. Calculate a few bills first, and I'll be able to forecast your future usage and costs!"
      }
      return `Based on your usage patterns, I predict you'll consume around ${dashboardData.aiPrediction} kWh next month. Visit the Predictions page for detailed AI insights and recommendations.`
    }

    // AC/Cooling related
    if (lowerMessage.includes("ac") || lowerMessage.includes("air condition") || lowerMessage.includes("cooling")) {
      return "Air conditioning typically accounts for 40% of your electricity bill. To save energy: set temperature to 24°C, clean filters regularly, and use fans to circulate air better."
    }

    if (lowerMessage.includes("refrigerator") || lowerMessage.includes("fridge")) {
      return "Refrigerators run 24/7, so efficiency matters! Keep the temperature at 3-4°C, don't overfill it, and ensure door seals are tight. Defrost regularly if it's not frost-free."
    }

    // Help or general questions
    if (lowerMessage.includes("help") || lowerMessage.includes("what can you do")) {
      return "I can help you with:\n• Understanding your energy usage and bills\n• Providing energy-saving tips\n• Explaining your consumption patterns\n• Giving predictions about future usage\n• Answering questions about appliances and efficiency\n\nJust ask me anything about energy management!"
    }

    // Default responses
    const defaultResponses = [
      "That's an interesting question! For specific energy advice, I'd recommend checking your usage patterns in the dashboard and implementing the tips from the Tips page.",
      "I'm here to help with energy management! You can ask me about your usage, bills, saving tips, or predictions. What would you like to know?",
      "For the best energy insights, make sure to regularly calculate your bills and track your usage. This helps me provide more accurate advice!",
      "Energy efficiency is all about small changes that add up! Check out your personalized tips or ask me about specific appliances.",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = saveChatMessage("user", inputValue.trim())
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(
      () => {
        const botResponse = generateBotResponse(inputValue.trim())
        const botMessage = saveChatMessage("bot", botResponse)
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-96 border rounded-lg bg-white">
      <div className="flex items-center space-x-2 p-3 border-b bg-gray-50 rounded-t-lg">
        <MessageCircle className="h-5 w-5 text-blue-600" />
        <span className="font-medium">AI Energy Assistant</span>
      </div>

      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "bot" && (
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3 w-3 text-blue-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-2 rounded-lg text-sm ${
                  message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
              {message.type === "user" && (
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="h-3 w-3 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="h-3 w-3 text-blue-600" />
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about energy saving tips..."
            disabled={isTyping}
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Named export for compatibility
export { ChatBot as Chatbot }
