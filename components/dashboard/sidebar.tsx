"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Calculator,
  Car,
  ChevronLeft,
  ChevronRight,
  GitCompare,
  Home,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "market-explorer", label: "Market Explorer", icon: Search },
  { id: "price-intelligence", label: "Price Intelligence", icon: Calculator },
  { id: "similar-cars", label: "Similar Cars", icon: Sparkles },
  { id: "best-value", label: "Best Value Deals", icon: Target },
  { id: "market-trends", label: "Market Trends", icon: TrendingUp },
  { id: "compare", label: "Compare Models", icon: GitCompare },
]

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredItems = navItems.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Car className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && <span className="font-semibold text-lg text-sidebar-foreground">SenCar</span>}
        </Link>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 bg-sidebar-accent border-sidebar-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2">
        <nav className="space-y-1 py-2">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                activeTab === item.id
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  activeTab === item.id ? "text-sidebar-primary" : "text-muted-foreground",
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </ScrollArea>

      {/* Collapse toggle */}
      <div className="p-4 border-t border-sidebar-border">
        <Button variant="ghost" size="sm" className="w-full justify-center" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
