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
    throw new Error("Database connection failed")
  }
}

// Initial empty data structure - everything starts at 0
export const initialDashboardData = {
  currentUsage: 0,
  currentBill: 0,
  aiPrediction: 0,
  savingsPotential: 0,
  monthlyData: [
    { month: "Jan", usage: 0, cost: 0 },
    { month: "Feb", usage: 0, cost: 0 },
    { month: "Mar", usage: 0, cost: 0 },
    { month: "Apr", usage: 0, cost: 0 },
    { month: "May", usage: 0, cost: 0 },
    { month: "Jun", usage: 0, cost: 0 },
  ],
  usageBreakdown: [
    { category: "Air Conditioning", usage: 0, color: "#3b82f6" },
    { category: "Lighting", usage: 0, color: "#10b981" },
    { category: "Water Heating", usage: 0, color: "#f59e0b" },
    { category: "Refrigerator", usage: 0, color: "#ef4444" },
    { category: "Others", usage: 0, color: "#8b5cf6" },
  ],
}

export default clientPromise
