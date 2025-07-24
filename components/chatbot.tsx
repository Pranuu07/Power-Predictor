"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, X, Bot, User, Loader2 } from "lucide-react"
import { getStoredData, saveStoredData } from "@/lib/localStorage"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Load chat history when component mounts
    const data = getStoredData()
    if (data.chatHistory) {
      setMessages(
        data.chatHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      )
    }
  }, [])

  const saveMessage = (message: Message) => {
    const data = getStoredData()
    const updatedHistory = [
      ...(data.chatHistory || []),
      {
        ...message,
        timestamp: message.timestamp.toISOString(),
      },
    ]
    saveStoredData({ ...data, chatHistory: updatedHistory })
  }

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response based on user input
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("usage") || lowerMessage.includes("consumption")) {
      const data = getStoredData()
      const calculations = data.billCalculations || []
      if (calculations.length > 0) {
        const latest = calculations[calculations.length - 1]
        return `Based on your latest calculation, you're using ${latest.totalUsage.toFixed(0)} kWh per month, which costs approximately $${latest.totalCost.toFixed(2)}. This is ${latest.totalUsage > 800 ? "above" : "below"} the average household consumption.`
      }
      return "I don't see any usage calculations yet. Try using the Bill Calculator to track your energy consumption first!"
    }

    if (lowerMessage.includes("save") || lowerMessage.includes("reduce") || lowerMessage.includes("tips")) {
      return "Here are some energy-saving tips: 1) Use LED bulbs instead of incandescent ones, 2) Unplug devices when not in use, 3) Set your thermostat 2-3 degrees higher in summer and lower in winter, 4) Use energy-efficient appliances, 5) Seal air leaks around windows and doors."
    }

    if (lowerMessage.includes("bill") || lowerMessage.includes("cost")) {
      return "To calculate your electricity bill accurately, I need to know your appliance usage. Use the Bill Calculator feature to input your appliances and their usage hours. The calculator considers different rate structures and provides detailed breakdowns."
    }

    if (lowerMessage.includes("prediction") || lowerMessage.includes("forecast")) {
      return "Based on your usage patterns, I can help predict future consumption. The Predictions page uses your historical data to forecast upcoming bills and suggest optimal usage patterns. Regular tracking helps improve prediction accuracy."
    }

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("help")) {
      return "Hello! I'm your energy assistant. I can help you with:\n• Understanding your energy usage\n• Providing energy-saving tips\n• Explaining your electricity bills\n• Offering predictions based on your data\n\nWhat would you like to know about your energy consumption?"
    }

    return "I'm here to help with your energy questions! You can ask me about your usage patterns, energy-saving tips, bill calculations, or predictions. What specific aspect of your energy consumption would you like to discuss?"
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    saveMessage(userMessage)
    setInput("")
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const responseContent = await generateResponse(userMessage.content)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      saveMessage(assistantMessage)
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      saveMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([])
    const data = getStoredData()
    saveStoredData({ ...data, chatHistory: [] })
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsOpen(true)} className="rounded-full w-14 h-14 shadow-lg" size="lg">
          <MessageCircle className="h-6 w-6" />
        </Button>
        {messages.length > 0 && (
          <Badge className="absolute -top-2 -left-2 bg-red-500">
            {messages.filter((m) => m.role === "assistant").length}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-96 h-[500px] shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Energy Assistant
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearChat} className="text-xs">
              Clear
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[380px] p-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">
                  Hi! I'm your energy assistant. Ask me about your usage, bills, or energy-saving tips!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                    </div>
                    {message.role === "user" && (
                      <div className="bg-blue-600 p-2 rounded-full">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your energy usage..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Named export for compatibility
export { Chatbot as default }
