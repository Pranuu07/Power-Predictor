"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Lightbulb,
  Thermometer,
  Zap,
  Home,
  DollarSign,
  CheckCircle,
  Star,
  Search,
  Filter,
  TrendingDown,
  Clock,
  Shield,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { getStoredData, saveStoredData } from "@/lib/localStorage"

interface Tip {
  id: string
  title: string
  description: string
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  savings: string
  timeToImplement: string
  icon: any
  steps: string[]
  completed: boolean
  impact: "Low" | "Medium" | "High"
}

const energyTips: Tip[] = [
  {
    id: "1",
    title: "Switch to LED Light Bulbs",
    description:
      "Replace incandescent and CFL bulbs with energy-efficient LED bulbs to reduce lighting costs by up to 75%.",
    category: "Lighting",
    difficulty: "Easy",
    savings: "$75-100/year",
    timeToImplement: "30 minutes",
    icon: Lightbulb,
    impact: "Medium",
    completed: false,
    steps: [
      "Identify all incandescent and CFL bulbs in your home",
      "Purchase LED replacements with equivalent brightness (lumens)",
      "Replace bulbs one room at a time",
      "Dispose of old bulbs properly at recycling centers",
    ],
  },
  {
    id: "2",
    title: "Install a Programmable Thermostat",
    description: "Automatically adjust temperature settings to save 10-15% on heating and cooling costs.",
    category: "HVAC",
    difficulty: "Medium",
    savings: "$150-200/year",
    timeToImplement: "2-3 hours",
    icon: Thermometer,
    impact: "High",
    completed: false,
    steps: [
      "Turn off power to your HVAC system",
      "Remove old thermostat and label wires",
      "Install new programmable thermostat following manufacturer instructions",
      "Program temperature schedules for different times of day",
      "Test the system to ensure proper operation",
    ],
  },
  {
    id: "3",
    title: "Unplug Electronics When Not in Use",
    description:
      "Eliminate phantom loads from devices in standby mode, which can account for 5-10% of your electricity bill.",
    category: "Electronics",
    difficulty: "Easy",
    savings: "$50-75/year",
    timeToImplement: "15 minutes",
    icon: Zap,
    impact: "Low",
    completed: false,
    steps: [
      "Identify devices that draw power when off (TVs, computers, chargers)",
      "Use power strips to easily disconnect multiple devices",
      "Unplug chargers when not actively charging devices",
      "Consider smart power strips that automatically cut standby power",
    ],
  },
  {
    id: "4",
    title: "Seal Air Leaks",
    description:
      "Caulk and weatherstrip around windows, doors, and other openings to prevent conditioned air from escaping.",
    category: "Insulation",
    difficulty: "Medium",
    savings: "$100-150/year",
    timeToImplement: "4-6 hours",
    icon: Home,
    impact: "High",
    completed: false,
    steps: [
      "Conduct a visual inspection for gaps around windows and doors",
      "Use incense or a candle to detect air leaks on windy days",
      "Apply caulk to seal gaps in stationary components",
      "Install weatherstripping around movable components like doors and windows",
      "Check and seal gaps around electrical outlets and fixtures",
    ],
  },
  {
    id: "5",
    title: "Use Energy-Efficient Appliances",
    description: "When replacing appliances, choose ENERGY STAR certified models that use 10-50% less energy.",
    category: "Appliances",
    difficulty: "Hard",
    savings: "$200-400/year",
    timeToImplement: "Varies",
    icon: Star,
    impact: "High",
    completed: false,
    steps: [
      "Research ENERGY STAR ratings when shopping for new appliances",
      "Calculate long-term energy savings vs. upfront costs",
      "Look for utility rebates and tax incentives",
      "Properly dispose of old appliances through recycling programs",
      "Learn optimal settings and maintenance for new appliances",
    ],
  },
  {
    id: "6",
    title: "Optimize Water Heater Settings",
    description: "Lower water heater temperature to 120°F and insulate the tank to reduce energy consumption.",
    category: "Water Heating",
    difficulty: "Easy",
    savings: "$60-90/year",
    timeToImplement: "1 hour",
    icon: Thermometer,
    impact: "Medium",
    completed: false,
    steps: [
      "Locate the temperature dial on your water heater",
      "Adjust temperature to 120°F (49°C)",
      "Install an insulation blanket around the tank",
      "Insulate the first 6 feet of hot water pipes",
      "Consider a timer for electric water heaters",
    ],
  },
  {
    id: "7",
    title: "Use Natural Light",
    description: "Open curtains and blinds during the day to reduce the need for artificial lighting.",
    category: "Lighting",
    difficulty: "Easy",
    savings: "$30-50/year",
    timeToImplement: "Immediate",
    icon: Lightbulb,
    impact: "Low",
    completed: false,
    steps: [
      "Open curtains and blinds during daylight hours",
      "Rearrange furniture to take advantage of natural light",
      "Use light-colored paint and mirrors to reflect light",
      "Trim vegetation that blocks windows",
      "Consider skylights or solar tubes for dark areas",
    ],
  },
  {
    id: "8",
    title: "Maintain Your HVAC System",
    description: "Regular maintenance keeps your heating and cooling system running efficiently.",
    category: "HVAC",
    difficulty: "Easy",
    savings: "$80-120/year",
    timeToImplement: "30 minutes monthly",
    icon: Shield,
    impact: "Medium",
    completed: false,
    steps: [
      "Replace air filters every 1-3 months",
      "Clean vents and registers regularly",
      "Schedule annual professional maintenance",
      "Keep outdoor units clear of debris",
      "Check and seal ductwork for leaks",
    ],
  },
]

