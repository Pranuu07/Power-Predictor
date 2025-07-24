import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return empty messages array - client will handle local storage
    return NextResponse.json({ messages: [] })
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return NextResponse.json({ messages: [] })
  }
}

export async function DELETE() {
  try {
    // Return success - client will handle local storage clearing
    return NextResponse.json({ success: true, message: "Chat history cleared" })
  } catch (error) {
    console.error("Failed to clear messages:", error)
    return NextResponse.json({ message: "Failed to clear chat history" }, { status: 500 })
  }
}
