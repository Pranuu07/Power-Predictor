import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const messages = await db.collection("chatMessages").find({}).sort({ timestamp: 1 }).limit(50).toArray()

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return NextResponse.json({ messages: [] })
  }
}