export default function TipsPage() {
  const [tips, setTips] = useState<Tip[]>(energyTips)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [filteredTips, setFilteredTips] = useState<Tip[]>(energyTips)

  const categories = ["All", ...Array.from(new Set(energyTips.map((tip) => tip.category)))]
  const difficulties = ["All", "Easy", "Medium", "Hard"]

  useEffect(() => {
    // Load completed tips from localStorage
    const data = getStoredData()
    if (data.completedTips) {
      const updatedTips = energyTips.map((tip) => ({
        ...tip,
        completed: data.completedTips.includes(tip.id),
      }))
      setTips(updatedTips)
      setFilteredTips(updatedTips)
    }
  }, [])

  useEffect(() => {
    let filtered = tips

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (tip) =>
          tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tip.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((tip) => tip.category === selectedCategory)
    }

    // Apply difficulty filter
    if (selectedDifficulty !== "All") {
      filtered = filtered.filter((tip) => tip.difficulty === selectedDifficulty)
    }

    setFilteredTips(filtered)
  }, [tips, searchTerm, selectedCategory, selectedDifficulty])

  const toggleTipCompletion = (tipId: string) => {
    const updatedTips = tips.map((tip) => (tip.id === tipId ? { ...tip, completed: !tip.completed } : tip))
    setTips(updatedTips)

    // Save to localStorage
    const data = getStoredData()
    const completedTips = updatedTips.filter((tip) => tip.completed).map((tip) => tip.id)
    saveStoredData({ ...data, completedTips })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Low":
        return "text-gray-600"
      case "Medium":
        return "text-yellow-600"
      case "High":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const completedTipsCount = tips.filter((tip) => tip.completed).length
  const completionPercentage = (completedTipsCount / tips.length) * 100

  const calculatePotentialSavings = () => {
    return tips
      .filter((tip) => !tip.completed)
      .reduce((total, tip) => {
        const savings = tip.savings.match(/\$(\d+)-?(\d+)?/)
        if (savings) {
          const min = Number.parseInt(savings[1])
          const max = savings[2] ? Number.parseInt(savings[2]) : min
          return total + (min + max) / 2
        }
        return total
      }, 0)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Energy Saving Tips</h1>
            <p className="text-gray-600 mt-2">
              Discover practical ways to reduce your energy consumption and save money on your electricity bills.
            </p>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tips Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {completedTipsCount}/{tips.length}
                </div>
                <Progress value={completionPercentage} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${calculatePotentialSavings().toFixed(0)}/year</div>
                <p className="text-xs text-muted-foreground">From remaining tips</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Easy Wins</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tips.filter((tip) => tip.difficulty === "Easy" && !tip.completed).length}
                </div>
                <p className="text-xs text-muted-foreground">Quick implementations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Impact</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tips.filter((tip) => tip.impact === "High" && !tip.completed).length}
                </div>
                <p className="text-xs text-muted-foreground">Maximum savings</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Find Tips</CardTitle>
              <CardDescription>Filter tips by category, difficulty, or search for specific topics.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Tips</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search tips..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {difficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredTips.length} of {tips.length} tips
                </p>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{completedTipsCount} completed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Grid */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Tips</TabsTrigger>
              <TabsTrigger value="quick">Quick Wins</TabsTrigger>
              <TabsTrigger value="high-impact">High Impact</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTips.map((tip) => {
                  const Icon = tip.icon
                  return (
                    <Card key={tip.id} className={`relative ${tip.completed ? "bg-green-50 border-green-200" : ""}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`p-2 rounded-lg ${tip.completed ? "bg-green-100" : "bg-blue-100"}`}>
                              <Icon className={`h-5 w-5 ${tip.completed ? "text-green-600" : "text-blue-600"}`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{tip.title}</CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className={getDifficultyColor(tip.difficulty)}>
                                  {tip.difficulty}
                                </Badge>
                                <Badge variant="outline">{tip.category}</Badge>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTipCompletion(tip.id)}
                            className={tip.completed ? "text-green-600" : "text-gray-400"}
                          >
                            <CheckCircle className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-600">{tip.description}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Savings</div>
                            <div className="font-medium text-green-600">{tip.savings}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Time</div>
                            <div className="font-medium">{tip.timeToImplement}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-500">Impact:</span>
                            <span className={`text-sm font-medium ${getImpactColor(tip.impact)}`}>{tip.impact}</span>
                          </div>
                          <Clock className="h-4 w-4 text-gray-400" />
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700">Implementation Steps:</div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {tip.steps.slice(0, 2).map((step, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>{step}</span>
                              </li>
                            ))}
                            {tip.steps.length > 2 && (
                              <li className="text-gray-500 italic">+{tip.steps.length - 2} more steps...</li>
                            )}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="quick">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTips
                  .filter((tip) => tip.difficulty === "Easy" && !tip.completed)
                  .map((tip) => {
                    const Icon = tip.icon
                    return (
                      <Card key={tip.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="p-2 rounded-lg bg-green-100">
                                <Icon className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{tip.title}</CardTitle>
                                <Badge variant="outline" className="mt-1 bg-green-100 text-green-800">
                                  Quick Win
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleTipCompletion(tip.id)}
                              className="text-gray-400"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-gray-600">{tip.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">Savings</div>
                              <div className="font-medium text-green-600">{tip.savings}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Time</div>
                              <div className="font-medium">{tip.timeToImplement}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            </TabsContent>

            <TabsContent value="high-impact">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTips
                  .filter((tip) => tip.impact === "High" && !tip.completed)
                  .map((tip) => {
                    const Icon = tip.icon
                    return (
                      <Card key={tip.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="p-2 rounded-lg bg-yellow-100">
                                <Icon className="h-5 w-5 text-yellow-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{tip.title}</CardTitle>
                                <Badge variant="outline" className="mt-1 bg-yellow-100 text-yellow-800">
                                  High Impact
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleTipCompletion(tip.id)}
                              className="text-gray-400"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-gray-600">{tip.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">Savings</div>
                              <div className="font-medium text-green-600">{tip.savings}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Time</div>
                              <div className="font-medium">{tip.timeToImplement}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTips
                  .filter((tip) => tip.completed)
                  .map((tip) => {
                    const Icon = tip.icon
                    return (
                      <Card key={tip.id} className="bg-green-50 border-green-200">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="p-2 rounded-lg bg-green-100">
                                <Icon className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{tip.title}</CardTitle>
                                <Badge variant="outline" className="mt-1 bg-green-100 text-green-800">
                                  Completed
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleTipCompletion(tip.id)}
                              className="text-green-600"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-gray-600">{tip.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">Savings</div>
                              <div className="font-medium text-green-600">{tip.savings}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Status</div>
                              <div className="font-medium text-green-600">✓ Implemented</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
              {filteredTips.filter((tip) => tip.completed).length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Tips Yet</h3>
                    <p className="text-gray-600 mb-4">Start implementing energy-saving tips to see them here.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
