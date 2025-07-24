"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Zap, BarChart3, Calculator, Lightbulb, TrendingUp, History } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Calculator", href: "/calculator", icon: Calculator },
  { name: "Predictions", href: "/predictions", icon: TrendingUp },
  { name: "Tips", href: "/tips", icon: Lightbulb },
  { name: "History", href: "/history", icon: History },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">PowerTracker</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          <div className="md:hidden">
            <div className="flex space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      pathname === item.href
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
