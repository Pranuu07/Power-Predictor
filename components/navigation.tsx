"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, BarChart3, Calculator, Brain, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/calculator", label: "Bill Calculator", icon: Calculator },
    { href: "/predictions", label: "AI Predictions", icon: Brain },
    { href: "/tips", label: "Smart Tips", icon: Lightbulb },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">PowerTracker</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href}>
                  <Button variant={isActive ? "default" : "ghost"} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
