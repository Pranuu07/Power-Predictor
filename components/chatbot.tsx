"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, Send } from "lucide-react"

interface Message {
  _id?: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadMessages()
    }
  }, [isOpen])

  const loadMessages = async () => {
    try {
      const response = await fetch("/api/chatbot/messages")
      const data = await response.json()
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages)
      } else {
        // Add welcome message if no messages exist
        const welcomeMessage = {
          type: "bot" as const,
          content:
            "Hi! I'm your energy assistant. I can help you with:\n• Current usage and bills\n• Energy-saving tips\n• Bill calculations\n• AI predictions\n\nWhat would you like to know?",
          timestamp: new Date(),
        }
        setMessages([welcomeMessage])
      }
    } catch (error) {
      console.error("Failed to load messages:", error)
      setMessages([
        {
          type: "bot",
          content: "Hi! I'm your energy assistant. How can I help you save energy today?",
          timestamp: new Date(),
        },
      ])
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      const response = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()

      const botMessage: Message = {
        type: "bot",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        type: "bot",
        content: "Sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
      setInput("")
    }
  }

  if (!isOpen) {
    return (
      <Button className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg z-50" onClick={() => setIsOpen(true)}>
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 shadow-xl z-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Energy Assistant</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-2 mb-4 max-h-64">
          {messages.map((message, index) => (
            <div
              key={message._id || index}
              className={`p-2 rounded-lg text-sm whitespace-pre-line ${
                message.type === "user" ? "bg-blue-600 text-white ml-8" : "bg-gray-100 text-gray-900 mr-8"
              }`}
            >
              {message.content}
            </div>
          ))}
          {loading && (
            <div className="bg-gray-100 text-gray-900 mr-8 p-2 rounded-lg text-sm">
              <div className="flex items-center space-x-1">
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
          )}
        </div>

        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <Button size="sm" onClick={handleSend} disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
