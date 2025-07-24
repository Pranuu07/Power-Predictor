import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Get recent chat messages (last 50)
    const messages = await db.collection("chatMessages").find({}).sort({ timestamp: -1 }).limit(50).toArray()

    // Reverse to show oldest first
    const sortedMessages = messages.reverse()

    return NextResponse.json({ messages: sortedMessages })
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return NextResponse.json({ messages: [] })
  }
}

export async function DELETE() {
  try {
    const { db } = await connectToDatabase()

    // Clear all chat messages
    await db.collection("chatMessages").deleteMany({})

    return NextResponse.json({ success: true, message: "Chat history cleared" })
  } catch (error) {
    console.error("Failed to clear messages:", error)
    return NextResponse.json({ message: "Failed to clear chat history" }, { status: 500 })
  }
}
