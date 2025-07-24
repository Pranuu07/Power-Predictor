import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  console.warn("Warning: MONGODB_URI environment variable is not set. Using fallback mode.")
}

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/powertracker"
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  try {
    const client = await clientPromise
    const db = client.db("powertracker")
    return { client, db }
  } catch (error) {
    console.error("MongoDB connection error:", error)
    // Return a mock database interface for build time
    throw new Error("Database connection failed")
  }
}

// Mock data for when database is not available
export const mockDashboardData = {
  currentUsage: 245,
  monthlyBill: 1250,
  efficiency: 78,
  savings: 320,
  usageData: [
    { month: "Jan", usage: 220, cost: 1100 },
    { month: "Feb", usage: 180, cost: 950 },
    { month: "Mar", usage: 240, cost: 1200 },
    { month: "Apr", usage: 200, cost: 1000 },
    { month: "May", usage: 260, cost: 1300 },
    { month: "Jun", usage: 245, cost: 1250 },
  ],
  breakdown: [
    { category: "Lighting", usage: 45, percentage: 18 },
    { category: "Cooling", usage: 98, percentage: 40 },
    { category: "Heating", usage: 49, percentage: 20 },
    { category: "Appliances", usage: 37, percentage: 15 },
    { category: "Others", usage: 16, percentage: 7 },
  ],
}

export const mockChatMessages = [
  {
    id: "1",
    message: "Hello! How can I help you with your energy consumption today?",
    sender: "bot",
    timestamp: new Date(),
  },
]

export const mockEnergyTips = [
  {
    id: "1",
    category: "Lighting",
    title: "Switch to LED Bulbs",
    description: "LED bulbs use 75% less energy than incandescent bulbs",
    savings: 25,
    difficulty: "Easy",
  },
  {
    id: "2",
    category: "Cooling",
    title: "Optimize AC Temperature",
    description: "Set your AC to 24°C instead of 22°C to save energy",
    savings: 15,
    difficulty: "Easy",
  },
  {
    id: "3",
    category: "Appliances",
    title: "Unplug Devices",
    description: "Unplug electronics when not in use to avoid phantom loads",
    savings: 10,
    difficulty: "Easy",
  },
]

export const mockPredictions = {
  nextMonthUsage: 265,
  nextMonthCost: 1325,
  trend: "increasing",
  confidence: 85,
  recommendations: [
    "Consider reducing AC usage during peak hours",
    "Switch to energy-efficient appliances",
    "Use natural lighting during daytime",
  ],
}
