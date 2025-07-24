"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, X, Bot, User, Zap } from "lucide-react"
import { getChatMessages, saveChatMessage, getDashboardData, getBillCalculations } from "@/lib/localStorage"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: string
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load chat history
    const chatHistory = getChatMessages()
    setMessages(chatHistory)
  }, [])

  useEffect(() => {
    // Scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const generateBotResponse = (userMessage: string): string => {
    const dashboardData = getDashboardData()
    const bills = getBillCalculations()
    const lowerMessage = userMessage.toLowerCase()

    // Greeting responses
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! I'm your AI energy assistant. I can help you understand your energy usage, provide saving tips, and answer questions about your electricity bills. How can I assist you today?"
    }

    // Usage-related questions
    if (lowerMessage.includes("usage") || lowerMessage.includes("consumption")) {
      if (dashboardData.currentUsage === 0) {
        return "You haven't tracked any energy usage yet. Start by using the Bill Calculator to enter your meter readings. Once you have some data, I can provide detailed insights about your consumption patterns!"
      }
      return `Your current usage is ${dashboardData.currentUsage} kWh. Based on your consumption pattern, you're ${dashboardData.currentUsage > 200 ? "using quite a bit of energy. Consider reducing AC usage during peak hours" : "maintaining good energy efficiency"}. Would you like specific tips to optimize your usage?`
    }

    // Bill-related questions
    if (lowerMessage.includes("bill") || lowerMessage.includes("cost") || lowerMessage.includes("money")) {
      if (dashboardData.currentBill === 0) {
        return "You haven't calculated any bills yet. Use the Bill Calculator to enter your meter readings and get an accurate bill estimate. I can then help you understand the charges and suggest ways to reduce costs."
      }
      return `Your current estimated bill is ₹${dashboardData.currentBill}. This breaks down into energy charges, fixed charges, and taxes. ${bills.length > 0 ? `You've calculated ${bills.length} bill(s) so far.` : ""} Would you like tips on reducing your electricity costs?`
    }

    // Savings and tips
    if (
      lowerMessage.includes("save") ||
      lowerMessage.includes("reduce") ||
      lowerMessage.includes("tips") ||
      lowerMessage.includes("lower")
    ) {
      const tips = [
        "Set your AC to 24°C instead of 22°C to save 6% energy per degree",
        "Switch to LED bulbs - they use 75% less energy than incandescent bulbs",
        "Unplug devices when not in use to avoid phantom power consumption",
        "Use natural light during daytime to reduce lighting costs",
        "Regular maintenance of appliances improves their efficiency",
      ]
      const randomTip = tips[Math.floor(Math.random() * tips.length)]
      return `Here's a great energy-saving tip: ${randomTip}. ${dashboardData.savingsPotential > 0 ? `Based on your usage, you could potentially save ₹${dashboardData.savingsPotential} per month!` : "Check the Tips page for more personalized recommendations."}`
    }

    // Predictions
    if (lowerMessage.includes("predict") || lowerMessage.includes("forecast") || lowerMessage.includes("next month")) {
      if (dashboardData.aiPrediction === 0) {
        return "I need more data to make accurate predictions. Once you've calculated a few bills, I can predict your next month's usage and costs based on your consumption patterns."
      }
      return `Based on your usage patterns, I predict your next month's consumption will be around ${dashboardData.aiPrediction} kWh. This is based on analyzing your historical data and seasonal trends. Keep tracking your usage for more accurate predictions!`
    }

    // AC/Cooling related
    if (lowerMessage.includes("ac") || lowerMessage.includes("air condition") || lowerMessage.includes("cooling")) {
      return "Air conditioning typically accounts for 40-60% of your electricity bill. Here are some AC tips: Set temperature to 24-26°C, use fans to circulate air, clean filters regularly, and use timer functions. Even 1°C higher can save 6% energy!"
    }

    // Appliances
    if (
      lowerMessage.includes("appliance") ||
      lowerMessage.includes("refrigerator") ||
      lowerMessage.includes("washing")
    ) {
      return "Appliances consume significant energy. Tips: Use energy-efficient models (5-star rated), maintain them regularly, use appropriate load sizes, and avoid keeping refrigerator doors open. Would you like specific advice for any particular appliance?"
    }

    // Help or general questions
    if (lowerMessage.includes("help") || lowerMessage.includes("how") || lowerMessage.includes("what")) {
      return "I can help you with: 📊 Understanding your energy usage patterns, 💡 Providing energy-saving tips, 💰 Explaining your electricity bills, 🔮 Making usage predictions, and 🏠 Optimizing home appliances. What would you like to know more about?"
    }

    // Default responses
    const defaultResponses = [
      "That's an interesting question! I specialize in energy management and electricity bills. Could you ask me something about your power consumption, bills, or energy-saving tips?",
      "I'm here to help with your energy needs! Try asking me about your electricity usage, bill calculations, or ways to save energy at home.",
      "I'd love to help you save energy and reduce costs! Ask me about your power consumption, appliance efficiency, or energy-saving strategies.",
      "As your energy assistant, I can provide insights about electricity usage, bill optimization, and smart energy practices. What would you like to know?",
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

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-xl z-40 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-blue-600" />
              Energy Assistant
              <Badge variant="secondary" className="ml-auto">
                <Zap className="h-3 w-3 mr-1" />
                AI
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Bot className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm">
                    Hi! I'm your AI energy assistant. Ask me about your electricity usage, bills, or energy-saving tips!
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === "bot" && <Bot className="h-4 w-4 mt-0.5 text-blue-600" />}
                      {message.type === "user" && <User className="h-4 w-4 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-blue-600" />
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
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your energy usage..."
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
