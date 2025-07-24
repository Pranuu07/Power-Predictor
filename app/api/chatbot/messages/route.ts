import { NextResponse } from "next/server"
import { connectToDatabase, mockChatMessages } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const messages = await db.collection("chatMessages").find({}).sort({ timestamp: 1 }).toArray()

    if (messages.length === 0) {
      // Insert initial message
      await db.collection("chatMessages").insertOne(mockChatMessages[0])
      return NextResponse.json(mockChatMessages)
    }

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Chat messages API error:", error)
    return NextResponse.json(mockChatMessages)
  }
}

export async function POST(request: Request) {
  try {
    const { message, sender } = await request.json()

    const newMessage = {
      id: Date.now().toString(),
      message,
      sender,
      timestamp: new Date(),
    }

    try {
      const { db } = await connectToDatabase()
      await db.collection("chatMessages").insertOne(newMessage)
    } catch (dbError) {
      console.warn("Could not save message to database:", dbError)
    }

    return NextResponse.json(newMessage)
  } catch (error) {
    console.error("Chat message save error:", error)
    return NextResponse.json({ message: "Failed to save message" }, { status: 500 })
  }
}
